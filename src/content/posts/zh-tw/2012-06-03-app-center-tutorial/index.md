---
title: 'App Center Tutorial'
description: '本篇翻譯自 Facebook 開發者頁面 的 App Center Tutorial'
pubDate: 'Jun 03 2012'
---

本篇翻譯自 [Facebook 開發者頁面](https://developers.facebook.com/) 的 [App Center Tutorial](https://developers.facebook.com/docs/guides/appcenter/)

Facebook App Center 是一個大型的社交應用程式中心。App Center 是協助你的 Facebook Apps、 手機 apps 和使用 Facebook Login 的網站 的管道。Facebook 鼓勵所有開發人員在這個 App Center 建立您的 app 細節內容頁面。

這篇文章將引導開發者配置 apps 的過程：

1. 建立一個 App 細節頁面
2. 上傳圖片
3. 網站和手機網頁的特別注意事項
4. 提交您的 app 到 App Center

如果你還沒有在 Facebook 平台上建立一個應用程序，你應該參考 [Apps on Facebook](https://developers.facebook.com/docs/guides/canvas/)， [Facebook Mobile](https://developers.facebook.com/docs/guides/mobile/) 或 [Facebook for Websites](https://developers.facebook.com/docs/guides/web/) 開發指南。

本篇假定您已經熟悉 [Facebook App Dashboard](https://developers.facebook.com/apps) 的操作及基本設置，並且已閱讀 [App Center Guidelines](https://developers.facebook.com/docs/appcenter/guidelines/) 。以確保 App Center 審查上市後，用戶在使用上有一個良好的體驗。

## 建立一個 App 細節頁面

所有的開發人員應在 [App Dashboard](https://developers.facebook.com/apps) 創建一個應用程式的詳細頁面。使用者可以經由這個頁面的資訊和截圖了解這個應用程式，然後開始登入使用。使用者通過認證之後，應用程式就會發送到他們的 Facebook 、網站或手機上。

要在 App Center 上架，App 細節頁面是必須的。這也將成為非 Facebook 用戶搜索時的目標頁面。

要訪問 App Center 的設置，到 [App Dashboard](https://developers.facebook.com/apps) 單擊在左側的 App Center 選項。

在這裡你可以輸入顯示在 App Center 應用程式的詳細訊息。包括應用程式的顯示名稱， [類別](https://developers.facebook.com/docs/appcenter/categories/) ，副標題和說明文字等等..。

請確保您的應用程式所支援的平台顯示。如果您正在測試 iOS 應用程式，且與您的 Facebook應用程式是相同的 App ID，但它仍然在開發中，你應該在細節頁面中隱藏 iOS 的平台配置。

註：如果您的網站支援 [Facebook Login](https://developers.facebook.com/docs/guides/web/) 並且同時擁有 [Facebook App](https://developers.facebook.com/docs/guides/canvas/)，那麼只需要顯示 [Facebook App](https://developers.facebook.com/docs/guides/canvas/) 在 App Center 即可，以減少用戶混淆。

最後，如果您之前尚未在設置協助訊息。則需要輸入 [隱私政策的URL](https://www.facebook.com/about/privacy/)， [服務條款URL](https://www.facebook.com/legal/terms) 和用戶支援電子郵件地址或URL。

## 上傳圖片

開發人員需要上傳圖示(icons)，橫幅(banners)和遊戲畫面(screenshots)。這些隨應用程式支持的平台可能會有所不同。例如，在 iOS 應用程式將需要上傳。圖片選項將依據適當的平台自動顯示在 App Center 選項中。

當您設計圖片時：

* 將您的應用程式名稱放置於橫福中。
* 預留一些空間給重要的圖形。
* 不要在圖片的邊界放置 Logo 和文字。
* 橫幅圖片必須填滿整個框架（例如，沒有空格，沒有圓角，無邊框）。
* 圖示(Icons)可以有圓角（建議使用帶透明度和PNG，不要GIF）。
* 請參閱 [App Center Guidelines](https://developers.facebook.com/docs/appcenter/guidelines/)。

App Center 支持以下的手機螢幕解析度：

* MDPI：240×480
* HDPI：480×800
* XHDPI：640×960以上

封面圖片：

設計封面圖片時，開發人員應該注意，128x128 圖示會稍微掩蓋住封面圖像的左下方。

遊戲畫面：

開發人員可以提交每個平台5張截圖的（Web，Canvas，手機 Web，iPhone，iPad，Android），至少須提交3個平台的遊戲截圖。

內容必須顯示真正的遊戲畫面，不能包含任何推銷資訊或橫幅。App Center 支持的截圖尺寸為 320×320 到 2048×2048 pixel 之間。

如果截圖的長寬比不適合在 App Center 的顯示框的長寬比，我們將自行縮放截圖。

畫面的選擇，根據用戶使用的裝置來查看頁面。如果您在 iPhone 上查看頁面，iPhone 的截圖會優先出現。如果應用程式不支援的 iOS 則手機 Web 的截圖會優先出現等。

有2個截圖的佈局設計：

* 一個直擺方向(portrait)+兩個橫擺方向(landscapes)。
* 三個 橫擺方向(landscapes)。

## 授權(Authorization)

在 App Center 的應用程式細節頁面中顯示新用戶所需的權限。可以被視為 [驗證對話框(Auth Dialog)](https://developers.facebook.com/docs/opengraph/authentication/) 中的一個版本，因此很容易直接從 App Center 為新用戶安裝你的應用程式。

在 App Center 下設置**權限(Permissions)**部分時，可以遵循以下：

1. 用戶與好友的權限(User & Friend Permissions)：這些[權限](http://permissions/)將顯示在 App Center 的應用程式的細節頁面。
2. 擴展權限(Extended Permissions)： 用戶通過點擊應用程式的細節頁面後，將出現對話框的提示驗證這些可選的[權限](https://developers.facebook.com/docs/reference/api/permissions/)，這意味著用戶可以**取消**這些權限，然後仍授權您的應用程式。
3. Auth Token Parameter：當用戶通過應用程式的細節頁面授權您的應用程式，我們將通過您的應用程式，在這裡指定 Auth Token 的格式。可用的格式：

請注意，有些用戶將直接從 App Center 導向到應用程式的細節頁面，其他用戶仍然可以通過直接輸入網址或通過 [Feed](https://developers.facebook.com/docs/reference/dialogs/feed/)， [Requests](https://developers.facebook.com/docs/requests/)和 [廣告](https://www.facebook.com/advertising/)導到您的應用程。在這些情況下，你仍然需要通過現有的 [驗證對話框(Auth Dialog)](https://developers.facebook.com/docs/opengraph/authentication/) 授權處理。

## Canvas App 的開發者(For [Canvas Developers](https://developers.facebook.com/docs/guides/canvas/))

大多數 Canvas 應用程式是將新用戶通過客戶端重導向驗證對話框。提交到 App Center，用戶仍然可以通過直接輸入網址瀏覽到應用程式，應仍保持授權的需要功能。開發人員必須確保他們在這兩種情況下的同一組的權限要求; App Center 權限配置應符合開發商已經要求的 [OAuth Dialog](https://developers.facebook.com/docs/reference/dialogs/oauth/) 參數。如果這些不匹配，用戶會看到兩種授權在提示，將造成用戶體驗混亂，導致您的應用程式無法在 App Center 上市。

## iOS 與 Android 的開發者(For [iOS](https://developers.facebook.com/docs/mobile/ios/build/) and [Android](https://developers.facebook.com/docs/mobile/android/build/))

手機應用程式必須使用單點登錄（SSO）是在 App Center 上市的資格。只提供一個無縫的登入過程後，通過應用程式的細節頁面點擊列出在 App Center 的手機應用程式。

人們將能夠瀏覽 Facebook.com 的 App Center，和 Facebook 的手機應用。當人們要安裝原生的手機應用程式，他們將直接從 Apple 的 App Store 或 Google Play 下載應用程式。App Center 聯繫手機應用商場，旨在推動 iOS，Android 和手機網路巨大社交應用的成長。

## 網頁與手機網頁的開發者(For [Website](https://developers.facebook.com/docs/guides/web/) and [Mobile Web](https://developers.facebook.com/docs/guides/mobile/web/) Developers)

在 App Center 的應用程式的細節頁面，將採取授權的用戶才到達您的網站上的方式，但重要的是要確保這些用戶有個人化的體驗經驗，當他們通過從 App Center 點擊您網站上的資訊。用戶不應該點擊第二次 登錄到 Facebook 按鈕，而是應該看到一些個人化的資訊，以優化用戶體驗。

下面的程式碼範例將檢查用戶是否已授權應用程式和顯示出個人資訊的歡迎訊息，例如 ‘Welcome, Constantin!’.。

```xml
<html>
   <head>
     <title>Example</title>
   </head>
   <body>
     <!-- Load the Facebook JavaScript SDK -->
     <div id="fb-root"></div>
     <script src="//connect.facebook.net/en_US/all.js"></script>
     <div id="welcomeMessage"></div>
     <script type="text/javascript">
       // Initialize the Facebook JavaScript SDK
       FB.init({
         appId: 'APP_ID',
   status: true,
       });

       // Check if the current user is logged in
       // and has authorized the app
       FB.getLoginStatus(checkLoginStatus);

       // Check the result of the user
       function checkLoginStatus(response) {
         if(response && response.status == 'connected') {
           // The user is connected to Facebook
           // and has authorized the app.
           // Now personalize the user experience

           FB.api('/me', function(response) {
             var message = document.getElementById('welcomeMessage');
             message.innerHTML = 'Welcome, ' + response.first_name + '!';
           });
         } else {
           // The user has not authenticated your app, 
           // proceed with your normal (anonymous) flow.
         }
       }
     </script>
   </body>
 </html>
```

更多如何檢測用戶的Facebook狀態可以參考 [JavaScript SDK](https://developers.facebook.com/docs/reference/javascript/)， [FB.getLoginStatus](https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/) 文件，這個 [網誌文章](https://developers.facebook.com/blog/post/2012/05/08/how-to--improve-the-experience-for-returning-users/) 的詳細資訊。

## 提交您的 app 到 App Center

對於一個應用程式在 App Center 上市，必須滿足您的應用程式的 [guidelines](https://developers.facebook.com/docs/appcenter/guidelines/) 。Facebook將審查圖片，應用程式的細節訊息，和用戶體驗。如果您的應用程式被拒絕，我們將解釋為什麼並給你一些改變的建議。一旦您修正，可以在 App Center 重新提交上市。

開發人員可以提交之前預覽他們的應用程序的詳細信息頁面，在頁面頂部點擊”預覽”鏈接。這將顯示一個實時預覽：

開發人員可以提交他們的應用程式，通過點擊 App Center 的頂上方按鈕。一旦提交將會顯示一條訊息，提交正在等待審查。一旦你的應用程式已經批准，將更新此訊息。

注意：一旦您提交您的應用程式的細節頁面，設定值不能被改變，直到提交批准或取消提交。一旦你的應用程式的細節頁面在 App Center 上市，頁面上的所有未來的變化也將受到審查。

這些提交過程是所有應用程式要在 App Center 上市所需的，但所有的應用程式仍可以繼續使用 Facebook 的 API，Bookmarks， Requests， Timeline 和 News Feed。提交到 App Center 不是必需的，但鼓勵大家這麼做，作為應用中心提供了一個獲取新用戶的重要機遇。
