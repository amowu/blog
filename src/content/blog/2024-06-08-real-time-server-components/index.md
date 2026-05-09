---
title: 'Real-time Server Components'
description: '打破無狀態伺服器的限制：利用 Durable Objects 和 React Server Components 構建即時多人應用'
pubDate: 'Jun 08 2024'
heroImage: './cover.png'
---

---

打破無狀態伺服器的限制：利用 Durable Objects 和 React Server Components 構建即時多人應用

![Generated with DALL·E](./cover.png)
*Generated with DALL·E*

#### 前言

最近有許多跟前端相關的 conference，例如 [React Conf 2024](https://conf.react.dev/)、[Google I/O 2024](https://io.google/2024/) 以及 [React Paris 24](https://react.paris/)。

雖然每段議程都不長，但要全部追完也是很累人，所以公司同事就揪大家一起共筆。

我認領到的議程有這三場：

1. [Real-time server components](https://conf.react.dev/talks/8)
2. [Automate browser testing with tools and best practices from Chrome](https://io.google/2024/explore/f6a77c6d-e1fe-434b-92ca-879f8d153672/)
3. [Multi-page application View Transitions are here](https://io.google/2024/explore/8ae18b72-028e-4722-9a05-4a480048e629/)

剛好可以順便來嘗試最近剛訂閱的 [ChatGPT Plus](https://openai.com/index/chatgpt-plus/)。

這篇先介紹 Real-time server components，其它之後有機會再陸續更新上來。

[React Conf 2024 Day 1](https://www.youtube.com/live/T8TZQ6k4SLE?t=24068&si=ThfeHok-WKdlzt3B)

#### 背景介紹

講者 [Sunil Pai](https://x.com/threepointone) 曾在 React 核心團隊工作，後來創辦了 [PartyKit](https://www.partykit.io) 這間公司，專注於構建即時多人應用程式。

最近 PartyKit 被 Cloudflare 收購，本人重返大公司工作。

![](./image1.png)

#### 無狀態伺服器架構的局限

無伺服器模型（Serverless）雖然有許多優點，但存在狀態管理問題。每次請求都會重置狀態，導致需要依賴外部資料庫或 key-value storage 來管理狀態。

```javascript
let counter = 0;
```

（每次請求回應的 `counter` 都會是 0）

#### Durable Objects 的解決方案

Cloudflare 的 [Durable Objects](https://developers.cloudflare.com/durable-objects/)（持久化物件？）提供了狀態化服務（stateful services）的新方法。通過給定的 ID，可以建立一個保持活躍的 process，這個 process 可以處理請求並保持狀態。

```kotlin
// for every /chat/:id...

class Server {
  // store messages in memory
  messages = [];

  async onRequest(req: Request) {
    if (req.method === 'POST') {
      this.messages.push(await req.text());
      return Response.json({ status: 'ok' });
    }
    if (req.method === 'GET') {
      return Response.json(this.messages);
    }
  }
}
```

這個模型使得構建像聊天室這樣的即時應用變得簡單，開發者可以使用類似於 JavaScript 的變數來維持狀態。

```typescript
class Server {
  websockets: WebSocket[] = []; // all websockets in this room
  messages: string[] = [];

  onConnect(ws: WebSocket) {
    this.websockets.push(ws);   // add websocket to array

    ws.send(
      JSON.stringify({
        type: 'message',
        data: this.messages,
      });
    );
  }

  onMessage(ws: WebSocket, message: string) {
    this.messages.push(message);

    this.websockets.forEach((w) => {
      w.send(
        JSON.stringify({ // <----- broadcast all incoming messages to all connected clients
          type: 'message',
          data: message,
        });
      );
    });
  }
}
```

#### React Server Components 的挑戰

目前在 [React Server Components](https://react.dev/reference/rsc/server-components) 中不能使用 `useState` 和 `Context`。這對於需要在伺服器端維持狀態的應用來說是一個限制。

```javascript
// server
function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <h1>Counter</h1>
      <p>{counter}</p>
      <Button
        onClick={() => {
          'use server'
          setCounter(counter + 1);
        }}
      >
        Increment
      </Button>
    </div>
  );
}

// browser
;('use client')
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}
```

#### React Party

講者介紹了一個名為 React Party 的新 library（coming soon），旨在解決上述挑戰。這個 library 允許在伺服器端使用狀態和上下文，同時暴露類似於 React 的 hooks。

```javascript
import {
  useState,
  useReducer,
  createContext,
  useContext,
  ReactServer,
} from 'react-party';

export class MyServer extends ReactServer {
  render() {
    return <App />
  }
}
```

這個 library 適合構建即時應用，如聊天室、協作工具、遊戲伺服器等，並且可以無縫整合到現有的框架如 Next.js 和 Remix 中。

#### React Party 的優點

* 在所有的 React components 中使用 state 和 context，無論是 server 還是 client
* 通過 WebSockets 推送 React Server Components
* 部署在 Global Edge Network（全球[邊緣](https://www.ruanyifeng.com/blog/2024/03/edge-platform.html)網路）以提供更低延遲的體驗
* …

#### 總結

隨著前端和後端技術的不斷進步，即時應用的開發變得越來越簡單和高效。Sunil Pai 和他的團隊通過引入 Cloudflare Durable Objects 和即將推出的 React Party，展示了如何在伺服器端高效管理狀態並進行即時更新。

Durable Objects 為無狀態伺服器架構帶來了新的希望，讓開發者能夠更輕鬆地構建高效能、低延遲的應用。同時，React Party 也將改變 React Server Components 的使用方式，使得開發者可以在伺服器端利用狀態和上下文來創建體驗更佳的應用。
