---
title: 'SortedDictionary 如何自訂排序'
description: '之前再寫 資料檢索這堂課的作業時，碰到一個 SortedDictionary 排序上的問題，因為我在寫 反轉索引法的過程中有使用到這個集合，其中 Key 的部分我是用來存放 TF-IDF 演算法求出來的 weight score，這個值我是以 double…'
pubDate: 'May 22 2009'
---

---

之前再寫 [資料檢索](http://zh.wikipedia.org/w/index.php?title=%E8%B3%87%E8%A8%8A%E6%AA%A2%E7%B4%A2&variant=zh-tw)這堂課的作業時，碰到一個 [SortedDictionary](http://msdn.microsoft.com/en-us/library/f7fta44c.aspx) 排序上的問題，因為我在寫 [反轉索引法](http://en.wikipedia.org/wiki/Inverted_index)的過程中有使用到這個集合，其中 Key 的部分我是用來存放 [TF-IDF](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) 演算法求出來的 weight score，這個值我是以 double 的型態來存放，不過因為 SortedDictionary 的排序方式是由小到大，也就是以升冪排序的方式幫你排序好了，但是我希望它能夠由大到小排序，因為作業的顯示結果要求 weight score 越高的結果要排越前面，所以我上 MSDN 查了一下 SortedDictionary 的資料後，本來看到它有一個 [Reverse](http://msdn.microsoft.com/en-us/library/bb358497.aspx) 的方法，不過後來研究了好久還是不會用，最後就上 PTT 的 C_Sharp 板去求助，經過 Cloud 大大的指導後終於解決這個問題了。

利用 SortedDictionary 建構式的一個多載，IComparer 介面就可以實現自訂排序方式，來看看實作程式碼吧。

我們先看一下一開始 SortedDictionary 為我們排序的結果：

```csharp
using System;
using System.Collections.Generic;
 
namespace SortedDictionarySample
{
  class Program
  {
    static void Main(string[] args)
    {
      SortedDictionary<int, string> sortedDictionary = new SortedDictionary<int, string>();
 
      sortedDictionary.Add(5, "五");
      sortedDictionary.Add(4, "四");
      sortedDictionary.Add(6, "六");
      sortedDictionary.Add(2, "二");
      sortedDictionary.Add(8, "八");
 
      foreach (KeyValuePair<int, string> kvp in sortedDictionary)
      Console.WriteLine(kvp.Value);
    }
  }
}
```

上面是一開始用 SortedDictionary 排序的結果，可以看出他是由小到大的升冪排序。
接下來就是本文的重點，自己定義 SortedDictionary 排序方式的實作方法：

```csharp
using System;
```

範例程式：

* [SortedDictionarySample.rar](http://sites.google.com/site/amo26site/download/SortedDictionarySample.rar?attredirects=0)

參考資料：

* [MSDN](http://msdn.microsoft.com/en-us/library/default.aspx)
