---
title: 'Factory pattern 工廠模式'
description: '距離上一篇 Strategy pattern 策略模式 已經兩個多月了，一直拖到現在才生出這篇文章…orz。'
pubDate: 'Aug 20 2009'
---

---

距離上一篇 [Strategy pattern 策略模式](https://blog.amowu.com/posts/2009-05-20-strategy-pattern-20/) 已經兩個多月了，一直拖到現在才生出這篇文章…orz。

其實這篇 工廠模式應該要當作第一篇 Design pattern 的文章會比較好，因為這個模式很容易懂，但是 工廠模式中又細分出一些其他類似的模式，例如 抽象工廠模式 ，所以我把一些相關的資料都讀了一遍後，分三篇作介紹。

**工廠模式最主要的精神就是將 new Class 這個動作另外封裝成一個 Factory Class，這個 Factory Class 專門負責實體化這些類別。**

特地這樣做有什麼好處呢？

舉個例子，假如我們現在有兩個繼承 Product 的類別，它們擁有 共同的方法 `Operation()`

一般來講，我們如果要實體化 ProductA 或 ProductB 的話，會這樣寫：

```csharp
namespace FactoryPattern
{
  class Program
  {
    static void Main(string[] args)
    {
      Product product = new ProductA();
      
      product.Operation();
    }
  }
}
```

這樣做有什麼缺點呢？

如果我 product 型別要換成 ProductB 的話，就需要把第 7 行的 `new ProductA()` 改成 `new ProductB()` ，若是繼承 Product 的類別一多，以後程式碼的維護上會很麻煩。

**簡單工廠模式 Simple Factory Pattern** （又稱 靜態工廠模式 Static Factory Pattern ）：

按照上圖，將擁有共同介面**類別的實體化動作封裝在 Factory **內，程式就可以在執行時**動態**決定要實體化哪個類別了。

Factory class：

```csharp
namespace SimpleFactoryPattern
{
  public class Factory
  {
    public Product CreateProduct(string name)
    {
      switch (name)
      {
        case "ProductA":
          return new ProductA();
        case "ProductB":
          return new ProductB();
        default:
          return null;
      }
    }
  }
}
```

Client：

```csharp
using System;
 
namespace SimpleFactoryPattern
{
  class Program
  {
    static void Main(string[] args)
    {
      // productName可以動態決定要實體化的類別
      string productName = "ProductA";
        
      Factory productFactory = new Factory();
        
      Product product = productFactory.CreateProduct(productName);
      
      product.Operation();
    }
  }
}
```

到這裡可以看看使用 Factory 後，和使用之前的程式碼做比較，最大的差別就是**現在可以靠變數來決定要實體化的類別**了，若是需要改成 ProductB 的話，只需要將 productName 的值改成 “ProductB” 就行了。

如果覺得上面的 `Factory productFactory = new Factory();` 這行有點礙眼的話，還可以將程式碼更簡單話一點，就是把 Factory class 的 `CreateProduct()` 方法改成 static：

```csharp
public static Product CreateProduct(string name)
```

這樣就可以直接跳過 `new Factory()` 的步驟，直接呼叫 `CreateProduct()` 方法：

```csharp
static void Main(string[] args)
{
  string productName = "ProductA";
                
  Product product = Factory.CreateProduct(productName);
 
  product.Operation();
}
```

使用 簡單工廠模式 雖然方便，但也是有缺點的。

如果每次新增一個 Product 子類別後，都必須修改 Factory class 中 CreateProduct() 的 switch 判斷式的話，這樣做不符合物件導向設計的 [Open-Closeed Principle(開放-封閉原則)](http://en.wikipedia.org/wiki/Open/closed_principle) 精神。

什麼是開放-封閉原則呢?

簡單說就是**程式容易擴充新功能，但是不用修改原始碼**的意思。

如果因為要擴充 ProductC class 進來，而修改了 Factory class 的話，這樣的做法並不是很好，所以比較正統的 工廠模式有另一種寫法，就是接著下一篇要介紹的 工廠方法模式 。

要解決 簡單工廠模式的問題， 工廠方法模式 的做法是將 Factory 類別抽象化，讓每個 Product 子類別都有屬於自己的工廠類別，如上圖所示。

Factory interface：

```csharp
namespace FactoryMethodPattern
{
  public interface Factory
  {
    Product CreateProduct();
  }
}
```

ProductFactoryA class：

```csharp
namespace FactoryMethodPattern
{
  public class ProductFactoryA : Factory
  {
    public Product CreateProduct()
    {
      return new ProductA();
    }
  }
}
```

ProductFactoryB class：

```csharp
namespace FactoryMethodPattern
{
  public class ProductFactoryB : Factory
  {
    public Product CreateProduct()
    {
      return new ProductB();
    }
  }
}
```

Client：

```csharp
using System;
 
namespace FactoryMethodPattern
{
  class Program
  {
    static void Main(string[] args)
    {
      // ProductA
      Factory productFactoryA = new ProductFactoryA();
      Product productA = productFactoryA.CreateProduct();
      productA.Operation();            
      
      // ProductB
      Factory productFactoryB = new ProductFactoryB();
      Product productB = productFactoryB.CreateProduct();            
      productB.Operation();
    }
  }
}
```

這樣就解決 簡單工廠的擴充問題了，如果需要增加 ProductC 的話，只需要加入 繼承 Product 的ProductC class 和 繼承 Factory 的 ProductFactoryC class 就可以了，不需要動到其他程式碼。

最後要介紹的是抽象工廠模式，這個模式其實跟上面的工廠方法是差不多的，只是增加了第二組Product的概念，我們來看看它的定義：

**抽象工廠模式，提供一個建立一系列相關物件的介面，而無需指定它們具體的類別。**

從上圖來看，我們有兩組產品，Product1 和 Product2，可以把它們想像成 Office 的 Word 和 Excel，這兩組產品如果要跨平台到 Mac 的話，就會分支出 Windows 版和 Mac 版的，但是軟體做的事情是一樣的，所以它們繼承了共同的方法，如下圖：

看完上圖後，可以看出每個產品都有 Windows 和 Mac 兩種系列，所以我們可以為他們寫兩個工廠類別，一個專門負責生產 Windows，一個專門負責生產 Mac 的產品，來看看程式碼：

Factory interface：

```csharp
namespace AbstractFactoryPattern
{
  public interface Factory
  {
    // 想像成CreateWindowsProduct()
    Product1 CreateProduct1();
    
    // 想像成CreateMacProduct()
    Product2 CreateProduct2();
  }
}
```

ProductFactoryA class：

```csharp
namespace AbstractFactoryPattern
{
  // 想像成WordFactory
  public class ProductFactoryA : Factory
  {
    public Product1 CreateProduct1()
    {
      // 生產Windows的Word
      return new Product1A();
    }
    
    public Product2 CreateProduct2()
    {
      // 生產Mac的Word
      return new Product2A();
    }
  }
}
```

ProductFactoryB class：

```csharp
namespace AbstractFactoryPattern
{
  // 想像成ExcelFactory
  public class ProductFactoryB : Factory
  {
    public Product1 CreateProduct1()
    {
      // 生產Windows的Excel
      return new Product1B();
    }
  
    public Product2 CreateProduct2()
    {
      // 生產Mac的Excel
      return new Product2B();
    }
  }
}
```

Client：

```java
namespace AbstractFactoryPattern
{
  class Program
  {
    static void Main(string[] args)
    {
      // Word工廠
      Factory productFactoryA = new ProductFactoryA();            
      // 製造Windows和Mac版本的Word
      Product1 product1A = productFactoryA.CreateProduct1();            
      Product2 product2A = productFactoryA.CreateProduct2();
      // 跑兩種版本的Word
      product1A.Operation();
      product2A.Operation();
      
      // Excel工廠
      Factory productFactoryB = new ProductFactoryB();
      // 製造Windows和Mac版本的Excel
      Product1 product1B = productFactoryB.CreateProduct1();
      Product2 product2B = productFactoryB.CreateProduct2();
      // 跑兩種版本的Excel
      product2B.Operation();
      product1B.Operation();
      }
  }
}
```

這樣就完成 抽象工廠模式了，將 Factory 抽象化後， Client 端就能利用多型的方法實體化 Product，而不需要知道具體的類別就能操作它，這就是 抽象工廠 的優點。

到這邊其實已經把 工廠模式都介紹完了，不過其實上面的 抽象工廠 還是有不完美的地方，例如我們現在加入了一個新的 Product 系列 ProductC（可以想像成 Linux 版本的 Office），那麼我們除了要寫 Product1C 跟 Product2C 這些基本的類別外，還要再為它們新增一個 ProductFactoryC 的類別，讓人覺得有一些麻煩。

這邊要介紹 [大話設計模式](http://findbook.tw/book/9789866761799/basic)一書中作者提供的一個技巧，可以將 工廠模式 再修改的更加完美。

看到上圖後，可以發現我們將 Factory 的抽象化拿掉了，變回最初的 簡單工廠模式 ，這時候的 Factory 會變成這樣：

Factory class：

```csharp
using System;
 
namespace SimpleAbstractFactoryPattern
{
  public class Factory
  {
    public static Product1 CreateProduct1(string name)
    {
      switch (name)
      {
        case "Product1A":
          return new Product1A();
        case "Product1B":
          return new Product1B();
        default:
          throw new Exception();
      }
    }
    
    public static Product2 CreateProduct2(string name)
    {
      switch (name)
      {
        case "Product2A":
          return new Product2A();
        case "Product2B":
          return new Product2B();
        default:
          throw new Exception();
      }
    }
  }
}
```

這樣寫的話，之前才提到的 開放-封閉原則 的缺點不是又出現了嗎？

如果增加了一個新的 ProductC 類別的話，就需要在 Factory 裡面增加新的 switch case 分支條件，不容易擴充的問題就出現了。

這裡要介紹 C# 跟 JAVA 都有提供的一個機制，**Reflection(反射)**，**它可以直接依照 class 的名稱來實體化類別**，我們直接來看看用Reflection機制修改後的 Factory 程式碼吧：

Factory class：

```csharp
using System;
using System.Reflection;
 
namespace SimpleAbstractFactoryPattern
{
  public class Factory
  {
    // 專案的namespace
    private static readonly string AssemblyName = "SimpleAbstractFactoryPattern";
    
    public static Product1 CreateProduct1(string name)
    {
      // 如果傳進來的name是"Product1A"
      // 那className就等於SimpleAbstractFactoryPattern.Product1A
      string className = AssemblyName + "." + name;
      
      // 這裡就是Reflection，直接依照className實體化具體類別
      return (IProduct1)Assembly.Load(AssemblyName).CreateInstance(className);
    }
    
    public static Product2 CreateProduct2(string name)
    {
      string className = AssemblyName + "." + name;
    
      return (IProduct2)Assembly.Load(AssemblyName).CreateInstance(className);
    }
  }
}
```

Client：

```csharp
namespace SimpleAbstractFactoryPattern
{
  class Program
  {
    static void Main(string[] args)
    {
      // 生產產品A
      
      Product1 product1A = Factory.CreateProduct1("Product1A");
      Product2 product2A = Factory.CreateProduct2("Product2A");
      
      product1A.Operation();
      product2A.Operation();
      
      // 生產產品B
      
      Product1 product1B = Factory.CreateProduct1("Product1B");
      Product2 product2B = Factory.CreateProduct2("Product2B");
      
      product2B.Operation();
      product1B.Operation();
    }
  }
}
```

看到了嗎!?這樣就算加入了其他 Product 子類別後，也不需要修改 Factory 的程式碼，只要在 CreateProduct() 方法內傳入要實體化的類別名稱就可以了，相當方便吧。

範例檔案：

* [FactoryPatternSample.rar](http://sites.google.com/site/amo26site/download/FactoryPatternSample.rar?attredirects=0)

參考資料：

* [軟體設計模式 — 維基百科](http://zh.wikipedia.org/w/index.php?title=%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&variant=zh-tw)
* [設計模式筆記](http://caterpillar.onlyfun.net/Gossip/DesignPattern/DesignPattern.htm)
* [First we try,then we trust — C#設計模式](http://www.cnblogs.com/zhenyulu/category/6930.html?Show=All)
