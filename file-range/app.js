const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const initFolder = path.resolve(__dirname, "./static");

const mimeNames = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "application/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".ogg": "application/ogg",
  ".ogv": "video/ogg",
  ".oga": "audio/ogg",
  ".txt": "text/plain",
  ".wav": "audio/x-wav",
  ".webm": "video/webm",
};

const server = http
  .createServer()
  .listen(8000, () => console.log("server listening port 8000"));

function sendResponse(
  response,
  responseStatus,
  responseHeader,
  readableStream
) {
  response.writeHead(responseStatus, responseHeader);

  if (readableStream == null) {
    response.end();
  } else {
    readableStream.pipe(response);
  }
}

function getMimeNameFromExt(ext) {
  let result = mimeNames[ext.toLowerCase()];
  if (result == null) {
    // https://stackoverflow.com/questions/20508788/do-i-need-content-type-application-octet-stream-for-file-download
    // 当不知道用什么content-type时就用这个, 诶嘿
    result = "application/octet-stream;";
  }
  return result;
}

/**
 *
 * @param {*} range bytes=[start]-[end]
 * @param {*} totalLength file.size
 * @returns
 */
function readRangeHeader(range, totalLength) {
  // 没传range请求头
  if (range == null || range.length === 0) {
    return null;
  }
  const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  const start = parseInt(array[1]);
  const end = parseInt(array[2]);
  // Accept-Range的start和end都是可选的, 那就产生四种情况, 正常情况下回如下定义
  /**
   * 1. start && end: 返回对应的区间[start, end]
   * 2. !start && !end: 返回整个文件[0, totalLength - 1]
   * 3. start && !end: 返回[start, totalLength - 1]
   * 4. !start && end: 返回[totalLength - end, totalLength - 1]
   */
  const result = {
    Start: isNaN(start) ? 0 : start,
    End: isNaN(end) ? totalLength - 1 : end,
  };
  if (!isNaN(start) && isNaN(end)) {
    result.Start = start;
    // video便签发起请求时请求头一般为Range: bytes=0- 为了分片返回这里设置end为totalLength/20
    // https://stackoverflow.com/questions/41521272/html5-video-element-not-requesting-end-range
    result.End = parseInt(
      start + (totalLength - 1) / 20 > totalLength - 1
        ? totalLength - 1
        : start + (totalLength - 1) / 20
    );
    // result.End = totalLength - 1;
  }
  if (isNaN(start) && !isNaN(end)) {
    result.Start = totalLength - end;
    result.End = totalLength - 1;
  }
  return result;
}

server.on("request", (req, res) => {
  if (req.method !== "GET") {
    return sendResponse(res, 405, { Allow: "GET" }, null);
  }
  // range请求 core logic
  // path.sep为系统的文件路径分隔符, windows为\\, unix为/
  const filePath =
    initFolder + url.parse(req.url).pathname.split("/").join(path.sep);
  if (!fs.existsSync(filePath)) {
    return sendResponse(res, 404, null, null);
  }
  // 文件属性
  const stat = fs.statSync(filePath);
  const responseHeader = {};
  const rangeRequest = readRangeHeader(req.headers["range"], stat.size);
  if (rangeRequest == null) {
    // 1. 如果没有传range默认返回整个文件
    responseHeader["Content-Type"] = getMimeNameFromExt(path.extname(filePath));
    responseHeader["Content-Length"] = stat.size;
    return sendResponse(
      res,
      200,
      responseHeader,
      fs.createReadStream(filePath)
    );
  } else {
    const { Start: start, End: end } = rangeRequest;
    if (start >= stat.size || end >= stat.size) {
      // 超出size
      responseHeader["Content-Range"] = `bytes */${stat.size}`;
      return sendResponse(res, 416, responseHeader, null);
    } else {
      responseHeader["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
      responseHeader["Content-Length"] = start === end ? 0 : end - start + 1;
      responseHeader["Content-Type"] = getMimeNameFromExt(
        path.extname(filePath)
      );
      responseHeader["Accept-Ranges"] = "bytes"; // 一般都是bytes
      responseHeader["Cache-Control"] = "no-cache";
      console.log(responseHeader["Content-Length"]);
      // 返回Partial Content 206
      return sendResponse(
        res,
        206,
        responseHeader,
        fs.createReadStream(filePath, { start, end })
      );
    }
  }
});
