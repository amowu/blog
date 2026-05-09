---
title: 'getDefinitionByName with swc'
description: '一般 Flash 程式開發時，取資源的方式有兩種：'
pubDate: 'Mar 06 2013'
---

一般 Flash 程式開發時，取資源的方式有兩種：

* .swf
* .swc

.swf 檔屬於 Runtime 時從外部載進來取用的方式，通常會使用 `Loader` 來作處理：

```java
var loader:Loader = new Loader();
```

```java
var request:URLRequest = new URLRequest('YOUR_SWF_PATH');

loader = new Loader();
loader.load(request);
loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);

private function onLoaderComplete(event:Event):void
{
  var loader:LoaderInfo = event.currentTarget as LoaderInfo;

  loader.removeEventListener(Event.COMPLETE, onLoaderComplete);
}

private function getClassReference(className:String):Class
{
  return loader.contentLoaderInfo.getDefinition(className) as Class;
}
```

.swc 擋則是 Compiler 時就會一起包進來，要取用內部元件通常就直接 `new` 出來就可以：

```java
var component:CLASS_NAME = new CLASS_NAME();
```

如果想要動態取得元件的話會碰到一些問題，一般來講會用 `getDefinitionByName(CLASS_NAME:String)` 這個 method：

```java
import flash.utils.getDefinitionByName;
```

```java
var ClassReference:Class = getDefinitionByName("CLASS_NAME") as Class;
var obj:Object = new ClassReference();
```

不過編譯完執行後會碰到錯誤，解決方式如下：

* Project > Properties
* Flex Compiler > 加入參數 `-include-libraries=YOUR_ABSOLUTE_SWC_PATH.swc`
