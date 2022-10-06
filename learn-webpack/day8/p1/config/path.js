const path = require('path');
const cwd = process.cwd(); // 当前终端目录

const resolveDir = (dir) => path.resolve(cwd, dir);

module.exports = {
  resolveDir,
};
