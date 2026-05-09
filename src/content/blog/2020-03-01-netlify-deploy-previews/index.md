---
title: '無限環境（ㄧ）Netlify Deploy Previews'
description: '大綱'
pubDate: 'Mar 01 2020'
heroImage: './cover.png'
---

---

![](./cover.png)

### 大綱

* 什麼是「無限環境」？
* 什麼是 Netlify Deploy Previews？
* 快速入門指南
* 總結
* 附錄
* 參考資料

### 什麼是「無限環境」？

大家常用的 [GitHub flow](https://guides.github.com/introduction/flow/) 其實有一個常常被忽略的重點 — — 合併前部署。

![](./image1.png)

我自己在前端開發的 [Code Review](https://github.com/features/code-review/) 上，常常碰到下列兩個問題：

1. PR 合併、部署到 staging 或 production 環境之後，才發現程式碼有問題
2. 為了避免第一個問題發生，就必須先 checkout PR 到 local 環境，然後經過一系列繁瑣的步驟跑起來，最後才能開始驗收和測試

為了解決上述問題，就需要引入無限環境的概念。

> 所謂的無限環境，就是**自動將目前 PR 中的最新 commit，部署到一個臨時環境中，並返回該環境的 URL 網址。**（如果口袋夠深的話，甚至可以部署每一個 commit 以方便比對。）
> [真正的敏捷工作流 — — GitHub flow](https://www.infoq.cn/article/ICx4zr8mpIYO6kD9Qveb)

如果能實現這個條件，將為開發團隊帶來兩點好處：

1. Reviewer 有任何懷疑時，便可以直接在預覽環境中驗證，而非憑空猜疑。
2. Reviewer 也可以放心大膽的驗證自己的懷疑，不需要在 local 開發環境耗時費力地切換。

接下來我會寫三篇「無限環境」系列的文章，介紹一些可以達成這個目的的工具。

這是第一篇文章，介紹如何透過 Netlify 的 Deploy Previews 服務，建立靜態網頁的無限環境。

### 什麼是 Netlify Deploy Previews？

[Netlify](https://www.netlify.com/) 是一個類似 [Heroku](https://www.heroku.com/) 的 All-in-one [PaaS](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E5%8F%B0%E5%8D%B3%E6%9C%8D%E5%8A%A1)，提供各種現代 web 專案會用到的自動化服務，例如：靜態網站部署、CDN、持續交付和一鍵配置 HTTPS 等。

其中 [Deploy Previews](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/) 這項服務，可以將 GitHub repository 中的每個 pull request 部署到**唯一**的 URL，與 staging 和 production 環境的完全不同。你和你的團隊可以在合併到主分支、並且部署到正式環境之前，提前看到更改的外觀以及驗收功能是否正確。

### 快速入門指南

這篇文章會以時下最流行的 [Create React App](https://create-react-app.dev/) 為例，示範如何實現 React 網站的無限環境。

#### 步驟一、建立 React 網站

透過 `npx create-react-app` 指令，快速產生一個 React App 專案：

```bash
$ npx create-react-app test-netlify-deploy-previews
```

打開 [http://localhost:3000](http://localhost:3000) 確認 React 網站成功運行：

![](./image2.png)

#### 步驟二、建立 GitHub repository

這篇文章以 GitHub 為例，Netlify 同時也支援 GitLab 和 Bitbucket。

首先，在自己的 GitHub 新增一個 repository：

![](./image3.png)

接下來，將程式碼 `git push` 至 GitHub repository：

```bash
$ git remote add origin git@github.com:amowu/test-netlify-deploy-previews.git
$ git add .
$ git commit -m "chore: create react app"
$ git push origin master
```

#### 步驟三、註冊＆配置 Netlify

前往 Netlify [註冊](https://app.netlify.com/signup) 頁面，這裡以連結 GitHub 帳號的方式為例：

![](./image4.png)

第一次需要「Create a new team」建立一個 team，免費方案只允許一位 team member。

接下來，選擇「New Site from Git」：

![](./image5.png)

選擇 GitHub 作為持續交付的服務對象：

![](./image6.png)

第一次需要透過「Configure Netlify on GitHub」安裝 Netlify 的 GitHub App：

![](./image7.png)

選擇要安裝在 GitHub 的個人帳號或是組織帳號，點選「Configure」：

![](./image8.png)

如果希望自己所有的 repositories 都套用 Netlify 服務，可以選擇「All repositories」。因為這裡只跑文章範例，所以選擇「Only select repositories」：

![](./image9.png)

點選 repository 進入配置頁面：

![](./image10.png)

接下來是**重點**，在 Basic build settings 底下有「Build command」和「Publish directory」兩個欄位，要填寫正確，否則 Netlify 無法正確地部署網站。

* Build command 填入 `yarn build`
* Publish directory 填入 `build/`

`yarn build` 是 Create React App 提供的指令，會將靜態網站的檔案輸出到 `build/` 資料夾底下。

如果使用的是其它靜態網站產生工具（例如 Jekyll），這兩個欄位填入的內容注意不要填錯了。

最後，點擊「Deploy site」開始部署網站：

![](./image11.png)

部署成功之後，就會看到一組屬於 master 分支的 production 環境（支援自訂網域）的 URL 網址：

![](./image12.png)

到這裡，就完成了 Netlift 的基本配置。接下來，介紹如何實現 Deploy Previews。

#### 最終步驟、玩轉 Deploy Previews

其實也不用特別配置，因為 Netlify 預設就會開啟 Deploy Previews 這個功能。我們直接送一個 Pull Request 試試。

打開 **src/App.js**，修改幾行程式碼如下：

```css
<p>
  - Edit <code>src/App.js</code> and save to reload.
  + Hello World!
</p>
```

接下來，建立新的分支，並 `git push` 到 GitHub：

```shell
$ git branch feature/hello-world
$ git add .
$ git commit -m "refactor(App): hello world"
$ git push -u origin feature/hello-world
```

最後，打開 GitHub，新增一個 merge `master` from `feature/hello-world` 的 Pull Request，捲至頁面至下方的 status checks 區塊，應該會出現 **netlify/<id>/deploy-preview** 的 check：

![](./image13.png)

等待「Deploy preview ready!」出現之後，表示 Netlify 已經順利將 PR 部署到一個暫時的環境，這時候可以透過點擊右方「Details」打開 Netlify 提供的唯一 URL，應該就會看到文字被更改「Hello World!」的頁面。

成果展示：

![](./image14.gif)

至此，完善 GitHub flow 的最後一哩路，「合併前部署」的流程就建立起來了。

未來 Code Reviewer 驗收 PR 的時機點，就可以發生在 merge master 之前，大大降低了「上線之後才發現問題」的發生機率。

### 總結

Google 的 [Code Review Developer Guide](https://google.github.io/eng-practices/review/) 曾經提到，看 PR 的優先順序，應該是先跑跑看結果是否正確。如果一開始就投入大量時間去 review 程式碼，但是發現跑出來的結果根本是錯的，那麼這其實是很浪費人力成本的。

這篇文章介紹了 Netlify 的 Deploy Previews 服務，結合 GitHub flow，讓 code author 在送出 React app 的修改 PR 時，自動在合併回主分支之前，先提前部署一次性的「無限環境」，讓 code reviewer 優雅地驗收測試，避免發生上線 production 環境之後才發現程式碼有問題。

介紹完 Netlift Deploy Previews 之後，可能會有讀者好奇：「萬一我們的專案不是靜態網站、而是動態網站呢？」。

真實的世界，不會只有靜態網站那麼單純。下一篇，我會介紹如何透過 Heroku 的 [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) 來實現動態網站的無限環境，敬請期待。

### 附錄

#### 如何刪除安裝在 GitHub repository 的 Netlify app？

如果之後不需要 Deploy Previews 這個服務，可以前往安裝的 repository 頁面，依序執行以下步驟：

Settings > Integrations & services > Installed GitHub Apps > Netlify > Configure > Uninstall Netlify > Uninstall

#### 可以套用在 components library 嗎？

假如你的專案不是網頁應用，而是元件庫（例如 [nwb](https://github.com/insin/nwb) 的 [React Components and Libraries](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md)）。那麼，通常專案會搭配 [Storybook](https://storybook.js.org/) 這個工具一起協助開發。

這時候，只需將 build settings 設定成 Storybook 的指令，然後指定輸出資料夾即可：

* Build command：`npm run build-storybook -- -c .storybook`
* Publish directory：`storybook-static`

### 參考資料

* [真正的敏捷工作流 — — GitHub flow](https://www.infoq.cn/article/ICx4zr8mpIYO6kD9Qveb)
* [Introducing Deploy Previews in Netlify](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/)
* [Google’s Code Review Guidelines](https://google.github.io/eng-practices/review/)
