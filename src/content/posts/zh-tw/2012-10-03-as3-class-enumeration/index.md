---
title: 'AS3 Class Enumeration'
description: '筆記筆記..'
pubDate: 'Oct 03 2012'
---

筆記筆記..

一般在 AS3 要列舉 Object 的 properties 時，通常會用下面這種寫法：

```javascript
//Get an XML description of this class 
//and return the variable types as XMLList with e4x
var varList:XMLList = flash.utils.describeType(VO)..variable;
```

```javascript
for(var i:int; i < varList.length(); i++){
  //Show the name and the value
  trace(varList[i].@name+':'+ VO[varList[i].@name]);
}
```

不過在處理 VO（Value Object）時則會出問題，因為它是 Class，後來在這篇[文章](http://www.learnosity.com/techblog/index.cfm/2008/2/6/AS3--Looping-over-properties-of-a-class)找到解法：

```javascript
for (var key:String in object)
{
  trace(key+':'+ object[key]);
}
```
