实战参考: 
1. [字节跳动面试官：请你实现一个大文件上传和断点续传](https://juejin.cn/post/6844904046436843527)
2. [字节跳动面试官，我也实现了大文件上传和断点续传](https://juejin.cn/post/6844904055819468808)

要点:
1. 并发数限制, 使用了`tiny-async-pool`库, 源码很简单可以直接参考es7的实现, es6的promise实现理解起来比较困难
[es7源码](https://github.com/rxaviers/async-pool/blob/1.x/lib/es7.js)