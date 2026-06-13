---
title: 'Visual Studio Code Snippets'
description: '最近在看 聖殿祭司寫的 ASP.NET 3.5 專家技術手冊 ，上面提到 Visual Studio 2005 之後，提供一個很不錯的功能叫做 Code Snippets（程式碼片段），這是一個可以快速產生常用程式碼的好東西。'
pubDate: 'Jul 16 2009'
categories: [Tech]
---

最近在看 [聖殿祭司](http://blog.sina.com.tw/dotnet/)寫的 [ASP.NET 3.5 專家技術手冊](http://findbook.tw/book/9789861816524/basic) ，上面提到 Visual Studio 2005 之後，提供一個很不錯的功能叫做 Code Snippets（程式碼片段），這是一個可以快速產生常用程式碼的好東西。

使用 Code Snippets 的好處是當我們每次要打一些常用的程式碼語法時，例如 if、do while、for 等等…就不必自己打一遍了，一方面平常輸入這些老是反覆再寫的程式碼時，效率不佳，而且另一方面有時候還會發生打錯或是想不起來怎麼寫的情況。

但是 C# 語言內建的程式碼片段很少，而且都是一些無關痛癢的基本語法，所以網路上有很多人將一些常用的 C# 程式碼片段寫成 VS 的擴充套件提供大家下載：

*微軟*
[*http://msdn.microsoft.com/en-us/vs2005/aa718338.aspx*](http://msdn.microsoft.com/en-us/vs2005/aa718338.aspx)* (英文)*
[*http://msdn.microsoft.com/zh-tw/vs2005/aa718338.aspx*](http://msdn.microsoft.com/zh-tw/vs2005/aa718338.aspx)* (繁體中文)*

*CodePlex*
[*http://www.codeplex.com/site/search?projectSearchText=Snippet*](http://www.codeplex.com/site/search?projectSearchText=Snippet)

*gotCODESNIPPETS.Net*
[*http://gotcodesnippets.com/default.aspx*](http://gotcodesnippets.com/default.aspx)

這邊我用微軟提供的程式碼片段作範例，首先要先去 MSDN 網站下載。

下載完成後點擊 Code_Snippets.msi 進入安裝，安裝路徑為「Microsoft Visual Studio位置\VC#\Snippets\1033\自訂命名」，例如「C:\Program Files\Microsoft Visual Studio 9.0\VC#\Snippets\1033\C# Snippets」。

接下來開啟 VS2005 或 VS2008，點選工具 -> 程式碼片段管理員。

開啟程式碼片段管理員後，點擊加入 -> 選擇剛剛安裝的目錄「C:\Program Files\Microsoft Visual Studio 9.0\VC#\Snippets\1033\C# Snippets」-> 確定，完成後就可以看到 C# Snippets 目錄被加入到清單內了。

成功加入後我們馬上來試試，在要加入程式碼片段的地方右鍵 -> 插入程式碼片段 -> C# Snippets -> database -> Create a local SQL Connection to SQL Server(or Express)，然後在下一行繼續插入程式碼片段 -> C# Snippets -> database -> Create a Parameterized SELECT Command，這樣就完成一個資料庫的連接跟查詢功能，程式碼都幫我們產生好了，只需要改改變數或字串就可以了，非常方便吧!!!

除了下載安裝別人提供的套件外，當然也可以寫一份屬於個人的程式碼片段擴充套件，畢竟平常在寫哪些程式碼，只有自己是最清楚的，可以去 [微軟 Snippet Editor](http://www.codeplex.com/SnippetEditor)或 [Snippy — Visual Studio code Snippet Editor](http://www.codeplex.com/snippy) 下載編輯工具，詳細的介紹各位可以參考 [聖殿祭司的ASP.NET 3.5 專家技術手冊I-使用C#](http://findbook.tw/book/9789861816524/basic) 這本書，內容適合中高階經驗的人，值得一看!!!
