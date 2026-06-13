---
title: 'swfobject — 網頁輕鬆嵌入 Flash'
description: 'Flash 在網頁上的應用已經越來越普遍了，未來一樣占有一席之位，但是從以前到現在，對於發佈 Flash 到網頁上常常碰到一些不必要的問題，例如 XP SP2 更新後，IE 瀏覽器上方會出現檔掉的訊息，或是 Flash…'
pubDate: 'Jul 23 2009'
categories: [Tech]
---

Flash 在網頁上的應用已經越來越普遍了，未來一樣占有一席之位，但是從以前到現在，對於發佈 Flash 到網頁上常常碰到一些不必要的問題，例如 XP SP2 更新後，IE 瀏覽器上方會出現檔掉的訊息，或是 Flash 外框出現虛線，需要滑鼠點一下才能開始動作等…，而且使用者並未安裝 Flash Player 的情況下或版本太低都會無法順利的瀏覽。

最近剛好看到一個不錯的東西，就是這次要介紹的 swfobject，一般我們要嵌入 swf 到 HTML 時，通常會寫的語法如下：

```xml
<object id="FlashID" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="300" height="120">
  <param name="movie" value="test.swf" />
  <param name="quality" value="high" />
  <param name="wmode" value="opaque" />
  <param name="swfversion" value="6.0.65.0" />
</object>
```

上面的程式碼使用到 `<object>` 標籤，早一點的甚至還要再寫 `<embed>` 才能動作，因為 IE 跟其他瀏覽器的種種原因，使得這種寫法不但又臭又長，也不符合標準。

那使用 swfobject 有什麼好處呢？我們繼續看下去吧。

首先我們得先去 swfobject 的網頁 [http://code.google.com/p/swfobject/](http://code.google.com/p/swfobject/)，然後下載目前的最新版本 [swfobject_2_2.zip](http://swfobject.googlecode.com/files/swfobject_2_2.zip) 。

下載解壓縮後可以看到以下檔案：

```plaintext
swfobject
├ src (原始碼資料夾)
│  ├ expressInstall.as (flash player版本升級原始碼)
│  ├ expressInstall.fla (flash player版本升級原始碼)
│  └ swfobject.js (swfobject javascript)
│
├ expressInstall.swf (flash player版本升級程式)
├ index.html (HTML範例檔)
├ index_dynamic.html (HTML範例檔)
├ swfobject.js (swfobject javascript)
└ test.swf (測試用swf檔)
```

上面灰色的檔案是比較不重要的範例檔，我們只需要 swfobject.js 跟 expressInstall.swf 就可以了。

在這裡先解釋一下，expressInstall.swf 是用來幫助使用者升級 flash player 用的 swf 檔，如果你發佈了一個版本為 10 的 swf 到網頁，而使用者的瀏覽器版本只到 9 或更低，網頁就會自動載入 expressInstall.swf 協助使用者升級 player 的版本。

下面我們開始使用 swfobject，先建立一個資料夾，暫時命名為 MySwfobject，然後在資料夾裡在建立一個 js 資料夾，我們把 swfobject.js 複製到 js 資料夾內，然後將 expressInstall.swf 複製到 MySwfobject 資料夾內，再來我們需要一個測試用的 flash，就把剛剛下載的 test.swf 一樣複製到 MySwfobject 資料夾內，最後建立一個空白的 HTML 檔 index.html，程式碼如下：

```xml
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>MySwfobject</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <body>
  </body>
</html>
```

這時我們的目錄應該如下的結構：

```plaintext
MySwfobject
├ js
│ └swfobject.js
│
├ expressInstall.swf
├ index.html
└ test.swf
```

我們開始把 test.swf 嵌入到 index.html，先在 `<head>` 標籤內導入 swfobject.js：

```xml
<script src="js/swfobject.js" type="text/javascript"></script>
然後在底下加上這幾行javascript:
<script type="text/javascript">
  swfobject.embedSWF("test.swf", "mySwfobjectDiv", "300", "120", "9.0.0", "expressInstall.swf");
</script>
```

最後在 `<body>` 內加入 `id="mySwfobjectDiv"` 的 `<div>` 標籤：

```xml
<div id="mySwfobjectDiv"></div>
```

這時候用你的瀏覽器開啟 index.html 就會發現 test.swf 成功被嵌入了。

大家可以發現程式碼非常的簡短，而且不需要一堆 `<object><embed>` 標籤，只需要一個 `<div>` 就可以輕鬆嵌入 Flash，其中的核心就是 `swfobject.embedSWF("test.swf", "mySwfobjectDiv", "300", "120", "9.0.0", "expressInstall.swf");` 這行，這裡我們介紹一下 `swfobject.embedSWF` 的幾個參數：

```javascript
swfobject.embedSWF(swfUrl, id, width, height, version, expressInstallSwfurl, flashvars, params, attributes, callbackFn)
```

* `swfUrl` 要嵌入的 swf 檔的位置（例如在這裡我們是 test.swf）
* `id` 要嵌入在哪的 HTML 標籤 id（在這裡我們是嵌入在 `<div id="mySwfobjectDiv">`）
* `width` Flash 的寬
* `height` Flash 的高
* `version` Flash Player 的版本（可直接輸入整數 ex: 9 or 10
* `expressInstallSwfurl` expressInstall.swf 的位置
* `flashvars` 要傳給 Flash 的變數
* `params` Flash 的參數 ex: menu,wmode,quality 等...
* `attributes` Flash 本身的一些屬性 ex: id,name...
* `callbackFn` 要 callback 給 javascript 的 function

最後這裡附上加了 flashvars, params 跟 attributes 的 index.html 程式碼：

```xml
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>MySwfobject</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="js/swfobject.js" type="text/javascript"></script>
    <script type="text/javascript">
      var flashvars = {};
      var params = {
        menu: "false"
      };
      var attributes = {
        id:"MySwfobject"
      };
      swfobject.embedSWF("test.swf", "mySwfobjectDiv", "300", "120", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
    </script>
  </head>
  <body>
    <div id="mySwfobjectDiv">
      <a href="http://www.adobe.com/go/getflashplayer">請安裝Flash Player</a>
    </div>
  </body>
</html>
```

我們新增了關閉 player menu 的參數給 swfobject，然後將 id 命名為 MySwfobject，並且在 mySwfobjectDiv 的 div 標籤內加入一個 Flash Plyer 的安裝連結，如果使用者的瀏覽器沒有安裝 Flash Player，swfobject 就不會將 test.swf 嵌入到 mySwfobjectDiv，而是直接顯示這行連結通知使用者安裝。

更多進階的使用文件可以參考 [swfobject 的 documentation](http://code.google.com/p/swfobject/wiki/documentation) 。

範例程式：

* [SwfobjectSample.rar](http://sites.google.com/site/amo26site/download/SwfobjectSample.rar?attredirects=0)

參考資料：

* [swfobject](http://code.google.com/p/swfobject/)
* [番茄腦袋](http://fanchie.blogspot.com/2008/04/swfobject-swfobject-20-flash.html)
