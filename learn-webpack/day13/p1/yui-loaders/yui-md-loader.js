const { marked } = require('marked');
const hljs = require('highlight.js');
const { validate } = require('schema-utils');
const schema = require('../yui-schema/loader-schema.json');

module.exports = function (content) {
  validate(schema, this.query, {
    name: 'yui-md-loader',
  });

  marked.setOptions({
    highlight: function (code, lang) {
      return hljs.highlight(lang, code).value;
    },
  });
  const htmlContent = marked(content);
  const innerContent = '`' + htmlContent + '`';
  const { firstName, lastName } = this.query;
  const moduleCode = `var firstName = '${firstName}', lastName = '${lastName}'; var code = ${innerContent}; export default code;`;

  return moduleCode;
};
