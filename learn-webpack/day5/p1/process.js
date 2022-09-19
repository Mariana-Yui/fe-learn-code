const fs = require('fs');

const content = fs.readFileSync('./build/bundle.js', { encoding: 'utf-8' });

fs.writeFileSync('./common_esm/index.js', content.replace(/\/\*+\//g, '').replace(/\/\/.+/g, '').replace(/\/\*.*\*\//g, ''), { flag: 'w+', encoding: 'utf-8' });
