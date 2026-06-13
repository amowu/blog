---
title: '如何使用 RxJS 處理分頁 API'
description: '這篇文章會以 node-github 的 getCommits API 為例，介紹如何使用 RxJS 取得所有分頁的 commits 結果。'
pubDate: 'Dec 09 2017'
categories: [Tech]
---

這篇文章會以 [node-github](https://github.com/octokit/node-github) 的 `getCommits` API 為例，介紹如何使用 RxJS 取得所有分頁的 commits 結果。

## 前言

以往在處理分頁的 API，通常都會使用遞回運算，這會讓程式碼的可讀性不佳。有鑒於最近 RxJS 正夯，想說來試著寫寫看，於是就有了這篇分享文章。

## 需求

首先，因為 node-github 的 [getCommits](https://octokit.github.io/node-github/) API 回傳的是一個 Promise 物件，所以需要先使用 RxJS 的 [fromPromise](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/frompromise.md) 將它轉成 Observable：

```javascript
Rx.Observable
    .fromPromise(getCommits(...))
```

接下來，利用 node-github 提供的 [hasNextPage](https://github.com/octokit/node-github) 和 [getNextPage](https://github.com/octokit/node-github)，搭配 RxJS 的 [expand](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/expand.md) 來處理分頁的遞回運算：

```javascript
Rx.Observable
    ...
    .expand(
        (response) => hasNextPage(response)
            ? Rx.Observable.fromPromise(getNextPage(response))
            : Rx.Observable.empty()
    );
```

上述邏輯大概是這樣：

1. 如果 `getCommits` 回傳的結果還有下一頁，就繼續 call `getNextPage` API
2. 如果已經沒有下一頁，則回傳 `Observable.empty()` 結束 `expand` 運算

最後，透過 [reduce](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md) 將所有分頁回傳的結果 `concat` 成一個 Array：

```javascript
Rx.Observable
    ...
    ...
    .reduce(
        (acc, curr) => acc.concat(curr.data)
    , []);
```

整體程式碼大致如下：

```javascript
Rx.Observable
    .fromPromise(getCommits(...))
    .expand(
        (response) => hasNextPage(response)
            ? Rx.Observable.fromPromise(getNextPage(response))
            : Rx.Observable.empty()
    )
    .reduce(
        (acc, curr) => acc.concat(curr.data)
    , []);
```

如果再稍微封裝一下，語法簡直優雅到無法直視 🤤：

```javascript
Rx.Observable
    .fromPromise(getCommits(...))
    .expand(checkNextPage)
    .reduce(concatAllCommits);
```

然後看是要用 [subscribe](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md) 或是 [toPromise](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/topromise.md) 來取得結果：

```javascript
const getAllCommits$ = Rx.Observable
    .fromPromise(getCommits(...))
    .expand(checkNextPage)
    .reduce(concatAllCommits, []);

// 方法一
getAllCommits$.subscribe(
    (commits) => console.log(commits)
);

// 方法二
const commits = await getAllCommits$.toPromise();

console.log(commits);

// Output:
// [{commit}, {commit}, ...]
```

## 總結

1. 以往的分頁 API 處理需要透過遞回運算才能完成，加上 [命令式編程](https://zh.wikipedia.org/wiki/%E6%8C%87%E4%BB%A4%E5%BC%8F%E7%B7%A8%E7%A8%8B) 的可讀性沒有 [聲明式編程](https://zh.wikipedia.org/wiki/%E5%AE%A3%E5%91%8A%E5%BC%8F%E7%B7%A8%E7%A8%8B) 的體驗佳，所以嘗試使用 RxJS 的 stream 取而代之
2. 使用 [fromPromise](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/frompromise.md) 將回傳物件為 Promise 的 API 轉換成 Observable
3. 使用 [expand](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/expand.md) 處理分頁的遞迴機制
4. 使用 [reduce](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md) 組合所有分頁的回傳結果
5. 使用 [toPromise](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/topromise.md) 獲取結果

## 附件

* [RunKit Demo](https://runkit.com/amowu/5a2556f64b348d0012eeafe3)
* [GitHub Gist](https://gist.github.com/amowu/5566485c9a8a64f3de171528f086fb24)

## 參考

* [RxJs Observable Pagination](https://stackoverflow.com/questions/35254323/rxjs-observable-pagination)
* [RXJS while loop for paging](https://stackoverflow.com/questions/44097231/rxjs-while-loop-for-paging)
