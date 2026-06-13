---
title: 'Javascript message on Facebook post feed'
description: '之前在使用Facebook API的時候碰到的問題,，筆記一下。'
pubDate: 'Mar 04 2012'
categories: [Tech]
---

之前在使用Facebook API的時候碰到的問題,，筆記一下。

如果在沒有登入Facebook的情況下開啟 Feed Dialog 發佈訊息，
會被導到一個莫名其妙的頁面，上面只有一串 javascript 如下

```xml
<script type="text/javascript">
window.location.href="fbconnect:\/\/success?
post_id=XXXXXX;
</script>
```

這個問題我碰到兩次：

* 一次是在網頁版直接使用 [Graph API call](https://developers.facebook.com/docs/reference/dialogs/feed/) 的方式開啟 Feed Dialog
* 一次是在 iOS Facebook SDK 中使用 Feed Dialog

iOS好像是在4.0以下才會發生，不太確定

解決方法：

* 找到呼叫 Graph API 的地方 ( iOS SDK 應該在 Dialog 相關的檔案裡)
* 將 [https://m.facebbok.com/dialog/feed?xxxxxx](https://m.facebbok.com/dialog/feed?xxxxxx) 的 m 改成 www
* 還是不行的話就把 https 改成 http 試試，應該可以解決~

參考：[Javascript message on Facebook Connect post to feed in iPhone/iPad app](http://stackoverflow.com/questions/8471762/javascript-message-on-facebook-connect-post-to-feed-in-iphone-ipad-app)
