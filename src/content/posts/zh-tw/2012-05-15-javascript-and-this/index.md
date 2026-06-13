---
title: 'Javascript and this'
description: '筆記一個 javascript 的特性。'
pubDate: 'May 15 2012'
categories: [Tech]
---

筆記一個 javascript 的特性。

通常在使用一些 method 的時候參數都帶有 Callback Function：

```scss
click(callbackFunction)
```

如果在這個 Callback Function 裡面直接使用 this 是沒有辦法的：

```javascript
callbackFunction = function() {
  this.doSomethiing(); // undefined
}
```

必須先在在外層定義 this 為一個變數才可以：

```javascript
var self = this;

callbackFunction = function() {
   self.doSomethiing(); // OK!!
}
```

參考文章：[Javascript — 淺談this與Closure](http://blog.darkthread.net/post-2009-03-11-js-this-and-closure.aspx)
