---
title: 'Strategy pattern 策略模式'
description: '這篇文章是我打算要寫的 Design pattern 系列中的第一篇，在我大學三年級的時候，修了系上開的視窗程式設計課程，開課教授也是我的專題指導教授，這堂課老師教了我們很多關於 programming design pattern 的觀念。'
pubDate: 'May 20 2009'
---

這篇文章是我打算要寫的 Design pattern 系列中的第一篇，在我大學三年級的時候，修了系上開的視窗程式設計課程，開課教授也是我的專題指導教授，這堂課老師教了我們很多關於 programming design pattern 的觀念。

最近剛好也讀完了 [O’REILLY 出版的 Head First Design Patterns（深入淺出設計模式）](http://findbook.tw/book/9789867794529/basic) ，對於一些較常用的 pattern 也有了更加的了解，所以我希望能整理幾個比較入門的 pattern 來當作學習文章,如果有哪裡寫錯或是有疑問的，非常歡迎留言指教，大家一起學習。

什麼是 design pattern（設計模式）呢?

> *design pattern 是對軟體設計中普遍存在（反覆出現）的各種問題，所提出的解決方案。*

> *design pattern 並不是直接用來完成程式碼的編寫，而是描述在各種不同情況下，要怎麼解決問題的一種方案。*

> *演算法不能算是一種 design pattern，因為演算法主要是用來解決計算上的問題，而非設計上的問題。 design pattern 主要目的是避免會引起麻煩的程式緊密耦合，以增強軟體設計面對並適應變化的能力。*

以上是引用 [軟體設計模式-維基百科](http://zh.wikipedia.org/w/index.php?title=%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&variant=zh-tw) 的其中一段介紹，第一次接觸的人可以去看看相關內容。

接下來我們進入主題，第一篇要來介紹的 pattern 是 **Strategy pattern** （策略模式）。

Strategy pattern 是指物件本身有某些行爲（method），但是在不同的情況中，該行爲有不同的實現方式（演算法），找出程式中可能需要更動的地方，把它們個別封裝起來，就算演算法有變動，也不會影響到使用演算法的程式，舉個 [維基百科](https://www.blogger.com/blog/post/edit/696354394590316778/6797536677321234615) 提供的例子，比如每個人都要「繳交個人所得稅」，但是「在美國繳交的個人所得稅」和「在台灣繳交的個人所得稅」就有不同的計算稅的演算法。

我們用 [Head First Design Patterns](http://findbook.tw/book/9789867794529/basic) 書上的鴨子範例來一步步解釋。

假設我們打算完成一個模擬鴨子的小程式，程式中可以模擬出各種不同類型的鴨子行為，例如游泳，呱呱叫等等的…。

這個時候我們會設計一個擁有這些行為的鴨子抽象類別（abstract class），讓各種鴨子繼承此類別。

紅頭鴨跟綠頭鴨都直接繼承 Duck 的 swim（游泳）跟 quack（呱呱叫）方法，因為兩隻鴨子的外觀不同，所以各自實作 display 抽象方法。

如果這個時候突然想為鴨子加上飛行的行為呢?

很直覺的，我們會直接在 Duck 中加入 `fly()` 讓每種鴨子都能順利繼承。

但是這個時候我們碰到問題了。

如果我們打算加入一隻橡皮玩具鴨怎麼辦?

橡皮鴨繼承了上面 Duck 的 fly 行為，可是像皮鴨實際上並不會飛行的……。

你可能想到一個方法，就是用 override 覆寫 `fly()` 方法，讓它不實作任何程式。

解決了飛行的問題之後，我們發現其實像皮鴨的叫聲也跟其他鴨子不同，所以把 `quack()` 方法也 override 成吱吱叫，取代原本的呱呱叫。

但是問題解決後，馬上又產生另一個問題，如果我們又打算加入一隻誘餌鴨呢? 
誘餌鴨不會飛也不會叫，我們又要把 `fly()` 跟 `quack()` 兩個方法又 override 一次。

這裡我們就會發現，利用繼承的方式提供鴨子行為會產生一些問題：

* 程式碼在多個類別中不斷重複
* runtime 期間，鴨子的行為不容易改變
* 難以得知鴨子的全部行為
* 改變會牽一髮動全身，造成其他鴨子不想要的影響

上面我們看見最主要的問題就是不容易維護，若是以後還有其他鴨子要加進來，我們又要因應它的特性來繼續 override 這些行為，而這些行為其實之前明明就已經實作過了，最後造成一堆不必要的程式碼重複。

不能用繼承的話，用介面來實作如何?

把上面需要不同實作方式的 fly 跟 quack 抽出來分別寫成 Flyable 跟 Quackable 介面，讓所有鴨子實作牠們自己需要的介面。

完成了上面的實作後，雖然完成了不用一直 override 的難題，並且也可以實現出不會飛的鴨子，但是最主要的問題還是沒解決，程式碼還是有到處重複無法再利用的情形，例如上圖中 MallarDuck 跟 RedheadDuck 的 `fly()` 跟 `quack()` 內容都是一樣的，綠頭鴨是呱呱叫跟會飛，紅頭鴨也是呱呱叫會飛，但是牠們卻都要自己再寫一次程式碼去實作，根據 [維基百科](http://en.wikipedia.org/wiki/Anas)提供的資料，鴨子的種類有 40 到 50 種，這些都是會飛且呱呱叫的鴨子，難道要我們每增加一次鴨子類別，就又要去實作已經寫過的 `fly()` 跟 `quack()` 嗎！？可見這並不是一個良好的 OO 軟體設計方式。

那到底該怎麼寫才適合這些可惡的鴨子呢…?

接下來會進入我們這篇文章的重點，策略模式的精神。

我們知道目前 Duck 類別內的 `fly()` 跟 `quack()` 會隨著有些鴨子的不同而改變，為了要讓他們可以隨著鴨子改變，且達到可重覆利用的特性，我們一樣將這兩個行為從 Duck 抽出來，獨立寫成個別的類別，讓我們來看下面這張圖。

上圖就是為了讓鴨子行為可以再三利用，獨立分出來的兩個策略類別（Strategy class），所有不同的飛行類別都要實作（或繼承）FlyBehavior 介面（或抽象類別），叫聲行為也是，這樣做有什麼好處呢？我們直接寫程式來實作給大家看。

```csharp
using System;
```

上面我們把 FlyBehavior 跟 QuackBehavior 以介面的型態加入到 Duck 的成員變數，這樣就能在 Runtime 期間動態改變鴨子的行為。

再來我們繼續把上面的 FlyBehavior 跟 QuackBehavior 程式碼給寫出來。

```csharp
namespace StrategySample
{
  /// <summary>
  /// 這是一個飛行行為的介面，所有飛行行為的類別都應該實作它
  /// </summary>
  public interface FlyBehavior
  {
    /// <summary>
    /// 飛行的方式
    /// </summary>
    /// <remarks>所有繼承FlyBehavior的類別都應該實作此方法</remarks>
    void fly();
  }
}
```

```csharp
namespace StrategySample
{
  /// <summary>
  /// 這是一個叫聲行為的介面，所有叫聲行為的類別都應該實作它
  /// </summary>
  public interface QuackBehavior
  {
    /// <summary>
    /// 叫聲的方式
    /// </summary>
    /// <remarks>所有繼承QuackBehavior的類別都應該實作此方法</remarks>
    void quack();
  }
}
```

然後我們把所有的行為實作出來

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 用翅膀飛行的行為
  /// </summary>
  public class FlyWithWings : FlyBehavior
  {
    public void fly()
    {
      Console.WriteLine("I'm flying with my wings");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 無法飛行的行為
  /// </summary>
  public class FlyNoWay : FlyBehavior
  {
    public void fly()
    {
      Console.WriteLine("I can't fly");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 呱呱叫的行為
  /// </summary>
  public class Quack : QuackBehavior
  {
    public void quack()
    {
      Console.WriteLine("I say Quack");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 吱吱叫的行為
  /// </summary>
  public class Squeak : QuackBehavior
  {
    public void quack()
    {
      Console.WriteLine("I say Squeak");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 沒有叫聲的行為
  /// </summary>
  public class MuteQuack : QuackBehavior
  {
    public void quack()
    {
      Console.WriteLine("I say ...(Silence)");
    }
  }
}
```

接著我們來寫一隻綠頭鴨子的模擬程式測試看看。

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 綠頭鴨
  /// </summary>
  public class MallardDuck : Duck
  {
    /// <summary>
    /// 綠頭鴨
    /// </summary>
    public MallardDuck()
    {
      this.flyBehavior = new FlyWithWings();
      this.quackBehavior = new Quack();
    }
    public override void display()
    {
      Console.WriteLine("I'm a real mallard duck");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  public class MiniDuckSimulator
  {
    static void Main(string[] args)
    {
      // 新增一隻綠頭鴨
      Duck mallardDuck = new MallardDuck();
      
      mallardDuck.display();      // 綠頭鴨外觀
      mallardDuck.performFly();   // 用翅膀飛行
      mallardDuck.performQuack(); // 呱呱叫
    }
  }
}
```

完成了綠頭鴨子之後我們再加入一隻紅頭鴨子模擬一遍。

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 紅頭鴨
  /// </summary>
  public class RedheadDuck : Duck
  {
    /// <summary>
    /// 紅頭鴨
    /// </summary>
    public RedheadDuck()
    {
      this.flyBehavior = new FlyWithWings();
      this.quackBehavior = new Quack();
    }
    public override void display()
    {
      Console.WriteLine("I'm a real redhead duck");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  public class MiniDuckSimulator
  {
    static void Main(string[] args)
    {
      // 新增一隻綠頭鴨
      Duck mallardDuck = new MallardDuck();
      
      mallardDuck.display();      // 綠頭鴨外觀
      mallardDuck.performFly();   // 用翅膀飛行
      mallardDuck.performQuack(); // 呱呱叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻紅頭鴨
      Duck redheadDuck = new RedheadDuck();
      
      redheadDuck.display();      // 紅頭鴨外觀
      redheadDuck.performFly();   // 用翅膀飛行
      redheadDuck.performQuack(); // 呱呱叫
    }
  }
}
```

看到上面的程式就可以發現雖然紅頭鴨跟綠頭鴨的行為一樣，但是不會產生像之前那樣程式碼重覆的情形，因為我們將 fly 跟 quack 的實作方式交給 FlyBehavior 跟 QuackBehavior，鴨子們只管呼叫它，不必知道它們的實現方法，這是 OO 中一個很重要的概念。

繼續完成剩下的兩隻鴨子

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 橡皮鴨
  /// </summary>
  public class RubberDuck : Duck
  {
    /// <summary>
    /// 橡皮鴨
    /// </summary>
    public RubberDuck()
    {
      this.flyBehavior = new FlyNoWay();
      this.quackBehavior = new Squeak();
    }
    public override void display()
    {
      Console.WriteLine("I'm a real rubber duck");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  /// <summary>
  /// 誘餌鴨
  /// </summary>
  public class DecoyDuck : Duck
  {
    /// <summary>
    /// 誘餌鴨
    /// </summary>
    public DecoyDuck()
    {
      this.flyBehavior = new FlyNoWay();
      this.quackBehavior = new MuteQuack();
    }
    
    public override void display()
    {
      Console.WriteLine("I'm a real decoy duck");
    }
  }
}
```

```csharp
using System;
 
namespace StrategySample
{
  public class MiniDuckSimulator
  {
    static void Main(string[] args)
    {
      // 新增一隻綠頭鴨
      Duck mallardDuck = new MallardDuck();
      
      mallardDuck.display();      // 綠頭鴨外觀
      mallardDuck.performFly();   // 用翅膀飛行
      mallardDuck.performQuack(); // 呱呱叫
      
      Console.WriteLine("-------------------------");
  
      // 新增一隻紅頭鴨
      Duck redheadDuck = new RedheadDuck();
      
      redheadDuck.display();      // 紅頭鴨外觀
      redheadDuck.performFly();   // 用翅膀飛行
      redheadDuck.performQuack(); // 呱呱叫
      
      Console.WriteLine("-------------------------");
  
      // 新增一隻橡皮鴨
      Duck rubberDuck = new RubberDuck();
      
      rubberDuck.display();       // 橡皮鴨外觀
      rubberDuck.performFly();    // 不會飛行
      rubberDuck.performQuack();  // 吱吱叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻誘餌鴨
      Duck decoyDuck = new DecoyDuck();
  
      decoyDuck.display();        // 誘餌鴨外觀
      decoyDuck.performFly();     // 不會飛行
      decoyDuck.performQuack();   // 不會叫
    }
  }
}
```

到這裡我們已經把鴨子模擬程式完成的差不多了，最後我們再來加一隻鴨子，我們加入一隻可以隨時改造的模型鴨子，這裡可以看出 runtime 期間動態改變行為的威力。

```csharp
using System;
namespace StrategySample
{
  /// <summary>
  /// 模型鴨
  /// </summary>
  public class ModelDuck : Duck
  {
    /// <summary>
    /// 模型鴨
    /// </summary>
    public ModelDuck()
    {
      this.flyBehavior = new FlyNoWay();
      this.quackBehavior = new MuteQuack();
    }
    public override void display()
    {
      Console.WriteLine("I'm a real model duck");
    }
  }
}
```

接著我們為 ModelDuck 寫一個飛行行為，我們把它取名為火箭飛行 FlyRocketPowered。

```csharp
namespace StrategySample
{
  /// <summary>
  /// 利用火箭動力飛行的行為
  /// </summary>
  public class FlyRocketPowered : FlyBehavior
  {
    public void fly()
    {
      Console.WriteLine("I'm flying with rocket");
    }
  }
}
```

好了，我們開始模擬這隻模型鴨，一開始我們的模型鴨不會飛也不會叫，經過了 Duck 的 `setFlyBehavior()` 我們可以在程式執行的期間把它裝上火箭動力，使它飛起來。

```csharp
using System;
 
namespace StrategySample
{
  public class MiniDuckSimulator
  {
    static void Main(string[] args)
    {
      // 新增一隻綠頭鴨
      Duck mallardDuck = new MallardDuck();
      
      mallardDuck.display();      // 綠頭鴨外觀
      mallardDuck.performFly();   // 用翅膀飛行
      mallardDuck.performQuack(); // 呱呱叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻紅頭鴨
      Duck redheadDuck = new RedheadDuck();
      
      redheadDuck.display();      // 紅頭鴨外觀
      redheadDuck.performFly();   // 用翅膀飛行
      redheadDuck.performQuack(); // 呱呱叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻橡皮鴨
      Duck rubberDuck = new RubberDuck();
      
      rubberDuck.display();       // 橡皮鴨外觀
      rubberDuck.performFly();    // 不會飛行
      rubberDuck.performQuack();  // 吱吱叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻誘餌鴨
      Duck decoyDuck = new DecoyDuck();
      
      decoyDuck.display();        // 誘餌鴨外觀
      decoyDuck.performFly();     // 不會飛行
      decoyDuck.performQuack();   // 不會叫
      
      Console.WriteLine("-------------------------");
      
      // 新增一隻模型鴨
      Duck modelDuck = new ModelDuck();
      
      modelDuck.display();        // 模型鴨外觀
      modelDuck.performFly();     // 不會飛行
      modelDuck.performQuack();   // 不會叫
      
      Console.WriteLine("After the installation of rocket...");
      
      modelDuck.setFlyBehavior(new FlyRocketPowered());   // 裝上火箭動力之後...
      modelDuck.performFly();     // 火箭動力飛行!!!
    }
  }
}
```

OK!!! 鴨子模擬程式完成了，我們來看看整個類別架構圖。

到這裡我們已經將策略模式給學起來了，讓我們來看看策略模式的 UML，並且跟上圖比較看看。

看完了上面介紹的鴨子範例後我想大家應該已經可以了解策略模式的主要精神了，將抽象類別中可能會需要隨著繼承類別的不同改變的方法獨立抽出來封裝成另外一個介面，然後個別為這些介面去實作需要的類別方法，不但增加可利用性，也不會出現程式碼不斷重複的情況。

呼，寫到這裡終於到一個段落了，因為這是我的第一篇心得分享文章，所以希望把它寫的很仔細，雖然可能有很多地方會有問題，或是交待的不清楚，所以大家如果有哪些疑問也請不要客氣，儘管提出你的看法，讓我有更大的動力繼續衝下一篇文章，謝謝。

下一篇 design pattern 的文章我打算介紹同樣屬於比較容易了解的初學模式，Factory pattern（工廠模式），Factory pattern 也是一個非常常用的設計方式，其中還衍生出許多不同的 pattern，例如 abstract factory pattern（抽象工廠模式），希望到時能如期把它完成並分享上來，謝謝大家不厭其煩的把這篇文章看到這裡，感謝。

範例程式:

* [StrategySample.rar](http://sites.google.com/site/amo26site/download/StrategySample.rar?attredirects=0)

參考資料:

* [Head First Design Patterns — 深入淺出設計模式](http://findbook.tw/book/9789867794529/basic)
* [策略模式 — 維基百科](http://zh.wikipedia.org/w/index.php?title=%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F&variant=zh-tw)
