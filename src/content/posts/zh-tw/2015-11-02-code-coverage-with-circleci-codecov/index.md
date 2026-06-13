---
title: 'Code Coverage with CircleCI + Codecov'
description: '最近的案子用到 Redux + React，因為它 Pure Function 的特性，所以 單元測試 很容易寫，順便也趁機會玩一下 程式碼覆蓋率 （Code Coverage）。'
pubDate: 'Nov 02 2015'
heroImage: './cover.png'
categories: [Tech]
---

最近的案子用到 [Redux](https://github.com/rackt/redux) + [React](https://facebook.github.io/react/)，因為它 [Pure Function](https://en.wikipedia.org/wiki/Pure_function) 的特性，所以 [單元測試](https://en.wikipedia.org/wiki/Unit_testing) 很容易寫，順便也趁機會玩一下 [程式碼覆蓋率](https://www.blogger.com/%28https://en.wikipedia.org/wiki/Code_coverage%29) （Code Coverage）。

## 單元測試 Unit Test

這裡就不講單元測試怎麼寫了，網路上有很多大神的好文可以爬，我是用 [Mocha](https://mochajs.org/) + [Chai](http://chaijs.com/) ：

* mocha 是 test framework，提供 `describe`、`it`
* chai 是 assertion library，提供 `assert`、`should`、`expect`

安裝 [Gulp](http://gulpjs.com/) ：

```bash
npm install --save-dev gulp gulp-mocha
```

安裝 [Babel](https://babeljs.io/) 讓程式支援 [ES6](https://en.wikipedia.org/wiki/ECMAScript) 語法：

```bash
npm install --save-dev babel
```

加入 mocha 到 `gulpfile.babel.js` ：

```javascript
// gulpfile.babel.js

import gulp from 'gulp';
import mocha from 'gulp-mocha';

gulp.task('mocha', () => {
  return gulp.src('test/**/*.js')
    .pipe(mocha());
});
```

使用 `npm test` 取代 `gulp mocha` ：

```json
// package.json
{
  "scripts": {
    "test": "gulp mocha"
  }
}
```

這樣做的好處：

* gulp 可不用 `-g` 全域安裝
* CI 會自動執行測試

## 程式碼覆蓋率 Code Coverage

有許多提供 code coverage review 的服務，例如： [Code Climate](https://codeclimate.com/)、 [Codecov](https://codecov.io/)、 [Coveralls](https://coveralls.io/)。這裡選擇 [Codecov](https://codecov.io/) ，因為它的 GitHub public repo 方案是免費的。

![](./image1.png)

安裝 [istanbul](https://github.com/gotwarlost/istanbul) 產生 coverage report：

```bash
npm install --save-dev gulp-istanbul isparta
```

[isparta](https://github.com/douglasduteil/isparta) 讓 istanbul 支援 ES6

加入 coverage 到 `gulpfile.babel.js` ：

```javascript
// gulpfile.babel.js

import istanbul from 'gulp-istanbul';
import { Instrumenter } from 'isparta';

gulp.task('coverage:instrument', () => {
  return gulp.src('src/**/*.js')
    .pipe(istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
})

gulp.task('coverage:report', () => {
  return gulp.src('src/**/*.js')
    .pipe(istanbul.writeReports())
})

gulp.task('coverage', done => {
  runSequence('coverage:instrument', 'mocha', 'coverage:report', done)
})
```

`gulp coverage` 會依順序執行：

1. `gulp coverage:instrument` 配置單元測試的原始碼
2. `gulp mocha` 執行單元測試
3. `gulp coverage:report` 產生覆蓋率報告

把 `npm test` 換成 `gulp coverage` ：

```json
// package.json
{
  "scripts": {
    "test": "gulp coverage"
  }
}
```

最後配置 [CircleCI](https://circleci.com/)，當測試成功之後，自動上傳覆蓋率報告至 [Codecov](https://codecov.io/) ：

```bash
npm install --save-dev codecov.io
```

```yaml
# circle.yml

test:
  post:
    - cat ./coverage/lcov.info | codecov
```

以上，當你 push 程式碼到 GitHub 上、並且通過 CircleCI 的單元測試之後，Codecov 就會產生覆蓋率報告了！

完整範例請參考我的 [GitHub](https://github.com/amowu/amowu.com/commit/9fac520b79d36c36bba7b6d55486e5a631c1c011)
