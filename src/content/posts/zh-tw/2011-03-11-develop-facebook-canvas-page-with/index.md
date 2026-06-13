---
title: 'Develop Facebook Canvas Page with CodeIgniter'
description: '這篇文章是介紹如何使用 CodeIgniter 這個 PHP Framework 來初步架構出 MVC 的環境, 並且開發一個簡單的 Facebook Canvas Page。'
pubDate: 'Mar 11 2011'
categories: [Tech]
---

**這篇文章是介紹如何使用 CodeIgniter 這個 PHP Framework 來初步架構出 MVC 的環境, 並且開發一個簡單的 Facebook Canvas Page。**

什麼是 CodeIgniter 呢？

> CodeIgniter 是開發 PHP 應用程式的 framework 及工具組。

> 提供簡易的介面和邏輯結構來使用豐富的函式庫，其目的是讓你可以加 快開發速度。

> 使用 CodeIgniter 只需要寫少少的程式，讓創造力可專注在專案開發。

* [CodeIgniter](http://codeigniter.com/)
* [CodeIgniter 台灣](http://www.codeigniter.org.tw/)
* CodeIgniter 中文使用手冊 ([英](http://codeigniter.com/user_guide/)) ([中](http://codeigniter.org.tw/user_guide/))

什麼是 MVC 呢？

簡而言之是一個程式設計模式（Design pattern），詳細介紹推薦參考這篇： [透視 WebMVC](http://www.jaceju.net/resources/webmvc/)

什麼是 [Facebook Canvas page](http://developers.facebook.com/docs/guides/canvas/) ？

簡單來說，就是 Facebook 的應用程式, 像開心農場之類直接嵌入在 Facebook 內的網頁，Facebook 的 API 很強大，可以作手機應用，網站應用等等，這篇我們就只討論 Canvas page 這個範圍，有興趣的可以到 [開發者頁面](http://developers.facebook.com/) 研究看看。

進入本篇重點，開發流程我把它分成三個步驟，如下：

1. 下載 CodeIgniter 2.0
2. 建立 Facebook 應用程式
3. 開始編寫程式碼

**1.下載 CodeIgniter 2.0**

這裡我們使用 CodeIgniter 2.0.0 的版本來實作。

前往 [CodeIgniter 網站](http://www.codeigniter.org.tw/)下載 [CodeIgniter 2.0](http://codeigniter.com/download.php)

下載完可看到 zip 檔，解壓縮至你的網頁目錄吧

CodeIgniter 的目錄內容大致如下

開啟瀏覽器測試看看，成功的話會如下圖所示

**2. 建立 Facebook 應用程式**

前往 [Facebook 開發者頁面](http://developers.facebook.com/)

點選上方 我的應用程式 連結進入

然後再點選 建立新的應用程式 按鈕

設定應用程式的名稱

設定 相關介紹，大致上都可以先不用填

我們要開發 Facebook Canvas，所以選 Facebook 集成 這個選項

* app id 待會寫程式時會用到
* canvas name 也是，這是你應用程式的網址
* canvas url 則是填寫實際的網頁位址
* https 這部分我還沒測試過, 如果程式要在 https 的 Facebook 環境底下運作的話，則需要填寫

大致上的配置都完成了，儲存後前往你的 canvas page 看看結果如何

沒問題的話，可以在 Facebook 裡面成功執行剛剛的 CodeIgniter 頁面

**3. 開始編寫程式碼**

OK，CodeIgniter 跟 Facebook 的環境都配置的差不多了，接下來進入 coding 的階段，我們將編寫下面這三個文件：

* welcome controller — 負責與 facebook model 溝通，處理使用者認證的部分，並把資料傳給 welcome view 作前端顯示
* welcome view — 將 welcome controller 傳過來的資料作顯示
* facebook model — 實作 facebook 認證，取得使用者資料的部分

welcome controller：

開啟（application\controllers\welcome.php），在 `index()` 這個 function 內編寫以下程式：

```php
function index()
{
    // 載入 Facebook Model
    $this->load->model('Facebook_model', 'facebook');

    // 判斷使用者是否認證此應用程式
    if( ! $this->facebook->is_auth())
    {
        // 還未認證的情況下:
        //
        // 需要將使用者導向 Facebook 的認證頁面,
        // 並提供認證所需相關資料.
        // 
        // $app_id Facebook    應用程式 ID
        //
        // $canvas_name    Canvas Page 填寫的名稱
        //                 ex: http://apps.facebook.com/XXX
        //
        // $permission    需要使用者同意的權限資料
        //                ex: email, user_birthday
        // ref url:
        // http://developers.facebook.com/docs/authentication/permissions/

        $app_id = 'YOUR APP ID';
        $canvas_name = 'YOUR CANVAS NAME';
        $permission = 'email,user_birthday';
        
        $this->facebook->do_auth($app_id, $canvas_name, $permission);
    }
    else
    {
        // 已認證的情況下:
        //
        // 向 Facebook model 取得使用者的資料,
        // 然後傳給 welcome_message View 作顯示.

        $me = $this->facebook->get_me();

        $data = array(
            'me_id' => $me->id,
            'me_name' => $me->name,            
            'me_email' => $me->email,
            'me_birthday' => $me->birthday
        );

        $this->load->view('welcome_message', $data);
    }
}
```

welcome view：

開啟（application\views\welcome_message.php），修改內容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Hello Canvas</title>
</head>
<body>

<h1>Hello Canvas</h1>

<p>ID: <?php echo $me_id; ?></p>
<p>Name: <?php echo $me_name; ?></p>
<p>Email: <?php echo $me_email; ?></p>
<p>Birthday: <?php echo $me_birthday; ?></p>

</body>
</html>
```

facebook model：

在（application\models\）底下新增 facebook_model.php，內容如下：

```php
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Facebook Model
 *
 */
class Facebook_model extends CI_Model {

    var $_cookie;

    function __construct()
    {
        parent::__construct();
    }

    /**
     * 判斷頁面是否認證
     *
     * @access  public
     * @return  boolean 判斷是否認證,若頁面已認證則回傳TRUE, 反之FALSE
     */
    function is_auth() {
        $signed_request = $_REQUEST["signed_request"];
        list($encoded_sig, $payload) = explode('.', $signed_request, 2);
         
        $this->_cookie = json_decode(base64_decode(strtr($payload, '-_', '+/')), TRUE);
        
        return isset($this->_cookie["user_id"]);
    }

    /**
     * 執行認證的動作
     *
     * @access  public
     * @param   String  $app_id         應用程式 ID
     * @param   String  $canvase_name   Canvas Page Name
     * @param   String  $permission     使用者提供的資料
     * @return  void
     */
    function do_auth($app_id, $canvas_name, $permission = '') {
        $canvas_page = 'http://apps.facebook.com/' . $canvas_name . '/';
        $auth_url = "http://www.facebook.com/dialog/oauth?client_id=" . $app_id . "&redirect_uri=" . urlencode($canvas_page) . "&scope=" . $permission;

        echo("<script> top.location.href='" . $auth_url . "'</script>");
    }

    /**
     * 取得使用者資料
     *
     * @access  public
     * @return  Object
     */
    function get_me() {
        $access_token = $this->_cookie['oauth_token'];

        $me = json_decode(file_get_contents('https://graph.facebook.com/me?access_token=' . $access_token));

        return $me;
    }
}

/* End of file facebook_model.php */
/* Location: ./application/models/facebook_model.php */
```

初步的程式碼都打完了, 接著我們再一次連到應用程式看看，沒問題的話，初次會導向 Facebook 授權請求 的認證頁面，如下圖，並且會出現需要授權的 permission

點選同意之後，沒意外的話，我們的第一個 Facebook canvas page 就出現囉！！！

範例程式下載 : [Fb_with_CI.rar](https://sites.google.com/site/amo26site/download/Fb_with_CI.rar?attredirects=0&d=1)
