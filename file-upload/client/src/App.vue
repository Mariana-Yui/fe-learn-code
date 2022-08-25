<template>
  <div class="box">
    <input type="file" @change="handleFileChange" />
    <Space>
      <Button type="primary" @click="handleUpload">Upload</Button>
      <Button type="primary" @click="handlePause">Pause</Button>
      <Button type="primary" @click="handleResume">Resume</Button>
    </Space>

    <div>calculate chunk hash</div>
    <Progress
      class="progress"
      :percent="hashPercentage"
      :status="progressStatus(hashPercentage)"
    />
    <div>total percentage</div>
    <Progress
      class="progress"
      :percent="uploadPercentage"
      :status="progressStatus(uploadPercentage)"
    />

    <Table class="table" :columns="columns" :data-source="data">
      <template #filename="{ record }">
        {{ record.hash }}
      </template>
      <template #status="{ record }">
        <Tag :color="status(record).color">
          {{ status(record).text }}
        </Tag>
      </template>
      <template #progress="{ record }">
        <Progress
          :percent="record.percentage"
          :status="progressStatus(record.percentage)"
        />
      </template>
    </Table>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import { Button, message, Progress, Table, Tag, Space } from "ant-design-vue";
import asyncPool from "tiny-async-pool";
import request from "./request";

export default defineComponent({
  components: {
    Button,
    Progress,
    Table,
    Tag,
    Space,
  },
  setup() {
    const BASE_URL = "http://9.134.187.84:3000";
    // 设置分片大小
    const SIZE = 2 * 1024 * 1024; // 10M
    const CONCURRENT_NUM = 4; // 并发量
    const container = reactive({
      file: null,
      worker: null,
      hash: "",
    });
    const data = ref(null);
    const requestListRef = ref([]);
    const progressStatus = (progress) =>
      progress >= 100 ? "success" : "active";
    // console.log('%c %s', 'color:pink', mapLimit);

    function handleFileChange(e) {
      const [file] = e.target.files;
      container.file = file;
    }

    // 生成文件分片
    function createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    }

    function createProgressHandler(item) {
      return (e) => {
        item.percentage = +parseInt((e.loaded / e.total) * 100).toFixed(2);
      };
    }

    // 上传分片
    async function uploadChunks(uploadedList = []) {
      // 保证分片列表长度一致
      const requestList = data.value.map(({ chunk, hash, fileHash }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("fileHash", fileHash);
        formData.append("filename", container.file.name);
        return { formData, retry: !uploadedList.includes(hash) };
      });
      const iteratee = async (item, arr) => {
        const { formData, retry } = item;
        // 如果服务端已存在分片直接返回
        if (!retry) return;
        const index = arr.findIndex((v) => v === item);
        return await request({
          url: BASE_URL,
          data: formData,
          onProgress: createProgressHandler(data.value[index]),
          requestList: requestListRef.value,
        });
      };
      // https://github.com/rxaviers/async-pool
      const res = await asyncPool(CONCURRENT_NUM, requestList, iteratee);
      console.log(uploadedList, requestList, data.value);
      await mergeChunks();
    }

    // 合并切片
    async function mergeChunks(size = SIZE) {
      await request({
        url: BASE_URL + "/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename: container.file.name,
          fileHash: container.hash,
          size,
        }),
      });
    }

    async function verifyUpload(filename, fileHash) {
      const { data } = await request({
        url: BASE_URL + "/verify",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename,
          fileHash,
        }),
      });
      return JSON.parse(data);
    }

    async function handleUpload() {
      if (!container.file) return;
      const fileChunkList = createFileChunk(container.file);
      container.hash = await calculateHash(fileChunkList);
      const { shouldUpload, uploadedList } = await verifyUpload(
        container.file.name,
        container.hash
      );
      if (!shouldUpload) {
        return message.success("skip upload: file upload success");
      }
      data.value = fileChunkList
        .map(({ file }, index) => ({
          fileHash: container.hash,
          chunk: file,
          hash: container.hash + "-" + index,
          index,
          percentage: 0,
          size: SIZE,
        }))
        .map((item) => ({
          ...item,
          percentage: uploadedList.includes(item.hash) ? 100 : 0,
        }));
      message.loading("正在上传文件...", 0);
      // 上传
      await uploadChunks(uploadedList);
      message.destroy();
      message.success("上传文件成功");
    }

    async function handlePause() {
      requestListRef.value.forEach((xhr) => xhr?.abort());
      requestListRef.value = [];
      message.destroy();
      message.info("暂停上传文件");
    }

    async function handleResume() {
      const { uploadedList } = await verifyUpload(
        container.file.name,
        container.hash
      );
      await uploadChunks(uploadedList);
      message.info("继续上传文件");
    }

    // 总进度条
    const uploadPercentage = computed(() => {
      if (!container.file || !data.value?.length) return 0;
      const loaded = data.value
        .map((item) => item.size * item.percentage)
        .reduce((prev, curr) => prev + curr);
      return +parseInt(loaded / container.file.size).toFixed(2);
    });

    const columns = [
      {
        title: "filename",
        dataIndex: "filename",
        width: "200px",
        slots: { customRender: "filename" },
      },
      {
        title: "status",
        dataIndex: "status",
        width: "120px",
        slots: { customRender: "status" },
      },
      {
        title: "progress",
        dataIndex: "progress",
        slots: { customRender: "progress" },
      },
    ];

    const status = (record) => {
      return record.percentage > 0
        ? record.percentage < 100
          ? { color: "geekblue", text: "UPLOADING" }
          : { color: "green", text: "COMPLETED" }
        : { color: "volcano", text: "WAIT" };
    };

    // 生成文件hash(web-worker)
    const hashPercentage = ref(0);
    function calculateHash(fileChunkList) {
      return new Promise((resolve) => {
        container.worker = new Worker("/worker/hash.js");
        container.worker.postMessage({ fileChunkList });
        container.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          hashPercentage.value = percentage;
          hash && resolve(hash);
        };
      });
    }

    return {
      container,
      handleFileChange,
      handleUpload,
      handlePause,
      handleResume,
      uploadPercentage,
      columns,
      status,
      data,
      hashPercentage,
      progressStatus,
    };
  },
});
</script>

<style scoped>
.box {
  margin: 20px;
}
.progress {
  margin-bottom: 15px;
}
.table {
  margin-bottom: 15px;
}
</style>
