/* =========================================================
 * VERSE道場破り — 中級編 (Q041〜Q120)
 * 茶帯。struct/class/interface/enum/map/失敗コンテキスト/
 * アクセス指定子/module/並行処理の入口まで、実務の土台を固める。
 * ========================================================= */
var INTERMEDIATE_QUESTIONS = [

// ---------- struct ----------
{
  n: 41, lv: "i", cat: "struct",
  concept: "structの定義とインスタンス化",
  explain: `<code>struct</code>は複数の値を1つにまとめる「データの入れ物」です。<code>フィールド名 : 型 = デフォルト値</code>を並べて定義し、インスタンスは<code>型名{フィールド := 値, ...}</code>のように<strong>フィールド名を指定して</strong>作ります。省略したフィールドはデフォルト値のままです。`,
  example: `player_stats := struct:
    Level : int = 1
    HP    : int = 100
    Attack : int = 10

MyStats := player_stats{Level := 5, HP := 150}
DefaultStats := player_stats{}   # すべてデフォルト値のまま
Print("{MyStats.Level}, {MyStats.HP}")`,
  problem: `<b>Name</b>(string, デフォルト<b>""</b>)・<b>X</b>(float, デフォルト<b>0.0</b>)・<b>Y</b>(float, デフォルト<b>0.0</b>)を持つ<code>point</code>という構造体を定義し、<code>point{Name := "スタート地点", X := 0.0, Y := 0.0}</code>を作ってフィールドをPrintしてください。`,
  answer: `point := struct:
    Name : string = ""
    X : float = 0.0
    Y : float = 0.0

Start := point{Name := "スタート地点", X := 0.0, Y := 0.0}
Print("{Start.Name}: ({Start.X}, {Start.Y})")`,
  note: `<code>型名{Field := Value}</code>という「名前付きフィールドでのインスタンス化」は、この先class・weak_mapなど至るところで使う基本パターンです。`
},

// ---------- 42 ----------
{
  n: 42, lv: "i", cat: "struct",
  concept: "structは値渡し(コピーされる)",
  explain: `structを別の変数に代入すると、<strong>まったく別の複製(コピー)</strong>が作られます。片方を書き換えても、もう片方には影響しません。structのフィールドは既定で「公開・不変」なので、書き換えたいときはstruct自体を<code>var</code>な変数に入れる必要があります。`,
  example: `var Original : player_stats = player_stats{Level := 5}
var Copy : player_stats = Original   # ここで複製が発生
set Copy.Level = 10
Print("{Original.Level}")   # → 5 (Originalは変化しない)`,
  problem: `<code>point</code>構造体(41問目のもの)の<b>var</b>変数<b>A</b>を<b>point{X := 1.0}</b>で作り、<b>B := A</b>でコピーしてから<b>Bだけ</b>を<b>X := 99.0</b>に書き換え、最後に<b>A.X</b>をPrintして<b>1.0のまま</b>であることを確認してください。`,
  answer: `var A : point = point{X := 1.0}
var B : point = A
set B.X = 99.0
Print("{A.X}")   # → 1.0 (Aは影響を受けない)`,
  note: `structの「コピーされる」性質は、次のclassの「共有される」性質とちょうど対になります。この違いを体で覚えることが中級編最大のヤマ場です。`
},

// ---------- 43 ----------
{
  n: 43, lv: "i", cat: "struct",
  concept: "structはメソッドを持てない",
  explain: `structはデータの入れ物に徹していて、メソッド(その型専用の関数)は持てません。structに関連する処理を書きたいときは、structを引数に取る<strong>普通の関数</strong>として外に定義します。`,
  example: `rgb_color := struct:
    R : int = 0
    G : int = 0
    B : int = 0

ToHexLike(C : rgb_color) : string =
    "R{C.R}G{C.G}B{C.B}"

Print(ToHexLike(rgb_color{R := 255, G := 128}))`,
  problem: `<code>point</code>構造体を受け取り、<b>"({X座標}, {Y座標})"</b>形式の文字列を返す関数<code>Describe</code>を作り、<code>Describe(point{X := 3.0, Y := 4.0})</code>をPrintしてください。`,
  answer: `Describe(P : point) : string =
    "({P.X}, {P.Y})"

Print(Describe(point{X := 3.0, Y := 4.0}))`,
  note: `structに「振る舞い」を持たせたくなったら、それはclassへの切り替えを検討するサインでもあります。`
},

// ---------- 44 ----------
{
  n: 44, lv: "i", cat: "struct",
  concept: "ジェネリックなstruct",
  explain: `structも関数と同じように、<code>(t : type)</code>という型パラメータを受け取れます。「どんな型でも包める箱」を1つ定義しておけば、intでもstringでも同じ構造で扱えます。`,
  example: `wrapper(t : type) := struct:
    Value : t

IntWrapped := wrapper(int){Value := 42}
StringWrapped := wrapper(string){Value := "こんにちは"}
Print("{IntWrapped.Value}")`,
  problem: `<code>wrapper</code>を参考に、<b>Value</b>(型t)と<b>Label</b>(string)の2つを持つジェネリックな<code>tagged</code>構造体を定義し、<code>tagged(int){Value := 100, Label := "得点"}</code>を作ってPrintしてください。`,
  answer: `tagged(t : type) := struct:
    Value : t
    Label : string

Score := tagged(int){Value := 100, Label := "得点"}
Print("{Score.Label}: {Score.Value}")`,
  note: `ジェネリックなstructは、後の章で学ぶ<code>option</code>や<code>array</code>そのものの仕組みにも通じる考え方です。`
},

// ---------- 45 ----------
{
  n: 45, lv: "i", cat: "struct",
  concept: "structのネスト(入れ子)",
  explain: `structのフィールドの型として、別のstructを使うこともできます。「座標を持つ敵キャラのデータ」のように、複数のstructを組み合わせて、より意味のあるデータ構造を組み立てられます。`,
  example: `enemy_data := struct:
    Name : string = "名無し"
    Position : point = point{}
    Hp : int = 50

Goblin := enemy_data{Name := "ゴブリン", Position := point{X := 10.0, Y := 5.0}}
Print("{Goblin.Name} @ ({Goblin.Position.X}, {Goblin.Position.Y})")`,
  problem: `<b>Name</b>(string)と<b>Score</b>(<code>tagged(int)</code>、44問目のもの)を持つ<code>result_entry</code>構造体を定義し、<b>"ゆうた"</b>と<b>tagged(int){Value := 90, Label := "得点"}</b>で1つ作ってPrintしてください。`,
  answer: `result_entry := struct:
    Name : string = ""
    Score : tagged(int) = tagged(int){Value := 0, Label := ""}

Entry := result_entry{Name := "ゆうた", Score := tagged(int){Value := 90, Label := "得点"}}
Print("{Entry.Name}: {Entry.Score.Label} {Entry.Score.Value}")`,
  note: `<code>Entry.Score.Value</code>のように、ドットを重ねて入れ子の中身までたどっていけます。`
},

// ---------- class ----------
{
  n: 46, lv: "i", cat: "class",
  concept: "classの定義とメソッド",
  explain: `<code>class</code>もフィールドを持てますが、structと違って<strong>メソッド(その型専用の関数)</strong>も一緒に定義できます。メソッドは<code>MethodName(引数) : 戻り値の型 = 処理</code>という、通常の関数と同じ書き方で、classのブロックの中に書きます。`,
  example: `character := class:
    Name : string
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)

Hero := character{Name := "ゆうた"}
Hero.TakeDamage(30)
Print("{Hero.Health}")   # → 70`,
  problem: `<b>Name</b>(string)と可変の<b>Level</b>(int, 初期値<b>1</b>)を持つ<code>hero</code>クラスを作り、<b>LevelUp()</b>というメソッドで<code>Level</code>を1増やせるようにしてください。`,
  answer: `hero := class:
    Name : string
    var Level : int = 1

    LevelUp() : void =
        set Level += 1

MyHero := hero{Name := "ゆうた"}
MyHero.LevelUp()
Print("{MyHero.Name} Lv.{MyHero.Level}")   # → ゆうた Lv.2`,
  note: `classのメソッドの中では、<code>self.Level</code>のように書かなくても、そのまま<code>Level</code>でフィールドにアクセスできます。`
},

// ---------- 47 ----------
{
  n: 47, lv: "i", cat: "class",
  concept: "classは参照渡し(共有される)",
  explain: `classのインスタンスを別の変数に代入しても、<strong>複製は作られません</strong>。「同じ実体を指す、新しい参照が増える」だけです。片方を書き換えると、もう片方からも変化が見えます。これがstructとの決定的な違いです。`,
  example: `Player1 := character{Name := "ゆうた"}
Player2 := Player1        # 参照が増えるだけ、実体は1つ
Player2.TakeDamage(30)
Print("{Player1.Health}")   # → 70 (Player1側にも影響する!)`,
  problem: `<code>hero</code>クラスの<b>A</b>を<b>hero{Name := "けん"}</b>で作り、<b>B := A</b>としてから<b>B.LevelUp()</b>を呼び、最後に<b>A.Level</b>をPrintして<b>Aにも反映されている</b>ことを確認してください。`,
  answer: `A := hero{Name := "けん"}
B := A
B.LevelUp()
Print("{A.Level}")   # → 2 (Bを通じた変更がAにも反映される)`,
  note: `「同じキャラクターを、2つのコントローラーで操作している」とイメージすると理解しやすいです。`
},

// ---------- 48 ----------
{
  n: 48, lv: "i", cat: "class",
  concept: "struct と class の使い分け",
  explain: `構造体(struct)は「コピーされるトレーディングカード」、クラス(class)は「複数人で回し持つコントローラー」です。座標や色のような<strong>値そのもの</strong>を表したいならstruct、プレイヤーや敵キャラのような<strong>同一性が大事なもの</strong>を表したいならclassを選びます。classだけが単一継承(1つの親クラス)にも対応しています。`,
  example: `# 値として扱いたい → struct
color := struct:
    R : int = 0
    G : int = 0
    B : int = 0

# 同一性が大事 → class
enemy := class:
    var Hp : int = 100`,
  problem: `次の2つのデータについて、<b>struct</b>と<b>class</b>のどちらで作るべきか考え、実際に<b>「3D空間の1点を表すvector3ライクなposition」はstructで</b>、<b>「ゲーム上に1体しか存在しない大ボスbossは class」</b>として、それぞれ最小限のフィールド(position: X,Y,Z / boss: Hp)で定義してください。`,
  answer: `position := struct:
    X : float = 0.0
    Y : float = 0.0
    Z : float = 0.0

boss := class:
    var Hp : int = 10000`,
  note: `「2つあったら別物として扱いたい→class」「中身が同じなら同じ値として扱いたい→struct」という基準で考えると迷いにくくなります。`
},

// ---------- 49. 継承 ----------
{
  n: 49, lv: "i", cat: "継承とoverride",
  concept: "class(親クラス) で継承する",
  explain: `<code>子クラス := class(親クラス):</code>と書くと、親クラスの機能をすべて引き継いだ子クラスを作れます。親のメソッドを上書きしたい場合は<code>&lt;override&gt;</code>を付けます。親自身の実装も呼びたい場合は<code>(super:)メソッド名()</code>と書きます。`,
  example: `base := class:
    Greet() : void = Print("私は生き物です")

derived := class(base):
    Greet<override>() : void =
        (super:)Greet()
        Print("その中でも、私は犬です")

Dog := derived{}
Dog.Greet()`,
  problem: `<code>Greet() : void = Print("動物です")</code>を持つ<code>animal</code>クラスを作り、それを継承した<code>cat</code>クラスで<code>Greet</code>を<code>&lt;override&gt;</code>し、<b>親の処理を呼んでから</b>「その中でも、私は猫です」とPrintするようにしてください。`,
  answer: `animal := class:
    Greet() : void = Print("動物です")

cat := class(animal):
    Greet<override>() : void =
        (super:)Greet()
        Print("その中でも、私は猫です")

MyCat := cat{}
MyCat.Greet()`,
  note: `<code>(super:)</code>は「親クラスの規格で、という指定」です。overrideした後でも親の実装を捨てずに再利用できます。`
},

// ---------- 50 ----------
{
  n: 50, lv: "i", cat: "継承とoverride",
  concept: "継承先で新しいフィールド・メソッドを足す",
  explain: `子クラスは親のフィールド・メソッドをすべて引き継いだ上で、<strong>新しいフィールドやメソッドを追加</strong>できます。「動物 → 犬」のような家系図をそのままコードにできるイメージです。`,
  example: `entity := class:
    var Position : point = point{}

character := class(entity):
    Name : string

    Move() : void =
        Print("{Name}が移動しました")`,
  problem: `<b>Name</b>(string)を持つ<code>vehicle</code>クラスを作り、それを継承して<b>Wheels</b>(int, 初期値<b>4</b>)を追加した<code>car</code>クラスを作ってください。<code>car{Name := "レーサー"}</code>を作り、<b>Name</b>と<b>Wheels</b>の両方をPrintしてください。`,
  answer: `vehicle := class:
    Name : string

car := class(vehicle):
    Wheels : int = 4

MyCar := car{Name := "レーサー"}
Print("{MyCar.Name} / タイヤ{MyCar.Wheels}個")`,
  note: `子クラスのインスタンスは、親クラスのフィールドもすべて自分のものとして持っています。`
},

// ---------- 51 ----------
{
  n: 51, lv: "i", cat: "継承とoverride",
  concept: "多段の継承",
  explain: `継承は1段階だけでなく、子クラスをさらに継承して孫クラスを作ることもできます。ただし、Verseの継承は<strong>単一継承</strong>(1つの親のみ)なので、家系図は一本道になります。`,
  example: `car := class:
    Name : string
    MaxSpeed : int = 120

sports_car := class(car):
    MaxSpeed<override> : int = 300`,
  problem: `<code>animal</code>(<b>Greet()</b>で"動物です")→<code>dog</code>(継承し<b>Greet</b>を"犬です"にoverride)→<code>puppy</code>(<code>dog</code>をさらに継承し<b>Greet</b>を"子犬です"にoverride)という3段階のクラスを作り、<code>puppy{}</code>の<code>Greet()</code>を呼んでください。`,
  answer: `animal := class:
    Greet() : void = Print("動物です")

dog := class(animal):
    Greet<override>() : void = Print("犬です")

puppy := class(dog):
    Greet<override>() : void = Print("子犬です")

MyPuppy := puppy{}
MyPuppy.Greet()   # → 子犬です`,
  note: `孫クラスでoverrideすると、一番近い(自分に近い)実装が優先されます。<code>(super:)</code>を使えば1つ上の親の実装も呼べます。`
},

// ---------- 52. interface ----------
{
  n: 52, lv: "i", cat: "interface",
  concept: "interfaceの定義と実装",
  explain: `<code>interface</code>は「このクラスはこの機能を必ず持っている」という約束(契約)です。<code>class(インターフェース名):</code>のように実装し、メソッドには<code>&lt;override&gt;</code>を付けます。クラスの親は1つだけですが、<strong>インターフェースはいくつでも同時に実装</strong>できます。`,
  example: `damageable := interface:
    TakeDamage(Amount : int) : void

character := class(damageable):
    var Health : int = 100

    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)`,
  problem: `<b>Interact()</b>というメソッドを持つ<code>interactable</code>インターフェースを定義し、それを実装した<code>chest</code>クラス(<code>Interact()</code>で「宝箱を開けた!」とPrint)を作ってください。`,
  answer: `interactable := interface:
    Interact() : void

chest := class(interactable):
    Interact<override>() : void =
        Print("宝箱を開けた!")

MyChest := chest{}
MyChest.Interact()`,
  note: `interfaceは「コンセントの差込口の規格」のようなものです。中身のクラスが何であれ、同じ規格を実装していれば同じように扱えます。`
},

// ---------- 53 ----------
{
  n: 53, lv: "i", cat: "interface",
  concept: "無関係なクラス同士が同じinterfaceを実装する",
  explain: `interfaceの強みは、<strong>継承関係が無いクラス同士でも同じ規格を実装できる</strong>ことです。「キャラクター」と「樽」はまったく別物でも、両方とも「ダメージを受けられる」という規格さえ満たせば、同じように扱えます。`,
  example: `character := class(damageable):
    var Health : int = 100
    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)

barrel := class(damageable):
    var Health : int = 30
    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)`,
  problem: `<code>damageable</code>インターフェース(52問目のもの)を、無関係な<code>window_glass</code>クラス(<b>Health</b>, 初期値<b>10</b>)にも実装し、<code>TakeDamage(5)</code>を呼んだ後の<b>Health</b>をPrintしてください。`,
  answer: `window_glass := class(damageable):
    var Health : int = 10
    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)

Glass := window_glass{}
Glass.TakeDamage(5)
Print("{Glass.Health}")   # → 5`,
  note: `キャラクターも樽もガラスも「同じ規格」を実装しているだけで、互いに継承関係を持つ必要はありません。これがinterfaceの柔軟さです。`
},

// ---------- 54 ----------
{
  n: 54, lv: "i", cat: "interface",
  concept: "interfaceのデフォルト実装",
  explain: `interfaceのメンバーは、メソッドの「約束」だけでなく、デフォルト値を持つフィールドを含めることもできます。実装側のクラスは、それを上書きするかそのまま使うか選べます。`,
  example: `damageable := interface:
    TakeDamage(Amount : int) : void
    MaxHealth : int = 100   # デフォルト実装(値)も持てる`,
  problem: `<code>describable</code>インターフェースを、<b>Describe() : string</b>(必須メソッド)と<b>Category : string = "その他"</b>(デフォルト値つきフィールド)で定義してください(実装クラスは書かなくてOKです)。`,
  answer: `describable := interface:
    Describe() : string
    Category : string = "その他"`,
  note: `メソッドは実装側で必ず定義が必要ですが、デフォルト値つきのフィールドは実装側で省略してそのまま使うこともできます。`
},

// ---------- 55 ----------
{
  n: 55, lv: "i", cat: "interface",
  concept: "配列に異なるクラスをinterface型として混在させる",
  explain: `同じinterfaceを実装しているクラスなら、たとえ元のクラスがバラバラでも、<strong>そのinterface型の配列</strong>にまとめて入れられます。forでくり返すときも、それぞれのクラスに応じた実装が自動的に呼ばれます。`,
  example: `Targets : []damageable = array{character{}, barrel{}, window_glass{}}
for (Target : Targets):
    Target.TakeDamage(10)`,
  problem: `<code>chest</code>クラスと、新しく作る<code>door</code>クラス(どちらも<code>interactable</code>を実装、それぞれ違うメッセージをPrint)を用意し、<b>[]interactable</b>型の配列に両方入れて、<code>for</code>で全部の<code>Interact()</code>を呼んでください。`,
  answer: `door := class(interactable):
    Interact<override>() : void =
        Print("扉を開けた!")

Objects : []interactable = array{chest{}, door{}}
for (Obj : Objects):
    Obj.Interact()`,
  note: `interfaceを使った「型をそろえて配列にまとめる」書き方は、この後の上級編でポリモーフィズム(多態性)として詳しく扱います。`
},

// ---------- 56. enum ----------
{
  n: 56, lv: "i", cat: "enum",
  concept: "enum<closed> の基本",
  explain: `「取りうる値がいくつかに決まっている」データは<code>enum</code>で表します。既定は<code>&lt;closed&gt;</code>(閉じた列挙型)で、「これから先も絶対に増えない」ことが確定している値に使います。値には<code>型名.ケース名</code>でアクセスします。`,
  example: `day_of_week := enum<closed>:
    Monday
    Tuesday
    Wednesday

Today : day_of_week = day_of_week.Tuesday
Print("{Today}")`,
  problem: `<b>North</b>・<b>South</b>・<b>East</b>・<b>West</b>の4方角を持つ<code>direction</code>という<code>enum&lt;closed&gt;</code>を定義し、<b>direction.East</b>を変数<b>Facing</b>に入れてPrintしてください。`,
  answer: `direction := enum<closed>:
    North
    South
    East
    West

Facing : direction = direction.East
Print("{Facing}")`,
  note: `方角のように「未来永劫これ以上増えない」と言い切れる値には<code>closed</code>がぴったりです。`
},

// ---------- 57 ----------
{
  n: 57, lv: "i", cat: "enum",
  concept: "enum<open> ── 将来増えるかもしれない値",
  explain: `将来アップデートで新しい値が追加される可能性があるなら<code>enum&lt;open&gt;</code>を使います。「まだ知らない未来の値」に備えて、後述するcase式で<strong>必ず「その他」の受け皿を用意</strong>する必要があります。`,
  example: `weapon_type := enum<open>:
    Sword
    Bow`,
  problem: `将来職業が追加される可能性を考えて、<code>enum&lt;open&gt;</code>で<b>job_type</b>(<b>Warrior</b>, <b>Mage</b>)を定義してください。`,
  answer: `job_type := enum<open>:
    Warrior
    Mage`,
  note: `<code>job_type</code>自体は「型」、<code>job_type.Warrior</code>が実際の「値」です。この区別を混同しないようにしましょう。`
},

// ---------- 58 ----------
{
  n: 58, lv: "i", cat: "enum",
  concept: "case式によるパターンマッチング",
  explain: `<code>case (値):</code>のあとに<code>パターン => 結果</code>を並べると、値に応じて分岐した結果を得られます。<code>enum&lt;open&gt;</code>を使うときは、想定外の値を受け止める<code>_ => 結果</code>を必ず用意します。`,
  example: `DescribeWeapon(W : weapon_type) : string =
    case (W):
        weapon_type.Sword => "白兵戦向きの武器"
        weapon_type.Bow   => "遠距離向きの武器"
        _                 => "未知の新武器"`,
  problem: `57問目の<code>job_type</code>を受け取り、<code>case</code>式で「Warrior→近接アタッカー」「Mage→遠距離アタッカー」「それ以外→未知の職業」と説明する関数<code>DescribeJob</code>を作ってください。`,
  answer: `DescribeJob(J : job_type) : string =
    case (J):
        job_type.Warrior => "近接アタッカー"
        job_type.Mage    => "遠距離アタッカー"
        _                => "未知の職業"

Print(DescribeJob(job_type.Warrior))`,
  note: `<code>enum&lt;closed&gt;</code>の場合はすべてのケースを網羅すれば<code>_</code>は省略できますが、<code>open</code>の場合は必須です。`
},

// ---------- 59 ----------
{
  n: 59, lv: "i", cat: "enum",
  concept: "enumをif条件やフィールドの型に使う",
  explain: `enumの値は、比較演算子<code>=</code>で他の値と比較したり、classやstructのフィールドの型として使ったりできます。ゲームの「状態」を表す値としてenumはとてもよく使われます。`,
  example: `battle_state := enum<closed>:
    Idle
    InBattle
    Victory

player := class:
    var State : battle_state = battle_state.Idle`,
  problem: `<code>battle_state</code>(上の例のもの)型の<b>var State</b>フィールドを持つ<code>arena</code>クラスを作り、<b>State</b>が<b>battle_state.Victory</b>のときだけ「勝利!」とPrintする<b>Announce()</b>メソッドを追加してください。<code>Arena{}</code>を作ってから<code>set Arena.State = battle_state.Victory</code>してから呼んでください。`,
  answer: `arena := class:
    var State : battle_state = battle_state.Idle

    Announce() : void =
        if (State = battle_state.Victory):
            Print("勝利!")

Arena := arena{}
set Arena.State = battle_state.Victory
Arena.Announce()`,
  note: `enumで状態を管理する設計は、上級編で扱う「状態機械(ステートマシン)」の基礎になります。`
},

// ---------- map ----------
{
  n: 60, lv: "i", cat: "map",
  concept: "mapの型とリテラル",
  explain: `mapは「キーと値のペア」をまとめて持つ辞書型のデータです。型は<code>[キーの型]値の型</code>、リテラルは<code>map{キー => 値, ...}</code>で書きます。`,
  example: `Inventory : [string]int = map{"薬草" => 3, "毒消し" => 1}
Print("{Inventory}")`,
  problem: `<b>Prices</b>という<b>[string]int</b>型のmapを、<b>"りんご" => 100</b>、<b>"みかん" => 80</b>の2要素で作り、Printしてください。`,
  answer: `Prices : [string]int = map{"りんご" => 100, "みかん" => 80}
Print("{Prices}")`,
  note: `キーには重複がないことが前提です。同じキーで2回登録すると、その挙動は保証されないので避けましょう。`
},

// ---------- 61 ----------
{
  n: 61, lv: "i", cat: "map",
  concept: "mapから値を取り出す(失敗コンテキスト)",
  explain: `<code>Map[キー]</code>で値を取り出せますが、そのキーが存在するとは限らないので、これは「失敗するかもしれない」操作です。<code>if (取り出した変数 := Map[キー], 条件):</code>のように、if文の中で安全に扱います。`,
  example: `Inventory : [string]int = map{"薬草" => 3}

if (Count := Inventory["薬草"], Count > 1):
    Print("使える! 残り{Count}個")
else:
    Print("足りません")`,
  problem: `60問目の<b>Prices</b>マップから<b>"りんご"</b>の値段を取り出し、<b>90円より高ければ"高級品"、そうでなければ"手頃"</b>とPrintしてください。`,
  answer: `if (ApplePrice := Prices["りんご"], ApplePrice > 90):
    Print("高級品")
else:
    Print("手頃")`,
  note: `配列のインデックスアクセスと同じように、mapのキーアクセスも「失敗するかもしれない」ため、必ずif文などの失敗コンテキストの中で扱います。`
},

// ---------- 62 ----------
{
  n: 62, lv: "i", cat: "map",
  concept: "mapへの挿入・更新(set)",
  explain: `mapは<code>var</code>で可変にしておけば、<code>set Map[キー] = 値</code>で新しいキーの追加や、既存のキーの値の更新ができます。`,
  example: `var Inventory : [string]int = map{"薬草" => 3}
set Inventory["薬草"] = 5        # 更新
set Inventory["毒消し"] = 1      # 追加
Print("{Inventory}")`,
  problem: `<b>var Scores : [string]int</b>を空の<code>map{}</code>で作り、<code>set</code>で<b>"たろう" => 90</b>と<b>"はなこ" => 85</b>を追加してからPrintしてください。`,
  answer: `var Scores : [string]int = map{}
set Scores["たろう"] = 90
set Scores["はなこ"] = 85
Print("{Scores}")`,
  note: `空のmapは<code>map{}</code>で作れます。あとから<code>set</code>で少しずつ育てていく使い方は、集計処理でとてもよく登場します。`
},

// ---------- 63 ----------
{
  n: 63, lv: "i", cat: "map",
  concept: "for (Key->Value : Map) でキーと値を両方取り出す",
  explain: `mapをforでくり返すときは、<code>for (キー変数 -> 値変数 : Map):</code>と書くと、キーと値の両方を1回のくり返しで受け取れます。`,
  example: `Inventory : [string]int = map{"薬草" => 3, "毒消し" => 1}

for (Name -> Count : Inventory):
    Print("{Name}: {Count}個")`,
  problem: `62問目の<b>Scores</b>マップを<code>for (Name -> Point : Scores)</code>でくり返し、<b>"たろう: 90点"</b>のような形式で全員分Printしてください。`,
  answer: `for (Name -> Point : Scores):
    Print("{Name}: {Point}点")`,
  note: `<code>-&gt;</code>という記号でキーと値を分けて受け取るのが、map専用のforの書き方です。`
},

// ---------- 64 ----------
{
  n: 64, lv: "i", cat: "map",
  concept: "mapとforのフィルタリングの組み合わせ",
  explain: `map版のforにも、配列のときと同じようにカンマで条件を追加してフィルタリングできます。「条件に合う要素だけ集めた新しい配列」を作れます。`,
  example: `Inventory : [string]int = map{"薬草" => 3, "毒消し" => 1, "エリクサー" => 5}

RareItems := for (Name -> Count : Inventory, Count >= 3):
    Name

Print("{RareItems}")`,
  problem: `62問目の<b>Scores</b>マップから、<b>88点以上の人の名前だけ</b>を集めた配列を<code>for</code>で作り、<b>Excellent</b>という変数に入れてPrintしてください。`,
  answer: `Excellent := for (Name -> Point : Scores, Point >= 88):
    Name

Print("{Excellent}")`,
  note: `mapのforも「値を作る式」であることに変わりありません。フィルタと変換を同時に行えるのが強みです。`
},

// ---------- 65 ----------
{
  n: 65, lv: "i", cat: "map",
  concept: "配列とforでmapを組み立てる(集計パターン)",
  explain: `配列をforでくり返しながら<code>var</code>のmapに<code>set</code>していくと、「配列の中身を数え上げてmapにする」という集計処理がよく書けます。`,
  example: `Items := array{"薬草", "毒消し", "薬草", "薬草"}

var Counted : [string]int = map{}
for (Item : Items):
    Current := Counted[Item] or 0
    set Counted[Item] = Current + 1

Print("{Counted}")   # → 薬草:3, 毒消し:1`,
  problem: `<code>Votes := array{"A", "B", "A", "C", "A", "B"}</code>を集計し、それぞれの文字が何回登場したかを<b>var Tally : [string]int</b>に集めてPrintしてください。`,
  answer: `Votes := array{"A", "B", "A", "C", "A", "B"}

var Tally : [string]int = map{}
for (V : Votes):
    Current := Tally[V] or 0
    set Tally[V] = Current + 1

Print("{Tally}")   # → A:3, B:2, C:1`,
  note: `<code>Counted[Item] or 0</code>は「キーがまだ無ければ0」というデフォルト値付きの取り出し方です(次の章で詳しく扱う<code>or</code>フォールバックの実例です)。`
},

// ---------- 66 ----------
{
  n: 66, lv: "i", cat: "map",
  concept: "weak_map ── プレイヤーごとのデータ管理",
  explain: `<code>weak_map(player, データ型)</code>は、プレイヤーをキーにしてデータを紐づけるための特別なmapです。プレイヤーがゲームを退出すると、そのデータも自動的に片付けられるという特徴があります(通常のmapよりメモリリークしにくい設計です)。`,
  example: `player_stats := struct:
    Level : int = 1

PlayerData : weak_map(player, player_stats) = map{}`,
  problem: `<b>Coins</b>(int, デフォルト<b>0</b>)を持つ<code>wallet</code>構造体を定義し、<code>weak_map(player, wallet)</code>型の<b>PlayerWallets</b>を空のmapで宣言してください(中身の操作はまだしなくてOK)。`,
  answer: `wallet := struct:
    Coins : int = 0

PlayerWallets : weak_map(player, wallet) = map{}`,
  note: `プレイヤーごとの所持金・レベル・進行状況などを管理するとき、通常のmapではなくweak_mapを選ぶのがVerseの定石です。`
},

// ---------- array応用 ----------
{
  n: 67, lv: "i", cat: "array応用",
  concept: "配列のFind",
  explain: `<code>配列.Find[値]</code>は、配列の中にその値があるかどうかを調べ、見つかった場合はその<strong>インデックス</strong>をoption(失敗するかもしれない値)として返します。if文の中で使うのが基本形です。`,
  example: `Items := array{"棒", "鉄の剣", "パン"}

if (ExistingIndex := Items.Find["鉄の剣"]):
    Print("{ExistingIndex}番目にあります")
else:
    Print("見つかりません")`,
  problem: `<b>Names := array{"たろう", "はなこ", "けんじ"}</b>を用意し、<code>Find</code>で<b>"はなこ"</b>を探して、<b>見つかった場合はそのインデックス</b>、<b>見つからなければ"該当なし"</b>とPrintしてください。`,
  answer: `Names := array{"たろう", "はなこ", "けんじ"}

if (Index := Names.Find["はなこ"]):
    Print("{Index}")
else:
    Print("該当なし")`,
  note: `<code>Find</code>は配列だけでなく、文字列の中の1文字を探すときなどにも使えます。`
},

// ---------- 68 ----------
{
  n: 68, lv: "i", cat: "array応用",
  concept: "forで配列からmapへ変換する",
  explain: `forは配列をmapに変換することもできます。<code>キー => 値</code>という形の式をforのブロック最後に置くと、その結果をmap型として集められます。`,
  example: `Names := array{"たろう", "はなこ", "けんじ"}

NameLengths := for (Name : Names):
    Name => Name.Length

Print("{NameLengths}")`,
  problem: `<code>Words := array{"猫", "います", "元気"}</code>を、それぞれの文字列とその文字数(<code>.Length</code>)を対応させたmapに<code>for</code>で変換し、<b>WordLengths</b>という変数に入れてPrintしてください。`,
  answer: `Words := array{"猫", "います", "元気"}

WordLengths := for (Word : Words):
    Word => Word.Length

Print("{WordLengths}")`,
  note: `forは「配列→配列」だけでなく「配列→map」への変換も同じ構文でこなせる、Verseの汎用的なくり返し構文です。`
},

// ---------- 69 ----------
{
  n: 69, lv: "i", cat: "array応用",
  concept: "配列同士の連結(+)",
  explain: `配列も文字列と同じように<code>+</code>で連結できます。2つの配列を1つにまとめた、新しい配列が返ります(元の配列は変化しません)。`,
  example: `Team1 := array{"たろう", "けん"}
Team2 := array{"はなこ", "みお"}
AllMembers := Team1 + Team2
Print("{AllMembers}")   # → (たろう, けん, はなこ, みお)`,
  problem: `<b>Fruits := array{"りんご", "ばなな"}</b>と<b>Vegetables := array{"人参", "玉ねぎ"}</b>を<code>+</code>で連結し、<b>AllFoods</b>という変数に入れてPrintしてください。`,
  answer: `Fruits := array{"りんご", "ばなな"}
Vegetables := array{"人参", "玉ねぎ"}
AllFoods := Fruits + Vegetables
Print("{AllFoods}")`,
  note: `<code>set 配列 += array{新要素}</code>という書き方も、内部的には「今の配列 + 新しい1要素の配列」を連結しているのと同じ考え方です。`
},

// ---------- 70 ----------
{
  n: 70, lv: "i", cat: "array応用",
  concept: "forの中で複数の失敗条件を連結する",
  explain: `forのフィルタ条件は1つに限らず、カンマで複数連結できます。「武器かどうか判定でき、なおかつダメージが基準値より大きい」のように、複数のハードルをすべて越えた要素だけを残せます。`,
  example: `Inventory := array{"棒", "鉄の剣", "パン", "光る盾"}

for (ItemName : Inventory, IsWeapon[ItemName], Damage := GetDamage[ItemName], Damage > 50):
    Print("強力な武器を発見: {ItemName}")`,
  problem: `<code>Scores := array{45, 82, 90, 58, 76, 95}</code>から、<b>60点以上、かつ90点未満</b>のスコアだけを<code>for</code>で集めて<b>MidRange</b>という変数に入れ、Printしてください。`,
  answer: `Scores := array{45, 82, 90, 58, 76, 95}

MidRange := for (S : Scores, S >= 60, S < 90):
    S

Print("{MidRange}")   # → (82, 76)`,
  note: `カンマ区切りの条件は、すべてがtrue(すべての操作が成功)になったときだけ、その要素が結果に残ります。`
},

// ---------- 71 ----------
{
  n: 71, lv: "i", cat: "array応用",
  concept: "空配列かどうかの判定",
  explain: `配列が空かどうかは<code>配列.Length &gt; 0</code>(要素がある)や<code>配列.Length = 0</code>(空)で判定するのが基本です。空配列に対して安全に処理を分岐させるのは、実務でとてもよく使うパターンです。`,
  example: `WarpPoints : []vector3 = array{}

if (WarpPoints.Length > 0):
    Print("ワープ先あり")
else:
    Print("ワープ先が登録されていません")`,
  problem: `<b>Queue : []string</b>を<b>array{}</b>(空)で作り、<b>Lengthが0なら"待機列は空です"、そうでなければ"{人数}人待っています"</b>とPrintしてください。`,
  answer: `Queue : []string = array{}

if (Queue.Length = 0):
    Print("待機列は空です")
else:
    Print("{Queue.Length}人待っています")`,
  note: `Verseの配列に「Nullや未定義」はありません。「空配列」という形で「何も無い」を安全に表現します。`
},

// ---------- 72 ----------
{
  n: 72, lv: "i", cat: "array応用",
  concept: "配列をmapに使ってグループ分けする",
  explain: `配列とmapを組み合わせると、「条件によってグループ分けする」という処理が書けます。for + if(失敗コンテキスト)+ varなmapという、これまで習った要素の総動員です。`,
  example: `Scores := array{45, 82, 90, 58, 76}

var Groups : [string]int = map{}
for (S : Scores):
    Key := if (S >= 60) then "合格" else "不合格"
    Current := Groups[Key] or 0
    set Groups[Key] = Current + 1

Print("{Groups}")   # → 合格:3, 不合格:2`,
  problem: `<code>Ages := array{5, 15, 25, 8, 42, 12}</code>を、<b>「12歳以下は"こども"、それ以外は"おとな"」</b>で2グループに分けて人数を数え、<b>var AgeGroups : [string]int</b>に集計してPrintしてください。`,
  answer: `Ages := array{5, 15, 25, 8, 42, 12}

var AgeGroups : [string]int = map{}
for (Age : Ages):
    Key := if (Age <= 12) then "こども" else "おとな"
    Current := AgeGroups[Key] or 0
    set AgeGroups[Key] = Current + 1

Print("{AgeGroups}")   # → こども:3, おとな:3`,
  note: `この「for + if + map集計」の組み合わせは、実務のスコアボードやランキング集計などで頻出するパターンです。`
},

// ---------- 失敗コンテキスト ----------
{
  n: 73, lv: "i", cat: "失敗という考え方",
  concept: "失敗コンテキストの正体",
  explain: `Verseには例外(try/catch)がありません。代わりに、「成功するか、失敗するか」という考え方が言語に組み込まれています。配列の範囲外アクセスやmapの存在しないキーへのアクセスなどは、エラーで止まるのではなく「失敗」として扱われ、<code>if</code>や<code>for</code>のような<strong>失敗コンテキスト</strong>の中で自然に処理されます。`,
  example: `Items := array{"剣", "盾"}

if (Item := Items[5]):     # 範囲外。「失敗」として扱われる
    Print(Item)
else:
    Print("その番号のアイテムはありません")`,
  problem: `<code>Items := array{"剣", "盾"}</code>から、存在しないインデックス<b>10</b>番目を<code>if</code>で取り出そうとして、失敗した場合に<b>"インデックスが範囲外です"</b>とPrintしてください。`,
  answer: `Items := array{"剣", "盾"}

if (Item := Items[10]):
    Print(Item)
else:
    Print("インデックスが範囲外です")`,
  note: `他の言語なら「クラッシュ」する場面が、Verseでは「if文のelse側に自然に流れる」だけで済みます。これがVerseの安全性の核です。`
},

// ---------- 74 ----------
{
  n: 74, lv: "i", cat: "失敗という考え方",
  concept: "複数のハードルをカンマでつなぐ",
  explain: `<code>if</code>のカッコの中にカンマで複数の式を並べると、それぞれが「ハードル」になります。前のハードルで手に入れた結果を、次のハードルでそのまま使えるのがポイントです。1つでも失敗すれば、全体がelse側に流れます。`,
  example: `if (Player := GetPlayerByName[Name],
    Score  := GetPlayerScore[Player],
    Score  > 100):
    Print("ハイスコア達成者です!")
else:
    Print("条件を満たしませんでした")`,
  problem: `<code>Inventory : [string]int = map{"薬草" => 3}</code>から<b>"薬草"</b>を取り出し(ハードル1)、その個数が<b>1より多いか</b>(ハードル2)を1つの<code>if</code>チェーンで判定し、成功したら<b>"使える! 残り{個数}個"</b>、失敗したら<b>"足りません"</b>とPrintしてください。`,
  answer: `Inventory : [string]int = map{"薬草" => 3}

if (Count := Inventory["薬草"], Count > 1):
    Print("使える! 残り{Count}個")
else:
    Print("足りません")`,
  note: `「検索して → その結果を使って検索して → その結果を判定する」という一連の流れを、1つの<code>if</code>で自然につなげられます。`
},

// ---------- 75 ----------
{
  n: 75, lv: "i", cat: "失敗という考え方",
  concept: "and / or / not と失敗",
  explain: `<code>and</code>は両方成功したときだけ成功、<code>or</code>はどちらか一方が成功すればOK(最初に成功したものが採用される「フォールバック」)、<code>not</code>は成功⇔失敗をひっくり返します。`,
  example: `Weapon := PrimaryWeapon[] or SecondaryWeapon[] or DefaultWeapon?`,
  problem: `<b>?string</b>型の<b>FavoriteColor</b>(中身なし、<code>false</code>)を用意し、<b>色が設定されていればそれを、なければ"白"をデフォルトとして使う</b><b>DisplayColor</b>を<code>or</code>で作ってPrintしてください。`,
  answer: `FavoriteColor : ?string = false
DisplayColor := FavoriteColor? or "白"
Print(DisplayColor)   # → 白`,
  note: `<code>値? or デフォルト値</code>は、option型から「あればそれを、なければデフォルトを」を1行で取り出す、非常によく使うイディオムです。`
},

// ---------- 76. option応用 ----------
{
  n: 76, lv: "i", cat: "option型応用",
  concept: "<decides> 指定子と失敗する関数",
  explain: `「失敗するかもしれない処理」を関数として書くときは、戻り値の型の前に<code>&lt;decides&gt;</code>という効果指定子を付けます。これは「この関数は成功か失敗かを"決める"、つまり失敗コンテキストの中でしか呼べない」という宣言です。`,
  example: `FindPath(Start : location, End : location)<decides> : path =
    DirectPath[Start, End] or
    PathAroundObstacles[Start, End] or
    ComplexPathfinding[Start, End]`,
  problem: `int配列<b>Numbers</b>と探したい値<b>Target</b>を受け取り、<code>Numbers.Find[Target]</code>の結果をそのまま返す<code>&lt;decides&gt;</code>関数<code>Locate</code>を定義し、<code>if (I := Locate(array{1,2,3}, 2)): Print("{I}")</code>のように呼び出してください。`,
  answer: `Locate(Numbers : []int, Target : int)<decides> : int =
    Numbers.Find[Target]

if (I := Locate(array{1, 2, 3}, 2)):
    Print("{I}")
else:
    Print("見つかりません")`,
  note: `<code>&lt;decides&gt;</code>な関数は、呼び出す側も<code>if</code>などの失敗コンテキストの中で使う必要があります。「失敗するかもしれない」という性質は、そのまま関数の外にも伝わっていきます。`
},

// ---------- 77 ----------
{
  n: 77, lv: "i", cat: "option型応用",
  concept: "optionを返す関数の設計",
  explain: `「値が見つからないかもしれない検索処理」を関数にするときは、戻り値の型を<code>?型</code>にするのも定番です。<code>option{値}</code>または<code>false</code>を返すことで、呼び出し側に「見つからないかもしれない」ことを型で伝えられます。`,
  example: `FindMemberByName(Names : []string, Target : string) : ?int =
    if (Index := Names.Find[Target]):
        option{Index}
    else:
        false`,
  problem: `string配列<b>Items</b>と<b>Target</b>を受け取り、<b>Targetが見つかればそのインデックスを?int型で返し、無ければfalseを返す</b>関数<code>SafeFind</code>を作り、呼び出し側でif文を使って結果を表示してください。`,
  answer: `SafeFind(Items : []string, Target : string) : ?int =
    if (Index := Items.Find[Target]):
        option{Index}
    else:
        false

if (Result := SafeFind(array{"剣", "盾"}, "盾")?):
    Print("{Result}")
else:
    Print("見つかりません")`,
  note: `<code>&lt;decides&gt;</code>と<code>?型を返す</code>は似ていますが、後者は「見つからなかった」という結果そのものを値として持ち運べるのが特徴です。`
},

// ---------- 78 ----------
{
  n: 78, lv: "i", cat: "option型応用",
  concept: "ネストしたoption的な失敗の連鎖",
  explain: `複数のoption/失敗しうる処理を連続で扱いたいときも、if文のカンマ連結がそのまま使えます。「AがあればBを試し、BがあればCを判定する」という一連の流れを1つのifにまとめられます。`,
  example: `PlayerInventories : [string][string]int = map{
    "たろう" => map{"薬草" => 3}
}

if (Inv := PlayerInventories["たろう"], Count := Inv["薬草"], Count > 0):
    Print("薬草を{Count}個持っています")
else:
    Print("見つかりませんでした")`,
  problem: `<code>Teams : [string][string]int = map{"赤" => map{"得点" => 10}}</code>から、<b>"赤"チーム</b>の<b>"得点"</b>を1つの<code>if</code>チェーンで取り出し、成功すれば<b>"赤チーム: {得点}点"</b>、失敗すれば<b>"データがありません"</b>とPrintしてください。`,
  answer: `Teams : [string][string]int = map{"赤" => map{"得点" => 10}}

if (Data := Teams["赤"], Points := Data["得点"]):
    Print("赤チーム: {Points}点")
else:
    Print("データがありません")`,
  note: `mapのmap(入れ子のmap)でも、失敗コンテキストの考え方は変わらず一貫しています。`
},

// ---------- 79 ----------
{
  n: 79, lv: "i", cat: "option型応用",
  concept: "block式で失敗コンテキストを区切る",
  explain: `<code>block:</code>は、複数の処理を1つのまとまりとして扱うための構文です。並行処理(sync/race)の中で複数行の処理をまとめたいときによく登場しますが、単独でも「この範囲だけの失敗コンテキスト」を作れます。`,
  example: `block:
    Print("1つ目の処理")
    Print("2つ目の処理")`,
  problem: `<code>block:</code>の中に、<b>"準備中..."</b>と<b>"準備完了"</b>という2つのPrintをまとめて書いてください。`,
  answer: `block:
    Print("準備中...")
    Print("準備完了")`,
  note: `<code>block</code>は上級編の並行処理(<code>race</code>の中で複数ステップをまとめる、など)で本格的に活躍します。`
},

// ---------- アクセス指定子 ----------
{
  n: 80, lv: "i", cat: "アクセス指定子",
  concept: "public / private の基本",
  explain: `<code>&lt;public&gt;</code>は「玄関」──どこからでもアクセス可能。<code>&lt;private&gt;</code>は「自分の日記」──定義した直後のスコープだけ。フィールドやメソッドの後ろに付けて、外部からの見え方をコントロールします。`,
  example: `inventory := class:
    var Items<private> : []item = array{}

    AddItem<public>(NewItem : item) : void =
        set Items += array{NewItem}`,
  problem: `<code>&lt;private&gt;</code>な可変フィールド<b>Diary</b>(string)を持つ<code>student</code>クラスを作り、外部から呼べる<code>&lt;public&gt;</code>な<b>WriteDiary(Text:string)</b>メソッドだけを使って書き込めるようにしてください。`,
  answer: `student := class:
    var Diary<private> : string = ""

    WriteDiary<public>(Text : string) : void =
        set Diary = Text

Me := student{}
Me.WriteDiary("今日はVerseを勉強した")`,
  note: `外から直接いじられたくないデータは<code>&lt;private&gt;</code>にし、決められた入り口(publicメソッド)だけを通すことで、意図しない書き換えを防げます。`
},

// ---------- 81 ----------
{
  n: 81, lv: "i", cat: "アクセス指定子",
  concept: "protected ── 継承先だけに公開する",
  explain: `<code>&lt;protected&gt;</code>は「家族専用のリビング」です。自分自身と、継承した子クラスだけがアクセスできます。まったくの外部からは見えません。`,
  example: `base_enemy := class:
    var Hp<protected> : int = 100

    Weaken<protected>() : void =
        set Hp -= 10`,
  problem: `<code>&lt;protected&gt;</code>な<b>var BasePower</b>(int, 初期値<b>10</b>)を持つ<code>weapon_base</code>クラスを作り、それを継承した<code>sword</code>クラスの中で<code>BasePower</code>を読み取って<b>2倍にした攻撃力</b>を返す<b>Attack() : int</b>メソッドを作ってください。`,
  answer: `weapon_base := class:
    var BasePower<protected> : int = 10

sword := class(weapon_base):
    Attack() : int = BasePower * 2

MySword := sword{}
Print("{MySword.Attack()}")   # → 20`,
  note: `protectedは「継承して使うことを前提に、外部には隠したい実装の詳細」に向いています。`
},

// ---------- 82 ----------
{
  n: 82, lv: "i", cat: "アクセス指定子",
  concept: "internal(既定)と scoped",
  explain: `何も指定しなかった場合の既定値は<code>&lt;internal&gt;</code>で、「同じモジュールの中だけ」からアクセスできます。さらに範囲を絞りたい場合は<code>&lt;scoped{モジュール名}&gt;</code>で「特定のモジュールにだけ見せる合鍵」を渡せます。`,
  example: `# 指定なし = internal(同じモジュール内だけ)
HelperFunction() : void = Print("モジュール内部専用")`,
  problem: `4つのアクセス指定子(<b>public</b>・<b>protected</b>・<b>internal</b>・<b>private</b>)を、アクセスできる範囲が<strong>広い順</strong>に並べてコメントとして書き出してください(コードは1行の連続コメントでOK)。`,
  answer: `# public(誰でも) > internal(同じモジュール内) > protected(自分+継承先) > private(定義直後のスコープのみ)`,
  note: `迷ったら「まずprivateにしておき、本当に外部から必要になったときだけ範囲を広げる」のが安全な設計の基本です。`
},

// ---------- 83 ----------
{
  n: 83, lv: "i", cat: "アクセス指定子",
  concept: "アクセス指定子とinterfaceの組み合わせ",
  explain: `interfaceを実装するメソッドに<code>&lt;public&gt;</code>と<code>&lt;override&gt;</code>を同時に付けることもよくあります。順番は<code>&lt;override&gt;</code>が先か後かよりも、「このメソッドは外部公開されていて、かつ親規格を上書きしている」ことが読み手に伝わることが重要です。`,
  example: `damageable := interface:
    TakeDamage(Amount : int) : void

character := class(damageable):
    var Health : int = 100
    TakeDamage<public><override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)`,
  problem: `<code>describable</code>インターフェース(<b>Describe() : string</b>)を実装した<code>book</code>クラスを作り、<code>Describe</code>メソッドに<code>&lt;public&gt;</code>と<code>&lt;override&gt;</code>の両方を付けて「面白い本です」を返すようにしてください。`,
  answer: `describable := interface:
    Describe() : string

book := class(describable):
    Describe<public><override>() : string = "面白い本です"

MyBook := book{}
Print(MyBook.Describe())`,
  note: `複数の指定子は<code>&lt;public&gt;&lt;override&gt;</code>のように連続して書けます。`
},

// ---------- 効果指定子 ----------
{
  n: 84, lv: "i", cat: "効果指定子",
  concept: "computes / converges ── 副作用のない関数",
  explain: `<code>&lt;computes&gt;</code>は「世界の状態を変えない、純粋な計算」であることを示す指定子です。<code>&lt;converges&gt;</code>は「必ずいつか処理が終わる(無限ループしない)」ことを示します。どちらも「この関数は安心して呼べる」という保証を表す成分表示です。`,
  example: `Square(X : int)<computes><converges> : int = X * X`,
  problem: `int型の<b>A</b>と<b>B</b>を受け取り、大きい方を返す関数<code>Bigger</code>を、<code>&lt;computes&gt;&lt;converges&gt;</code>を付けて定義してください。`,
  answer: `Bigger(A : int, B : int)<computes><converges> : int =
    if (A > B) then A else B`,
  note: `単純な計算だけを行う関数には、こうした効果指定子を付けることで「この関数は安全です」という情報をコンパイラと読み手の両方に伝えられます。`
},

// ---------- 85 ----------
{
  n: 85, lv: "i", cat: "効果指定子",
  concept: "decides と transacts",
  explain: `<code>&lt;decides&gt;</code>は「失敗するかもしれない(成功/失敗を決める)」処理、<code>&lt;transacts&gt;</code>は「世界の状態を変えるが、失敗したら全部なかったことになる(銀行取引のような)」処理を表します。`,
  example: `TakeDamage(Amount : int)<transacts> : void =
    set Health = Max(0, Health - Amount)`,
  problem: `int配列<b>Numbers</b>と<b>Target</b>を受け取り、<code>Numbers.Find[Target]</code>をそのまま返す関数<code>TryFind</code>を、正しい効果指定子(<code>&lt;decides&gt;</code>)を付けて定義してください。`,
  answer: `TryFind(Numbers : []int, Target : int)<decides> : int =
    Numbers.Find[Target]`,
  note: `<code>&lt;decides&gt;</code>と<code>&lt;transacts&gt;</code>はどちらも「失敗の可能性」を扱いますが、transactsは「状態変更を伴う失敗」に特化しています。`
},

// ---------- 86 ----------
{
  n: 86, lv: "i", cat: "効果指定子",
  concept: "suspends ── 時間をまたぐ処理",
  explain: `<code>&lt;suspends&gt;</code>は「時間をまたいで一時停止するかもしれない」ことを示します。<code>Sleep(...)</code>や後述の<code>sync</code>/<code>race</code>などを呼ぶ関数には必須です。<strong>&lt;suspends&gt;な関数を呼ぶ関数自身も&lt;suspends&gt;を宣言する必要があり</strong>、これは伝播していきます。`,
  example: `PlaySequence()<suspends> : void =
    Print("スタート")
    Sleep(2.0)
    Print("2秒後")`,
  problem: `「3秒カウントダウンしてから"スタート!"と表示する」<code>Countdown</code>関数を、<code>&lt;suspends&gt;</code>と<code>Sleep</code>を使って書いてください。`,
  answer: `Countdown()<suspends> : void =
    Print("3")
    Sleep(1.0)
    Print("2")
    Sleep(1.0)
    Print("1")
    Sleep(1.0)
    Print("スタート!")`,
  note: `<code>&lt;suspends&gt;</code>と<code>&lt;decides&gt;</code>は組み合わせられません。「一時停止するかもしれない」と「失敗するかもしれない」は、Verseでは意図的に別の枠組みとして扱われています。`
},

// ---------- 87 ----------
{
  n: 87, lv: "i", cat: "効果指定子",
  concept: "効果指定子の組み合わせルール",
  explain: `効果指定子は複数組み合わせられますが、同じものを重複させたり(<code>&lt;computes&gt;&lt;computes&gt;</code>はエラー)、矛盾する組み合わせ(<code>&lt;suspends&gt;</code>と<code>&lt;decides&gt;</code>)は使えません。関数の性質に応じて、必要な指定子だけを正しく選びましょう。`,
  example: `# OK: publicかつoverrideかつtransacts
TakeDamage<public><override>(Amount : int)<transacts> : void = void`,
  problem: `次の3つの関数それぞれに、最もふさわしい効果指定子を1つずつ選んでコメントで答えてください:
①「配列から要素を探し、見つからないかもしれない」関数
②「2秒待ってから処理を続ける」関数
③「何も状態を変えず、ただ足し算するだけ」の関数`,
  answer: `# ① <decides>  (失敗するかもしれない探索)
# ② <suspends> (時間をまたいで待つ)
# ③ <computes> (副作用のない純粋な計算)`,
  note: `効果指定子は「この関数が何をする(何をしない)か」を型システムのレベルで保証してくれる、Verseらしい安全機構です。`
},

// ---------- module ----------
{
  n: 88, lv: "i", cat: "moduleとusing",
  concept: "moduleの定義",
  explain: `<code>module</code>は関連するコードをまとめる入れ物です。<code>名前 := module:</code>のあと、インデントしたブロックに公開したい値や関数を並べます。フィールドには<code>&lt;public&gt;</code>を付けて、外部モジュールから使えるようにします。`,
  example: `GameConfig := module:
    MaxPlayers<public> : int = 100`,
  problem: `<b>ShopName</b>(string, <b>"verseショップ"</b>)と<b>TaxRate</b>(float, <b>0.1</b>)を公開フィールドとして持つ、<code>ShopConfig</code>というモジュールを定義してください。`,
  answer: `ShopConfig := module:
    ShopName<public> : string = "verseショップ"
    TaxRate<public> : float = 0.1`,
  note: `Verseでは、フォルダ構造そのものがモジュール構造になります。同じフォルダの<code>.verse</code>ファイルは「同じ教室の生徒」として扱われます。`
},

// ---------- 89 ----------
{
  n: 89, lv: "i", cat: "moduleとusing",
  concept: "using によるモジュールの読み込み",
  explain: `<code>using { パス }</code>をファイルの先頭に書くと、他のモジュールの機能を読み込めます。組み込みモジュールは<code>/Verse.org/Random</code>のような絶対パス形式、自分のプロジェクト内のモジュールは<code>using { ModuleName }</code>のように名前で読み込みます。`,
  example: `using { /Verse.org/Random }
using { /Fortnite.com/Devices }

GenerateValue() : float =
    GetRandomFloat(0.0, 1.0)`,
  problem: `<code>/Verse.org/Random</code>モジュールを<code>using</code>で読み込み、<code>GetRandomInt(1, 6)</code>(1〜6のランダムな整数、サイコロ)を返す<code>RollDice</code>関数を作ってください。`,
  answer: `using { /Verse.org/Random }

RollDice() : int =
    GetRandomInt(1, 6)

Print("{RollDice()}")`,
  note: `<code>using</code>は必ずファイルの先頭にまとめて書きます。パスは<code>/YourGame/Player/Inventory</code>のような形式で、世界中のどのモジュールも一意に指し示せる「住所」になっています。`
},

// ---------- 90 ----------
{
  n: 90, lv: "i", cat: "moduleとusing",
  concept: "名前の衝突を (モジュール名:) で解決する",
  explain: `2つの<code>using</code>したモジュールに同じ名前の関数があって衝突するときは、<code>(モジュール名:)関数名()</code>のように「どちらのモジュールの話か」を明示して呼び分けます。`,
  example: `using { CombatModule }
using { MagicModule }

ProcessDamage() : void =
    PhysicalDamage := (CombatModule:)CalculateDamage(100.0)
    MagicalDamage  := (MagicModule:)CalculateDamage(100.0)`,
  problem: `<code>WeaponModule</code>と<code>ArmorModule</code>という2つのモジュールを<code>using</code>し、両方に存在する<code>GetValue()</code>関数を、それぞれ<b>WeaponValue</b>・<b>ArmorValue</b>という変数に、名前を明示して呼び分けて代入してください。`,
  answer: `using { WeaponModule }
using { ArmorModule }

WeaponValue := (WeaponModule:)GetValue()
ArmorValue  := (ArmorModule:)GetValue()`,
  note: `この曖昧さ解消の書き方は、interfaceで同名メソッドが衝突したときの<code>(インターフェース名:)メソッド名</code>ともまったく同じ発想です。`
},

// ---------- 91 ----------
{
  n: 91, lv: "i", cat: "moduleとusing",
  concept: "moduleとclassを組み合わせた設計",
  explain: `moduleは、設定値(コンフィグ)をひとまとめにしたり、関連する関数群を整理したりするのによく使われます。classやenum、structをmoduleの中にまとめて、1つの機能単位として管理することもできます。`,
  example: `CombatModule := module:
    critical_hit_result<public> := enum<closed>:
        Hit
        Critical
        Miss

    CalculateDamage<public>(Base : int) : int = Base * 2`,
  problem: `<code>ScoreModule</code>というmoduleの中に、<b>rank_type</b>という<code>enum&lt;closed&gt;</code>(<b>Bronze</b>, <b>Silver</b>, <b>Gold</b>)と、点数からrank_typeを判定する<code>&lt;public&gt;</code>な関数<code>Judge(Score:int):rank_type</code>(90以上でGold、70以上でSilver、それ未満はBronze)を定義してください。`,
  answer: `ScoreModule := module:
    rank_type<public> := enum<closed>:
        Bronze
        Silver
        Gold

    Judge<public>(Score : int) : rank_type =
        if (Score >= 90) then rank_type.Gold
        else if (Score >= 70) then rank_type.Silver
        else rank_type.Bronze`,
  note: `<code>if ... else if ... else</code>のように<code>else</code>の直後にもう1つ<code>if</code>を続けると、3択以上の分岐も1つの式として書けます。`
},

// ---------- 92. 名前付き引数 ----------
{
  n: 92, lv: "i", cat: "名前付き引数",
  concept: "?引数によるデフォルト値",
  explain: `引数名の前に<code>?</code>を付けると「名前付き引数」になり、デフォルト値も指定できます。呼び出し側は、変えたい項目だけを<code>?引数名 := 値</code>で指定すればよく、それ以外はデフォルトのまま使われます。`,
  example: `Log(Message : string, ?Level : int = 1, ?Color : string = "white") : string =
    "[Lv{Level}] {Message} ({Color})"

Print(Log("起動しました"))
Print(Log("警告です", ?Level := 2))`,
  problem: `<b>Name</b>(必須の引数)と、名前付き引数<b>?Greeting</b>(デフォルト<b>"こんにちは"</b>)を受け取り、「{Greeting}、{Name}さん!」を返す<code>Welcome</code>関数を作り、デフォルトのままの呼び出しと<b>?Greeting := "おかえりなさい"</b>を指定した呼び出しの両方を試してください。`,
  answer: `Welcome(Name : string, ?Greeting : string = "こんにちは") : string =
    "{Greeting}、{Name}さん!"

Print(Welcome("ゆうた"))
Print(Welcome("みお", ?Greeting := "おかえりなさい"))`,
  note: `名前付き引数は「カスタムオーダー用紙」のようなもの。変えたい項目だけチェックを入れれば、残りは標準のまま作ってもらえます。`
},

// ---------- 93 ----------
{
  n: 93, lv: "i", cat: "名前付き引数",
  concept: "複数の名前付き引数を組み合わせる",
  explain: `名前付き引数はいくつでも定義でき、呼び出し時にはどれか一部だけを、順不同で指定できます。指定しなかったものはすべてデフォルト値になります。`,
  example: `CreateEnemy(Name : string, ?Hp : int = 100, ?Speed : float = 1.0) : void =
    Print("{Name} HP:{Hp} Speed:{Speed}")

CreateEnemy("ゴブリン")
CreateEnemy("ボス", ?Hp := 5000, ?Speed := 0.5)`,
  problem: `<b>Title</b>(必須)、<b>?Volume</b>(int, デフォルト<b>50</b>)、<b>?Loop</b>(logic, デフォルト<b>false</b>)を受け取る<code>PlayMusic</code>関数を作り、「Titleだけ指定した呼び出し」と「TitleとLoopだけ指定した呼び出し」の両方を書いてください(中身はPrintでよい)。`,
  answer: `PlayMusic(Title : string, ?Volume : int = 50, ?Loop : logic = false) : void =
    Print("{Title} vol:{Volume} loop:{Loop}")

PlayMusic("戦闘テーマ")
PlayMusic("街のBGM", ?Loop := true)`,
  note: `名前付き引数は、引数の数が増えてきた関数の呼び出しを読みやすく保つのにとても有効です。`
},

// ---------- 94 ----------
{
  n: 94, lv: "i", cat: "拡張メソッド",
  concept: "既存の型に拡張メソッドを追加する",
  explain: `<code>(変数名 : 型).メソッド名(引数) : 戻り値の型 = 処理</code>という書き方で、<code>int</code>や<code>string</code>のような既存の型にさえ、あとから新しいメソッドを「後付け」できます。`,
  example: `(N : int).Double() : int = N * 2

X := 5
Y := X.Double()   # → 10`,
  problem: `<code>string</code>型に、「<b>!!!</b>」を3つ末尾につけて強調する<code>Shout()</code>という拡張メソッドを追加し、<code>"やったね".Shout()</code>を呼んでください。`,
  answer: `(S : string).Shout() : string = S + "!!!"

Print("やったね".Shout())   # → やったね!!!`,
  note: `拡張メソッドは「スマホにあとからバンカーリングを付ける」ようなもの。元の型を作り直さなくても、便利な機能を外側から追加できます。`
},

// ---------- 95 ----------
{
  n: 95, lv: "i", cat: "拡張メソッド",
  concept: "配列に拡張メソッドを追加する",
  explain: `拡張メソッドは<code>[]int</code>のような配列型にも追加できます。よく使う集計処理を拡張メソッドにしておくと、まるで標準機能のように呼び出せて便利です。`,
  example: `(Numbers : []int).Sum() : int =
    var Total : int = 0
    for (N : Numbers):
        set Total += N
    Total

Print("{array{1, 2, 3}.Sum()}")   # → 6`,
  problem: `<code>[]int</code>型に、配列の中の<b>最大値</b>を返す拡張メソッド<code>Max2()</code>を追加してください(配列は必ず1要素以上ある前提でOKです)。<code>array{4, 9, 2, 7}.Max2()</code>を呼んでください。`,
  answer: `(Numbers : []int).Max2() : int =
    var Best : int = Numbers[0]
    for (N : Numbers):
        if (N > Best):
            set Best = N
    Best

Print("{array{4, 9, 2, 7}.Max2()}")   # → 9`,
  note: `<code>Max</code>という名前は組み込み関数と衝突する可能性があるので、練習用に<code>Max2</code>という名前にしています。実務では衝突しない名前を選びましょう。`
},

// ---------- 96 ----------
{
  n: 96, lv: "i", cat: "拡張メソッド",
  concept: "structへの拡張メソッド",
  explain: `拡張メソッドは自分で定義したstruct型にも追加できます。struct自体はメソッドを持てませんが、拡張メソッドを使えば「後付けの振る舞い」を実現できます。`,
  example: `point := struct:
    X : float = 0.0
    Y : float = 0.0

(P : point).DistanceFromOrigin() : float =
    (P.X * P.X + P.Y * P.Y)`,
  problem: `<code>point</code>構造体に、原点(0,0)からの距離の2乗を返す拡張メソッド<code>SquaredDistance()</code>を追加し、<code>point{X := 3.0, Y := 4.0}.SquaredDistance()</code>をPrintしてください。`,
  answer: `(P : point).SquaredDistance() : float =
    P.X * P.X + P.Y * P.Y

Print("{point{X := 3.0, Y := 4.0}.SquaredDistance()}")   # → 25.0`,
  note: `「structはデータだけ、振る舞いは拡張メソッドで外付け」という組み合わせは、Verseらしい設計パターンの1つです。`
},

// ---------- 並行処理 sync ----------
{
  n: 97, lv: "i", cat: "並行処理 sync",
  concept: "sync ── 全員そろうまで待つ",
  explain: `<code>sync:</code>ブロックの中に複数の処理を並べると、それらが並行に実行され、<strong>すべて完了してから次に進みます</strong>。sync自体を含む関数には<code>&lt;suspends&gt;</code>が必要です。`,
  example: `LoadAll()<suspends> : void =
    Results := sync:
        LoadTexture()
        LoadSound()
        LoadModel()
    Print("全部読み込み完了")`,
  problem: `<code>OpenDoor()</code>、<code>PlaySound()</code>、<code>TurnOnLight()</code>という3つの処理を<code>sync</code>で並行実行し、すべて終わったら「準備完了!」と表示する<code>&lt;suspends&gt;</code>関数<code>Prepare</code>を書いてください。`,
  answer: `Prepare()<suspends> : void =
    sync:
        OpenDoor()
        PlaySound()
        TurnOnLight()
    Print("準備完了!")`,
  note: `複数の準備作業を1つずつ順番に待つより、syncでまとめて並行に走らせた方がずっと速く終わります。`
},

// ---------- 98 ----------
{
  n: 98, lv: "i", cat: "並行処理 sync",
  concept: "syncの結果をタプルとして受け取る",
  explain: `<code>sync:</code>の結果を変数に代入すると、各処理の戻り値がタプルとして受け取れます。<code>Results(0)</code>、<code>Results(1)</code>のようにインデックスでアクセスします。`,
  example: `Results := sync:
    LoadTexture()
    LoadSound()
    LoadModel()

ProcessData(Results(0), Results(1), Results(2))`,
  problem: `<code>GetPlayerLevel() : int</code>と<code>GetPlayerName() : string</code>という2つの関数(中身は適当な値をreturnでOK)を<code>sync</code>で並行実行し、その結果のタプルから両方の値を取り出してPrintする<code>&lt;suspends&gt;</code>関数を書いてください。`,
  answer: `GetPlayerLevel() : int = 5
GetPlayerName() : string = "ゆうた"

ShowProfile()<suspends> : void =
    Results := sync:
        GetPlayerLevel()
        GetPlayerName()
    Print("{Results(1)} Lv.{Results(0)}")`,
  note: `syncの結果はタプルなので、途中で1つの処理の型を変更すると、他の取り出し箇所の番号がズレやすい点には注意しましょう。`
},

// ---------- 99 ----------
{
  n: 99, lv: "i", cat: "並行処理 race",
  concept: "race ── 早い者勝ち",
  explain: `<code>race:</code>は複数の処理を並行実行し、<strong>最初に完了した処理の結果だけ</strong>を受け取ります。残りの処理は自動的にキャンセルされます。「本来の処理」と「制限時間のSleep」を競わせる、タイムアウトの定番パターンです。`,
  example: `WaitForAnswerOrTimeout()<suspends> : void =
    race:
        block:
            WaitForAnswer()
            Print("正解しました!")
        block:
            Sleep(5.0)
            Print("時間切れです")`,
  problem: `「なぞなぞに正解する処理(<code>WaitForAnswer()</code>)」と「<b>3秒のタイムアウト</b>」を<code>race</code>で競わせ、先にゴールした方に応じてメッセージを出し分ける<code>&lt;suspends&gt;</code>関数を書いてください。`,
  answer: `QuizChallenge()<suspends> : void =
    race:
        block:
            WaitForAnswer()
            Print("正解しました!")
        block:
            Sleep(3.0)
            Print("時間切れです")`,
  note: `複数行の処理をraceの1枝としてまとめたいときは、<code>block:</code>で囲みます。`
},

// ---------- 100 ----------
{
  n: 100, lv: "i", cat: "並行処理 race",
  concept: "raceによるタイムアウトパターンの定式化",
  explain: `「時間内に終わらなければ諦める」という設計は、実務で非常によく登場します。<code>race</code>の中に「本来やりたい処理」と「制限時間のSleep」を並べるだけで、複雑なタイマー管理なしにタイムアウトを実現できます。`,
  example: `ProcessWithTimeout()<suspends> : void =
    race:
        LongTask()
        Sleep(10.0)`,
  problem: `重い処理<code>HeavyCalculation()</code>を、<b>4秒でタイムアウト</b>させる形で<code>race</code>を使って実行する<code>&lt;suspends&gt;</code>関数<code>SafeCalculate</code>を書いてください(中身のPrintは無くてOK)。`,
  answer: `SafeCalculate()<suspends> : void =
    race:
        HeavyCalculation()
        Sleep(4.0)`,
  note: `このパターンさえ覚えておけば、「時間制限つきの処理」はほとんどの場面で対応できます。`
},

// ---------- 101 ----------
{
  n: 101, lv: "i", cat: "並行処理 race",
  concept: "raceとif式を組み合わせた結果分岐",
  explain: `raceの中の各枝は、それぞれ完了時にログを出したり、フラグを立てたりすることもよくあります。「どちらが勝ったか」に応じて後続処理を変えたいときは、raceの外側でmutable変数を用意し、各ブロックの中でsetする設計がよく使われます。`,
  example: `var Winner : string = "未定"

race:
    block:
        WaitForAnswer()
        set Winner = "プレイヤー"
    block:
        Sleep(5.0)
        set Winner = "タイムアウト"

Print("{Winner}が先にゴールしました")`,
  problem: `<code>var Result : string = "進行中"</code>を用意し、<code>race</code>の中で「<code>AttackEnemy()</code>成功時は"勝利"」「<b>8秒のSleep</b>でタイムアウトしたら"敗北"」を<code>Result</code>にsetし、最後にPrintする<code>&lt;suspends&gt;</code>関数を書いてください。`,
  answer: `Battle()<suspends> : void =
    var Result : string = "進行中"

    race:
        block:
            AttackEnemy()
            set Result = "勝利"
        block:
            Sleep(8.0)
            set Result = "敗北"

    Print(Result)`,
  note: `raceの外側で結果を受け取るための「入れ物」をあらかじめ用意しておく設計は、この後の上級編でも頻出します。`
},

// ---------- rush/branch/spawn ----------
{
  n: 102, lv: "i", cat: "rush・branch・spawn",
  concept: "rush ── 一番乗りを見ながら、他も走らせ続ける",
  explain: `<code>rush</code>は<code>race</code>と似ていますが、<strong>最初の完了は教えてくれつつも、残りのタスクをキャンセルせず裏側で走らせ続けます</strong>。「速い応答」と「完全な処理の完了」の両方が欲しいときに向いています。`,
  example: `FirstResult := rush:
    UpdateUI()
    SaveToServer()`,
  problem: `<code>rush</code>を使い、<code>UpdateUI()</code>(先に終わってほしい)と<code>SaveData()</code>(裏側で最後まで完了させたい)を同時に走らせる<code>&lt;suspends&gt;</code>関数<code>SyncAndSave</code>を書いてください。`,
  answer: `SyncAndSave()<suspends> : void =
    rush:
        UpdateUI()
        SaveData()`,
  note: `<code>race</code>は「1着以外は失格(キャンセル)」、<code>rush</code>は「1着はすぐ知らせるが、全員完走させる」という違いがあります。`
},

// ---------- 103 ----------
{
  n: 103, lv: "i", cat: "rush・branch・spawn",
  concept: "branch ── 打ち上げ花火",
  explain: `<code>branch:</code>は、処理を開始してすぐに次へ進みます。「打ち上げ花火」のイメージで、結果を待たずにバックグラウンドで走らせておきたいときに使います。ただし、その場面(スコープ)が終わると花火(branchのタスク)も自動的に片付けられます。`,
  example: `branch:
    PlayBackgroundEffect()
    UpdateSystemAsync()
# ここにはすぐ到達する(バックグラウンドはまだ実行中)`,
  problem: `<code>branch</code>を使って「花火の演出(<code>PlayFireworks()</code>)」を打ち上げつつ、その場ですぐに<b>"次の処理に進みます"</b>とPrintするコードを書いてください。`,
  answer: `branch:
    PlayFireworks()

Print("次の処理に進みます")`,
  note: `branchは「その場の処理が終わったら片付けられる」点が、次に習うspawnとの大きな違いです。`
},

// ---------- 104 ----------
{
  n: 104, lv: "i", cat: "rush・branch・spawn",
  concept: "spawn と task型 ── スコープを超えて生き続ける",
  explain: `<code>spawn{ 処理 }</code>は、<code>task(型)</code>型の値を返します。branchと違い、<strong>呼び出し元のスコープが終わっても、タスクは生き続けます</strong>。<code>.Cancel()</code>でキャンセルを依頼し、<code>.Await()</code>で完了を待って結果を受け取れます。`,
  example: `BackgroundTask : task(int) = spawn{ LongRunningWork() }

BackgroundTask.Cancel()
Result : int = BackgroundTask.Await()`,
  problem: `<code>MonitorServer() : void</code>という処理を<code>spawn</code>で起動して<b>ServerTask</b>という<code>task(void)</code>型の変数に入れ、その後で<code>ServerTask.Cancel()</code>を呼んでください。`,
  answer: `ServerTask : task(void) = spawn{ MonitorServer() }
ServerTask.Cancel()`,
  note: `spawnは「独立した長期プロジェクト」。担当者(呼び出し元)がすでにいなくなっていても、プロジェクト自体はスコープをまたいで生き続けます。`
},

// ---------- 105 ----------
{
  n: 105, lv: "i", cat: "rush・branch・spawn",
  concept: "5つの並行処理キーワードの使い分け",
  explain: `<code>sync</code>(全員待つ)・<code>race</code>(1着以外は失格)・<code>rush</code>(1着を見つつ全員完走)・<code>branch</code>(発射して次へ、スコープが終われば片付く)・<code>spawn</code>(スコープを超えて生き続ける)。この5つの使い分けを整理しておきましょう。`,
  example: `sync   全員待つ
race   一番だけ、他は中止
rush   一番を見つつ全員継続
branch 発射して次へ(スコープ内)
spawn  スコープ超えて独立`,
  problem: `次の3つの場面に、最もふさわしいキーワード(sync/race/rush/branch/spawnのいずれか)を1つずつコメントで答えてください:
①「敵を倒す処理」と「3秒のタイムアウト」を競わせたい
②複数の初期化処理をまとめて、全部終わってから次に進みたい
③ゲーム全体が続く限りバックグラウンドで動き続ける天候システムを起動したい`,
  answer: `# ① race  (最速の結果だけ欲しい、タイムアウトパターン)
# ② sync  (全員そろうまで待つ)
# ③ spawn (スコープをまたいで生き続ける常駐処理)`,
  note: `迷ったときは「結果を待つ必要があるか」「他を中断してよいか」「スコープを超えて生きる必要があるか」の3点で考えると選びやすくなります。`
},

// ---------- ジェネリクス基礎 ----------
{
  n: 106, lv: "i", cat: "ジェネリクス基礎",
  concept: "type を引数のように受け取る",
  explain: `<code>(X : t where t : type)</code>のように書くと、<code>t</code>という「型そのもの」を引数のように扱えます。呼び出すときの実際の型に応じて、同じロジックがそのまま使い回せます。`,
  example: `Identity(X : t where t : type) : t = X

Identity(42)            # t は int
Identity("こんにちは")   # t は string`,
  problem: `<code>Identity</code>を参考に、受け取った値をそのまま配列に1つだけ入れて返すジェネリック関数<code>Wrap</code>を作り、<code>Wrap(5)</code>と<code>Wrap("hello")</code>の両方をPrintしてください。`,
  answer: `Wrap(X : t where t : type) : []t = array{X}

Print("{Wrap(5)}")
Print("{Wrap("hello")}")`,
  note: `戻り値の型にも<code>t</code>をそのまま使えるので、「受け取った型と同じ型の配列」を返す関数が1つの定義で書けます。`
},

// ---------- 107 ----------
{
  n: 107, lv: "i", cat: "ジェネリクス基礎",
  concept: "関数のオーバーロード",
  explain: `同じ名前の関数を、引数の型ごとに複数定義できます(オーバーロード)。呼び出し側は、渡した引数の型に応じて自動的に正しいバージョンが選ばれます。`,
  example: `Process(Value : int)   : string = "整数です: {Value}"
Process(Value : float) : string = "小数です: {Value}"`,
  problem: `<code>Describe</code>という関数を、<b>int版</b>("これは整数の{値}です")と<b>string版</b>("これは文字列の{値}です")の2つ定義し、<code>Describe(5)</code>と<code>Describe("犬")</code>の両方をPrintしてください。`,
  answer: `Describe(Value : int) : string = "これは整数の{Value}です"
Describe(Value : string) : string = "これは文字列の{Value}です"

Print(Describe(5))
Print(Describe("犬"))`,
  note: `オーバーロードとジェネリクスは似ていますが、オーバーロードは「型ごとに違う処理」、ジェネリクスは「型が違っても同じ処理」という使い分けです。`
},

// ---------- 108 ----------
{
  n: 108, lv: "i", cat: "ジェネリクス基礎",
  concept: "ジェネリックなクラス",
  explain: `structと同じように、classにも型パラメータを付けられます。「どんな型の中身でも保持できる箱型のクラス」を作れます。`,
  example: `box(t : type) := class:
    var Content : t

    Get() : t = Content

IntBox := box(int){Content := 100}
Print("{IntBox.Get()}")`,
  problem: `<code>box</code>を参考に、中身を後から<code>Set</code>で差し替えられるジェネリックなクラス<code>slot(t : type)</code>を作り、<code>slot(string){Content := "初期値"}</code>を作ってから<code>Set("新しい値")</code>し、<code>Get()</code>の結果をPrintしてください。`,
  answer: `slot(t : type) := class:
    var Content : t

    Get() : t = Content
    Set(NewValue : t) : void =
        set Content = NewValue

MySlot := slot(string){Content := "初期値"}
MySlot.Set("新しい値")
Print(MySlot.Get())`,
  note: `ジェネリッククラスはclassなので参照セマンティクス(共有)である点にも注意しましょう。`
},

// ---------- 総合 ----------
{
  n: 109, lv: "i", cat: "中級総合演習",
  concept: "struct・enum・class・option を組み合わせる",
  explain: `ここからは中級編の総まとめです。struct(データ)・enum(状態や種別)・class(振る舞い)・option(失敗の可能性)を組み合わせて、実際にありそうなミニシステムを作ってみましょう。`,
  example: `item_category := enum<open>:
    Weapon
    Potion

item := struct:
    Name : string = ""
    Category : item_category = item_category.Potion
    Count : int = 1

inventory_box := class:
    var Items<private> : []item = array{}

    AddItem<public>(NewItem : item) : void =
        set Items += array{NewItem}

    FindByName<public>(Target : string) : ?item =
        for (I : Items, I.Name = Target):
            return option{I}
        false`,
  problem: `上の<code>inventory_box</code>を使い、<b>item{Name := "伝説の剣", Category := item_category.Weapon}</b>を1つ追加してから、<code>FindByName("伝説の剣")</code>で検索して、見つかった場合はその<b>Name</b>をPrintしてください。`,
  answer: `MyBag := inventory_box{}
MyBag.AddItem(item{Name := "伝説の剣", Category := item_category.Weapon})

if (Found := MyBag.FindByName("伝説の剣")?):
    Print(Found.Name)
else:
    Print("見つかりません")`,
  note: `<code>&lt;private&gt;</code>なフィールドと<code>&lt;public&gt;</code>なメソッドの組み合わせは、外部から中身を直接いじらせない「カプセル化」の基本形です。`
},

// ---------- 110 ----------
{
  n: 110, lv: "i", cat: "中級総合演習",
  concept: "mapとenumを組み合わせたランキング集計",
  explain: `map・enum・for・failure contextを組み合わせて、「ランク別の人数集計」のような、実務でありそうな処理を書いてみましょう。`,
  example: `rank_type := enum<closed>:
    Bronze
    Silver
    Gold

JudgeRank(Score : int) : rank_type =
    if (Score >= 90) then rank_type.Gold
    else if (Score >= 70) then rank_type.Silver
    else rank_type.Bronze`,
  problem: `上の<code>JudgeRank</code>を使い、<code>Scores := array{95, 60, 78, 88, 100, 45}</code>それぞれのランクを判定し、<b>var RankCount : [rank_type]int</b>にランクごとの人数を集計してPrintしてください。`,
  answer: `Scores := array{95, 60, 78, 88, 100, 45}

var RankCount : [rank_type]int = map{}
for (S : Scores):
    R := JudgeRank(S)
    Current := RankCount[R] or 0
    set RankCount[R] = Current + 1

Print("{RankCount}")`,
  note: `mapのキーにはstringだけでなく、enumのようなVerseの基本的な値も使えます。`
},

// ---------- 111 ----------
{
  n: 111, lv: "i", cat: "中級総合演習",
  concept: "interfaceと配列を使ったイベント処理設計",
  explain: `interfaceを実装した複数のクラスをまとめて配列に入れ、forで一括処理する設計は、ゲームの「複数の敵に一斉にダメージを与える」ような場面で頻出します。`,
  example: `Enemies : []damageable = array{character{}, barrel{}}

DamageAll(Targets : []damageable, Amount : int) : void =
    for (Target : Targets):
        Target.TakeDamage(Amount)`,
  problem: `<code>interactable</code>を実装した<code>chest</code>と<code>door</code>(52・55問目のもの)を配列にまとめ、<b>すべてのオブジェクトのInteract()を呼ぶ</b>汎用関数<code>InteractAll(Targets : []interactable) : void</code>を作り、実際に2つのオブジェクトで呼んでください。`,
  answer: `InteractAll(Targets : []interactable) : void =
    for (Target : Targets):
        Target.Interact()

InteractAll(array{chest{}, door{}})`,
  note: `「interface型の配列 + for」という組み合わせは、Verseで多態性(ポリモーフィズム)を実現する最も基本的な形です。上級編でさらに深掘りします。`
},

// ---------- 112 ----------
{
  n: 112, lv: "i", cat: "中級総合演習",
  concept: "moduleにconfigとロジックをまとめる",
  explain: `moduleの中にenum・struct・関数をまとめておくと、「ショップ機能一式」のように、関連する要素をひとかたまりとして管理・再利用しやすくなります。`,
  example: `ShopModule := module:
    item_data<public> := struct:
        Name : string = ""
        Price : int = 0

    ApplyDiscount<public>(Price : int, Percent : int) : int =
        Price * (100 - Percent) / 100`,
  problem: `<code>ShopModule</code>を参考に、<code>TaxModule</code>というmoduleの中に、<b>税込み価格を計算する</b><code>&lt;public&gt;</code>関数<code>WithTax(Price:int, ?TaxPercent:int = 10):int</code>を定義し、<code>WithTax(1000)</code>をPrintしてください。`,
  answer: `TaxModule := module:
    WithTax<public>(Price : int, ?TaxPercent : int = 10) : int =
        Price * (100 + TaxPercent) / 100

Print("{TaxModule.WithTax(1000)}")`,
  note: `moduleの中の関数を呼ぶときは、<code>using</code>していれば直接、そうでなければ<code>ModuleName.関数名()</code>のようにモジュール名を経由して呼べます。`
},

// ---------- 113 ----------
{
  n: 113, lv: "i", cat: "中級総合演習",
  concept: "並行処理とclassを組み合わせる",
  explain: `classのメソッドに<code>&lt;suspends&gt;</code>を付ければ、その中でsyncやraceを使った並行処理を書けます。「タイムアウトつきのチャレンジ」をクラスのメソッドとしてまとめる設計は、実務でもよく見る形です。`,
  example: `challenge := class:
    RunWithTimeout(Seconds : float)<suspends> : string =
        race:
            block:
                DoTask()
                return "成功"
            block:
                Sleep(Seconds)
                return "タイムアウト"`,
  problem: `<code>DoQuiz()</code>という処理を持つ<code>quiz_runner</code>クラスを作り、<b>Start(TimeLimit : float)&lt;suspends&gt; : string</b>というメソッドで、<code>race</code>を使って<b>DoQuiz()が先に終われば"正解"、TimeLimit秒経てば"時間切れ"</b>を返すようにしてください。`,
  answer: `quiz_runner := class:
    Start(TimeLimit : float)<suspends> : string =
        race:
            block:
                DoQuiz()
                return "正解"
            block:
                Sleep(TimeLimit)
                return "時間切れ"`,
  note: `<code>return</code>を使うと、raceの枝の途中からでも即座に関数の戻り値を確定させられます。`
},

// ---------- 114 ----------
{
  n: 114, lv: "i", cat: "中級総合演習",
  concept: "weak_mapとclassでプレイヤーデータを管理する",
  explain: `weak_mapとclassを組み合わせると、「プレイヤーごとに、可変で複雑なデータを保持する」システムの土台ができます。実際のゲームのスコアボードやセーブデータ管理の第一歩です。`,
  example: `player_progress := class:
    var Level : int = 1
    var Exp : int = 0

PlayerProgressMap : weak_map(player, player_progress) = map{}`,
  problem: `<code>player_progress</code>クラス(上の例のもの)と<code>weak_map(player, player_progress)</code>型の<b>ProgressMap</b>を用意し、あるプレイヤー<b>P</b>のデータが無ければ<code>player_progress{}</code>を新規作成して登録し、あればそれをそのまま返す関数<code>GetOrCreate(P : player) : player_progress</code>を作ってください。`,
  answer: `player_progress := class:
    var Level : int = 1
    var Exp : int = 0

ProgressMap : weak_map(player, player_progress) = map{}

GetOrCreate(P : player) : player_progress =
    if (Existing := ProgressMap[P]):
        Existing
    else:
        NewProgress := player_progress{}
        set ProgressMap[P] = NewProgress
        NewProgress`,
  note: `「無ければ作って登録、あればそれを返す」というこのパターンは、プレイヤーデータ管理における定番中の定番です。`
},

// ---------- 115 ----------
{
  n: 115, lv: "i", cat: "中級総合演習",
  concept: "拡張メソッドとoptionを組み合わせる",
  explain: `拡張メソッドの戻り値をoption型にすることで、「既存の型に、失敗するかもしれない便利機能」を後付けできます。`,
  example: `(Numbers : []int).SafeFirst() : ?int =
    if (Numbers.Length > 0):
        option{Numbers[0]}
    else:
        false`,
  problem: `<code>[]int</code>型に、配列の<b>最後の要素</b>を安全に取り出す拡張メソッド<code>SafeLast() : ?int</code>を追加し、<code>array{1,2,3}.SafeLast()</code>と<code>array{}.SafeLast()</code>の両方の結果をif文でPrintしてください。`,
  answer: `(Numbers : []int).SafeLast() : ?int =
    if (Numbers.Length > 0):
        option{Numbers[Numbers.Length - 1]}
    else:
        false

if (Last := array{1, 2, 3}.SafeLast()?):
    Print("{Last}")
else:
    Print("空です")

if (Last2 := array{}.SafeLast()?):
    Print("{Last2}")
else:
    Print("空です")`,
  note: `「失敗するかもしれない拡張メソッド」を用意しておくと、呼び出し側は常にif文で安全に扱えるようになります。`
},

// ---------- 116 ----------
{
  n: 116, lv: "i", cat: "中級総合演習",
  concept: "interfaceとenumで状態に応じた振る舞いを変える",
  explain: `enumで「今どの状態か」を管理しつつ、状態ごとの振る舞いをcase式で分岐させる設計は、次の上級編で学ぶ「状態機械」の入り口です。`,
  example: `npc_state := enum<closed>:
    Idle
    Talking
    Fighting

DescribeState(S : npc_state) : string =
    case (S):
        npc_state.Idle     => "ぼーっとしている"
        npc_state.Talking  => "話しかけている"
        npc_state.Fighting => "戦っている"`,
  problem: `<code>npc_state</code>型の<b>var State</b>フィールドを持つ<code>npc</code>クラスを作り、<b>ReactToPlayer()</b>メソッドで、<code>DescribeState(State)</code>の結果をPrintするようにしてください。<code>Npc{}</code>を作ってから<code>set Npc.State = npc_state.Fighting</code>して呼んでください。`,
  answer: `npc := class:
    var State : npc_state = npc_state.Idle

    ReactToPlayer() : void =
        Print(DescribeState(State))

Npc := npc{}
set Npc.State = npc_state.Fighting
Npc.ReactToPlayer()   # → 戦っている`,
  note: `「enumで状態管理 + caseで振る舞いを分岐」という組み合わせは、この後の上級編で本格的な状態機械として発展させます。`
},

// ---------- 117 ----------
{
  n: 117, lv: "i", cat: "中級総合演習",
  concept: "再帰関数の基本",
  explain: `関数は自分自身を呼び出すこともできます(再帰)。「階乗の計算」は再帰の定番例です。<code>N!</code>は「N × (N-1)!」、そして「0! = 1」という土台(ベースケース)の組み合わせで定義できます。`,
  example: `Factorial(N : int) : int =
    if (N <= 0) then 1 else N * Factorial(N - 1)

Print("{Factorial(5)}")   # → 120`,
  problem: `再帰を使って、フィボナッチ数列のN番目を返す関数<code>Fibonacci(N : int) : int</code>を書いてください(0番目は0、1番目は1、それ以降は直前2つの和)。<code>Fibonacci(7)</code>をPrintしてください。`,
  answer: `Fibonacci(N : int) : int =
    if (N <= 1) then N else Fibonacci(N - 1) + Fibonacci(N - 2)

Print("{Fibonacci(7)}")   # → 13`,
  note: `再帰関数を書くときは、必ず「これ以上分解しないベースケース」を用意し、無限に自分を呼び続けないようにしましょう。`
},

// ---------- 118 ----------
{
  n: 118, lv: "i", cat: "中級総合演習",
  concept: "var引数(mutableな引数)",
  explain: `関数の引数に<code>var</code>を付けると、呼び出し元の変数そのものを直接書き換えられる「参照渡し」になります(引数の型の前に<code>var</code>を書きます)。通常の値渡しとの違いを意識して使いましょう。`,
  example: `Increment(var X : int) : void =
    set X += 1

var Coins : int = 10
Increment(var Coins)
Print("{Coins}")   # → 11`,
  problem: `<code>var</code>引数を使って、渡されたint変数の値を<b>2倍にする</b>関数<code>DoubleInPlace(var X : int) : void</code>を作り、<b>Score</b>(int, 初期値<b>21</b>)に対して呼び出し、結果をPrintしてください。`,
  answer: `DoubleInPlace(var X : int) : void =
    set X *= 2

var Score : int = 21
DoubleInPlace(var Score)
Print("{Score}")   # → 42`,
  note: `<code>var</code>引数は便利ですが多用すると処理の流れが追いにくくなるため、「戻り値で新しい値を返す」設計の方が好まれる場面も多いです。`
},

// ---------- 119 ----------
{
  n: 119, lv: "i", cat: "中級総合演習",
  concept: "タプルの分解代入",
  explain: `タプルを返す関数の結果は、複数の変数にまとめて分解して受け取れます。<code>(A, B) := 関数呼び出し</code>のように書くと、タプルの各要素がそれぞれの変数に入ります。`,
  example: `MinMax(Numbers : []int) : (int, int) =
    (Numbers.Max2(), Numbers[0])

(Highest, First) := MinMax(array{5, 9, 2})
Print("{Highest}, {First}")`,
  problem: `int配列を受け取り、<b>(合計, 平均)</b>のタプルを返す関数<code>Analyze</code>を作り、<code>(Total, Average) := Analyze(array{10, 20, 30})</code>のように分解代入して両方をPrintしてください(平均はint同士の割り算でOK)。`,
  answer: `Analyze(Numbers : []int) : (int, int) =
    var Total : int = 0
    for (N : Numbers):
        set Total += N
    (Total, Total / Numbers.Length)

(Total, Average) := Analyze(array{10, 20, 30})
Print("合計:{Total} 平均:{Average}")`,
  note: `分解代入を使うと、タプルの中身を<code>Result(0)</code>のようにインデックスで取り出すより、意味のある名前で扱えて読みやすくなります。`
},

// ---------- 120 ----------
{
  n: 120, lv: "i", cat: "中級総合演習",
  concept: "中級の集大成:ミニ・インベントリシステム",
  explain: `中級編の最終問題です。struct・class・enum・map・option・interface・アクセス指定子・for内包表記――これまで習った要素をすべて動員して、小さなインベントリシステムを完成させましょう。`,
  example: `item_category := enum<open>:
    Weapon
    Potion

item := struct:
    Name : string = ""
    Category : item_category = item_category.Potion
    Count : int = 1

inventory := class:
    var Items<private> : []item = array{}

    AddItem<public>(NewItem : item) : void =
        set Items += array{NewItem}

    CountByCategory<public>(Target : item_category) : int =
        var Total : int = 0
        for (I : Items, I.Category = Target):
            set Total += I.Count
        Total`,
  problem: `上の<code>inventory</code>クラスに、<b>&lt;public&gt;</b>な<code>ListNames() : []string</code>メソッド(全アイテムの名前一覧を返す)を追加してください。そのうえで<b>薬草(Potion, 3個)</b>と<b>鉄の剣(Weapon, 1個)</b>を追加した<code>inventory</code>を作り、<code>CountByCategory(item_category.Potion)</code>と<code>ListNames()</code>の両方をPrintしてください。`,
  answer: `item_category := enum<open>:
    Weapon
    Potion

item := struct:
    Name : string = ""
    Category : item_category = item_category.Potion
    Count : int = 1

inventory := class:
    var Items<private> : []item = array{}

    AddItem<public>(NewItem : item) : void =
        set Items += array{NewItem}

    CountByCategory<public>(Target : item_category) : int =
        var Total : int = 0
        for (I : Items, I.Category = Target):
            set Total += I.Count
        Total

    ListNames<public>() : []string =
        for (I : Items):
            I.Name

MyBag := inventory{}
MyBag.AddItem(item{Name := "薬草", Category := item_category.Potion, Count := 3})
MyBag.AddItem(item{Name := "鉄の剣", Category := item_category.Weapon, Count := 1})

Print("{MyBag.CountByCategory(item_category.Potion)}")
Print("{MyBag.ListNames()}")`,
  note: `お疲れさまでした!中級80問はこれで完走です。次はいよいよ、並行処理の組み合わせ・多態性・状態機械・型システムの深いところまで踏み込む上級編、全80問です。`
}

];
