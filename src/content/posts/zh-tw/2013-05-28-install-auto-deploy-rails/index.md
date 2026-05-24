---
title: '從無到有：安裝＆自動部署 Ruby on Rails 網站'
description: '這個月把網站從 Amazon EC2 搬回自己的 server，目前整個環境是 Linux（Ubuntu）+ Apache + Ruby on Rails 在跑，筆記一下從無到有的配置方法：'
pubDate: 'May 28 2013'
---

這個月把網站從 Amazon EC2 搬回自己的 server，目前整個環境是 Linux（Ubuntu）+ Apache + Ruby on Rails 在跑，筆記一下從無到有的配置方法：

### Install [VirtualBox](https://www.virtualbox.org/)

虛擬主機，另一個較有名的是 [VMWare](http://www.vmware.com/)，這裡是選用 VirtualBox 4.2.12 作 host。

安裝之後設定一下配置，大部份都用預設的就可以，比較不一樣的地方有，記憶體 1024 MB，網路使用**橋接界面卡**的方式，這樣可以在虛擬 OS 內連線取得固定 IP，這對使用自有網址來架設網站是很重要的。

### Install [Ubuntu](http://www.ubuntu.com/)

下載 Ubuntu 最新版本，這裡使用 13.04，然後將映像擋掛載在 VirtualBox 後啟動，照指示一步一步安裝。

安裝完成後，記得先把系統更新裝一裝，之後執行：

```shell
$ sudo apt-get update
$ sudo apt-get upgrade
```

### Install SSH

安裝完 ubuntu 後，為了之後能遠端操作 server，所以接著安裝 SSH：

```shell
$ sudo apt-get install openssh-server
$ ssh-keygen -t rsa
$ scp .ssh/id_rsa.pub SERVER_HOST_NAME:~/.ssh/
$ cat .ssh/id_rsa.pub >> .ssh/authorized_keys
```

註：第 2–4 步是為了之後登入 server 可以不用打密碼

註：第 3 步的 `SERVER_HOST_NAME` 記得換成自己的網址或 IP

### Install vim

接著是安裝 vim，為了之後能在 terminal 上直接編輯文字檔案 or code：

```shell
$ sudo apt-get remove vim-tiny
$ sudo apt-get install vim
```

### Install Git

版本控制，因為之後部署網站都是直接從 [GitHub](https://github.com/) 拉下來，所以需要安裝 Git：

```shell
$ sudo apt-get install -y git-core
```

如果需要使用到 GitHub SSH 的話請參考這篇：[Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys)

### Install NVM + Node

雖然我的網站還沒使用到 Node.js 的技術，但接下來要安裝的東西需要跑 javascript，所以這裡需要先安裝。

NVM 是 Node.js 的版本管理套件，可以輕鬆安裝、移除、切換任意版本的 Node：

```shell
$ sudo apt-get install build-essential libssl-dev curl
$ git clone git://github.com/creationix/nvm.git ~/.nvm
$ echo ". ~/.nvm/nvm.sh" >> .bashrc
$ bash
```

NVM 安裝完成後，接著安裝 Node，這裡使用 0.10.0 的版本：

```shell
$ nvm install v0.10.0
$ nvm alias default 0.10.0
```

### Install RVM + Ruby + Rails

同 NVM, RVM 是 Ruby 的版本管理套件：

```shell
$ bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
$ echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"' >> ~/.bash
$ source ~/.bashrc
$ bash
```

接著安裝 Ruby 1.9.3：

```shell
$ rvm install 1.9.3
$ rvm use --default 1.9.3
```

接著安裝 Ruby on Rails：

```shell
$ gem install sqlite3 --no-ri --no-rdoc
$ gem install rails --no-ri --no-rdoc
```

### Install Apache + Passenger

接著安裝 server，通常有 Apache 或 Nginx 兩種，這裡是選用 Apache：

```shell
$ sudo apt-get install -y apache2-mpm-prefork apache2-prefork-dev libapr1-dev libaprutil1-dev libcurl4-openssl-dev
```

安裝完 Apache server 後，要讓 Rails 能在上面 run，需要安裝 Passenger 套件：

```shell
$ gem install passenger
$ sudo passenger-install-apache2-module
```

在安裝完成後，會看到 LoadModule 的配置訊息，把它貼到 `/etc/apache2/conf.d/mod_rails`，大致上會類似這樣：

```bash
LoadModule passenger_module /home/YOUR_RUBY_PATH/gems/passenger-4.0.2/libout/apache2/mod_passenger.so
PassengerRoot /home/YOUR_RUBY_PATH/gems/passenger-4.0.2
PassengerDefaultRuby /home/YOUR_RVM_PATH/wrappers/ruby-1.9.3-p429/ruby
```

接著在 `/etc/apache2/sites-enabled` 底下建立一個 `YOUR_APP.conf`，加入以下設定：

```xml
<VirtualHost *:80>
ServerName YOUR_DOMAIN_NAME
DocumentRoot YOUR_RAILS_PATH/public
<Directory YOUR_RAILS_PATH/public>
  AllowOverride all
  Options -MultiViews
</Directory>
</VirtualHost>
```

接著重啟 Apache：

```shell
$ sudo a2dissite default
$ sudo service apache2 reload
$ sudo service apache2 rstart
$ sudo apache2ctl restart
```

大致上 server 環境都建置好了，最後要設定自動化部署工具，使用 Capistrano 這個套件：

```shell
$ gem install capistrano
```

安裝完之後，前往你的 Rails 目錄：

```shell
$ capify .
```

指令完成之後 Rails 目錄會新增 `config/deploy.rb`，開啟並設定一些部署參數，大致上會如下：

```ruby
set :application, "YOUR_RAILS_APP_NAME"
set :repository,  "YOUR_GIT_REPOSITORY_PATH"
```

```ruby
set :branch, "master"
set :scm, :git
set :user, "YOUR_GIT_USERNAME"
set :port, "22"
set :deploy_to, "YOUR_SERVER_APP_PATH"
set :deploy_via, :remote_cache
set :use_sudo, false
role :web, "YOUR_WEB_SERVER_DOMAIN"
role :app, "YOUR_APP_SERVER_DOMAIN"
role :db,  "YOUR_DB_SERVER_DOMAIN"
…
```

接著可以開始部署了：

```shell
$ cap deploy:setup
$ cap deploy:cold
```

下完以上指令後，server 上的目錄會出現 `current`，`release` 這些資料夾，current 這個目錄就是最新部署的位置，前往這個目錄，安裝從 Git 拉下來的 Rails：

```shell
$ bundle install
```

這樣就完成所有 server 部署的配置了，之後只要網站有更新，直接執行以下部署指令，server 就會從 Git 上自動更新：

```shell
$ cap deploy
```

如果以上步驟都沒發生問題，網站也成功運行，別忘了使用 VirtualBox 的**快照**功能，儲存一份當前狀態，這樣之後就算 server 被搞爛了也能迅速恢復到最初狀態 :-)

小撇步：

1. 不習慣 Ubuntu 的視窗桌面，可以使用 `Ctrl-Alt-F1` 切換到 Console mode，`Ctrl-Alt-F7` 切回視窗模式
2. 有時會發生 server 網路斷線的情況，雖然不知道這招是不是對的，但用到現在網路還蠻穩定的，開啟 `/etc/ppp/options`，將 `lcp-echo-failure` 值設高一點，這裡設 15

參考文章：

1. [Ruby on Rails 實戰聖經](http://ihower.tw/rails3/index.html)
