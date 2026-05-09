---
title: 'Use getPixelRatio for HTML5 on retina'
description: '如果用 HTML5 配 WebView 來作 App 的話，在 iPhone4 跟一些 Android 手機會碰到的解析度問題。'
pubDate: 'Mar 04 2012'
---

如果用 HTML5 配 WebView 來作 App 的話，在 iPhone4 跟一些 Android 手機會碰到的解析度問題。

iPhone4 的 Retina 是 960 x 640，但是在 WebView 底下會以 480 x 320 來顯示。

所以須要利用到 javascript 的 getPixelRatio() 來作調整：

```javascript
/**
 * Return current device resolution pixel ratio, Default is 1.
 * @return {number}
 */
function getDevicePixelRatio() {
       
    if (window.devicePixelRatio === undefined) {
        return 1;
    }
       
    return window.devicePixelRatio;
}
```

這裡寫一支 function 來取得裝置的 PixelRatio，一般通常都 return 1，解析度較大的手機才會回傳其他數值，例如 iPhone4 則回傳 2。

最後寫一支 initDeviceViewport 的 function 來塞值給 viewport metadata tag，例如這裡 iPhone4 會將 viewport 的 scale 全部縮放為 0.5 倍。

```javascript
/**
 * Initialize device viewport meta tag to full screen size.
 * @author http://jsway.se/?p=150
 */
function initDeviceViewport() {
       
    var scale = 1;
    var ratio = getDevicePixelRatio();
    if (ratio !== 1) {
        scale = 1 / ratio;
        scale = scale.toFixed(1);
    }
        
    var viewport = document.getElementById("viewport");
    var vp_width = "width=device-width; ";
    var vp_initial_scale = "initial-scale="+scale+"; ";
    var vp_maximum_scale  = "maximum-scale="+scale+"; ";
    var vp_minimum_scale = "minimum-scale="+scale+"; ";
    var vp_user_scalable = "user-scalable=0;";
       
    viewport.attributes.content.value =
        vp_width+
        vp_initial_scale+
        vp_minimum_scale+
        vp_maximum_scale+
        vp_user_scalable;
}
```

參考： [RETINA DISPLAY AND WEB DEVELOPMENT](http://jsway.se/?p=150)
