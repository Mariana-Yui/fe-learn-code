运行demo:
1. node app.js
2. 浏览器输入 http://localhost:8000/index.html?200

实战参考:
[Node.js 中实现 HTTP 206 内容分片](https://www.oschina.net/translate/http-partial-content-in-node-js?cmp)


Q:
mp4文件超过100M, git无法提交
A:
centos7环境下:
1. `yum makecach`
2. 安装git-lfs `yum -y install git-lfs`
3. 项目下`git lfs migrate import --include="*.mp4"`