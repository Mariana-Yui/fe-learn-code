module.exports = function (content) {
  console.log('Normal Loader 01');
  // return content;
  this.callback(null, content);
};

module.exports.pitch = function () {
  console.log('Pitch Loader 01');
};
