export default function request({
  url,
  method = "post",
  data,
  onProgress = (e) => e,
  headers = {},
  requestList,
}) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.upload.onprogress = onProgress;

    xhr.send(data);
    xhr.onload = (e) => {
      if (requestList) {
        const index = requestList.findIndex((item) => item === xhr);
        requestList.splice(index, 1);
      }
      resolve({
        // 可以通过xhr.responseType指定返回类型
        data: e.target.response,
      });
    };

    requestList?.push(xhr);
  });
}
