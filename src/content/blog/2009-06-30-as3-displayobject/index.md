---
title: 'AS3 如何複製 DisplayObject'
description: '最近正在寫一個 FLASH 的相片大頭貼截取程式，碰到了一個複製 MovieClip 的問題，AS3 已經沒有 AS2 的 duplicateMovie() 方法可以用，所以我找了一些解決方法分享上來。'
pubDate: 'Jun 30 2009'
---

---

最近正在寫一個 FLASH 的相片大頭貼截取程式，碰到了一個複製 MovieClip 的問題，AS3 已經沒有 AS2 的 `duplicateMovie()` 方法可以用，所以我找了一些解決方法分享上來。

第一種方式是比較好的解決方法，是 PTT 的 CJCAT 大提供的，可以直接複製一個相同的 Class。

> *假如場景上面有一個 clip_mc，它的 class 是 MyClip，在不使用 *`*new MyClip()*`* 的前提下，以下的 code 可以生出一個新的 MyClip 物件。*

```typescript
// 先抓到MyClip的constructor
var mcClass:Class = Object(clip_mc).constructor;
 
// 這樣就生出一個新的MyClip物件了
var clip2_mc:DisplayObject = new mcClass();
 
// 加入到舞台後就成功了
this.addChild(clip2_mc);
```

不過上面這個方法我試不出來，不知道是不是哪裡出錯了，所以又找了第二種方法， [Copying a Sprite using BitmapData](http://www.kirupa.com/forum/showthread.php?t=283258) ，這個方法可以將 Sprite 的畫面複製到另一個 DisplayObject 上，因為我只是需要複製一個靜態的圖，所以可以不需要使用第一種複製 Class 的方式。

```typescript
// 先實體一個clip_mc大小的BitmapData
var myBitmapData:BitmapData = new BitmapData(clip_mc.width, clip_mc.height);
// 然後繪製一個相同的clip_mc
myBitmapData.draw(clip_mc);
 
// 實體一個複製的Bitmap
var clip2_mc:Bitmap = new Bitmap(myBitmapData);
 
// 加入到舞台後就成功了
this.addChild(clip2_mc);
```

參考資料：

* [批踢踢實業坊](http://www.ptt.cc/)
* [KIRUPA.COM](http://www.kirupa.com/)
* [ActionScript 3.0 語言和組件參考](http://help.adobe.com/zh_TW/AS3LCR/Flash_10.0/index.html)
