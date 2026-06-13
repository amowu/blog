---
title: '如何解決 GPG 失效的問題？'
description: '我是用 cider 在管理自己的 dotfiles，然後前陣子因為 gnupg 的 formula 剛好一起被更新，導致我的 GPG signature verification 無法順利運作。'
pubDate: 'Jun 24 2017'
categories: [Tech]
---

我是用 [cider](https://github.com/msanders/cider) 在管理自己的 dotfiles，然後前陣子因為 [gnupg](https://www.gnupg.org/) 的 formula 剛好一起被更新，導致我的 [GPG signature verification](https://github.com/blog/2144-gpg-signature-verification) 無法順利運作。

解決方式：

```bash
$ brew unlink gnupg && brew link gnupg
```

如果有跳出某些 conflicting error 的話，可以照著提示解決，例如：

```bash
Linking /usr/local/Cellar/gnupg/2.1.21...
Error: Could not symlink bin/gpg-agent
Target /usr/local/bin/gpg-agent
is a symlink belonging to gpg-agent. You can unlink it:
  brew unlink gpg-agent

To force the link and overwrite all conflicting files:
  brew link --overwrite gnupg

To list all files that would be deleted:
  brew link --overwrite --dry-run gnupg
```

然後再重新 link gnupg 一次：

```bash
$ brew unlink gnupg && brew link gnupg
```

最後檢查 Git 能不能順利 commit 和 push，然後確認 GitHub 的 commits 有出現 verified signature 的話，表示順利修復成功。
