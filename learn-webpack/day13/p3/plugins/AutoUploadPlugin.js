const { NodeSSH } = require('node-ssh');

class AutoUploadWebpackPlugin {
  constructor(options = {}) {
    this.ssh = new NodeSSH();
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('AutoUploadWebpackPlugin', async (compilation, callback) => {
      // 1. 获取输出的文件夹
      const outputPath = compilation.outputOptions.path;

      // 2. 连接服务器
      await this.connectServer();

      // 删除原来目录中的内容
      const serverDir = this.options.remotePath;
      console.log(serverDir);
      await this.ssh.execCommand(`rm -rf ${serverDir}/*`);

      // 4. 上传文件到服务器
      await this.uploadFiles(outputPath, serverDir);

      // 5. 关闭ssh
      this.ssh.dispose();
      callback();
    });
  }

  async connectServer() {
    const { host, port, username, password } = this.options;
    await this.ssh.connect({
      host,
      port,
      username,
      password,
    });
    console.log('连接成功');
  }

  async uploadFiles(localPath, remotePath) {
    const status = await this.ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10,
    });
    console.log('传送到服务器: ', status ? '成功' : '失败');
  }
}

module.exports = AutoUploadWebpackPlugin;
