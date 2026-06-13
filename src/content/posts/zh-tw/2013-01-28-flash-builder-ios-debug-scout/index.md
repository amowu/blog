---
title: 'Flash Builder 4.7 iOS Debug'
description: '這個月剛好玩到 flash on iOS，在部署到 iPad 時碰到些問題，筆記一下最後解決的步驟。'
pubDate: 'Jan 28 2013'
categories: [Tech]
---

這個月剛好玩到 flash on iOS，在部署到 iPad 時碰到些問題，筆記一下最後解決的步驟。

Flash Builder 4.7 提供三種方式部署和測試你的程式:

* On AIR Simulator
* On iOS Simulator
* On device

開發環境:

* Mac OSX 10.8.2
* XCode 4.5.2
* Flash Builder 4.7 Premium
* Adobe AIR SDK 3.5

STEP:

1. 先開啟 Xcode 確定有更新到最新版，否則模擬器會有問題。
2. 到**美國**Adobe官網下載安裝 [Flash Builder 4.7](http://www.adobe.com/products/flash-builder.html)，可試用兩個月。
3. 前往 /Applications/Flash Builder 4.7/sdk/ 底下。
4. 複製一份 4.6.0 的資料夾命名為 4.6.0_AIR35。
5. 下載最新 [AIR SDK](http://www.adobe.com/devnet/air/air-sdk-download.html) 到剛建立的資料夾。
6. 開啟 Terminal
7. `cd /Applications/Flash Builder 4.7/sdk/4.6.0_AIR35/`
8. `sudo tar -jxvf <下載的AIR SDK>`
9. 準備好 Apple Developer 的 .p12 和 .mobileprovision。
10. Debug your app!!

最後發現 Adobe 還提供一個免費又強力的效能檢測工具 [Adobe Scout](http://gaming.adobe.com/technologies/scout/)。
 不過一開始碰到不少問題，Flex 專案沒辦法跟 Scout 連上，最後 Google 到的解決方法:

1. 確定你有安裝 python 的環境。
2. 下載 [telemetry-utils](https://github.com/adobe/telemetry-utils)。
3. 開啟 Terminal cd 到 telemetry-utils 資料夾底下。
4. `add-opt-in.py <YOUR FLEX bin .swf file>`
5. 然後再 Run 就可以看到 Scout 的結果了。

缺點是每次重新 Build 的時候就失效了，需要再下一次指令，期待之後會改善。
