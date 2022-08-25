/**
 * worker中全局对象是self不是window
 */
// 导入脚本
self.importScripts(
  "https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js"
);

self.onmessage = (e) => {
  const { fileChunkList } = e.data;
  // binary use: new SparkMD5.ArrayBuffer()
  // text just use: new SparkMD5();
  // 其他api都一样
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = (i) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[i].file);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === fileChunkList.length-1) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        percentage += +(100 / fileChunkList.length).toFixed(2);
        self.postMessage({
          percentage,
        });
      }
      loadNext(count);
    };
  };
  loadNext(count);
};
