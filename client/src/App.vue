<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <Button type="primary" @click="handleUpload">上传</Button>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { Button } from "ant-design-vue";
import * as mapLimit from "async/mapLimit";
import request from "./request";

export default defineComponent({
  components: {
    Button,
  },
  setup() {
    // 设置分片大小
    const SIZE = 10 * 1024 * 1024; // 10M
    const CONCURRENT_NUM = 4; // 并发量
    const container = reactive({
      file: null,
    });
    const data = ref(null);
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

    // 上传分片
    async function uploadChunks() {
      const requestList = data.value.map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", container.file.name);
        return { formData };
      });
      const iteratee = async ({ formData }, callback) => {
        const data = await request({
          url: "http://localhost:3000",
          data: formData,
        });
        callback(null, data);
      };
      // https://caolan.github.io/async/v3/docs.html
      const res = await mapLimit(requestList, CONCURRENT_NUM, iteratee);
      console.log(res);
    }

    async function handleUpload() {
      if (!container.file) return;
      const fileChunkList = createFileChunk(container.file);
      data.value = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: container.file.name + "-" + index,
      }));
      // 上传
      await uploadChunks();
    }

    return {
      container,
      handleFileChange,
      handleUpload,
    };
  },
});
</script>

<style lang="scss" scoped></style>
