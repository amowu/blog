---
title: 'How to list the properties of a javascript object'
description: '本篇參考 stackoverflow 的 How to list the properties of a javascript object'
pubDate: 'May 19 2012'
categories: [Tech]
---

本篇參考 [stackoverflow](http://stackoverflow.com/) 的 [How to list the properties of a javascript object](http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object)

要如何知道 Javascript 物件擁有哪些 proerty?

```javascript
var dog = {
  name: 'Lucky', 
  age: 3, 
  breeds: 'Shiba Inu'
};
```

上面是一個小狗的物件，裡面有一些自訂的屬性 `'name'`, `'age'`, `'breeds'` 等等...

那要怎麼在程式中知道這些屬性呢?

比較新的瀏覽器(IE9, FireFox, Chrome…)可直接使用 [Object.keys](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys) 這個方法

```javascript
var keys = Object.keys(dog);
```

或者自己寫

```javascript
var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}
```

```javascript
var keys = getKeys(dog);
```

這樣 keys 就會是一個有所有屬性的陣列

```javascript
keys = ["name", "age", "breeds"];
```

參考文章：

* [How to list the properties of a javascript object](http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object)
