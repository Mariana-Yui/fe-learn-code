module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3, // 必须填默认corejs: 2会报错
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3
    }]
  ]
};
