---
title: 'XNA Simple Animation'
description: '因為我的大學專題是寫一款四人網路連線的格鬥遊戲，所以對 XNA 這套微軟提供的遊戲開發平台有點研究，之前在痞客邦寫網誌的時候有寫過幾篇這個作品的開發情況，後來因為實在太忙了所以沒有繼續介紹下去，現在這個遊戲已經在去年完成了，也得到不錯的成績，有機會我會 PO…'
pubDate: 'Jun 12 2009'
categories: [Tech]
---

因為我的大學專題是寫一款四人網路連線的格鬥遊戲，所以對 [XNA](http://zh.wikipedia.org/w/index.php?title=XNA&variant=zh-tw) 這套微軟提供的遊戲開發平台有點研究，之前在痞客邦寫網誌的時候有寫過幾篇這個作品的開發情況，後來因為實在太忙了所以沒有繼續介紹下去，現在這個遊戲已經在去年完成了，也得到不錯的成績，有機會我會 PO 上來分享一些製作心得。

在網誌搬到 Blogger 之後一直沒有機會寫一些跟 XNA 有關的文章，我打算介紹一些 [XNA Creators Club](http://creators.xna.com/en-US/education/catalog/) 教學範例中所使用到的開發技術，國內介紹 XNA 的文章不多，有興趣用 XNA 開發遊戲的人，推薦可以到 [點部落](http://www.dotblogs.com.tw/Team.aspx?GroupID=507) 去看一些不錯的文章。

這一篇我想先介紹 XNA 如何使用 Model、ModelBone 和 ModelMesh 等技術去載入一個 3D 模型，然後控制一些簡單的 3D 動畫。

首先必須先準備一個 3D 模型，XNA 預設的類型有 `.x` 跟 `.fbx` 兩種模型檔，這裡我們先用微軟提供的坦克車模型（ [part1](http://sites.google.com/site/amo26site/download/TankModel.part1.rar?attredirects=0)）（ [part2](http://sites.google.com/site/amo26site/download/TankModel.part2.rar?attredirects=0) ）來作示範。

一開始先建立一個 XNA 的專案。

將模型檔加入到 Content 資料夾內。

新增一個 `Tank.cs` ：

```csharp
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
 
namespace SimpleAnimationSample
{
  /// <summary>
  /// 能讓零件動作的坦克車模型類別
  /// </summary>
  public class Tank
  {
    /// <summary>
    /// 坦克車模型
    /// </summary>
    private Model tankModel;
    
    /// <summary>
    /// 坦克所有組件的平移矩陣
    /// </summary>
    private Matrix[] boneTransforms;
  
    /// <summary>
    /// 載入坦克車資源
    /// </summary>
    public void Load(ContentManager content)
    {
      // 從ContentManager載入坦克車模型.
      this.tankModel = content.Load<Model>("tank");
    
      // 配置所有組件的平移矩陣
      this.boneTransforms = new Matrix[this.tankModel.Bones.Count];
    }
    /// <summary>
    /// 坦克車的繪圖機制
    /// </summary>
    /// <param name="world">世界矩陣</param>
    /// <param name="view">觀察矩陣</param>
    /// <param name="projection">投影矩陣</param>
    public void Draw(Matrix world, Matrix view, Matrix projection)
    {
      // 設定坦克車最上層的平移矩陣為世界矩陣
      this.tankModel.Root.Transform = world;
  
      // 更新所有組件的平移矩陣
      this.tankModel.CopyAbsoluteBoneTransformsTo(this.boneTransforms);
      
      // 繪製模型
      foreach (ModelMesh mesh in this.tankModel.Meshes)
      {
        foreach (BasicEffect effect in mesh.Effects)
        {
          effect.World = this.boneTransforms[mesh.ParentBone.Index];
          effect.View = view;
          effect.Projection = projection;
          
          effect.EnableDefaultLighting();
        }
    
        mesh.Draw();
      }
    }
  }
}
```

修改遊戲主程式 `Game1.cs`（這裡我命名為 `SimpleAnimation.cs` ）：

```csharp
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
 
namespace SimpleAnimationSample
{
  /// <summary>
  /// 控制坦克車模型動畫的範例程式
  /// </summary>
  public class SimpleAnimation : Microsoft.Xna.Framework.Game
  {
    private GraphicsDeviceManager graphics;
    
    private Tank tank;
    public SimpleAnimation()
    {
      this.graphics = new GraphicsDeviceManager(this);
      
      this.graphics.PreferredBackBufferWidth = 600;
      this.graphics.PreferredBackBufferHeight = 450;
      
      this.Content.RootDirectory = "Content";
    }
  
    /// <summary>
    /// 初始化遊戲內容
    /// </summary>
    protected override void Initialize()
    {
      this.tank = new Tank();
      
      base.Initialize();
    }
  
    /// <summary>
    /// 載入遊戲資源
    /// </summary>
    protected override void LoadContent()
    {
      this.tank.Load(this.Content);
    }
  
    /// <summary>
    /// 遊戲繪圖更新
    /// </summary>
    /// <param name="gameTime">上一次繪圖後經過的時間</param>
    protected override void Draw(GameTime gameTime)
    {
      this.GraphicsDevice.Clear(Color.CornflowerBlue);
  
      // 視窗畫面
      Viewport viewport = this.GraphicsDevice.Viewport;
      
      // 畫面長寬比
      float aspectRatio = (float)viewport.Width / (float)viewport.Height;
      
      // 世界矩陣(縮放矩陣, 旋轉矩陣, 平移矩陣)
      Matrix world = Matrix.CreateScale(1.0f) * Matrix.CreateRotationY(MathHelper.PiOver4) * Matrix.CreateTranslation(Vector3.Zero);
      
      // 觀察矩陣(攝影機座標, 攝影機焦點座標, 攝影機上方的向量)
      Matrix view = Matrix.CreateLookAt(new Vector3(1000, 600, 0), new Vector3(0, 100, 0), Vector3.Up);
  
      // 投影矩陣(畫面視角呈現弧度, 畫面長寬比, 近景值, 遠景值)
      Matrix projection = Matrix.CreatePerspectiveFieldOfView(MathHelper.PiOver4, aspectRatio, 10, 10000);
  
      this.tank.Draw(world, view, projection);
  
      base.Draw(gameTime);
    }
  }
}
```

上面我們完成了基本的坦克車模型載入，接下來要讓它的每個組件都能動作。

如果要讓模型內的組件獨立動作的話，會需要用到 ModelBone 這個類別，這裡我們先示範讓坦克車的**左前輪**轉動。

要讓左前輪動就必須知道他在模型內的 Mesh 命名，如果不知道當初建模時的命名，可以照下圖的步驟找出左前輪的名稱。

找到左前輪的命名 `"l_front_wheel_geo"` 後，就可以開始用程式去控制它了，修改 `Tank.cs` ：

```csharp
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
 
namespace SimpleAnimationSample
{
  /// <summary>
  /// 能讓零件動作的坦克車模型類別
  /// </summary>
  public class Tank
  {
    /// <summary>
    /// 坦克車模型
    /// </summary>
    private Model tankModel;
  
    // 坦克左前輪組件
    private ModelBone leftFrontWheelBone;
  
    // 坦克左前輪的平移矩陣
    private Matrix leftFrontWheelTransform;
  
    /// <summary>
    /// 坦克所有組件的平移矩陣
    /// </summary>
    private Matrix[] boneTransforms;
    // 輪子的旋轉值
    private float wheelRotationValue;
  
    /// <summary>
    /// Get或Set輪子的旋轉值.
    /// </summary>
    public float WheelRotation
    {
      get { return wheelRotationValue; }
      set { wheelRotationValue = value; }
    }
  
    /// <summary>
    /// 載入坦克車資源
    /// </summary>
    public void Load(ContentManager content)
    {
      // 從ContentManager載入坦克車模型.
      this.tankModel = content.Load<Model>("tank");
  
      // 參照坦克左前輪組件
      this.leftFrontWheelBone = this.tankModel.Bones["l_front_wheel_geo"];
  
      // 取得左前輪平移矩陣
      this.leftFrontWheelTransform = this.leftFrontWheelBone.Transform;
  
      // 配置所有組件的平移矩陣
      this.boneTransforms = new Matrix[this.tankModel.Bones.Count];
    }
    /// <summary>
    /// 坦克車的繪圖機制
    /// </summary>
    /// <param name="world">世界矩陣</param>
    /// <param name="view">觀察矩陣</param>
    /// <param name="projection">投影矩陣</param>
    public void Draw(Matrix world, Matrix view, Matrix projection)
    {
      // 設定坦克車最上層的平移矩陣為世界矩陣
      this.tankModel.Root.Transform = world;
      
      // 輪子繞著X軸旋轉
      Matrix wheelRotation = Matrix.CreateRotationX(this.wheelRotationValue);
      // 左前輪的平移矩陣 = 旋轉矩陣 * 平移矩陣
      this.leftFrontWheelBone.Transform = wheelRotation * this.leftFrontWheelTransform;
      
      // 更新所有組件的平移矩陣
      this.tankModel.CopyAbsoluteBoneTransformsTo(this.boneTransforms);
  
      // 繪製模型
      foreach (ModelMesh mesh in this.tankModel.Meshes)
      {
        foreach (BasicEffect effect in mesh.Effects)
        {
          effect.World = this.boneTransforms[mesh.ParentBone.Index];
          effect.View = view;
          effect.Projection = projection;
  
          effect.EnableDefaultLighting();
        }
  
        mesh.Draw();
      }
    }
  } 
}
```

接著馬上更新遊戲主程式，讓坦克的左前輪旋轉，修改 `Game1.cs`（ `SimpleAnimation.cs` ）：

```csharp
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
 
namespace SimpleAnimationSample
{
  /// <summary>
  /// 控制坦克車模型動畫的範例程式
  /// </summary>
  public class SimpleAnimation : Microsoft.Xna.Framework.Game
  {
    private GraphicsDeviceManager graphics;
 
    private Tank tank;
    public SimpleAnimation()
    {
      this.graphics = new GraphicsDeviceManager(this);
      
      this.graphics.PreferredBackBufferWidth = 600;
      this.graphics.PreferredBackBufferHeight = 450;
      
      this.Content.RootDirectory = "Content";
    }
 
    /// <summary>
    /// 初始化遊戲內容
    /// </summary>
    protected override void Initialize()
    {
      this.tank = new Tank();
    
      base.Initialize();
    }
 
    /// <summary>
    /// 載入遊戲資源
    /// </summary>
    protected override void LoadContent()
    {
      this.tank.Load(this.Content);
    }
    
    /// <summary>
    /// 遊戲邏輯更新
    /// </summary>
    /// <param name="gameTime">上一次更新後經過的時間</param>
    protected override void Update(GameTime gameTime)
    {
      // 上次更新後到現在經過幾秒
      float time = (float)gameTime.TotalGameTime.TotalSeconds;
      
      // 更新坦克輪子的旋轉值
      this.tank.WheelRotation = time * 5;
      
      base.Update(gameTime);
    }
 
    /// <summary>
    /// 遊戲繪圖更新
    /// </summary>
    /// <param name="gameTime">上一次繪圖後經過的時間</param>
    protected override void Draw(GameTime gameTime)
    {
      this.GraphicsDevice.Clear(Color.CornflowerBlue);
 
      // 視窗畫面
      Viewport viewport = this.GraphicsDevice.Viewport;
      
      // 畫面長寬比
      float aspectRatio = (float)viewport.Width / (float)viewport.Height;
      
      // 世界矩陣(縮放矩陣, 旋轉矩陣, 平移矩陣)
      Matrix world = Matrix.CreateScale(1.0f) * Matrix.CreateRotationY(MathHelper.PiOver4) * Matrix.CreateTranslation(Vector3.Zero);
      
      // 觀察矩陣(攝影機座標, 攝影機焦點座標, 攝影機上方的向量)
      Matrix view = Matrix.CreateLookAt(new Vector3(1000, 600, 0), new Vector3(0, 100, 0), Vector3.Up);
      
      // 投影矩陣(畫面視角呈現弧度, 畫面長寬比, 近景值, 遠景值)
      Matrix projection = Matrix.CreatePerspectiveFieldOfView(MathHelper.PiOver4, aspectRatio, 10, 10000);

      this.tank.Draw(world, view, projection);
 
      base.Draw(gameTime);
    }
  }
}
```

沒意外的話坦克車的左前輪就會開始旋轉了，接著其他的組件也只要按照上面的步驟加入程式碼，就能完成一部很酷的坦克車動畫了，手邊如果有其他模型檔的話也可以玩玩看~

完整範例程式：

* SimpleAnimationSample.rar（[part1](http://sites.google.com/site/amo26site/download/SimpleAnimationSample.part1.rar?attredirects=0)）（[part2](http://sites.google.com/site/amo26site/download/SimpleAnimationSample.part2.rar?attredirects=0)）

參考資料：

* [XNA Creator Club Online — simple animation](http://creators.xna.com/en-US/sample/simpleanimation)
* [MSDN](http://msdn.microsoft.com/en-us/library/bb203940.aspx)
* [點部落 — XNA顯示3D模型](http://www.dotblogs.com.tw/help/archive/2009/01/14/6810.aspx)
* [點部落 — XNA3D座標系統](http://www.dotblogs.com.tw/help/archive/2009/01/09/6711.aspx)
* [點部落 — XNA3D矩陣運算](http://www.dotblogs.com.tw/sonic10690/archive/2009/01/02/6598.aspx)
* [點部落 — XNA攝影機](http://www.dotblogs.com.tw/sonic10690/archive/2009/01/03/6602.aspx)
* [點部落 — XNA投影轉換](http://www.dotblogs.com.tw/sonic10690/archive/2009/01/04/6617.aspx)
