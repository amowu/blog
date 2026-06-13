---
title: '如何寫一個 Arduino Library？'
description: '假設要寫一個摩斯密碼（telegraph）的 library：'
pubDate: 'Apr 26 2013'
heroImage: './cover.jpg'
categories: [Tech]
---

假設要寫一個摩斯密碼（telegraph）的 library：

1. 先在 Arduino 目錄底下（預設是`/Users/XXX/Documents/Arduino`）建立一個 `libraries` 資料夾
2. 建立一個資料夾取名為 `Telegraph`
3. 建立 `Telegraph.h`

```cpp
#ifndef Telegraph_h
#define Telegraph_h
```

```cpp
class Telegraph
{
public:
    Telegraph();
    void send_message(const char* message); // 要公開給別人使用的 method.
private:
    ...
};
#endif
```

建立 `Telegraph.cpp`（舊版使用 `WProgram.g`，新版使用 `Arduino.h`）：

```cpp
#if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#endif
#include "Telegraph.h"
```

```cpp
Telegraph::Telegraph() {
    ...
}
void Telegraph::send_message(const char* message) {
    ...
}
```

到這邊基本上已經寫好一個 library 了，接下來開啟一個新的 Ardiono 專案來使用：

```cpp
#include <Telegraph.h>
```

```cpp
Telegraph telegraph();
void setup() {}
void loop() {
  telegraph.send_message("Hello world");
}
```

更多詳細的範例原始碼可以參考這個 [GitHub repository](https://github.com/amowu/arduimo/tree/master/Telegraph)。
