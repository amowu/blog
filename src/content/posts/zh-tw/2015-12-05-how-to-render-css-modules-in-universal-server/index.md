---
title: '解決 Universal 架構的 CSS Modules 問題'
description: '在 Isomorphic JavaScript 應用中實作 CSS Modules 時，解決 Node.js 無法 import CSS 以及 Server/Client 渲染結果不一致的問題。'
pubDate: 'Dec 05 2015'
---

最近在使用 [React](https://facebook.github.io/react/) 和 [Redux](https://github.com/rackt/redux) 建構一個 [Isomorphic JavaScript](http://isomorphic.net/javascript) （Universal）應用。

但是在實作 [CSS Modules](https://github.com/css-modules/css-modules) 的時候，會碰上兩個問題：

1. Server-side 的 Node.js 無法 import `*.css`。
2. 如果改成使用 `process.env.IS_BROWSER` 來判斷只在 Client-side import，那又會碰到 Server-side 與 Client-side render 出來的 DOM 結果不一致的問題。

解決方式：

安裝 [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook) 這個套件：

```
npm install css-modules-require-hook --save-dev
```

修改 webpack config 的 css-loader 設定：

```javascript
// webpack.config.js

{
  // ...
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!!postcss-loader'
    }]
  }
  // ...
}
```

在 Node.js 的 main file 加入 css-modules-require-hook：

```javascript
// server.js

require('css-modules-require-hook')({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});
// ...
```

注意 `generateScopedName` 的命名格式，必須與 css-loader 的 `localIdentName` 保持一致。
