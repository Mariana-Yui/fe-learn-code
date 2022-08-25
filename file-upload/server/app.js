const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const multiparty = require("multiparty");

const server = http
  .createServer()
  .listen(3000, () => console.log("listening port 3000"));
server.setTimeout(600000);
// 切片存储目录
const UPLOAD_DIR = path.resolve(__dirname, "./target");

const resolvePost = (req) =>
  new Promise((resolve) => {
    let chunk = "";
    req.setEncoding("utf-8");
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });

const pipeStream = (path, ws) =>
  new Promise((resolve) => {
    const rs = fse.createReadStream(path);
    rs.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    rs.pipe(ws);
  });

// 返回已上传的所有切片名
const createUploadedList = async (fileHash) => {
  return fse.existsSync(path.resolve(UPLOAD_DIR, fileHash))
    ? fse.readdirSync(path.resolve(UPLOAD_DIR, fileHash))
    : [];
};

const mergeFileChunk = async (filePath, fileHash, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
  const chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  // 并发写入文件
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        fse.createWriteStream(filePath, {
          // 每条可写流都从对应offset写入就不用串行写入了
          start: index * size,
        })
      )
    )
  );
  // 合并后删除保存切片的目录
  fse.rmdirSync(chunkDir);
};

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.url === "/") {
    const multipart = new multiparty.Form();
    // req.body需要通过req.on data / end处理, 第三方库已经抽象处理

    multipart.parse(req, async (err, fields, files) => {
      if (err) return;
      /**
     * fields 非二进制文件字段
     * 
     * {
        hash: [ 'wallhaven-9mjoy1.png-2' ],
        filename: [ 'wallhaven-9mjoy1.png' ]
      }
     * files 二进制文件
      {
        chunk: [
          {
            fieldName: 'chunk',
            originalFilename: 'blob',
            path: '/tmp/7XPebrzzEO-WAcmWcVWJDSCw',
            headers: [Object],
            size: 2097152
          }
        ]
      }
     */
      const [chunk] = files.chunk;
      const [hash] = fields.hash;
      const [fileHash] = fields.fileHash;
      const [filename] = fields.filename;
      // 分片文件夹
      const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
      if (!fse.existsSync(chunkDir)) {
        fse.mkdirSync(chunkDir, { recursive: true });
      }
      // chunk.path默认存在os.tmpdir()
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
      res.end("received file chunk");
    });
  }
  if (req.url === "/merge") {
    const body = await resolvePost(req);
    const { filename, size, fileHash } = body;
    // filePath最后生成的文件名
    const filePath = path.resolve(
      UPLOAD_DIR,
      `${fileHash}${path.extname(filename)}`
    );
    await mergeFileChunk(filePath, fileHash, size);
    res.end(
      JSON.stringify({
        code: 0,
        message: "file mergd success",
      })
    );
  }
  if (req.url === "/verify") {
    const body = await resolvePost(req);
    const { filename, fileHash } = body;
    const extname = path.extname(filename);
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${extname}`);
    if (fse.existsSync(filePath)) {
      res.end(
        JSON.stringify({
          shouldUpload: false,
        })
      );
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: await createUploadedList(fileHash)
        })
      );
    }
  }
});
