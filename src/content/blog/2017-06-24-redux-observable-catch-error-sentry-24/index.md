---
title: '如何發送 redux-observable 的 catch error 至 Sentry'
description: '我們團隊目前使用 Sentry 這個服務作 error tracking，JavaScript 或 React 的基本安裝方法在 官方文件 都可以找到，這裡就不贅述。'
pubDate: 'Jun 24 2017'
---

---

我們團隊目前使用 [Sentry](https://sentry.io/) 這個服務作 error tracking，JavaScript 或 React 的基本安裝方法在 [官方文件](https://docs.sentry.io/clients/javascript/integrations/react/) 都可以找到，這裡就不贅述。

同時我們也有在使用 [redux-observable](https://github.com/redux-observable/redux-observable) 這個 RxJS middleware 來處理帶有副作用的 Redux action。

根據 redux-observable 這篇 [Error Handling](https://redux-observable.js.org/docs/recipes/ErrorHandling.html) 文件的介紹，一般處理 async 錯誤的寫法大概會是：

```javascript
import { createAction } from 'redux-actions';
import { Observable } from 'rxjs/Observable';

const fetchUserEpic = action$ =>
  action$.ofType(FETCH_USER)
    .mergeMap(action =>
      Observable.fromPromise(fetch(`/api/users/${action.payload}`))
        .map(response => createAction('FETCH_USER_FULFILLED')(response))
        .catch(error => Observable.of(createAction('FETCH_USER_REJECTED')(error.message)))
    );
```

但是因為這裡並非正規的錯誤拋出方式，導致 Sentry 無法攔截到。

所以根據 Sentry 的這篇 [Rich Error Reports with Redux Middleware](https://blog.sentry.io/2016/08/24/redux-middleware-error-logging) 文件介紹，我們需要另外為它寫一個 Redux middleware 來處理。

策略是利用 [redux-actions](https://github.com/acdlite/redux-actions) 的 [Flux Standard Action](https://github.com/acdlite/flux-standard-action) 特性，將錯誤用 JavaScript 的 Error object 封裝至 action payload：

```javascript
...
        .catch(error => Observable.of(createAction('FETCH_USER_REJECTED')(new Error(error.message))))
// => {
//   type: 'FETCH_USER_REJECTED',
//   payload: new Error(error.message),
//   error: true,
// }
...
```

然後寫一個 Redux middleware 去攔截這類 actions：

```javascript
import Raven from 'raven-js';

Raven.config(process.env.REACT_APP_RAVEN_DSN).install();

const errorReporter = store => next => action => {
  if (action.error) {
    const error = action.payload;

    Raven.captureException(error, {
      extra: {
        action,
        state: store.getState(),
      },
    });

    throw error;
  }

  return next(action);
};

export default errorReporter;
```

最後將這個 middleware 載入 Redux store：

```javascript
// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as reducers from './reducers';
import errorReporter from './errorReporter';

const rootReducer = combineReducers(reducers);

const middleware = applyMiddleware(
  errorReporter, // 注意：errorReporter 要放在其它 middlewares 之前
  // epicMiddleware, routerMiddleware, etc...
);

export default (initialState = {}) =>
  createStore(
    rootReducer,
    initialState,
    middleware,
  );
```

### 參考資料

* [redux-raven-middleware](https://github.com/ngokevin/redux-raven-middleware)
* [raven-for-redux](https://github.com/captbaritone/raven-for-redux)
* [redux-reporter](https://github.com/ezekielchentnik/redux-reporter)
* [react-redux-persist-sentry-middleware](https://github.com/rishantagarwal/react-redux-persist-sentry-middleware)
* [RFC: default error handling of Epics](https://github.com/redux-observable/redux-observable/issues/94)
