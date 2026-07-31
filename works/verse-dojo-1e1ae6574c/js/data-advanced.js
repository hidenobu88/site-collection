/* =========================================================
 * VERSE道場破り — 上級編 (Q121〜Q200)
 * 黒帯。並行処理の組み合わせ・多態性・状態機械・型の高度な
 * 使いこなしまで、実務レベルの設計力を鍛える最終章。
 * ========================================================= */
var ADVANCED_QUESTIONS = [

// ---------- 並行処理 総合 ----------
{
  n: 121, lv: "a", cat: "並行処理 総合",
  concept: "sync + race の組み合わせ",
  explain: `<code>sync</code>と<code>race</code>は入れ子にできます。「複数の準備をsyncで並行に済ませ、その全体にraceでタイムアウトを掛ける」という組み合わせは、実務のロード画面などでよく使われる設計です。`,
  example: `LoadWithTimeout()<suspends> : void =
    race:
        block:
            sync:
                LoadTexture()
                LoadSound()
            Print("読み込み完了")
        block:
            Sleep(8.0)
            Print("読み込みタイムアウト")`,
  problem: `<code>LoadPlayerData()</code>と<code>LoadWorldData()</code>を<code>sync</code>でまとめて待ち、その全体を<b>5秒</b>で<code>race</code>によりタイムアウトさせる<code>&lt;suspends&gt;</code>関数<code>InitializeGame</code>を書いてください(成功時"初期化完了"、失敗時"初期化タイムアウト"とPrint)。`,
  answer: `InitializeGame()<suspends> : void =
    race:
        block:
            sync:
                LoadPlayerData()
                LoadWorldData()
            Print("初期化完了")
        block:
            Sleep(5.0)
            Print("初期化タイムアウト")`,
  note: `並行処理キーワードは組み合わせるほど複雑に見えますが、「syncで束ねたひとかたまりを、raceの1つの枝として扱う」と考えると読み解きやすくなります。`
},

// ---------- 122 ----------
{
  n: 122, lv: "a", cat: "並行処理 総合",
  concept: "rush + sync の組み合わせ",
  explain: `<code>rush</code>の中に<code>sync</code>を入れることもできます。「複数グループそれぞれをsyncで待ちつつ、グループ全体としては最速の完了を知りたい、かつ全グループを最後まで完走させたい」という高度な要求に応えられます。`,
  example: `ProcessGroups()<suspends> : void =
    rush:
        block:
            sync:
                TaskA()
                TaskB()
        block:
            sync:
                TaskC()
                TaskD()`,
  problem: `2つのグループ(<code>Group1Task1()</code>+<code>Group1Task2()</code>、<code>Group2Task1()</code>+<code>Group2Task2()</code>)を、それぞれ<code>sync</code>でまとめ、グループ全体を<code>rush</code>で走らせる<code>&lt;suspends&gt;</code>関数<code>ProcessAllGroups</code>を書いてください。`,
  answer: `ProcessAllGroups()<suspends> : void =
    rush:
        block:
            sync:
                Group1Task1()
                Group1Task2()
        block:
            sync:
                Group2Task1()
                Group2Task2()`,
  note: `並行処理の入れ子は、まず内側のブロック単位で「これは1つの処理のかたまり」と捉えると設計しやすくなります。`
},

// ---------- 123 ----------
{
  n: 123, lv: "a", cat: "並行処理 総合",
  concept: "複数のraceでリトライ付きタイムアウトを作る",
  explain: `<code>loop</code>と<code>race</code>を組み合わせると、「タイムアウトしたらもう一度試す」というリトライ設計を実現できます。<code>break</code>で成功時に抜け出します。`,
  example: `ConnectWithRetry()<suspends> : void =
    loop:
        race:
            block:
                TryConnect()
                Print("接続成功")
                break
            block:
                Sleep(3.0)
                Print("再試行します")`,
  problem: `<code>FetchData()</code>という処理を、<b>2秒のタイムアウト</b>つきの<code>race</code>で<code>loop</code>の中で試し続け、成功したら<b>"取得成功"</b>とPrintして<code>break</code>する<code>&lt;suspends&gt;</code>関数<code>FetchWithRetry</code>を書いてください。`,
  answer: `FetchWithRetry()<suspends> : void =
    loop:
        race:
            block:
                FetchData()
                Print("取得成功")
                break
            block:
                Sleep(2.0)
                Print("タイムアウト、再試行します")`,
  note: `無限リトライにならないよう、実務では「最大リトライ回数」をカウンタで管理することも合わせて検討しましょう。`
},

// ---------- 124 ----------
{
  n: 124, lv: "a", cat: "並行処理 総合",
  concept: "for の中で複数のタスクをbranchする",
  explain: `<code>for</code>ループの中で<code>branch</code>を使うと、複数の独立したバックグラウンド処理を一斉に起動できます。1つ1つの完了を待たずに、次々と処理を打ち上げていくイメージです。`,
  example: `LaunchAllEffects(Positions : []vector3)<suspends> : void =
    for (Pos : Positions):
        branch:
            PlayEffectAt(Pos)`,
  problem: `string配列<code>Targets := array{"A", "B", "C"}</code>を受け取り、<code>for</code>の中で<code>branch</code>を使って、それぞれに対して<code>NotifyPlayer(Name)</code>を並行に打ち上げる<code>&lt;suspends&gt;</code>関数<code>NotifyAll</code>を書いてください。`,
  answer: `NotifyAll(Targets : []string)<suspends> : void =
    for (Name : Targets):
        branch:
            NotifyPlayer(Name)`,
  note: `forの中のbranchは、forループ自体のスコープが終わると片付けられる点に注意しましょう。ループ全体が終わるまで生き続けさせたい場合は<code>spawn</code>を検討します。`
},

// ---------- 125 ----------
{
  n: 125, lv: "a", cat: "並行処理 総合",
  concept: "task配列でspawnした複数タスクをまとめてAwaitする",
  explain: `<code>spawn</code>で作った複数の<code>task</code>を配列に集めておき、あとでまとめて<code>.Await()</code>することもできます。「並行に開始しておいて、後で好きなタイミングで結果を回収する」という柔軟な設計です。`,
  example: `var Tasks : []task(int) = array{}
for (I := 1..3):
    set Tasks += array{spawn{ HeavyCalc(I) }}

for (T : Tasks):
    Print("{T.Await()}")`,
  problem: `<code>DownloadChunk(I : int) : int</code>という処理を<b>0から2</b>まで3回<code>spawn</code>して<b>var Tasks : []task(int)</b>に集め、<code>for</code>ですべての<code>.Await()</code>結果をPrintする<code>&lt;suspends&gt;</code>関数<code>DownloadAll</code>を書いてください。`,
  answer: `DownloadAll()<suspends> : void =
    var Tasks : []task(int) = array{}
    for (I := 0..2):
        set Tasks += array{spawn{ DownloadChunk(I) }}

    for (T : Tasks):
        Print("{T.Await()}")`,
  note: `複数の独立したタスクを先にすべて起動してから、後でまとめて結果を待つ設計は、逐次待つより全体の完了が速くなります。`
},

// ---------- 協調的キャンセルとdefer ----------
{
  n: 126, lv: "a", cat: "キャンセルとdefer",
  concept: "協調的キャンセルと中断ポイント",
  explain: `<code>race</code>で負けたタスクや<code>.Cancel()</code>されたタスクは、<strong>その瞬間に即座には止まりません</strong>。あらかじめ決められた「中断ポイント」(<code>Sleep</code>や関数呼び出しなど)に来たときだけキャンセルに気づいて止まる、「協調的」な仕組みです。重い処理には中断ポイントをこまめに挟むのが良い設計です。`,
  example: `ResponsiveLoop()<suspends> : void =
    for (I := 0..10000):
        ExpensiveOperation(I)
        Sleep(0.0)   # 中断ポイント`,
  problem: `0〜4999まで数える<code>CountUp</code>という<code>&lt;suspends&gt;</code>関数を書き、各回で<code>Sleep(0.0)</code>という中断ポイントを挟んで、途中でキャンセルされたときにすぐ反応できるようにしてください。`,
  answer: `CountUp()<suspends> : void =
    for (I := 0..4999):
        Print("{I}")
        Sleep(0.0)`,
  note: `もし重い処理の中に中断ポイントが一切なければ、キャンセルを頼んでもすぐには反応してくれません。また、親タスクがキャンセルされると子タスクにも自動的に伝わります。`
},

// ---------- 127 ----------
{
  n: 127, lv: "a", cat: "キャンセルとdefer",
  concept: "defer による確実な後片付け",
  explain: `「使ったら必ず片付ける」処理を、キャンセルや早期リターンが起きても忘れずに実行してくれるのが<code>defer:</code>です。「教室の電気を消す当番」のように、その場を離れるタイミングで必ず実行されます。`,
  example: `ProcessWithTimeout()<suspends> : void =
    race:
        block:
            Resource := AcquireResource()
            defer:
                ReleaseResource(Resource)
            LongTask(Resource)
        block:
            Sleep(10.0)`,
  problem: `<code>OpenConnection() : connection</code>で接続を取得し、<code>defer</code>で必ず<code>CloseConnection(Conn)</code>するようにしたうえで、<code>SendData(Conn)</code>を実行する<code>&lt;suspends&gt;</code>関数<code>SafeSend</code>を書いてください。`,
  answer: `SafeSend()<suspends> : void =
    Conn := OpenConnection()
    defer:
        CloseConnection(Conn)
    SendData(Conn)`,
  note: `<code>defer</code>を使わずに手動で後片付けを書くと、途中の分岐や早期リターン、キャンセルのたびに片付け処理を書き忘れるリスクがあります。`
},

// ---------- 128 ----------
{
  n: 128, lv: "a", cat: "キャンセルとdefer",
  concept: "raceとdeferとsuspendsの伝播をまとめて理解する",
  explain: `<code>&lt;decides&gt;</code>な関数を呼ぶ関数自身も<code>&lt;decides&gt;</code>を宣言する必要があったのと同じように、<code>&lt;suspends&gt;</code>な関数(Sleepやsync/raceを使う関数)を呼ぶ関数も<code>&lt;suspends&gt;</code>を宣言する必要があります。これは「電子レンジの前で待つ人を呼びに行った人も、結局は一緒に待つことになる」という比喩で説明されます。`,
  example: `# ×: Sleepを呼んでいるのにsuspendsが無い → エラーになる
# BadFunction() : void = Sleep(1.0)

# ○: suspendsを正しく伝播させる
GoodFunction()<suspends> : void = Sleep(1.0)`,
  problem: `<code>Sleep(2.0)</code>を呼ぶ関数<code>WaitABit</code>と、それを呼び出すだけの関数<code>DoSomethingSlow</code>を作り、<b>両方に正しく&lt;suspends&gt;を付けて</b>ください。`,
  answer: `WaitABit()<suspends> : void =
    Sleep(2.0)

DoSomethingSlow()<suspends> : void =
    WaitABit()
    Print("完了")`,
  note: `効果指定子は「うそをつけない」仕組みです。suspendsな処理を内部に持つ関数は、必ずそれを外にも正直に表示しなければなりません。`
},

// ---------- 129 ----------
{
  n: 129, lv: "a", cat: "キャンセルとdefer",
  concept: "deferを複数使うときの実行順序",
  explain: `1つのブロックの中に複数の<code>defer</code>を書いた場合、実行される順番は「あとに書いたものから先に」(後入れ先出し、LIFO)になります。複数のリソースを確保する処理でよく登場する考え方です。`,
  example: `SetupAndTeardown()<suspends> : void =
    block:
        defer:
            Print("1つ目の片付け")
        defer:
            Print("2つ目の片付け")
        Print("本処理")
    # 実行順: 本処理 → 2つ目の片付け → 1つ目の片付け`,
  problem: `<code>defer</code>を2つ使い、「A確保」「B確保」の順にPrintしたあと、<code>defer</code>で「B解放」「A解放」の<strong>正しい順序</strong>でPrintされるようにコードを書いてください(defer自体は確保の直後に書きます)。`,
  answer: `AcquireBoth()<suspends> : void =
    block:
        Print("A確保")
        defer:
            Print("A解放")
        Print("B確保")
        defer:
            Print("B解放")
        Print("本処理")
    # 実行順: A確保 → B確保 → 本処理 → B解放 → A解放`,
  note: `後に確保したものから先に解放する、というのは多くのプログラミング言語のリソース管理で共通する自然な原則です。`
},

// ---------- 効果指定子の組み合わせ設計 ----------
{
  n: 130, lv: "a", cat: "効果指定子の設計",
  concept: "効果指定子から関数の性質を読み取る",
  explain: `効果指定子は「この関数の中で何が起きうるか」を型として保証する仕組みです。指定子を見るだけで、実装を読まなくても関数の性質がある程度わかるようになるのが理想です。`,
  example: `# 純粋な計算だけ、必ず終わる、失敗しない、時間を待たない
Square(X : int)<computes><converges> : int = X * X

# 失敗するかもしれない検索
TryFind(Arr : []int, T : int)<decides> : int = Arr.Find[T]

# 時間をまたぐ
Wait(Seconds : float)<suspends> : void = Sleep(Seconds)`,
  problem: `次の3つの関数それぞれに最もふさわしい効果指定子を考え、実際にコードとして書いてください:
①「配列の中から条件に合う最初の要素を探すが、無いかもしれない」関数<code>FindFirst</code>
②「サーバーとの接続が確立するまで待つ」関数<code>WaitForConnection</code>
③「税込み価格を計算するだけ」の関数<code>CalcTax</code>`,
  answer: `FindFirst(Arr : []int, Cond : type{_(:int)<computes>:logic})<decides> : int =
    for (X : Arr, Cond(X)):
        return X
    Arr[0]   # 便宜上のダミー(実際はdecidesの伝播に任せる設計が望ましい)

WaitForConnection()<suspends> : void =
    Sleep(1.0)

CalcTax(Price : int)<computes> : int =
    Price * 11 / 10`,
  note: `①のように「関数を引数として渡す」設計は高度になりがちなので、実務ではまず②③のようなシンプルな指定から確実に身につけましょう。`
},

// ---------- 131 ----------
{
  n: 131, lv: "a", cat: "効果指定子の設計",
  concept: "transactsによる「全部なかったことに」の保証",
  explain: `<code>&lt;transacts&gt;</code>は、銀行取引のように「状態変更を伴うが、途中で失敗したら全部なかったことになる」処理を表します。「HPを減らして、もし0未満になるなら操作全体を失敗させる」というような、一部だけ変更が反映される不整合を防ぎたい場面に向いています。`,
  example: `TakeDamage(Amount : int)<transacts> : void =
    set Health = Max(0, Health - Amount)`,
  problem: `<code>var Gold : int = 100</code>を持つクラス<code>wallet</code>に、<b>&lt;transacts&gt;</b>な<code>Spend(Amount : int)<decides><transacts> : void</code>メソッドを作り、<b>Goldが足りなければ失敗</b>(何も変更しない)、<b>足りればGoldを減らす</b>ようにしてください。`,
  answer: `wallet := class:
    var Gold : int = 100

    Spend(Amount : int)<decides><transacts> : void =
        Gold >= Amount
        set Gold -= Amount

MyWallet := wallet{}
if (MyWallet.Spend(30)):
    Print("購入成功 残り{MyWallet.Gold}")
else:
    Print("お金が足りません")`,
  note: `<code>&lt;decides&gt;</code>と<code>&lt;transacts&gt;</code>を組み合わせることで、「条件を満たさなければ、状態変更ごと丸ごと失敗させる」という堅牢な設計ができます。`
},

// ---------- 132 ----------
{
  n: 132, lv: "a", cat: "効果指定子の設計",
  concept: "純粋な関数(computes)を積極的に使うメリット",
  explain: `<code>&lt;computes&gt;</code>な関数(副作用のない純粋な計算)は、いつ何度呼んでも同じ入力に対して同じ結果を返すことが保証されます。テストが書きやすく、並行処理の中でも安全に呼べるため、可能な限り<code>&lt;computes&gt;</code>にできる処理は分離しておくのが良い設計です。`,
  example: `# 副作用があり、computesにできない
var Total : int = 0
AddToTotal(X : int) : void = set Total += X

# 副作用が無く、computesにできる
Add(A : int, B : int)<computes> : int = A + B`,
  problem: `「渡された配列の合計」を計算する処理を、<b>グローバル変数を使わず、&lt;computes&gt;を付けられる形</b>の関数<code>SumPure(Numbers : []int)<computes> : int</code>として書いてください。`,
  answer: `SumPure(Numbers : []int)<computes> : int =
    var Total : int = 0
    for (N : Numbers):
        set Total += N
    Total`,
  note: `関数の中でローカルな<code>var</code>を使うこと自体はcomputesを妨げません。「関数の外の状態を変えない」ことがcomputesの条件です。`
},

// ---------- 133 ----------
{
  n: 133, lv: "a", cat: "効果指定子の設計",
  concept: "効果指定子とinterfaceの契約",
  explain: `interfaceのメソッド宣言にも効果指定子を含められます。実装クラス側は、interfaceで宣言された効果指定子と<strong>矛盾しない</strong>形で実装しなければなりません。「この規格は、必ず失敗しうる処理として実装してください」という契約を、型システムで強制できます。`,
  example: `damageable := interface:
    TakeDamage(Amount : int)<transacts> : void

character := class(damageable):
    var Health : int = 100
    TakeDamage<override>(Amount : int)<transacts> : void =
        set Health = Max(0, Health - Amount)`,
  problem: `<code>Validate() : void</code>を<code>&lt;decides&gt;</code>として宣言する<code>validatable</code>インターフェースを定義し、それを実装する<code>form_data</code>クラス(<b>var Name : string</b>を持ち、<b>Nameが空でなければ成功</b>とする)を作ってください。`,
  answer: `validatable := interface:
    Validate()<decides> : void

form_data := class(validatable):
    var Name : string = ""

    Validate<override>()<decides> : void =
        Name.Length > 0

MyForm := form_data{Name := "ゆうた"}
if (MyForm.Validate()):
    Print("検証OK")
else:
    Print("検証NG")`,
  note: `interfaceで効果指定子まで規定しておくと、実装側が「失敗しうることを忘れて素朴に実装してしまう」ようなミスを防げます。`
},

// ---------- ジェネリクス応用 ----------
{
  n: 134, lv: "a", cat: "ジェネリクス応用",
  concept: "where t : subtype(comparable) による制約",
  explain: `ジェネリック関数の型パラメータには<code>where t : subtype(comparable)</code>のように制約をかけられます。「どんな型でもいいわけではなく、比較できる(<code>comparable</code>を満たす)型限定」という意味です。工具箱の中から「ネジ回し系だけ」を選ぶようなイメージです。`,
  example: `AreEqual(A : t, B : t where t : subtype(comparable))<computes> : logic =
    A = B`,
  problem: `<code>AreEqual</code>を参考に、2つの<code>comparable</code>な値を受け取り、<b>同じなら"一致"、違えば"不一致"</b>を返すジェネリック関数<code>Compare</code>を作り、<code>Compare(3, 3)</code>と<code>Compare("a", "b")</code>の両方をPrintしてください。`,
  answer: `Compare(A : t, B : t where t : subtype(comparable))<computes> : string =
    if (A = B) then "一致" else "不一致"

Print(Compare(3, 3))
Print(Compare("a", "b"))`,
  note: `<code>where</code>句の制約は、ジェネリック関数の中で「その型に対してどんな操作ができるか」をコンパイラに伝える役割も果たします。`
},

// ---------- 135 ----------
{
  n: 135, lv: "a", cat: "ジェネリクス応用",
  concept: "ジェネリックな配列操作関数",
  explain: `<code>where t : type</code>だけの制約なら、比較などを使わない限り、あらゆる型の配列に対して動く汎用関数が書けます。「配列の先頭要素を安全に取り出す」のような処理は、型を選びません。`,
  example: `SafeFirst(Arr : []t where t : type) : ?t =
    if (Arr.Length > 0):
        option{Arr[0]}
    else:
        false`,
  problem: `<code>SafeFirst</code>を参考に、配列の<b>末尾の要素</b>を安全に取り出すジェネリック関数<code>SafeLastGeneric(Arr : []t where t : type) : ?t</code>を作り、<code>SafeLastGeneric(array{1,2,3})</code>と<code>SafeLastGeneric(array{"a","b"})</code>の両方の結果をPrintしてください。`,
  answer: `SafeLastGeneric(Arr : []t where t : type) : ?t =
    if (Arr.Length > 0):
        option{Arr[Arr.Length - 1]}
    else:
        false

if (X := SafeLastGeneric(array{1, 2, 3})?):
    Print("{X}")

if (Y := SafeLastGeneric(array{"a", "b"})?):
    Print(Y)`,
  note: `型に依存しない汎用関数は、一度書けばあらゆるデータ型の配列に対して使い回せる、高いコード再利用性を生みます。`
},

// ---------- 136 ----------
{
  n: 136, lv: "a", cat: "ジェネリクス応用",
  concept: "複数の型パラメータを持つジェネリクス",
  explain: `ジェネリック関数やstructは、型パラメータを複数持てます。「キーの型」と「値の型」が別々でよいペアのような構造を、型を問わず表現できます。`,
  example: `pair(k : type, v : type) := struct:
    Key : k
    Value : v

NamedScore := pair(string, int){Key := "たろう", Value := 90}
Print("{NamedScore.Key}: {NamedScore.Value}")`,
  problem: `<code>pair</code>を参考に、2つの異なる型パラメータ<code>a</code>・<code>b</code>を持つジェネリック関数<code>MakePair(X : a, Y : b) : pair(a, b)</code>を作り、<code>MakePair(1, "one")</code>を作ってPrintしてください。`,
  answer: `MakePair(X : a, Y : b where a : type, b : type) : pair(a, b) =
    pair(a, b){Key := X, Value := Y}

Result := MakePair(1, "one")
Print("{Result.Key}: {Result.Value}")`,
  note: `<code>where a : type, b : type</code>のように、カンマで複数の型パラメータの制約をまとめて宣言できます。`
},

// ---------- 137 ----------
{
  n: 137, lv: "a", cat: "ジェネリクス応用",
  concept: "ジェネリックなclassとインターフェースの組み合わせ",
  explain: `ジェネリックなclassに、通常のinterfaceを実装させることもできます。「どんな型の中身でも保持できて、かつ共通の規格にも従う箱」を作れます。`,
  example: `printable := interface:
    Describe() : string

labeled_box(t : type) := class(printable):
    var Content : t
    var Label : string = ""

    Describe<override>() : string =
        "{Label}: {Content}"`,
  problem: `<code>labeled_box</code>を参考に、<code>labeled_box(int){Content := 42, Label := "得点"}</code>を作り、<code>printable</code>型の配列に入れてforで<code>Describe()</code>の結果をPrintしてください。`,
  answer: `printable := interface:
    Describe() : string

labeled_box(t : type) := class(printable):
    var Content : t
    var Label : string = ""

    Describe<override>() : string =
        "{Label}: {Content}"

Items : []printable = array{labeled_box(int){Content := 42, Label := "得点"}}
for (I : Items):
    Print(I.Describe())`,
  note: `ジェネリクスとinterfaceを組み合わせることで、「型は自由だが、決まった規格には従う」という柔軟かつ安全な設計ができます。`
},

// ---------- 138 ----------
{
  n: 138, lv: "a", cat: "ジェネリクス応用",
  concept: "ジェネリック関数によるソート済み挿入",
  explain: `<code>subtype(comparable)</code>な型パラメータと比較演算子<code>&lt;=</code>を組み合わせると、「ソート済み配列に、正しい位置へ挿入する」という汎用的な処理を型を問わず書けます。`,
  example: `InsertSorted(Arr : []t, NewValue : t where t : subtype(comparable))<computes> : []t =
    Before := for (X : Arr, X <= NewValue): X
    After  := for (X : Arr, X > NewValue): X
    Before + array{NewValue} + After`,
  problem: `<code>InsertSorted</code>を使い、<code>array{10, 30, 50}</code>に<b>25</b>を挿入した結果をPrintしてください。`,
  answer: `Result := InsertSorted(array{10, 30, 50}, 25)
Print("{Result}")   # → (10, 25, 30, 50)`,
  note: `<code>Before</code>と<code>After</code>という2つのforフィルタで配列を分割し、新しい値を挟んで<code>+</code>連結する、というアプローチはVerseらしい「値を作る式としてのfor」の応用例です。`
},

// ---------- weak_map・永続データ ----------
{
  n: 139, lv: "a", cat: "永続データ設計",
  concept: "複数のweak_mapでプレイヤーデータを分割管理する",
  explain: `1つの巨大な構造体にすべてを詰め込むより、目的ごとに<code>weak_map(player, ...)</code>を分けて管理する設計もよく使われます。「進行状況」「インベントリ」「設定」のように関心事を分離すると、コードの見通しが良くなります。`,
  example: `progress_data := class:
    var Level : int = 1

settings_data := class:
    var Volume : int = 50

ProgressMap : weak_map(player, progress_data) = map{}
SettingsMap : weak_map(player, settings_data) = map{}`,
  problem: `<code>progress_data</code>と<code>settings_data</code>(上の例のもの)それぞれについて、あるプレイヤー<b>P</b>のデータを「無ければ新規作成、あれば取得」する関数<code>GetProgress(P:player):progress_data</code>と<code>GetSettings(P:player):settings_data</code>を作ってください。`,
  answer: `progress_data := class:
    var Level : int = 1

settings_data := class:
    var Volume : int = 50

ProgressMap : weak_map(player, progress_data) = map{}
SettingsMap : weak_map(player, settings_data) = map{}

GetProgress(P : player) : progress_data =
    if (Existing := ProgressMap[P]):
        Existing
    else:
        NewData := progress_data{}
        set ProgressMap[P] = NewData
        NewData

GetSettings(P : player) : settings_data =
    if (Existing := SettingsMap[P]):
        Existing
    else:
        NewData := settings_data{}
        set SettingsMap[P] = NewData
        NewData`,
  note: `関心事ごとにweak_mapを分けると、それぞれの読み書きの責任範囲が明確になり、複数人での開発時にもコンフリクトが起きにくくなります。`
},

// ---------- 140 ----------
{
  n: 140, lv: "a", cat: "永続データ設計",
  concept: "weak_mapとclassの組み合わせで集計処理を行う",
  explain: `weak_mapに登録されたプレイヤーデータ全体を集計したいときは、for文でweak_map自体をキー・値のペアとしてくり返します。「全プレイヤーの平均レベル」のような処理を書けます。`,
  example: `AverageLevel(Data : weak_map(player, progress_data))<computes> : float =
    var Total : int = 0
    var Count : int = 0
    for (P -> D : Data):
        set Total += D.Level
        set Count += 1
    if (Count > 0) then (Total * 1.0) / (Count * 1.0) else 0.0`,
  problem: `<code>AverageLevel</code>を参考に、<code>weak_map(player, progress_data)</code>を受け取り、<b>Levelが10以上のプレイヤー数</b>を数える関数<code>CountHighLevel</code>を作ってください。`,
  answer: `CountHighLevel(Data : weak_map(player, progress_data))<computes> : int =
    var Count : int = 0
    for (P -> D : Data, D.Level >= 10):
        set Count += 1
    Count`,
  note: `weak_mapもmapの一種として、forによるキー・値の取り出しやフィルタリングがそのまま使えます。`
},

// ---------- 141 ----------
{
  n: 141, lv: "a", cat: "永続データ設計",
  concept: "リーダーボード(ランキング)の設計",
  explain: `weak_mapからデータを集めて配列化し、比較関数と組み合わせてソートすれば、ランキング表示のもとになるデータが作れます。「map → 配列に変換 → 加工」という流れは実務のランキング機能そのものです。`,
  example: `entry := struct:
    Name : string = ""
    Score : int = 0

BuildEntries(Scores : [string]int)<computes> : []entry =
    for (Name -> S : Scores):
        entry{Name := Name, Score := S}`,
  problem: `<code>BuildEntries</code>を使い、<code>map{"たろう" => 90, "はなこ" => 75, "けん" => 100}</code>から<code>entry</code>配列を作り、その中から<b>Scoreが80以上のNameだけ</b>を<code>for</code>で抽出してPrintしてください。`,
  answer: `Scores : [string]int = map{"たろう" => 90, "はなこ" => 75, "けん" => 100}
Entries := BuildEntries(Scores)

HighScorers := for (E : Entries, E.Score >= 80):
    E.Name

Print("{HighScorers}")`,
  note: `本格的な「点数順に並べ替える」処理はもう一歩進んだアルゴリズムが必要になりますが、「map→struct配列→フィルタ」という変換の流れ自体はここまでの知識だけで組み立てられます。`
},

// ---------- 142 ----------
{
  n: 142, lv: "a", cat: "永続データ設計",
  concept: "weak_mapとinterfaceを組み合わせた通知設計",
  explain: `weak_mapの値をinterface型にしておくと、プレイヤーごとに「振る舞いが違うオブジェクト」を紐づけられます。「プレイヤーごとに異なる報酬処理」のような、動的な差し替えが必要な設計に向いています。`,
  example: `reward_strategy := interface:
    GrantReward(P : player) : void

RewardMap : weak_map(player, reward_strategy) = map{}`,
  problem: `<code>reward_strategy</code>(上の例のもの)を実装した<code>gold_reward</code>クラス(<code>GrantReward</code>で「ゴールドを付与しました」とPrint)を作り、<code>weak_map(player, reward_strategy)</code>型の<b>RewardMap</b>に、あるプレイヤー<b>P</b>への割り当てを<code>set</code>してください。`,
  answer: `reward_strategy := interface:
    GrantReward(P : player) : void

gold_reward := class(reward_strategy):
    GrantReward<override>(P : player) : void =
        Print("ゴールドを付与しました")

var RewardMap : weak_map(player, reward_strategy) = map{}
AssignReward(P : player) : void =
    set RewardMap[P] = gold_reward{}`,
  note: `「データ」だけでなく「振る舞い(interface)」をweak_mapで紐づけられるのは、classが参照型でありinterfaceを実装できることの自然な帰結です。`
},

// ---------- persistable ----------
{
  n: 143, lv: "a", cat: "永続化可能な型",
  concept: "persistable ── セーブデータの金庫のルール",
  explain: `ゲームを終了しても消えないデータを扱うのが<code>&lt;persistable&gt;</code>です。ただし何でも永続化できるわけではなく、<code>int / float / logic / string / char</code>などの基本型、そして<code>&lt;persistable&gt;</code>かつ<code>&lt;final&gt;</code>な構造体・クラスだけが対象です。<code>rational</code>や<code>any</code>、継承ありのクラスは永続化できません。`,
  example: `player_stats := struct<persistable><final>:
    Level : int = 1
    Experience : int = 0`,
  problem: `<b>UnlockedSkins</b>(int, 所持スキン数)と<b>TotalPlayTime</b>(float, プレイ時間)を持つ<code>&lt;persistable&gt;&lt;final&gt;</code>な<code>save_data</code>構造体を定義してください。`,
  answer: `save_data := struct<persistable><final>:
    UnlockedSkins : int = 0
    TotalPlayTime : float = 0.0`,
  note: `セーブデータの形は公開後に大きく変更しづらいので、設計段階で項目をよく吟味し、シンプルな値にはclassよりもstructを優先しましょう。`
},

// ---------- 144 ----------
{
  n: 144, lv: "a", cat: "永続化可能な型",
  concept: "永続化できるもの・できないものの見極め",
  explain: `永続化のルールは「基本型・組み合わせ可能なコンテナ(array/map/option/tuple、中身も永続化可能な場合)・persistable+finalな構造体」がOK、「rational・関数型・any・comparable・type・継承ありのクラスやインターフェース型」はNGという線引きです。`,
  example: `# OK: 中身がすべて永続化可能な型の配列
UnlockedItems : []string = array{}

# OK: 永続化可能な構造体をmapの値にする
PlayerRecords : [string]save_data = map{}`,
  problem: `次の3つのフィールドのうち、<b>持続化(&lt;persistable&gt;)できないもの</b>を1つ選び、理由をコメントで説明してください:
① <code>Coins : int = 0</code>
② <code>Ratio : rational = 1 / 2</code>
③ <code>Names : []string = array{}</code>`,
  answer: `# ②の Ratio: rational = 1 / 2 は永続化できない。
# rational型はpersistableの対象外(丸め誤差なく正確な分数を保持する内部構造が、
# セーブデータの単純な形式と相性が悪いため)。int/float/string/logic/charや、
# それらで構成されたarray・mapは永続化可能。`,
  note: `迷ったときは「セーブデータには、単純な数値・文字列・真偽値・それらの組み合わせだけを持たせる」と考えるとルールを覚えやすくなります。`
},

// ---------- 145 ----------
{
  n: 145, lv: "a", cat: "永続化可能な型",
  concept: "永続化可能なmapとネストしたstruct",
  explain: `永続化可能な構造体は、mapの値やarrayの要素としても使えます。「プレイヤー名 → セーブデータ」のようなmapごと永続化する設計は、複数プレイヤー分のデータを1つの領域にまとめて管理したいときに便利です。`,
  example: `inventory_slot := struct<persistable><final>:
    ItemName : string = ""
    Count : int = 0

full_save := struct<persistable><final>:
    Level : int = 1
    Slots : []inventory_slot = array{}`,
  problem: `<code>inventory_slot</code>(上の例のもの)の配列<b>Slots</b>と、<b>Coins</b>(int)を持つ<code>&lt;persistable&gt;&lt;final&gt;</code>な<code>player_save</code>構造体を定義し、<b>Slots</b>に<code>inventory_slot{ItemName := "薬草", Count := 3}</code>を1つ持つインスタンスを作ってPrintしてください。`,
  answer: `inventory_slot := struct<persistable><final>:
    ItemName : string = ""
    Count : int = 0

player_save := struct<persistable><final>:
    Slots : []inventory_slot = array{}
    Coins : int = 0

MySave := player_save{
    Slots := array{inventory_slot{ItemName := "薬草", Count := 3}},
    Coins := 100
}
Print("{MySave.Slots} / {MySave.Coins}")`,
  note: `永続化可能な構造体を入れ子にしていく設計は、実際のゲームのセーブデータ構造とほぼ同じ考え方です。`
},

// ---------- 146 ----------
{
  n: 146, lv: "a", cat: "永続化可能な型",
  concept: "finalの意味",
  explain: `<code>&lt;final&gt;</code>は「このクラス・構造体は、これ以上継承(拡張)されない」ことを示す指定子です。永続化可能な型はデータの形が固定されている必要があるため、<code>&lt;persistable&gt;</code>には常に<code>&lt;final&gt;</code>がセットで必要になります。`,
  example: `# 継承されないことが保証されているのでpersistableにできる
record := struct<persistable><final>:
    Value : int = 0

# 継承の可能性があるクラスはpersistableにできない
# base_enemy := class<persistable>: ...  # NG(継承可能なため)`,
  problem: `「なぜ<code>&lt;persistable&gt;</code>な型には<code>&lt;final&gt;</code>が必要なのか」を、<b>継承(継承先でフィールドが増える可能性)</b>という観点から1〜2文でコメントとして説明してください。`,
  answer: `# もし継承を許すと、セーブデータを書き出した後にサブクラスが新しいフィールドを
# 追加でき、保存された時点の「形」と将来読み込む時点の「形」が食い違ってしまう
# 可能性がある。<final>で継承を禁止することで、データの形を将来にわたって
# 固定し、セーブ/ロードの安全性を保証している。`,
  note: `<code>&lt;final&gt;</code>は永続化の文脈以外でも、「この型はこれ以上拡張しない」という設計意図を明示する目的で使えます。`
},

// ---------- 147 ----------
{
  n: 147, lv: "a", cat: "永続化可能な型",
  concept: "セーブデータのバージョン設計(考え方)",
  explain: `永続化可能な型は基本的に「後から形を変えにくい」ため、実務では最初から<b>拡張しやすい形</b>で設計しておくのが定石です。例えば、将来増えそうな項目は先に<code>?型</code>のoptionにしておいたり、単純なフィールドを積み重ねる代わりに小さなstructに分けておいたりします。`,
  example: `# 将来追加されるかもしれない項目は?型にしておくと、
# 古いセーブデータ(その項目が無い状態)とも共存しやすい
save_v1 := struct<persistable><final>:
    Level : int = 1
    NewFeatureFlag : ?logic = false`,
  problem: `<b>Level</b>(int)と、<b>将来追加されるかもしれない「二つ名(称号)」</b>を表す<b>Title</b>を<b>?string型</b>で持つ、<code>&lt;persistable&gt;&lt;final&gt;</code>な<code>character_save</code>構造体を定義してください。`,
  answer: `character_save := struct<persistable><final>:
    Level : int = 1
    Title : ?string = false`,
  note: `「まだ無いかもしれない項目」を最初からoption型として設計しておくと、後からの機能追加に強いデータ構造になります。`
},

// ---------- 再帰的データ構造 ----------
{
  n: 148, lv: "a", cat: "再帰的データ構造",
  concept: "自己参照するclass(連結リストの基礎)",
  explain: `classは参照型なので、自分自身の型を指す<code>?型</code>フィールドを持てます。「次の要素へのつながり」を<code>Next : ?node</code>のようなoption型で表現すると、連結リスト(linked list)が作れます。`,
  example: `node := class:
    Value : int = 0
    var Next : ?node = false

First := node{Value := 1}
Second := node{Value := 2}
set First.Next = option{Second}`,
  problem: `<code>node</code>(上の例のもの)を3つ(<b>1</b>→<b>2</b>→<b>3</b>)つなげて連結リストを作り、先頭の<code>node</code>から<code>Next</code>をたどりながら、すべての<b>Value</b>を<code>loop</code>と<code>break</code>を使ってPrintしてください。`,
  answer: `First := node{Value := 1}
Second := node{Value := 2}
Third := node{Value := 3}
set First.Next = option{Second}
set Second.Next = option{Third}

var Current : ?node = option{First}
loop:
    if (N := Current?):
        Print("{N.Value}")
        set Current = N.Next
    else:
        break`,
  note: `「optionで次を指す」パターンは、Verseで再帰的なデータ構造を組み立てるための基本テクニックです。`
},

// ---------- 149 ----------
{
  n: 149, lv: "a", cat: "再帰的データ構造",
  concept: "再帰関数で連結リストの長さを数える",
  explain: `連結リストのような再帰的データ構造は、再帰関数と特に相性が良いです。「自分の長さ = 1 + 次のノードの長さ」という定義がそのまま関数になります。`,
  example: `NodeLength(N : ?node) : int =
    if (Current := N?):
        1 + NodeLength(Current.Next)
    else:
        0`,
  problem: `148問目の3つの<code>node</code>(1→2→3)を使い、<code>NodeLength</code>を使ってリストの長さをPrintしてください。`,
  answer: `First := node{Value := 1}
Second := node{Value := 2}
Third := node{Value := 3}
set First.Next = option{Second}
set Second.Next = option{Third}

NodeLength(N : ?node) : int =
    if (Current := N?):
        1 + NodeLength(Current.Next)
    else:
        0

Print("{NodeLength(option{First})}")   # → 3`,
  note: `再帰関数の「ベースケース(空リスト → 0)」と「再帰ケース(1つ数えて残りに委ねる)」という構造は、あらゆる再帰的データ構造に共通する考え方です。`
},

// ---------- 150 ----------
{
  n: 150, lv: "a", cat: "再帰的データ構造",
  concept: "二分木(binary tree)の基礎",
  explain: `<code>Left</code>と<code>Right</code>という2つの<code>?型</code>フィールドを持たせれば、二分木(binary tree)も表現できます。連結リストが「1本道」だったのに対し、二分木は「枝分かれ」するデータ構造です。`,
  example: `tree_node := class:
    Value : int = 0
    var Left : ?tree_node = false
    var Right : ?tree_node = false

Root := tree_node{Value := 10}
set Root.Left = option{tree_node{Value := 5}}
set Root.Right = option{tree_node{Value := 15}}`,
  problem: `<code>tree_node</code>(上の例のもの)を受け取り、木の中の<strong>すべてのノードの値の合計</strong>を再帰で計算する関数<code>SumTree(N : ?tree_node) : int</code>を作り、上の例の3ノード分のツリーで呼んでPrintしてください。`,
  answer: `tree_node := class:
    Value : int = 0
    var Left : ?tree_node = false
    var Right : ?tree_node = false

SumTree(N : ?tree_node) : int =
    if (Current := N?):
        Current.Value + SumTree(Current.Left) + SumTree(Current.Right)
    else:
        0

Root := tree_node{Value := 10}
set Root.Left = option{tree_node{Value := 5}}
set Root.Right = option{tree_node{Value := 15}}

Print("{SumTree(option{Root})}")   # → 30`,
  note: `二分木の再帰は「自分の値 + 左の合計 + 右の合計」のように、複数方向への再帰呼び出しを1つの式にまとめるのが特徴です。`
},

// ---------- 151 ----------
{
  n: 151, lv: "a", cat: "再帰的データ構造",
  concept: "木の深さ(高さ)を求める",
  explain: `二分木の「深さ」は「1 + 左右のうち深い方の深さ」という再帰的な定義で求められます。前の章で習った<code>if...then...else</code>による大小比較がここでも活躍します。`,
  example: `TreeDepth(N : ?tree_node) : int =
    if (Current := N?):
        LeftDepth := TreeDepth(Current.Left)
        RightDepth := TreeDepth(Current.Right)
        1 + (if (LeftDepth > RightDepth) then LeftDepth else RightDepth)
    else:
        0`,
  problem: `150問目のツリー(Root→Left(5)→Right(15))に対して<code>TreeDepth</code>を呼び、深さをPrintしてください。`,
  answer: `TreeDepth(N : ?tree_node) : int =
    if (Current := N?):
        LeftDepth := TreeDepth(Current.Left)
        RightDepth := TreeDepth(Current.Right)
        1 + (if (LeftDepth > RightDepth) then LeftDepth else RightDepth)
    else:
        0

Root := tree_node{Value := 10}
set Root.Left = option{tree_node{Value := 5}}
set Root.Right = option{tree_node{Value := 15}}

Print("{TreeDepth(option{Root})}")   # → 2`,
  note: `木構造のアルゴリズムの多くは「自分のノードを処理し、左右の子に再帰で委ねて結果を合成する」という同じ骨格を持っています。`
},

// ---------- 152 ----------
{
  n: 152, lv: "a", cat: "再帰的データ構造",
  concept: "再帰とloopの使い分け",
  explain: `連結リストのような「1本道」の構造は、再帰でも<code>loop</code>+<code>break</code>でも書けます(148問目の例)。木構造のように「枝分かれ」するデータは、再帰の方が自然に書けます。深いネストが心配な場合はloopベースへの書き換えも検討しますが、まずは再帰で正しく考えられるようになることが大切です。`,
  example: `# 1本道 → loopでもOK
# 枝分かれ → 再帰が自然

CountNodes(N : ?tree_node) : int =
    if (Current := N?):
        1 + CountNodes(Current.Left) + CountNodes(Current.Right)
    else:
        0`,
  problem: `<code>tree_node</code>を受け取り、木の中の<strong>ノードの総数</strong>を再帰で数える関数<code>CountNodes</code>を書き、150問目のツリー(3ノード)で呼んでPrintしてください。`,
  answer: `CountNodes(N : ?tree_node) : int =
    if (Current := N?):
        1 + CountNodes(Current.Left) + CountNodes(Current.Right)
    else:
        0

Root := tree_node{Value := 10}
set Root.Left = option{tree_node{Value := 5}}
set Root.Right = option{tree_node{Value := 15}}

Print("{CountNodes(option{Root})}")   # → 3`,
  note: `再帰関数を書くときの型のパターン「終端条件(false)で0や空を返し、それ以外は1つ処理して残りに再帰する」は、この先どんなデータ構造にも応用できます。`
},

// ---------- interfaceポリモーフィズム ----------
{
  n: 153, lv: "a", cat: "ポリモーフィズム設計",
  concept: "同じメソッド名、違う振る舞い",
  explain: `複数のクラスが同じinterfaceを実装し、同じメソッド名でもクラスごとに違う処理をする――これがポリモーフィズム(多態性)です。呼び出す側は「相手が具体的に何のクラスか」を意識せず、interfaceの規格だけを信じて呼び出せます。`,
  example: `attack_type := interface:
    Execute(Target : string) : void

sword_attack := class(attack_type):
    Execute<override>(Target : string) : void =
        Print("{Target}を斬りつけた!")

magic_attack := class(attack_type):
    Execute<override>(Target : string) : void =
        Print("{Target}に炎の魔法を放った!")`,
  problem: `<code>attack_type</code>(上の例のもの)を配列<code>[]attack_type</code>に<code>sword_attack{}</code>と<code>magic_attack{}</code>の両方入れ、<code>for</code>ですべての<code>Execute("ゴブリン")</code>を呼んでください。`,
  answer: `attack_type := interface:
    Execute(Target : string) : void

sword_attack := class(attack_type):
    Execute<override>(Target : string) : void =
        Print("{Target}を斬りつけた!")

magic_attack := class(attack_type):
    Execute<override>(Target : string) : void =
        Print("{Target}に炎の魔法を放った!")

Attacks : []attack_type = array{sword_attack{}, magic_attack{}}
for (A : Attacks):
    A.Execute("ゴブリン")`,
  note: `もし新しい攻撃方法(<code>arrow_attack</code>など)を追加したくなっても、<code>attack_type</code>を実装しさえすれば、既存の呼び出し側コードは一切変更する必要がありません。`
},

// ---------- 154 ----------
{
  n: 154, lv: "a", cat: "ポリモーフィズム設計",
  concept: "enum+case による分岐との比較",
  explain: `「種類ごとに違う処理をする」という要求には、interfaceによるポリモーフィズムだけでなく、enumと<code>case</code>式による分岐でも対応できます。<strong>種類が頻繁に増える見込みがあるならinterface(新しいクラスを追加するだけで済む)</strong>、<strong>種類がほぼ固定でロジックがシンプルならenum+case(見通しが良い)</strong>という使い分けが目安です。`,
  example: `# enum+case版(種類がほぼ固定なとき向き)
attack_kind := enum<closed>:
    Sword
    Magic

ExecuteByKind(Kind : attack_kind, Target : string) : void =
    case (Kind):
        attack_kind.Sword => Print("{Target}を斬りつけた!")
        attack_kind.Magic => Print("{Target}に魔法を放った!")`,
  problem: `153問目のinterface版と、この問題のenum+case版のどちらにも共通する<b>メリット・デメリット</b>を、それぞれ1つずつコメントで書き出してください(コードの実装は不要です)。`,
  answer: `# interface版のメリット: 新しい種類を追加するとき、既存コードを一切
#   変更せずに新しいクラスを1つ足すだけで済む(拡張に強い)
# interface版のデメリット: クラスの数が増えるほどファイル数・定義が増え、
#   全体を見渡しにくくなることがある
#
# enum+case版のメリット: 全ての種類が1箇所のcase式に集約され、見通しが良い
# enum+case版のデメリット: 新しい種類を追加するたびに、関連するすべての
#   case式を漏れなく修正する必要がある(修正漏れのリスク)`,
  note: `どちらが「正解」というわけではなく、プロジェクトの性質(種類の増減頻度)に応じて選ぶ設計判断です。`
},

// ---------- 155 ----------
{
  n: 155, lv: "a", cat: "ポリモーフィズム設計",
  concept: "共通のデフォルト実装を持つinterface",
  explain: `interfaceのメソッドにデフォルト値(デフォルト実装)を持たせられるフィールドと組み合わせることで、「多くのクラスで共通する部分」と「クラスごとに変わる部分」を整理できます。`,
  example: `describable := interface:
    Describe() : string
    Category<public> : string = "アイテム"`,
  problem: `<code>describable</code>(上の例のもの)を実装した<code>potion_item</code>クラス(<code>Describe()</code>で"ポーションです"とreturn、<b>Category</b>は"回復アイテム"に上書き)を作り、<code>Describe()</code>と<code>Category</code>の両方をPrintしてください。`,
  answer: `describable := interface:
    Describe() : string
    Category<public> : string = "アイテム"

potion_item := class(describable):
    Describe<override>() : string = "ポーションです"
    Category<override> : string = "回復アイテム"

MyPotion := potion_item{}
Print(MyPotion.Describe())
Print(MyPotion.Category)`,
  note: `メソッドは実装側で必ず定義が必要ですが、デフォルト値のあるフィールドは必要なクラスだけが上書きすればよく、共通処理の重複を減らせます。`
},

// ---------- 156 ----------
{
  n: 156, lv: "a", cat: "ポリモーフィズム設計",
  concept: "interfaceを引数の型として使う関数設計",
  explain: `interface型を引数に取る関数を設計すると、「その規格さえ満たしていれば、どんなクラスでも渡せる」汎用的な処理が書けます。テストのしやすさや、後からの機能追加のしやすさにも直結する重要な設計テクニックです。`,
  example: `ExecuteAll(Actions : []attack_type, Target : string) : void =
    for (A : Actions):
        A.Execute(Target)`,
  problem: `<code>describable</code>型(155問目のもの)の配列を受け取り、それぞれの<code>Category</code>を集計して<b>var CategoryCount : [string]int</b>にまとめる関数<code>SummarizeCategories</code>を作ってください。`,
  answer: `SummarizeCategories(Items : []describable) : [string]int =
    var CategoryCount : [string]int = map{}
    for (Item : Items):
        Current := CategoryCount[Item.Category] or 0
        set CategoryCount[Item.Category] = Current + 1
    CategoryCount

Print("{SummarizeCategories(array{potion_item{}})}")`,
  note: `interface型を受け取る関数は、実装クラスが増えても書き換える必要がないため、大規模なコードベースほど威力を発揮します。`
},

// ---------- 157 ----------
{
  n: 157, lv: "a", cat: "ポリモーフィズム設計",
  concept: "複数interfaceの同時実装",
  explain: `1つのクラスは、複数のinterfaceを同時に実装できます。「ダメージを受けられる」かつ「説明を表示できる」もの、のように複数の規格を同時に満たすオブジェクトを設計できます。`,
  example: `damageable := interface:
    TakeDamage(Amount : int) : void

describable := interface:
    Describe() : string

crate := class(damageable, describable):
    var Health : int = 20

    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)

    Describe<override>() : string = "木箱です"`,
  problem: `<code>crate</code>(上の例のもの)を1つ作り、<code>TakeDamage(5)</code>を呼んでから、<code>Describe()</code>と<b>Health</b>の両方をPrintしてください。`,
  answer: `damageable := interface:
    TakeDamage(Amount : int) : void

describable := interface:
    Describe() : string

crate := class(damageable, describable):
    var Health : int = 20

    TakeDamage<override>(Amount : int) : void =
        set Health = Max(0, Health - Amount)

    Describe<override>() : string = "木箱です"

MyCrate := crate{}
MyCrate.TakeDamage(5)
Print(MyCrate.Describe())
Print("{MyCrate.Health}")`,
  note: `<code>class(A, B)</code>のようにカンマで並べることで、複数のinterfaceを同時に実装できます(親クラスは1つまでですが、interfaceの数に制限はありません)。`
},

// ---------- コールバック/Strategyパターン ----------
{
  n: 158, lv: "a", cat: "コールバック設計",
  concept: "1メソッドinterfaceによる「振る舞いの差し替え」",
  explain: `「処理そのものを、あとから差し替えたい」というときは、1つのメソッドだけを持つinterfaceを定義し、それを実装したクラスを「差し替え可能な振る舞い」として扱う設計(Strategyパターン)が定番です。関数そのものを値として渡すのに近い効果を、interfaceで安全に実現できます。`,
  example: `action := interface:
    Execute() : void

heal_action := class(action):
    Execute<override>() : void = Print("回復!")

attack_action := class(action):
    Execute<override>() : void = Print("攻撃!")

RunAction(A : action) : void = A.Execute()`,
  problem: `<code>action</code>(上の例のもの)を実装した<code>defend_action</code>クラス(<code>Execute()</code>で「防御!」とPrint)を作り、<code>RunAction</code>に<code>heal_action{}</code>・<code>attack_action{}</code>・<code>defend_action{}</code>を順番に渡してください。`,
  answer: `action := interface:
    Execute() : void

heal_action := class(action):
    Execute<override>() : void = Print("回復!")

attack_action := class(action):
    Execute<override>() : void = Print("攻撃!")

defend_action := class(action):
    Execute<override>() : void = Print("防御!")

RunAction(A : action) : void = A.Execute()

RunAction(heal_action{})
RunAction(attack_action{})
RunAction(defend_action{})`,
  note: `この設計の強みは、<code>RunAction</code>自体は一切変更せずに、新しい行動(<code>action</code>を実装したクラス)をいくらでも追加できることです。`
},

// ---------- 159 ----------
{
  n: 159, lv: "a", cat: "コールバック設計",
  concept: "var フィールドで振る舞いを実行時に切り替える",
  explain: `interface型の<code>var</code>フィールドを持たせておくと、実行の途中で「振る舞いそのもの」を差し替えられます。「AIの行動パターンが、状況によって変わる」ようなキャラクター設計に使えます。`,
  example: `character_ai := class:
    var CurrentAction : action = heal_action{}

    SwitchTo(NewAction : action) : void =
        set CurrentAction = NewAction

    Act() : void =
        CurrentAction.Execute()`,
  problem: `<code>character_ai</code>(上の例のもの)のインスタンスを1つ作り、まず<code>Act()</code>(デフォルトのheal_action)を呼び、次に<code>SwitchTo(attack_action{})</code>してから再度<code>Act()</code>を呼んでください。`,
  answer: `character_ai := class:
    var CurrentAction : action = heal_action{}

    SwitchTo(NewAction : action) : void =
        set CurrentAction = NewAction

    Act() : void =
        CurrentAction.Execute()

AI := character_ai{}
AI.Act()                        # → 回復!
AI.SwitchTo(attack_action{})
AI.Act()                        # → 攻撃!`,
  note: `「データと一緒に、差し替え可能な振る舞いを持ち運ぶ」設計は、ゲームAIやUIの状態に応じたボタンの挙動切り替えなど、幅広い場面で応用できます。`
},

// ---------- 160 ----------
{
  n: 160, lv: "a", cat: "コールバック設計",
  concept: "条件付きinterfaceの実行(コマンドパターン)",
  explain: `複数の<code>action</code>を配列として順番に実行する「コマンド列」を作れば、あらかじめ決めた一連の行動をまとめて再生できます。ゲームのリプレイやマクロ機能の基礎的な考え方です。`,
  example: `RunSequence(Actions : []action) : void =
    for (A : Actions):
        A.Execute()`,
  problem: `<code>RunSequence</code>を使い、<code>attack_action{}</code>→<code>heal_action{}</code>→<code>attack_action{}</code>という順番の行動列を、<code>[]action</code>の配列として実行してください。`,
  answer: `RunSequence(Actions : []action) : void =
    for (A : Actions):
        A.Execute()

RunSequence(array{attack_action{}, heal_action{}, attack_action{}})`,
  note: `「振る舞いを表すオブジェクトを配列に並べて、順番に実行する」という発想はコマンドパターンと呼ばれ、行動の記録・再生・取り消しなどに応用できます。`
},

// ---------- 161 ----------
{
  n: 161, lv: "a", cat: "コールバック設計",
  concept: "条件によって実行するactionを選ぶファクトリ関数",
  explain: `「状況に応じて、どのactionを使うか」を決める関数(ファクトリ関数)を用意しておくと、呼び出し側は判断ロジックを気にせず、結果として返ってきたactionをそのまま実行するだけで済みます。`,
  example: `ChooseAction(Hp : int) : action =
    if (Hp < 30) then heal_action{} else attack_action{}`,
  problem: `<code>ChooseAction</code>を参考に、<code>ChooseAction2(Hp : int, EnemyNearby : logic) : action</code>という関数を作り、<b>「Hpが20未満ならheal_action、そうでなくEnemyNearbyがtrueならattack_action、それ以外はdefend_action」</b>を返すようにしてください。`,
  answer: `ChooseAction2(Hp : int, EnemyNearby : logic) : action =
    if (Hp < 20) then heal_action{}
    else if (EnemyNearby) then attack_action{}
    else defend_action{}

RunAction(ChooseAction2(15, false))    # → 回復!
RunAction(ChooseAction2(80, true))     # → 攻撃!
RunAction(ChooseAction2(80, false))    # → 防御!`,
  note: `「判断ロジック(ChooseAction2)」と「実行ロジック(RunAction)」を分離しておくと、それぞれを独立してテスト・変更しやすくなります。`
},

// ---------- 162 ----------
{
  n: 162, lv: "a", cat: "コールバック設計",
  concept: "actionの結果を記録するロギング設計",
  explain: `<code>action</code>を実行するたびに、その履歴を配列に記録しておく設計も実務でよく使われます。「何が、いつ実行されたか」を追跡できるようにしておくと、デバッグやリプレイ機能に役立ちます。`,
  example: `action_logger := class:
    var History<private> : []string = array{}

    LogAndRun<public>(Name : string, A : action) : void =
        A.Execute()
        set History += array{Name}

    ShowHistory<public>() : void =
        Print("{History}")`,
  problem: `<code>action_logger</code>(上の例のもの)のインスタンスを1つ作り、<code>LogAndRun("最初の攻撃", attack_action{})</code>と<code>LogAndRun("回復", heal_action{})</code>を呼んでから、<code>ShowHistory()</code>を呼んでください。`,
  answer: `action_logger := class:
    var History<private> : []string = array{}

    LogAndRun<public>(Name : string, A : action) : void =
        A.Execute()
        set History += array{Name}

    ShowHistory<public>() : void =
        Print("{History}")

Logger := action_logger{}
Logger.LogAndRun("最初の攻撃", attack_action{})
Logger.LogAndRun("回復", heal_action{})
Logger.ShowHistory()`,
  note: `<code>&lt;private&gt;</code>な履歴フィールドと<code>&lt;public&gt;</code>な記録用メソッドの組み合わせは、「外部から履歴を直接改ざんされたくない」という設計意図を型システムで保証しています。`
},

// ---------- 型リファインメント ----------
{
  n: 163, lv: "a", cat: "型のリファインメント",
  concept: "type{_X : 型 where 条件} による値の絞り込み",
  explain: `<code>type{_X : 型 where 条件}</code>という書き方で、「ある型の中でも、特定の条件を満たす値だけ」を新しい型として定義できます。「0以上100以下のint」のような、値の範囲を型そのもので保証したいときに使います。`,
  example: `percentage_int := type{_X : int where 0 <= _X, _X <= 100}`,
  problem: `<code>percentage_int</code>を参考に、<b>1以上5以下のint</b>だけを表す<code>star_rating</code>という型を、<code>type{...}</code>で定義してください。`,
  answer: `star_rating := type{_X : int where 1 <= _X, _X <= 5}`,
  note: `<code>_X</code>は「この型に当てはまるかどうかを判定する対象の値」を表す、type{}構文の中だけで使う特別な名前です。`
},

// ---------- 164 ----------
{
  n: 164, lv: "a", cat: "型のリファインメント",
  concept: "リファインメント型を引数の型として使う",
  explain: `type{}で定義したリファインメント型は、通常の型と同じように関数の引数や戻り値の型として使えます。「この関数は、必ず0〜100の範囲のintしか受け取らない」という制約を、型シグネチャに直接埋め込めます。`,
  example: `percentage_int := type{_X : int where 0 <= _X, _X <= 100}

DescribeProgress(P : percentage_int) : string =
    "{P}% 完了"`,
  problem: `163問目の<code>star_rating</code>を引数に取り、<b>"評価: ★{値}"</b>という文字列を返す関数<code>DescribeRating</code>を作ってください。`,
  answer: `star_rating := type{_X : int where 1 <= _X, _X <= 5}

DescribeRating(R : star_rating) : string =
    "評価: ★{R}"

Print(DescribeRating(4))`,
  note: `リファインメント型を関数の引数にすることで、「範囲外の値を渡すこと自体ができない」という強力な安全性を型レベルで手に入れられます。`
},

// ---------- 165 ----------
{
  n: 165, lv: "a", cat: "型のリファインメント",
  concept: "リファインメント型とfloatの組み合わせ",
  explain: `リファインメント型はintだけでなく、floatなど他の型にも使えます。「0.0以上1.0以下のfloat」のような割合表現に向いています。`,
  example: `percent := type{_X : float where 0.0 <= _X, _X <= 1.0}`,
  problem: `<code>percent</code>を参考に、<b>-1.0以上1.0以下のfloat</b>だけを表す<code>normalized_value</code>という型を<code>type{}</code>で定義し、それを受け取ってPrintするだけの関数<code>ShowNormalized(V : normalized_value) : void</code>を作ってください。`,
  answer: `normalized_value := type{_X : float where -1.0 <= _X, _X <= 1.0}

ShowNormalized(V : normalized_value) : void =
    Print("{V}")

ShowNormalized(0.5)`,
  note: `ゲーム開発では「向き(-1〜1)」や「割合(0〜1)」のような、意味のある範囲を持つ数値がよく登場します。リファインメント型はこうした値の表現にぴったりです。`
},

// ---------- 166 ----------
{
  n: 166, lv: "a", cat: "型のリファインメント",
  concept: "リファインメント型 vs if文によるチェックの違い",
  explain: `「値が範囲内かどうか」を毎回<code>if</code>でチェックするやり方でも同じ安全性を実現できますが、その場合は<strong>チェックを書き忘れるリスク</strong>が常につきまといます。リファインメント型を使えば、そもそも範囲外の値を持つ変数自体が「その型」として成立しないため、コンパイラのレベルでミスを防げます。`,
  example: `# if文でのチェック(書き忘れるリスクがある)
ValidateManually(X : int) : void =
    if (X >= 0, X <= 100):
        Print("OK")
    else:
        Print("範囲外!")

# リファインメント型(そもそも範囲外の値を渡せない)
percentage_int := type{_X : int where 0 <= _X, _X <= 100}
ValidateByType(X : percentage_int) : void =
    Print("OK")`,
  problem: `「なぜリファインメント型の方が、if文によるチェックより安全と言えるのか」を1〜2文でコメントとして説明してください。`,
  answer: `# if文によるチェックは、関数を書くたびに毎回手動でチェックを書く必要があり、
# 1箇所でも書き忘れると範囲外の値がすり抜けてバグの原因になる。
# リファインメント型は「その型の値である」こと自体が範囲内であることの
# 証明になるため、うっかり書き忘れるということが構造的に起こらない。`,
  note: `「実行時にチェックする」のではなく「そもそも不正な値を作れないようにする」という考え方は、堅牢な型システムを持つ言語に共通する設計思想です。`
},

// ---------- 167 ----------
{
  n: 167, lv: "a", cat: "型のリファインメント",
  concept: "複数条件を持つリファインメント型",
  explain: `<code>where</code>の後にはカンマで複数の条件を並べられます(if文のカンマ連結と同じ書き方です)。「特定の倍数だけ」のような、より複雑な制約も表現できます。`,
  example: `even_positive := type{_X : int where _X > 0, Mod(_X, 2) = 0}`,
  problem: `<code>even_positive</code>を参考に、<b>10の倍数かつ0以上</b>のintだけを表す<code>round_number</code>という型を<code>type{}</code>で定義してください。`,
  answer: `round_number := type{_X : int where _X >= 0, Mod(_X, 10) = 0}`,
  note: `複数条件のリファインメント型は、「ゲームの経験値は必ず10刻み」のような、業務ロジック上のルールをそのまま型で表現するのに使えます。`
},

// ---------- モジュール設計 ----------
{
  n: 168, lv: "a", cat: "モジュール設計",
  concept: "フォルダ構造 = モジュール構造という原則",
  explain: `Verseのプロジェクトが大きくなってきたら、機能ごとにフォルダを分けます。フォルダがそのままモジュールになるため、「Combatフォルダ」「Inventoryフォルダ」のように分けておけば、それぞれが自然な単位のモジュールになります。`,
  example: `# フォルダ構成のイメージ(コメントとして)
# /YourGame
#   /Combat       -- CombatModule
#   /Inventory    -- InventoryModule
#   /UI           -- UiModule`,
  problem: `「戦闘」「インベントリ」「ショップ」の3つの機能を持つゲームを想定し、それぞれをどんなフォルダ(モジュール)に分けるべきか、フォルダ名の案をコメントとして3つ書き出してください。`,
  answer: `# /Combat    -- 戦闘関連(ダメージ計算、攻撃パターンなど)
# /Inventory -- 持ち物・アイテム管理関連
# /Shop      -- 購入・売却・価格設定関連`,
  note: `機能ごとにモジュールを分けておくと、「このバグはどのフォルダを見ればいいか」が直感的にわかり、チーム開発でも作業がぶつかりにくくなります。`
},

// ---------- 169 ----------
{
  n: 169, lv: "a", cat: "モジュール設計",
  concept: "公開するAPIと内部実装を分ける",
  explain: `モジュールを設計するときは、「外部に見せたいもの(<code>&lt;public&gt;</code>)」と「モジュール内部でしか使わないもの(指定なし=internal、または<code>&lt;private&gt;</code>)」を明確に区別しましょう。公開する範囲を絞るほど、後から内部実装を自由に変更しやすくなります。`,
  example: `CombatModule := module:
    # 外部に公開するAPI
    CalculateDamage<public>(Base : int) : int =
        ApplyModifiers(Base)

    # モジュール内部だけで使うヘルパー(internal、指定なし)
    ApplyModifiers(Base : int) : int =
        Base * 2`,
  problem: `<code>ScoreModule</code>というmoduleを作り、外部に公開する<code>&lt;public&gt;</code>な<code>CalculateFinalScore(Base:int):int</code>と、内部だけで使う(指定なしの)ヘルパー関数<code>ApplyBonus(Base:int):int</code>(値を1.5倍して返す、int同士の計算でOK)を定義してください。`,
  answer: `ScoreModule := module:
    CalculateFinalScore<public>(Base : int) : int =
        ApplyBonus(Base)

    ApplyBonus(Base : int) : int =
        Base * 3 / 2`,
  note: `「公開APIは最小限に、内部実装はできるだけ隠す」という設計原則は、Verseに限らずソフトウェア設計全般で重要な考え方です。`
},

// ---------- 170 ----------
{
  n: 170, lv: "a", cat: "モジュール設計",
  concept: "モジュール間の依存関係を一方向に保つ",
  explain: `モジュールAがモジュールBを<code>using</code>し、同時にBもAを<code>using</code>する「循環依存」は、コードの見通しを悪くする典型的な設計ミスです。「下位モジュール(共通のデータ型など)→上位モジュール(それを使う機能)」のように、依存の向きを一方向にそろえるのが良い設計です。`,
  example: `# 良い例: CoreTypesは誰にも依存せず、他から使われるだけ
# CoreTypes := module: item := struct: ...
#
# CombatModule は CoreTypes を using する(依存の向きが一方向)
# using { CoreTypes }`,
  problem: `「ItemModule(アイテムのstructを定義)」「CombatModule(ItemModuleのitemを使ってダメージ計算)」「ShopModule(ItemModuleのitemを使って価格計算)」という3モジュールを想定したとき、<b>誰が誰をusingするべきか</b>を矢印(→)を使ってコメントで表現してください。`,
  answer: `# CombatModule → ItemModule (CombatがItemModuleをusingする)
# ShopModule   → ItemModule (ShopもItemModuleをusingする)
# ItemModule はどちらもusingしない(一番下位の共通モジュールとして独立させる)`,
  note: `「共通のデータ型を定義するだけの、依存の無いモジュール」を土台に据える設計は、循環依存を未然に防ぐ効果的な方法です。`
},

// ---------- 171 ----------
{
  n: 171, lv: "a", cat: "モジュール設計",
  concept: "設定値をmoduleに集約する",
  explain: `ゲーム全体で使う定数(税率、最大人数、初期HPなど)を1つのconfigモジュールにまとめておくと、後から数値を調整したいときに1箇所を直すだけで済みます。あちこちに同じ数値を直接書く(マジックナンバー)のは避けましょう。`,
  example: `GameConfig := module:
    MaxPlayers<public> : int = 16
    StartingHp<public> : int = 100
    TaxRate<public> : float = 0.1`,
  problem: `<b>MaxInventorySlots</b>(int, <b>20</b>)、<b>RespawnSeconds</b>(float, <b>5.0</b>)、<b>DefaultDifficulty</b>(string, <b>"Normal"</b>)の3つをまとめた<code>&lt;public&gt;</code>な<code>GameSettings</code>モジュールを定義してください。`,
  answer: `GameSettings := module:
    MaxInventorySlots<public> : int = 20
    RespawnSeconds<public> : float = 5.0
    DefaultDifficulty<public> : string = "Normal"`,
  note: `設定値を1箇所に集約しておくと、バランス調整の際に「あの数値、どこに書いたっけ?」と探し回らずに済みます。`
},

// ---------- 172 ----------
{
  n: 172, lv: "a", cat: "モジュール設計",
  concept: "scoped によるモジュール間の限定公開",
  explain: `<code>&lt;scoped{モジュール名}&gt;</code>を使うと、「完全に公開(public)」でも「完全に非公開(internal/private)」でもない、「特定の信頼できるモジュールにだけ見せる」という中間の公開範囲を作れます。「合鍵を渡す相手を選ぶ」イメージです。`,
  example: `InternalDataModule := module:
    # AdminModuleだけに見せる合鍵
    SecretValue<scoped{AdminModule}> : int = 42`,
  problem: `「なぜ、単純に&lt;public&gt;にせず&lt;scoped{...}&gt;を使う場面があるのか」を、<b>セキュリティやカプセル化の観点</b>から1〜2文でコメントとして説明してください。`,
  answer: `# <public>にすると、プロジェクト内のあらゆるモジュールから自由にアクセスできて
# しまい、意図しない使われ方(誤用や不正な書き換え)を防げない。
# <scoped{...}>を使うことで、「本当に必要な、信頼できる特定のモジュールにだけ」
# アクセスを許可でき、公開範囲を必要最小限に絞ったカプセル化ができる。`,
  note: `アクセス指定子の選択は「動けばいい」だけでなく、「将来誤って壊されないためのガードレールをどう設計するか」という視点が重要です。`
},

// ---------- immutable設計 ----------
{
  n: 173, lv: "a", cat: "immutable設計",
  concept: "「基本は不変」というVerseの設計思想",
  explain: `Verseは「基本は不変(<code>:=</code>)、必要なときだけ<code>var</code>で可変にする」という設計になっています。不変な値は、いつどこで読んでも同じ値であることが保証されるため、バグの温床になりにくく、並行処理の中でも安心して扱えます。`,
  example: `# 不必要にvarを使うと、どこで値が変わるかわかりにくくなる
var Total : int = 0
# 本当にこの値は「あとから変わる」必要があるか、常に考える`,
  problem: `次の関数は<code>var</code>を使っていますが、実は不要です。<code>var</code>を使わない(不変な値だけで書く)バージョンに書き換えてください。
<code>CalcTotal(A : int, B : int) : int =
    var Result : int = A
    set Result += B
    Result</code>`,
  answer: `CalcTotal(A : int, B : int) : int =
    Result := A + B
    Result`,
  note: `「一度計算したら、あとから変える必要が無い」場合は、迷わず<code>:=</code>(不変)を選びましょう。<code>var</code>は「本当にあとから書き換える必要があるとき」の最終手段です。`
},

// ---------- 174 ----------
{
  n: 174, lv: "a", cat: "immutable設計",
  concept: "「新しい値を作って返す」設計 vs 「その場で書き換える」設計",
  explain: `structの値を書き換えたいとき、「元の値をvarで持ち、フィールドをsetする」代わりに「新しいstructを作って返す」設計にすると、元のデータを一切変更しない(副作用のない)関数として書けます。<code>&lt;computes&gt;</code>とも相性が良い考え方です。`,
  example: `point := struct:
    X : float = 0.0
    Y : float = 0.0

# 書き換える版(副作用あり)
MoveInPlace(var P : point, Dx : float) : void =
    set P.X += Dx

# 新しい値を作って返す版(副作用なし、computesにできる)
Moved(P : point, Dx : float)<computes> : point =
    point{X := P.X + Dx, Y := P.Y}`,
  problem: `<code>Moved</code>を参考に、<code>point</code>のYだけを動かす<code>MovedY(P : point, Dy : float)<computes> : point</code>関数を作り、<code>MovedY(point{X := 1.0, Y := 2.0}, 5.0)</code>の結果をPrintしてください。`,
  answer: `MovedY(P : point, Dy : float)<computes> : point =
    point{X := P.X, Y := P.Y + Dy}

Result := MovedY(point{X := 1.0, Y := 2.0}, 5.0)
Print("({Result.X}, {Result.Y})")   # → (1.0, 7.0)`,
  note: `「新しい値を返す」設計は、元のデータへの意図しない書き換えを防げるだけでなく、複数の処理を安全に並行実行しやすくなるという利点もあります。`
},

// ---------- 175 ----------
{
  n: 175, lv: "a", cat: "immutable設計",
  concept: "classの中でも不変を意識する",
  explain: `classは参照型で「共有」される性質を持つため、classのフィールドを不用意に<code>var</code>にすると、「どこからでも書き換えられる、追跡しづらい状態」になりがちです。本当に書き換える必要があるフィールドだけを<code>var</code>にし、それ以外は不変のまま保つことを意識しましょう。`,
  example: `# Nameは一度決まったら変わらないので不変、Healthだけvar
character := class:
    Name : string          # 不変
    var Health : int = 100 # 可変(必要な部分だけ)`,
  problem: `次の<code>enemy</code>クラスには、本来変わるはずのない<b>Name</b>にまで<code>var</code>が付いています。<b>Nameを不変、Hpだけ可変</b>に修正してください。
<code>enemy := class:
    var Name : string
    var Hp : int = 50</code>`,
  answer: `enemy := class:
    Name : string
    var Hp : int = 50`,
  note: `「このフィールドは本当にあとから変わるのか?」を1つずつ問い直す習慣が、読みやすく壊れにくい設計につながります。`
},

// ---------- 176 ----------
{
  n: 176, lv: "a", cat: "immutable設計",
  concept: "不変な値でも、参照先(class)の中身は変わりうる",
  explain: `<code>:=</code>で不変に定義した変数でも、その中身が<strong>class</strong>(参照型)なら、classの中の<code>var</code>フィールドは変更できてしまいます。「変数そのものへの再代入はできない」ことと「参照先のオブジェクトの中身が変わらない」ことは<strong>別の話</strong>である点に注意しましょう。`,
  example: `MyChar := character{Name := "ゆうた"}   # MyChar自体は不変(再代入は不可)
MyChar.TakeDamage(30)                     # でもHealthは変わる(classのvarフィールドのため)
# MyChar = AnotherCharacter                # ← これはコンパイルエラー(不変な変数への再代入)`,
  problem: `次の説明が正しいか誤りかを判定し、理由をコメントで説明してください:「<code>Hero := character{Name := "ゆうた"}</code>と書けば、Heroが指すキャラクターのHealthも含めて、一切変更できなくなる」`,
  answer: `# 誤り。:= はHero「という変数」への再代入(Heroに別のcharacterを入れ直すこと)を
# 禁止するだけであり、Heroが指しているcharacterインスタンスの中のvarフィールド
# (Healthなど)は、character側でvarとして宣言されている限り、
# Hero.TakeDamage(...)のようなメソッド経由で引き続き変更できる。`,
  note: `「変数の不変性」と「参照先オブジェクトの可変性」は独立した概念です。この違いを理解しておくと、classまわりの予期せぬ挙動に悩まされにくくなります。`
},

// ---------- 177 ----------
{
  n: 177, lv: "a", cat: "immutable設計",
  concept: "不変データを前提にしたAPI設計",
  explain: `関数やメソッドのAPIを設計するときは、「受け取ったデータを書き換えない」ことを前提にすると、呼び出し側は安心してデータを渡せます。struct(コピーされる)を積極的に使い、classの<code>&lt;private&gt;</code>な内部データを外に直接晒さない設計は、このための具体的な手段です。`,
  example: `# 良い設計: 引数を書き換えず、新しい結果を返す
FilterPositive(Numbers : []int)<computes> : []int =
    for (N : Numbers, N > 0):
        N`,
  problem: `int配列を受け取り、<b>元の配列は一切変更せず</b>、すべての要素を2倍にした<strong>新しい配列</strong>を返す<code>&lt;computes&gt;</code>関数<code>Doubled</code>を作り、<code>Doubled(array{1, 2, 3})</code>の結果と、元の配列が変わっていないことの両方をPrintで確認してください。`,
  answer: `Doubled(Numbers : []int)<computes> : []int =
    for (N : Numbers):
        N * 2

Original := array{1, 2, 3}
Result := Doubled(Original)
Print("{Result}")     # → (2, 4, 6)
Print("{Original}")   # → (1, 2, 3) ← 変わっていない`,
  note: `「渡したデータが、知らないうちに書き換えられているかもしれない」という不安が無いAPIは、それだけでバグを生みにくく、安心して使えます。`
},

// ---------- 状態機械 ----------
{
  n: 178, lv: "a", cat: "状態機械",
  concept: "enum<open> + case による状態管理の基本形",
  explain: `ゲームの進行状況(待機中・進行中・終了など)は、状態機械(ステートマシン)として設計すると整理しやすくなります。<code>enum&lt;open&gt;</code>で状態の種類を定義し、<code>case</code>式で「今の状態に応じた振る舞い」を切り替えます。`,
  example: `game_state := enum<open>:
    Waiting
    Playing
    Finished

DescribeState(S : game_state) : string =
    case (S):
        game_state.Waiting  => "開始を待っています"
        game_state.Playing  => "プレイ中です"
        game_state.Finished => "終了しました"
        _                     => "不明な状態です"`,
  problem: `<code>game_state</code>(上の例のもの)型の<b>var State</b>フィールドを持つ<code>game_session</code>クラスを作り、<b>Announce()</b>メソッドで<code>DescribeState(State)</code>をPrintするようにしてください。<code>game_session{}</code>を作ってから<code>set</code>で<b>Playing</b>に変えて呼んでください。`,
  answer: `game_session := class:
    var State : game_state = game_state.Waiting

    Announce() : void =
        Print(DescribeState(State))

Session := game_session{}
set Session.State = game_state.Playing
Session.Announce()   # → プレイ中です`,
  note: `enumで「今どの状態か」を表現し、caseでその状態ごとの振る舞いを分岐させる――これが状態機械の最も基本的な骨格です。`
},

// ---------- 179 ----------
{
  n: 179, lv: "a", cat: "状態機械",
  concept: "許可された遷移だけを受け付ける",
  explain: `本格的な状態機械では、「どの状態からどの状態へ遷移してよいか」をコードで制御します。<code>&lt;decides&gt;</code>な遷移メソッドを使えば、「不正な遷移は失敗として扱う」という安全な設計ができます。`,
  example: `game_session := class:
    var State : game_state = game_state.Waiting

    StartGame()<decides> : void =
        State = game_state.Waiting   # Waiting状態からしか開始できない
        set State = game_state.Playing`,
  problem: `<code>game_session</code>に、<b>Playing状態のときだけ成功する</b><code>&lt;decides&gt;</code>な<code>FinishGame()</code>メソッド(成功したら<code>State</code>を<code>Finished</code>にする)を追加し、<code>Waiting</code>状態のまま<code>FinishGame()</code>を呼んで<strong>失敗すること</strong>をif文で確認してください。`,
  answer: `game_session := class:
    var State : game_state = game_state.Waiting

    FinishGame()<decides> : void =
        State = game_state.Playing
        set State = game_state.Finished

Session := game_session{}
if (Session.FinishGame()):
    Print("終了しました")
else:
    Print("Playing状態でないと終了できません")`,
  note: `「不正な遷移をそもそも実行させない」設計は、状態管理のバグ(あり得ないはずの状態になってしまう)を大きく減らします。`
},

// ---------- 180 ----------
{
  n: 180, lv: "a", cat: "状態機械",
  concept: "並行処理と状態機械の組み合わせ",
  explain: `<code>race</code>による「制限時間か、目標達成か」の競争と、enum状態管理を組み合わせると、実務的なゲームロジック(タイムアタックなど)が書けます。「クリアか、タイムアウトか」を<code>race</code>で競わせ、その結果で状態を更新する設計です。`,
  example: `RunRound(Session : game_session, TimeLimit : float)<suspends> : void =
    race:
        block:
            WaitForClear()
            set Session.State = game_state.Finished
        block:
            Sleep(TimeLimit)
            set Session.State = game_state.Waiting`,
  problem: `<code>RunRound</code>を参考に、<code>game_session</code>を受け取り、<b>10秒のタイムリミット</b>で<code>WaitForClear()</code>と競わせ、結果に応じて<code>Announce()</code>まで呼ぶ<code>&lt;suspends&gt;</code>関数<code>PlayTimedRound</code>を書いてください。`,
  answer: `PlayTimedRound(Session : game_session)<suspends> : void =
    race:
        block:
            WaitForClear()
            set Session.State = game_state.Finished
        block:
            Sleep(10.0)
            set Session.State = game_state.Waiting
    Session.Announce()`,
  note: `race・enum・classのメソッドという、これまで習った複数の要素が1つの現実的な処理の中で自然に組み合わさっています。`
},

// ---------- 181 ----------
{
  n: 181, lv: "a", cat: "状態機械",
  concept: "状態ごとに許可される操作を制限する",
  explain: `状態機械の重要な役割の1つは、「今の状態では、この操作は許可しない」ことを保証することです。<code>&lt;decides&gt;</code>を使い、メソッドの冒頭で現在の状態をチェックすることで、これを型システムと組み合わせた形で表現できます。`,
  example: `shop_session := class:
    var IsOpen : logic = false

    Purchase(ItemPrice : int)<decides> : void =
        IsOpen   # Openでなければここで失敗
        Print("{ItemPrice}円の商品を購入しました")`,
  problem: `<code>shop_session</code>(上の例のもの)を参考に、<b>IsOpenがtrueのときだけ成功する</b><code>&lt;decides&gt;</code>な<code>CheckStock(Count : int) : void</code>メソッド(<b>Countが0より大きければ成功</b>、という条件も追加で満たす必要がある)を作ってください。`,
  answer: `shop_session := class:
    var IsOpen : logic = false

    CheckStock(Count : int)<decides> : void =
        IsOpen
        Count > 0
        Print("在庫あり: {Count}個")

Shop := shop_session{IsOpen := true}
if (Shop.CheckStock(3)):
    Print("購入可能")
else:
    Print("購入できません")`,
  note: `<code>&lt;decides&gt;</code>な関数の中では、条件式を単独の行として書くだけで、それが失敗すればそこで処理全体が失敗として打ち切られます(if文を使わずに済む、簡潔な書き方です)。`
},

// ---------- 182 ----------
{
  n: 182, lv: "a", cat: "状態機械",
  concept: "状態遷移の履歴を記録する",
  explain: `状態が変わるたびに、その履歴を配列に記録しておくと、「どういう経緯で今の状態になったか」を後から追跡できます。デバッグやリプレイ、実績(アチーブメント)判定などに応用できる設計です。`,
  example: `tracked_session := class:
    var State : game_state = game_state.Waiting
    var History<private> : []game_state = array{}

    ChangeState<public>(NewState : game_state) : void =
        set State = NewState
        set History += array{NewState}`,
  problem: `<code>tracked_session</code>(上の例のもの)のインスタンスを1つ作り、<code>ChangeState</code>で<b>Playing</b>→<b>Finished</b>の順に状態を変えたあと、<b>History</b>を(publicなメソッドを追加して)取り出しPrintしてください。`,
  answer: `tracked_session := class:
    var State : game_state = game_state.Waiting
    var History<private> : []game_state = array{}

    ChangeState<public>(NewState : game_state) : void =
        set State = NewState
        set History += array{NewState}

    GetHistory<public>() : []game_state = History

Session := tracked_session{}
Session.ChangeState(game_state.Playing)
Session.ChangeState(game_state.Finished)
Print("{Session.GetHistory()}")`,
  note: `<code>&lt;private&gt;</code>な履歴データを、専用の<code>&lt;public&gt;</code>なGetterメソッド経由でのみ読み出せるようにする設計は、カプセル化の基本形です。`
},

// ---------- map+classシステム ----------
{
  n: 183, lv: "a", cat: "小規模システム設計",
  concept: "ミニショップシステムの土台",
  explain: `ここからは、map・class・struct・interfaceを組み合わせた、小さな「実務っぽい」システムを組み立てていきます。まずは商品リストを表す仕組みから始めましょう。`,
  example: `shop_item := struct:
    Name : string = ""
    Price : int = 0
    Stock : int = 0

shop := class:
    var Items<private> : [string]shop_item = map{}

    AddItem<public>(NewItem : shop_item) : void =
        set Items[NewItem.Name] = NewItem`,
  problem: `<code>shop</code>(上の例のもの)に、<b>&lt;public&gt;</b>な<code>GetItem(Name : string) : ?shop_item</code>メソッド(見つかればその商品を返し、無ければfalse)を追加してください。そのうえで<code>shop_item{Name := "回復薬", Price := 100, Stock := 5}</code>を1つ登録し、<code>GetItem("回復薬")</code>の結果をPrintしてください。`,
  answer: `shop_item := struct:
    Name : string = ""
    Price : int = 0
    Stock : int = 0

shop := class:
    var Items<private> : [string]shop_item = map{}

    AddItem<public>(NewItem : shop_item) : void =
        set Items[NewItem.Name] = NewItem

    GetItem<public>(Name : string) : ?shop_item =
        if (Found := Items[Name]):
            option{Found}
        else:
            false

MyShop := shop{}
MyShop.AddItem(shop_item{Name := "回復薬", Price := 100, Stock := 5})

if (Item := MyShop.GetItem("回復薬")?):
    Print("{Item.Name}: {Item.Price}円")
else:
    Print("見つかりません")`,
  note: `商品を「名前をキーにしたmap」で管理すると、商品検索のたびに配列を先頭からなめる必要がなく、直接キーでアクセスできます。`
},

// ---------- 184 ----------
{
  n: 184, lv: "a", cat: "小規模システム設計",
  concept: "在庫を減らす購入処理(transacts)",
  explain: `購入処理は「在庫があるか確認 → 在庫を減らす → 完了」という一連の流れです。途中で失敗する可能性がある(在庫不足)ので、<code>&lt;decides&gt;&lt;transacts&gt;</code>な設計にすると安全です。`,
  example: `shop := class:
    var Items<private> : [string]shop_item = map{}

    AddItem<public>(NewItem : shop_item) : void =
        set Items[NewItem.Name] = NewItem

    Purchase<public>(Name : string)<decides><transacts> : void =
        Item := Items[Name]
        Item.Stock > 0
        set Items[Name] = shop_item{Name := Item.Name, Price := Item.Price, Stock := Item.Stock - 1}`,
  problem: `<code>shop</code>(上の例のもの)に、<b>"回復薬"を1個だけ在庫として持つ状態</b>を作り、<code>Purchase("回復薬")</code>を<strong>2回連続</strong>で呼んで、<b>1回目は成功、2回目は在庫切れで失敗する</b>ことをif文でPrintして確認してください。`,
  answer: `shop_item := struct:
    Name : string = ""
    Price : int = 0
    Stock : int = 0

shop := class:
    var Items<private> : [string]shop_item = map{}

    AddItem<public>(NewItem : shop_item) : void =
        set Items[NewItem.Name] = NewItem

    Purchase<public>(Name : string)<decides><transacts> : void =
        Item := Items[Name]
        Item.Stock > 0
        set Items[Name] = shop_item{Name := Item.Name, Price := Item.Price, Stock := Item.Stock - 1}

MyShop := shop{}
MyShop.AddItem(shop_item{Name := "回復薬", Price := 100, Stock := 1})

if (MyShop.Purchase("回復薬")):
    Print("1回目: 購入成功")
else:
    Print("1回目: 購入失敗")

if (MyShop.Purchase("回復薬")):
    Print("2回目: 購入成功")
else:
    Print("2回目: 購入失敗")`,
  note: `structは不変なので、フィールドを1つだけ変えたいときも「同じ値のまま、1つだけ変えた新しいstructを作ってset」という形になります。`
},

// ---------- 185 ----------
{
  n: 185, lv: "a", cat: "小規模システム設計",
  concept: "プレイヤーの所持金と連携させる",
  explain: `ショップシステムに「プレイヤーの財布(wallet)」を組み合わせると、より実践的な購入フローになります。「お金が足りるか」と「在庫があるか」の<strong>両方</strong>を満たしたときだけ購入を成立させます。`,
  example: `wallet := class:
    var Gold : int = 0

    Spend<public>(Amount : int)<decides><transacts> : void =
        Gold >= Amount
        set Gold -= Amount`,
  problem: `<code>shop</code>(183・184問目のもの)と<code>wallet</code>(上の例のもの)を組み合わせ、<b>両方の条件を満たしたときだけ成功する</b><code>&lt;decides&gt;&lt;transacts&gt;</code>な関数<code>BuyItem(S : shop, W : wallet, Name : string, Price : int) : void</code>を作り、購入成功・失敗をif文でPrintしてください。`,
  answer: `BuyItem(S : shop, W : wallet, Name : string, Price : int)<decides><transacts> : void =
    W.Spend(Price)
    S.Purchase(Name)

MyShop := shop{}
MyShop.AddItem(shop_item{Name := "回復薬", Price := 100, Stock := 1})
MyWallet := wallet{Gold := 150}

if (BuyItem(MyShop, MyWallet, "回復薬", 100)):
    Print("購入成功 残金:{MyWallet.Gold}")
else:
    Print("購入失敗")`,
  note: `<code>&lt;transacts&gt;</code>な操作を2つ連続で呼ぶ設計では、「片方だけ成功して、もう片方が失敗する」という中途半端な状態を避けるよう、処理の順序や設計を慎重に考える必要があります。`
},

// ---------- 186 ----------
{
  n: 186, lv: "a", cat: "小規模システム設計",
  concept: "全商品を一覧表示する",
  explain: `mapのforを使えば、登録されているすべての商品を一覧として表示できます。「在庫がある商品だけ」のようなフィルタも、これまで習った通りに組み合わせられます。`,
  example: `shop := class:
    var Items<private> : [string]shop_item = map{}
    # (AddItem, Purchaseは省略)

    ListInStock<public>() : []string =
        for (Name -> Item : Items, Item.Stock > 0):
            "{Name}({Item.Stock}個)"`,
  problem: `<code>ListInStock</code>(上の例のもの)を持つ<code>shop</code>を作り、<b>"回復薬"(在庫2)</b>と<b>"毒消し"(在庫0)</b>を登録したうえで<code>ListInStock()</code>を呼び、<strong>在庫がある商品だけ</strong>が表示されることをPrintで確認してください。`,
  answer: `shop_item := struct:
    Name : string = ""
    Price : int = 0
    Stock : int = 0

shop := class:
    var Items<private> : [string]shop_item = map{}

    AddItem<public>(NewItem : shop_item) : void =
        set Items[NewItem.Name] = NewItem

    ListInStock<public>() : []string =
        for (Name -> Item : Items, Item.Stock > 0):
            "{Name}({Item.Stock}個)"

MyShop := shop{}
MyShop.AddItem(shop_item{Name := "回復薬", Price := 100, Stock := 2})
MyShop.AddItem(shop_item{Name := "毒消し", Price := 80, Stock := 0})

Print("{MyShop.ListInStock()}")   # → (回復薬(2個))`,
  note: `mapのforによるフィルタリングは、実際の在庫管理システムの「品切れ商品を除いた一覧」のような機能にそのまま応用できます。`
},

// ---------- 187 ----------
{
  n: 187, lv: "a", cat: "小規模システム設計",
  concept: "weak_mapで複数プレイヤーのwalletを一元管理する",
  explain: `183〜186問目のショップシステムに、weak_mapを組み合わせれば「プレイヤーごとに別々の財布を持つ」複数人対応のシステムに発展させられます。ここまでの全要素の集大成です。`,
  example: `PlayerWallets : weak_map(player, wallet) = map{}

GetWallet(P : player) : wallet =
    if (Existing := PlayerWallets[P]):
        Existing
    else:
        NewWallet := wallet{Gold := 100}
        set PlayerWallets[P] = NewWallet
        NewWallet`,
  problem: `<code>GetWallet</code>(上の例のもの)を使い、あるプレイヤー<b>P</b>のwalletを取得して<code>BuyItem</code>(185問目のもの)で商品購入を試みる関数<code>PlayerBuy(P : player, S : shop, Name : string, Price : int) : void</code>を作ってください(結果をif文でPrint)。`,
  answer: `PlayerWallets : weak_map(player, wallet) = map{}

GetWallet(P : player) : wallet =
    if (Existing := PlayerWallets[P]):
        Existing
    else:
        NewWallet := wallet{Gold := 100}
        set PlayerWallets[P] = NewWallet
        NewWallet

PlayerBuy(P : player, S : shop, Name : string, Price : int) : void =
    W := GetWallet(P)
    if (BuyItem(S, W, Name, Price)):
        Print("購入成功 残金:{W.Gold}")
    else:
        Print("購入失敗")`,
  note: `weak_map・class・struct・interface・failure context――中級から上級まで積み上げてきたほぼすべての要素が、この1つの購入処理の中に自然に組み合わさっています。`
},

// ---------- 高度な失敗コンテキスト ----------
{
  n: 188, lv: "a", cat: "高度な失敗コンテキスト",
  concept: "orチェーンによる複数フォールバックの設計",
  explain: `複数の取得手段を優先順位付きで試したいときは、<code>or</code>を数珠つなぎにします。「最優先の方法がダメなら次、それもダメならさらに次」という「志望校フォールバック」を、何段階でも連結できます。`,
  example: `GetDisplayName(P : player) : string =
    GetCustomNickname[P] or
    GetGuildTag[P] or
    GetDefaultName[P]`,
  problem: `<code>GetDisplayName</code>を参考に、<b>PrimaryServer[]</b>・<b>BackupServer[]</b>・<b>LocalCache[]</b>という3つの取得手段(それぞれ<code>&lt;decides&gt;</code>相当の関数と仮定)を<code>or</code>でつなぎ、最初に成功したものを返す関数<code>ResolveData() : data</code>を書いてください。`,
  answer: `ResolveData() : data =
    PrimaryServer[] or
    BackupServer[] or
    LocalCache[]`,
  note: `orチェーンは、上から順に「成功するまで」試していくため、並べる順番がそのまま「優先順位」を表します。`
},

// ---------- 189 ----------
{
  n: 189, lv: "a", cat: "高度な失敗コンテキスト",
  concept: "複数の<decides>関数を合成する",
  explain: `<code>&lt;decides&gt;</code>な関数同士は、if文のカンマ連結を使って自然に合成できます。「1段階目が成功したら、その結果を使って2段階目を試す」というパイプライン処理が組み立てられます。`,
  example: `ParseAndValidate(Text : string)<decides> : int =
    Number := ParseInt(Text)
    Number >= 0
    Number`,
  problem: `文字列<b>Text</b>から数値を取り出す<code>ParseInt(Text) : int</code>(<code>&lt;decides&gt;</code>と仮定)を使い、<strong>取り出せて、かつ100以下</strong>のときだけ成功する<code>&lt;decides&gt;</code>関数<code>ParseAsPercentage(Text : string) : int</code>を書いてください。`,
  answer: `ParseAsPercentage(Text : string)<decides> : int =
    Number := ParseInt(Text)
    Number >= 0
    Number <= 100
    Number`,
  note: `<code>&lt;decides&gt;</code>関数の中では、条件式をただの1行として並べるだけで、上から順に「ハードル」として機能します。`
},

// ---------- 190 ----------
{
  n: 190, lv: "a", cat: "高度な失敗コンテキスト",
  concept: "forとorを組み合わせた「最初に見つかった有効な値」の抽出",
  explain: `複数の候補の中から「最初に条件を満たすもの」を探す処理は、for + if(break的な発想)や、より宣言的にforのフィルタ+配列の先頭取得で書けます。`,
  example: `FindFirstValid(Candidates : []int) : ?int =
    Valid := for (C : Candidates, C > 0):
        C
    if (Valid.Length > 0):
        option{Valid[0]}
    else:
        false`,
  problem: `<code>FindFirstValid</code>を参考に、string配列から<strong>最初に空でない文字列</strong>を探す関数<code>FindFirstNonEmpty(Candidates : []string) : ?string</code>を書き、<code>array{"", "", "こんにちは", "さようなら"}</code>で試してPrintしてください。`,
  answer: `FindFirstNonEmpty(Candidates : []string) : ?string =
    Valid := for (C : Candidates, C.Length > 0):
        C
    if (Valid.Length > 0):
        option{Valid[0]}
    else:
        false

if (Result := FindFirstNonEmpty(array{"", "", "こんにちは", "さようなら"})?):
    Print(Result)
else:
    Print("見つかりません")`,
  note: `「全部集めてから先頭を取る」というやり方は、「見つかった時点で即座に抜ける」やり方より計算コストはやや高くなりますが、コードとしての見通しは良くなります。用途に応じて選びましょう。`
},

// ---------- 191 ----------
{
  n: 191, lv: "a", cat: "高度な失敗コンテキスト",
  concept: "失敗を「積極的に使う」バリデーション設計",
  explain: `<code>&lt;decides&gt;</code>関数は、単なる検索だけでなく「入力値のバリデーション(検証)」にも積極的に使えます。複数の検証ルールを1つの<code>&lt;decides&gt;</code>関数の中に並べれば、「1つでも違反したら失敗」というルールチェックが簡潔に書けます。`,
  example: `ValidateUsername(Name : string)<decides> : void =
    Name.Length > 0
    Name.Length <= 16
    not Name.Length = 0`,
  problem: `パスワードの文字列<b>Pw</b>を受け取り、<strong>8文字以上16文字以下</strong>のときだけ成功する<code>&lt;decides&gt;</code>関数<code>ValidatePassword(Pw : string) : void</code>を書き、<code>if (ValidatePassword("abc123456"))</code>のように呼んで結果をPrintしてください。`,
  answer: `ValidatePassword(Pw : string)<decides> : void =
    Pw.Length >= 8
    Pw.Length <= 16

if (ValidatePassword("abc123456")):
    Print("有効なパスワードです")
else:
    Print("8〜16文字にしてください")`,
  note: `バリデーションルールを<code>&lt;decides&gt;</code>関数として独立させておくと、フォーム入力・API受け取りなど、複数の場所から同じルールを再利用できます。`
},

// ---------- 192 ----------
{
  n: 192, lv: "a", cat: "高度な失敗コンテキスト",
  concept: "失敗コンテキストのまとめ:例外を使わない設計思想",
  explain: `ここまで見てきたように、Verseには例外(try/catch)がありません。代わりに「失敗するかもしれない」という性質そのものを、<code>?</code>・<code>&lt;decides&gt;</code>・<code>if</code>・<code>or</code>という一貫した仕組みで、<strong>型システムの一部として</strong>扱います。これにより「失敗しうる処理を、失敗しうると気づかずに呼んでしまう」という事故を防げます。`,
  example: `# 失敗するかもしれないことが、型シグネチャを見ただけでわかる
TryFind(Arr : []int, T : int)<decides> : int = Arr.Find[T]
SafeFind(Arr : []int, T : int) : ?int = ...`,
  problem: `「例外(try/catch)を使う言語」と「Verseの失敗コンテキスト」の違いを、<b>「呼び出し側が失敗の可能性に気づけるかどうか」</b>という観点から2〜3文でコメントとして説明してください。`,
  answer: `# 例外を使う言語では、ある関数が例外を投げるかどうかは呼び出し側から
# 見えにくく、ドキュメントを読むかtry/catchを書き忘れて実行時に気づく
# ことも多い。一方Verseでは、<decides>や?型・戻り値の型そのものが
# 「失敗するかもしれない」ことを型シグネチャ上に明示するため、呼び出し側は
# コンパイルの時点で「これは失敗コンテキストで扱う必要がある」と気づける。
# これにより、失敗の考慮漏れによるバグを構造的に減らせる。`,
  note: `この設計思想こそが、Verseという言語の核心部分です。ここまで来たあなたは、もうVerseの「失敗」の扱い方を体で理解しています。`
},

// ---------- 総合問題 (集大成 193-200) ----------
{
  n: 193, lv: "a", cat: "総合問題",
  concept: "集大成①:ターン制ミニバトルシステム",
  explain: `ここからの8問は、これまでの200問すべての集大成です。まずは「プレイヤー」「敵」「1ターンの攻撃処理」からなる、ごく小さなターン制バトルの土台を作りましょう。`,
  example: `combatant := class:
    Name : string
    var Hp : int = 100

    TakeDamage<public>(Amount : int) : void =
        set Hp = Max(0, Hp - Amount)

    IsAlive<public>() : logic = Hp > 0`,
  problem: `<code>combatant</code>(上の例のもの)を使い、<b>Hero</b>(Hp 100)と<b>Slime</b>(Hp 30)を作り、<code>Hero.TakeDamage(20)</code>→<code>Slime.TakeDamage(30)</code>の順に実行してから、<b>両者のIsAlive()の結果</b>をPrintしてください。`,
  answer: `combatant := class:
    Name : string
    var Hp : int = 100

    TakeDamage<public>(Amount : int) : void =
        set Hp = Max(0, Hp - Amount)

    IsAlive<public>() : logic = Hp > 0

Hero := combatant{Name := "勇者", Hp := 100}
Slime := combatant{Name := "スライム", Hp := 30}

Hero.TakeDamage(20)
Slime.TakeDamage(30)

Print("{Hero.Name}: {Hero.IsAlive()}")     # → true
Print("{Slime.Name}: {Slime.IsAlive()}")   # → false`,
  note: `classの共有セマンティクス・アクセス指定子・条件式――どれも中級編の最初の方で習った、基本中の基本の組み合わせです。`
},

// ---------- 194 ----------
{
  n: 194, lv: "a", cat: "総合問題",
  concept: "集大成②:actionインターフェースで技を表現する",
  explain: `193問目の<code>combatant</code>に、158問目で習った1メソッドinterface(Strategyパターン)を組み合わせて、「技」を差し替え可能なオブジェクトとして表現しましょう。`,
  example: `skill := interface:
    Use(Attacker : combatant, Target : combatant) : void

fire_skill := class(skill):
    Use<override>(Attacker : combatant, Target : combatant) : void =
        Target.TakeDamage(25)
        Print("{Attacker.Name}の炎の魔法! {Target.Name}に25ダメージ")`,
  problem: `<code>skill</code>(上の例のもの)を実装した<code>slash_skill</code>クラス(15ダメージ、「斬撃!」とPrint)を作り、<b>Hero</b>が<b>Slime</b>に対して<code>fire_skill</code>と<code>slash_skill</code>を順番に使うコードを書いてください。`,
  answer: `skill := interface:
    Use(Attacker : combatant, Target : combatant) : void

fire_skill := class(skill):
    Use<override>(Attacker : combatant, Target : combatant) : void =
        Target.TakeDamage(25)
        Print("{Attacker.Name}の炎の魔法! {Target.Name}に25ダメージ")

slash_skill := class(skill):
    Use<override>(Attacker : combatant, Target : combatant) : void =
        Target.TakeDamage(15)
        Print("{Attacker.Name}の斬撃! {Target.Name}に15ダメージ")

Hero := combatant{Name := "勇者", Hp := 100}
Slime := combatant{Name := "スライム", Hp := 30}

Skills : []skill = array{fire_skill{}, slash_skill{}}
for (S : Skills):
    S.Use(Hero, Slime)`,
  note: `新しい技を追加したくなっても、<code>skill</code>を実装したクラスを1つ増やすだけで済みます。これがinterfaceによる拡張性の強みです。`
},

// ---------- 195 ----------
{
  n: 195, lv: "a", cat: "総合問題",
  concept: "集大成③:enum状態機械でバトルの進行を管理する",
  explain: `178問目の状態機械の考え方を、193〜194問目のバトルに組み込みましょう。「戦闘中」「勝利」「敗北」という状態をenumで管理します。`,
  example: `battle_result := enum<closed>:
    Ongoing
    Victory
    Defeat

CheckResult(Hero : combatant, Enemy : combatant) : battle_result =
    if (not Enemy.IsAlive()) then battle_result.Victory
    else if (not Hero.IsAlive()) then battle_result.Defeat
    else battle_result.Ongoing`,
  problem: `<code>CheckResult</code>(上の例のもの)を使い、<b>Hero</b>(Hp 100)と<b>Slime</b>(Hp 10)を用意して<code>Slime.TakeDamage(30)</code>した後の<code>CheckResult(Hero, Slime)</code>の結果を、<code>case</code>式で日本語のメッセージに変換してPrintしてください。`,
  answer: `battle_result := enum<closed>:
    Ongoing
    Victory
    Defeat

CheckResult(Hero : combatant, Enemy : combatant) : battle_result =
    if (not Enemy.IsAlive()) then battle_result.Victory
    else if (not Hero.IsAlive()) then battle_result.Defeat
    else battle_result.Ongoing

DescribeResult(R : battle_result) : string =
    case (R):
        battle_result.Ongoing => "戦闘継続中"
        battle_result.Victory => "勝利!"
        battle_result.Defeat  => "敗北..."

Hero := combatant{Name := "勇者", Hp := 100}
Slime := combatant{Name := "スライム", Hp := 10}
Slime.TakeDamage(30)

Print(DescribeResult(CheckResult(Hero, Slime)))   # → 勝利!`,
  note: `enum<closed>を使ったのは、「戦闘結果」がOngoing/Victory/Defeatの3つで確定していて、将来増える見込みが薄いためです。56〜59問目で習った使い分けがここで活きています。`
},

// ---------- 196 ----------
{
  n: 196, lv: "a", cat: "総合問題",
  concept: "集大成④:raceでターンにタイムリミットを設ける",
  explain: `97〜101問目のraceを使い、「プレイヤーが技を選ぶまでの制限時間」を実装しましょう。時間内に選ばなければ、自動的にデフォルトの技が発動する設計です。`,
  example: `ChooseSkillWithTimeout(TimeLimit : float)<suspends> : skill =
    race:
        block:
            return WaitForPlayerChoice()
        block:
            Sleep(TimeLimit)
            return slash_skill{}`,
  problem: `<code>ChooseSkillWithTimeout</code>を参考に、<b>5秒以内</b>に<code>WaitForPlayerChoice()</code>が返らなければ<code>fire_skill{}</code>をデフォルトとして返す<code>&lt;suspends&gt;</code>関数<code>ChooseOrDefault</code>を書いてください。`,
  answer: `ChooseOrDefault()<suspends> : skill =
    race:
        block:
            return WaitForPlayerChoice()
        block:
            Sleep(5.0)
            return fire_skill{}`,
  note: `「時間内に選ばなければ自動選択」というUXは、多くの対戦ゲームで採用されている定番パターンです。raceだけでシンプルに実現できます。`
},

// ---------- 197 ----------
{
  n: 197, lv: "a", cat: "総合問題",
  concept: "集大成⑤:weak_mapで対戦成績を記録する",
  explain: `139〜142問目のweak_map設計を使い、プレイヤーごとの「勝敗記録」を永続的に近い形で管理しましょう(実際の永続化には<code>&lt;persistable&gt;</code>な構造体を使います)。`,
  example: `battle_record := struct<persistable><final>:
    Wins : int = 0
    Losses : int = 0

RecordMap : weak_map(player, battle_record) = map{}

RecordWin(P : player) : void =
    Current := RecordMap[P] or battle_record{}
    set RecordMap[P] = battle_record{Wins := Current.Wins + 1, Losses := Current.Losses}`,
  problem: `<code>RecordWin</code>を参考に、負けたときに<b>Losses</b>を1増やす<code>RecordLoss(P : player) : void</code>関数を作り、あるプレイヤー<b>P</b>に対して<code>RecordWin(P)</code>を2回、<code>RecordLoss(P)</code>を1回呼んだ後の<code>RecordMap[P]</code>をPrintしてください。`,
  answer: `battle_record := struct<persistable><final>:
    Wins : int = 0
    Losses : int = 0

var RecordMap : weak_map(player, battle_record) = map{}

RecordWin(P : player) : void =
    Current := RecordMap[P] or battle_record{}
    set RecordMap[P] = battle_record{Wins := Current.Wins + 1, Losses := Current.Losses}

RecordLoss(P : player) : void =
    Current := RecordMap[P] or battle_record{}
    set RecordMap[P] = battle_record{Wins := Current.Wins, Losses := Current.Losses + 1}

RecordWin(P)
RecordWin(P)
RecordLoss(P)

if (Record := RecordMap[P]):
    Print("{Record.Wins}勝{Record.Losses}敗")`,
  note: `<code>battle_record</code>をpersistableにしておけば、この対戦成績はゲームを終了しても失われず、次回ログイン時にも引き継がれます。`
},

// ---------- 198 ----------
{
  n: 198, lv: "a", cat: "総合問題",
  concept: "集大成⑥:再帰でコンボ攻撃を表現する",
  explain: `148〜152問目の再帰的データ構造を応用し、「連続コンボ攻撃」を連結リストのように表現してみましょう。「次のコンボへのつながり」を<code>?型</code>で表すのは、連結リストとまったく同じ考え方です。`,
  example: `combo_step := class:
    SkillToUse : skill
    var Next : ?combo_step = false

RunCombo(Step : ?combo_step, Attacker : combatant, Target : combatant) : void =
    if (Current := Step?):
        Current.SkillToUse.Use(Attacker, Target)
        RunCombo(Current.Next, Attacker, Target)`,
  problem: `<code>combo_step</code>と<code>RunCombo</code>(上の例のもの)を使い、<b>slash_skill</b>→<b>fire_skill</b>という2段コンボを<code>combo_step</code>でつなげて、<b>Hero</b>から<b>Slime</b>への<code>RunCombo</code>を実行してください。`,
  answer: `combo_step := class:
    SkillToUse : skill
    var Next : ?combo_step = false

RunCombo(Step : ?combo_step, Attacker : combatant, Target : combatant) : void =
    if (Current := Step?):
        Current.SkillToUse.Use(Attacker, Target)
        RunCombo(Current.Next, Attacker, Target)

Hero := combatant{Name := "勇者", Hp := 100}
Slime := combatant{Name := "スライム", Hp := 100}

Step2 := combo_step{SkillToUse := fire_skill{}}
Step1 := combo_step{SkillToUse := slash_skill{}}
set Step1.Next = option{Step2}

RunCombo(option{Step1}, Hero, Slime)`,
  note: `「連結リストで技をつなぐ」という発想は、コンボシステムだけでなく、クエストの進行順序やダイアログの分岐など、幅広い場面に応用できます。`
},

// ---------- 199 ----------
{
  n: 199, lv: "a", cat: "総合問題",
  concept: "集大成⑦:全要素を統合したバトルループ",
  explain: `いよいよ最終問題の1つ前です。sync/race・enum状態機械・weak_map記録・interfaceの技システムを、1つの<code>&lt;suspends&gt;</code>関数の中にすべて統合しましょう。`,
  example: `PlayBattle(P : player, Hero : combatant, Enemy : combatant)<suspends> : void =
    loop:
        S := ChooseOrDefault()
        S.Use(Hero, Enemy)
        R := CheckResult(Hero, Enemy)
        if (R = battle_result.Victory):
            RecordWin(P)
            Print("勝利しました!")
            break
        if (R = battle_result.Defeat):
            RecordLoss(P)
            Print("敗北しました...")
            break`,
  problem: `<code>PlayBattle</code>(上の例のもの)を実際に呼び出し、<b>あるプレイヤーP</b>と<b>Hero(Hp 100)</b>・<b>Slime(Hp 20)</b>で対戦をシミュレートするコードを書いてください(<code>WaitForPlayerChoice</code>や各種関数の中身は、この問題では実装済みと仮定して構いません)。`,
  answer: `Hero := combatant{Name := "勇者", Hp := 100}
Slime := combatant{Name := "スライム", Hp := 20}

PlayBattle(P, Hero, Slime)`,
  note: `1行の呼び出しの裏側に、これまで習った並行処理・状態機械・データ管理・ポリモーフィズムのすべてが動いています。これがVerseで「実務レベルのロジック」を組み立てるということです。`
},

// ---------- 200 ----------
{
  n: 200, lv: "a", cat: "総合問題",
  concept: "集大成⑧:あなた自身のVerseプログラムを設計する",
  explain: `最後の問題には、決まった正解を用意していません。ここまでの200問――変数・型・制御構文・struct/class/interface/enum・失敗コンテキスト・アクセス指定子・module・並行処理・ジェネリクス・型リファインメント・状態機械――のうち、<strong>好きな要素を5つ以上選んで</strong>、あなた自身の小さなVerseプログラムを設計してください。`,
  example: `# 例: 「ミニクエスト管理システム」
quest_state := enum<open>:
    NotStarted
    InProgress
    Completed

quest := class:
    Title : string
    var State : quest_state = quest_state.NotStarted

    Advance<public>()<decides> : void =
        State <> quest_state.Completed
        set State = quest_state.InProgress`,
  problem: `あなた自身のアイデアで、<b>5つ以上の要素</b>(例: class・enum・weak_map・failure context・並行処理など)を組み合わせた、オリジナルの小さなVerseプログラムを設計してください。テーマは自由です(クエスト管理・ミニゲーム・スコアボード・ショップ・チャットボットなど、何でも構いません)。`,
  answer: `# 解答例: 実績(アチーブメント)システム
achievement_id := enum<open>:
    FirstWin
    TenWins

achievement_data := struct<persistable><final>:
    Unlocked : logic = false

AchievementMap : weak_map(player, [achievement_id]achievement_data) = map{}

UnlockAchievement(P : player, Id : achievement_id)<transacts> : void =
    var PlayerMap : [achievement_id]achievement_data = AchievementMap[P] or map{}
    set PlayerMap[Id] = achievement_data{Unlocked := true}
    set AchievementMap[P] = PlayerMap

CheckAndCelebrate(P : player, Id : achievement_id)<suspends> : void =
    UnlockAchievement(P, Id)
    Sleep(0.5)
    Print("実績解除!")`,
  note: `おめでとうございます、これで200問すべてクリアです!正解を写すことより、あなた自身の設計判断で「なぜこの要素をこう組み合わせたか」を説明できることの方がずっと大切です。ここまで来たあなたは、もう入門者ではありません。実際のUEFNプロジェクトで、手を動かしながらさらに腕を磨いていってください。`
}

];
