---
title: '如何在 React Native 使用 SVG 向量圖檔'
description: '問題'
pubDate: 'Dec 16 2018'
heroImage: './cover.png'
---

---

![](./cover.png)

### 問題

1. React Native 提供的 [Image](https://facebook.github.io/react-native/docs/image.html) 無法使用 .svg 向量圖檔
2. [Expo](https://expo.io/) 提供的 [Svg](https://docs.expo.io/versions/v26.0.0/sdk/svg) 需要透過 `Circle`、`Rect`、`Path`、`ClipPath` 和 `Polygon` 自己繪製

### 解決方法

透過 [SVGR](https://github.com/smooth-code/svgr) 這個工具將 SVG 轉換成 React Native Component，例如：

```bash
$ npx svgr@v1.10.0 --native ./logo.svg > LogoSVG.js
```

會自動產生下列 [react-native-svg](https://github.com/react-native-community/react-native-svg) 可以支援的程式碼：

```javascript
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const LogoSVG = props => (
  <Svg {...props}>
    <Defs>...</Defs>
    <Path ... />
    <Path ... />
    ...
  </Svg>
);

export default LogoSVG;
```

直接在 App 使用：

```javascript
import React from 'react';
import { View } from 'react-native';

import LogoSVG from './LogoSVG';

class App extends React.Component {
  render() {
    return (
      <View>
        <LogoSVG />
      </View>
    );
  }
}
```

### 已知問題

如果 SVG 元件沒有 render 出來，可能需要自行給定寬和高，例如：

```xml
<LogoSVG width={320} height={240} />
```

`<Stop />` 的 `offset` propTypes 預設 number 是錯誤的，應該是字串，例如：

```xml
<!-- 錯誤的 -->
<Stop offset={0.93} stopColor="#000000" />

<!-- 正確的 -->
<Stop offset="93%" stopColor="#000000" />
```

某些 `<Path />` 會掉色，要手動添加 `fill` props，例如：

```xml
<Path
  d="..."
  fill="#00aaa5"
/>
```

### 參考文章

* [react-native icon解决方案（svg）](https://www.jianshu.com/p/7db2bc62c5ed)
* [Making SVG icon libraries for React apps](http://nicolasgallagher.com/making-svg-icon-libraries-for-react-apps/)
