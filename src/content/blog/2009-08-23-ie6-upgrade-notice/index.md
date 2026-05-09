---
title: 'IE6 Upgrade Notice'
description: '有過網頁設計經驗的人，無論是部落格樣版或是其他頁面，都一定有個共同的痛，就是 IE6 這傢伙對 CSS 的呈現總是跟別人不同，偏偏它的市占率一直是最高的。'
pubDate: 'Aug 23 2009'
---

有過網頁設計經驗的人，無論是部落格樣版或是其他頁面，都一定有個共同的痛，就是 IE6 這傢伙對 CSS 的呈現總是跟別人不同，偏偏它的市占率一直是最高的。

通常解決這個問題的方法有兩種，一種是修改 CSS 直到版面看起來正常，另一種則是直接放棄，在網頁開頭就提醒使用者升級瀏覽器。

我們今天要介紹的就是最後一種方法，為什麼我們要放棄 IE6 呢?

因為網頁技術不斷的進步，不單單是 CSS 的問題，IE6 本身還有其他原因，它已經不適合這個世代了，加上最近許多知名網站也紛紛開始提倡升級 IE6，例如 You Tube、Twitter 和 Facebook 等，IE6 你真的玩完了，拜託還在使用 IE6 的人，請你快點更換瀏覽器吧！！（小聲:換 Firefox Chrome 吧）

知名影音分享網站 YouTube 將停止對 IE6 的支援。

連最近在台灣火熱的 Facebook 都要封殺 IE6 了，還在使用它的人，麻煩你快點更新吧！！！

剛好之前看到一篇 [重灌狂人](http://briian.com/)寫的文章 “ [在網站加入警告標語，建議 IE 6.0 的使用者升級](http://briian.com/?p=6382)”，裡面介紹了一些 IE 瀏覽器版本判斷的語法，可以分辨出使用者目前的 IE 瀏覽器是哪一個版本。

例如我要讓 IE6 以下的使用者看見提示的話：

```xml
<!--[if lte IE 6]>
  這裡的內容只有IE6以下的使用者才看的見。
<![endif]-->
```

只要將提示內容放在 `<!--[if lte IE 6]><![endif]-->` 之中，就可以讓還在用 IE6 的人，看到你要傳達給他的訊息了。

語法說明：

```xml
<!--[if IE]>
  使用 IE 瀏覽器全部版本的人都看得見這裡的內容。
<![endif]-->
<!--[if IE 6]>
  只有 IE6 的使用者才能看見這裡的內容
<![endif]-->
<!--[if lt IE 6]>
  這裡是小於 IE6 的版本使用者才能看到，不含 IE6。
<![endif]-->
<!--[if lte IE 6]>
  IE6 以下版本的使用者能看見內容，包含 IE6。
<![endif]-->
<!--[if gt IE 6]>
  這樣 IE6 以上版本的使用者會看見內容，但不包含 IE6。
<![endif]--> 
<!--[if gte IE 6]>
  IE6 以上版本的使用者能看見內容，包含 IE6。
<![endif]-->
```

上面的版本編號也可以換，如果把 `[if lte IE 6]` 換成 `[if lte IE 7]` 的話，就是 IE7 以下使用者能看見內容。

* **gt：**greater than（版本大於）
* **lt：**less than（版本小於）
* **gte：**greater than or equal（版本大於等於）
* **lte：**less than or equal（版本小於等於）

最後分享一個自己寫的範本，加了 jquery 的 sideup 效果，有興趣的可以下載回去參考看看。

演示範例：

* [IE6 Notice sample page](http://momo26.myweb.hinet.net/amo-studio/IE6Notice/)

範本下載：

* [IE6NoticeTemplate.rar](http://sites.google.com/site/amo26site/download/IE6NoticeTemplate.rar?attredirects=0)

參考資料：

* [重灌狂人 — 在網站加入警告標語，建議IE 6.0的使用者升級！](http://briian.com/?p=6382)
* [靖˙技場 — IE6 No More § 請升級你的瀏覽器，不要再用過時的IE6啦！](http://jinnsblog.blogspot.com/2009/08/ie6-no-more-update-your-browser.html)
