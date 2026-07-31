/* =========================================================
 * VERSE道場破り — 初級編 (Q001〜Q040)
 * 白帯〜青帯。Verseの基本文法をひとつずつ体に叩き込む。
 * ========================================================= */
var BEGINNER_QUESTIONS = [

// ---------- 01. コメントとPrint ----------
{
  n: 1, lv: "b", cat: "出力とコメント",
  concept: "Print関数とコメント",
  explain: `Verseで画面(出力ログ)に文字を出すには <code>Print(...)</code> を使います。丸カッコの中に <code>"..."</code> で囲んだ文字列を渡すのが基本形です。行の途中に <code>#</code> を書くと、そこから行末まではコメント(実行されないメモ)になります。`,
  example: `# これはコメント。実行結果には影響しない
Print("道場へようこそ")`,
  problem: `<code>Print</code>を使って、<b>"最初の一撃"</b>という文字列を出力するコードを1行で書いてください。`,
  answer: `Print("最初の一撃")`,
  note: `<code>Print(...)</code>の丸カッコの中に、ダブルクォートで囲んだ文字列を渡すだけです。これがVerseの最初の一歩です。`
},

// ---------- 02 ----------
{
  n: 2, lv: "b", cat: "出力とコメント",
  concept: "複数行のPrint",
  explain: `<code>Print</code>は何度でも呼び出せます。1行に1回ずつ<code>Print(...)</code>を書けば、上から順にログへ出力されます。`,
  example: `Print("1本目")
Print("2本目")
Print("3本目")`,
  problem: `<code>Print</code>を3回使って、<b>"構え"</b> → <b>"踏み込み"</b> → <b>"一本!"</b> の順に出力してください。`,
  answer: `Print("構え")
Print("踏み込み")
Print("一本!")`,
  note: `Verseのコードは基本的に上から下へ順番に実行されます。`
},

// ---------- 03 ----------
{
  n: 3, lv: "b", cat: "出力とコメント",
  concept: "空行とインデントの意味",
  explain: `Verseは中カッコ<code>{}</code>ではなく<strong>インデント(字下げ)</strong>でブロックの範囲を判断する言語です。まだ関数もif文も習っていませんが、この後ずっと重要になる考え方なので、ここで覚えておきましょう。行頭の空白の数(半角スペース)が、コードの「所属」を決めます。`,
  example: `Print("道場破り、開始")
# ↑と↓は同じインデント(字下げなし)なので、同じ階層の処理として扱われる
Print("よろしく")`,
  problem: `次の一言(<b>"礼に始まり礼に終わる"</b>)を、他の行と同じインデント(字下げなし)で<code>Print</code>してください。`,
  answer: `Print("礼に始まり礼に終わる")`,
  note: `今の時点ではインデントを気にする場面はまだ出てきませんが、if・for・関数・classなど、この先ほぼ全ての構文がインデントでブロックの範囲を表します。`
},

// ---------- 04. 変数と定数 ----------
{
  n: 4, lv: "b", cat: "変数と定数",
  concept: "不変の値(:=)",
  explain: `Verseの変数は<strong>デフォルトで「不変」</strong>(あとから書き換えられない)です。<code>名前 := 値</code>と書くと、型は自動的に推測され、二度と書き換えられない値になります。`,
  example: `PlayerName := "ゆうた"
Print(PlayerName)`,
  problem: `<b>DojoName</b>という名前で<b>"紅蓮道場"</b>という文字列を<code>:=</code>で定義し、<code>Print</code>で表示してください。`,
  answer: `DojoName := "紅蓮道場"
Print(DojoName)`,
  note: `<code>:=</code>は「型推測つきの不変代入」です。DojoNameの型は自動的にstringになります。`
},

// ---------- 05 ----------
{
  n: 5, lv: "b", cat: "変数と定数",
  concept: "型を明示する不変の値",
  explain: `<code>名前 : 型 = 値</code>のように書くと、型を自分ではっきり指定した不変の値を作れます。<code>:=</code>と同じく、あとから書き換えることはできません。`,
  example: `MaxScore : int = 100
Print("{MaxScore}")`,
  problem: `<b>Belt</b>という名前でstring型、値は<b>"白帯"</b>を、型を明示するかたち(<code>: 型 =</code>)で定義してください。`,
  answer: `Belt : string = "白帯"`,
  note: `<code>:=</code>と<code>: 型 =</code>はどちらも不変ですが、後者は型を読み手にはっきり伝えたいときに使います。`
},

// ---------- 06 ----------
{
  n: 6, lv: "b", cat: "変数と定数",
  concept: "可変の値(var)とset",
  explain: `書き換えたい値には<code>var 名前 : 型 = 値</code>を使います。<code>var</code>を使うときは<strong>型を省略できません</strong>。値を書き換えるときは<code>set 名前 = 新しい値</code>と書きます。`,
  example: `var Coins : int = 0
set Coins = 100
Print("{Coins}")   # → 100`,
  problem: `<b>Hp</b>というint型の可変変数を<b>100</b>で作り、<code>set</code>で<b>80</b>に書き換えてから表示してください。`,
  answer: `var Hp : int = 100
set Hp = 80
Print("{Hp}")`,
  note: `<code>var</code>で作った変数だけが、あとから<code>set</code>で中身を差し替えられます。`
},

// ---------- 07 ----------
{
  n: 7, lv: "b", cat: "変数と定数",
  concept: "複合代入(+= -=)",
  explain: `<code>set X += 値</code>は<code>set X = X + 値</code>の短縮形です。同じように<code>-=</code> <code>*=</code> <code>/=</code>も使えます。可変変数(<code>var</code>)にのみ使えます。`,
  example: `var Coins : int = 100
set Coins += 50   # 150
set Coins -= 20   # 130
Print("{Coins}")`,
  problem: `<b>Exp</b>(int, 初期値<b>0</b>)を<code>var</code>で作り、<code>+=</code>で<b>30</b>増やし、さらに<code>+=</code>で<b>15</b>増やしてから表示してください。`,
  answer: `var Exp : int = 0
set Exp += 30
set Exp += 15
Print("{Exp}")   # → 45`,
  note: `複合代入を使うと「今の値を使って計算し直す」という意図がひと目でわかります。`
},

// ---------- 08. 型 ----------
{
  n: 8, lv: "b", cat: "基本の型",
  concept: "int / float",
  explain: `<code>int</code>は整数、<code>float</code>は小数を表す型です。<code>225</code>のように小数点がない数値はint、<code>98.6</code>のように小数点があればfloatになります。`,
  example: `Coins : int = 225
Health : float = 98.6
Print("{Coins} / {Health}")`,
  problem: `<b>Level</b>(int, <b>5</b>)と<b>Speed</b>(float, <b>3.5</b>)を定義し、両方をPrintしてください。`,
  answer: `Level : int = 5
Speed : float = 3.5
Print("{Level}")
Print("{Speed}")`,
  note: `intとfloatは見た目(小数点の有無)で決まる、Verseで最もよく使う数値型です。`
},

// ---------- 09 ----------
{
  n: 9, lv: "b", cat: "基本の型",
  concept: "rational(分数)",
  explain: `<code>rational</code>は割り算の結果を丸めずに正確な分数として保持する型です。整数どうしを<code>/</code>で割ると、Verseでは自動的にrationalになります。<code>Floor(値)</code>で切り捨て、<code>Ceil(値)</code>で切り上げてint化できます。`,
  example: `Half : rational = 5 / 2      # 2.5に丸めず、正確な5/2として保持
Print("{Floor(Half)}")        # → 2
Print("{Ceil(Half)}")         # → 3`,
  problem: `<b>OneThird</b>という名前で<b>1 / 3</b>のrational値を作り、<code>Floor</code>で切り捨てた結果をPrintしてください。`,
  answer: `OneThird : rational = 1 / 3
Print("{Floor(OneThird)}")   # → 0`,
  note: `floatは近似値になりがちですが、rationalは「正確な分数」のまま保持できるのが特徴です。`
},

// ---------- 10 ----------
{
  n: 10, lv: "b", cat: "基本の型",
  concept: "logic(真偽値)",
  explain: `<code>logic</code>は<code>true</code>か<code>false</code>だけを表す型です。他の言語の<code>bool</code>にあたります。条件分岐や比較演算の結果は必ずlogicになります。`,
  example: `IsAlive : logic = true
IsRich : logic = 100 > 50
Print("{IsAlive}")
Print("{IsRich}")`,
  problem: `<b>IsBlackBelt</b>というlogic型の変数を<b>false</b>で定義し、Printしてください。`,
  answer: `IsBlackBelt : logic = false
Print("{IsBlackBelt}")`,
  note: `logic型はtrue/falseの2値のみ。比較演算子(<code>&gt;</code> <code>=</code> など)の結果も常にlogicになります。`
},

// ---------- 11 ----------
{
  n: 11, lv: "b", cat: "基本の型",
  concept: "string(文字列)",
  explain: `<code>string</code>はダブルクォート<code>"..."</code>で囲んだ文字の並びです。ここまでのPrintの例でも、実はもうたくさん使っています。`,
  example: `Master : string = "師範"
Print(Master)`,
  problem: `<b>DojoMotto</b>という名前で<b>"礼節を尽くす"</b>という文字列を定義し、Printしてください。`,
  answer: `DojoMotto : string = "礼節を尽くす"
Print(DojoMotto)`,
  note: `文字列型は名前・メッセージ・ラベルなど、あらゆる場面で使う最も基本的な型のひとつです。`
},

// ---------- 12. 演算子 ----------
{
  n: 12, lv: "b", cat: "演算子",
  concept: "四則演算",
  explain: `<code>+ - * /</code>は数値どうしの足し算・引き算・かけ算・割り算です。int同士の割り算は前の問題で見た通りrationalになるので、int同士のままで扱いたいときは意識しておきましょう。`,
  example: `X : int = 10
Y : int = 3
Print("{X + Y}")   # → 13
Print("{X * Y}")   # → 30`,
  problem: `<b>A</b>(int, <b>20</b>)と<b>B</b>(int, <b>6</b>)を定義し、<b>A - B</b>の結果をPrintしてください。`,
  answer: `A : int = 20
B : int = 6
Print("{A - B}")   # → 14`,
  note: `四則演算子は数式そのままの感覚で使えます。`
},

// ---------- 13 ----------
{
  n: 13, lv: "b", cat: "演算子",
  concept: "比較演算子",
  explain: `<code>= &lt;&gt; &lt; &lt;= &gt; &gt;=</code>で2つの値を比較でき、結果はlogic(true/false)になります。<code>=</code>は「等しい」、<code>&lt;&gt;</code>は「等しくない」です。`,
  example: `Score : int = 82
IsPass : logic = Score >= 60
Print("{IsPass}")   # → true`,
  problem: `<b>Age</b>(int, <b>17</b>)を定義し、<b>Age &lt; 20</b>の結果を<b>IsMinor</b>という変数に入れてPrintしてください。`,
  answer: `Age : int = 17
IsMinor : logic = Age < 20
Print("{IsMinor}")   # → true`,
  note: `比較演算子の結果は常にlogic型になるので、そのままlogic型の変数に代入できます。`
},

// ---------- 14 ----------
{
  n: 14, lv: "b", cat: "演算子",
  concept: "論理演算子 and / or / not",
  explain: `<code>and</code>は両方true、<code>or</code>はどちらか一方でもtrueなら結果がtrueになります。<code>not</code>はtrue/falseをひっくり返します。`,
  example: `Coins : int = 150
HasKey : logic = true
CanEnter : logic = Coins >= 100 and HasKey
Print("{CanEnter}")   # → true`,
  problem: `<b>Hp</b>(int, <b>0</b>)を定義し、<b>「Hpが0より大きい」をnotで反転した値</b>を<b>IsDefeated</b>に入れてPrintしてください。`,
  answer: `Hp : int = 0
IsDefeated : logic = not (Hp > 0)
Print("{IsDefeated}")   # → true`,
  note: `<code>not</code>を式全体にかけたいときはカッコでくくると意図がわかりやすくなります。`
},

// ---------- 15 ----------
{
  n: 15, lv: "b", cat: "演算子",
  concept: "文字列の連結(+)",
  explain: `<code>+</code>演算子は数値の足し算だけでなく、<strong>文字列どうしの連結</strong>にも使えます。<code>"あ" + "い"</code>は<code>"あい"</code>になります。`,
  example: `FirstName := "たろう"
Title := "師範"
Print(Title + "・" + FirstName)`,
  problem: `<b>Rank</b>(<b>"三段"</b>)と<b>Name</b>(<b>"けんじ"</b>)を<code>+</code>で連結して<b>"三段 けんじ"</b>という文字列を作り、Printしてください。`,
  answer: `Rank := "三段"
Name := "けんじ"
Print(Rank + " " + Name)`,
  note: `文字列を組み立てるだけなら文字列補間(次の章)の方が読みやすいことも多いですが、<code>+</code>連結も基本として押さえておきましょう。`
},

// ---------- 16. 文字列補間 ----------
{
  n: 16, lv: "b", cat: "文字列補間",
  concept: "\"{式}\" で値を埋め込む",
  explain: `文字列の中に<code>{式}</code>と書くと、その式の結果がその場に埋め込まれます。すでにこれまでの例で何度も使ってきた、Verseで一番よく使う出力テクニックです。`,
  example: `Name := "ひなた"
Score : int = 95
Print("{Name}さんの得点は{Score}点です")`,
  problem: `<b>Wins</b>(int, <b>7</b>)と<b>Losses</b>(int, <b>2</b>)を定義し、<b>"7勝2敗です"</b>のように文字列補間で出力してください。`,
  answer: `Wins : int = 7
Losses : int = 2
Print("{Wins}勝{Losses}敗です")`,
  note: `文字列補間の中には変数だけでなく、計算式もそのまま書けます。`
},

// ---------- 17 ----------
{
  n: 17, lv: "b", cat: "文字列補間",
  concept: "補間の中に計算式を書く",
  explain: `<code>{}</code>の中には変数だけでなく、<code>X + Y</code>のような式もそのまま書けます。式の計算結果がその場に文字列として埋め込まれます。`,
  example: `X : int = 4
Y : int = 5
Print("合計は{X + Y}です")   # → 合計は9です`,
  problem: `<b>Price</b>(int, <b>800</b>)を定義し、<b>"税込み{Price * 11 / 10}円"</b>のように、補間の中で計算しながら出力してください。`,
  answer: `Price : int = 800
Print("税込み{Price * 11 / 10}円")`,
  note: `計算をあらかじめ変数に入れておかなくても、補間の中に直接式を書けるのが便利なところです。`
},

// ---------- 18 ----------
{
  n: 18, lv: "b", cat: "文字列補間",
  concept: "改行なしで複数の値を並べる",
  explain: `文字列の中には<code>{式}</code>を何回でも登場させられます。日本語の文章の中に、必要な変数を自由な位置に差し込めます。`,
  example: `Name := "ゆうた"
Level : int = 12
Hp : int = 340
Print("{Name}(Lv.{Level}) HP:{Hp}")`,
  problem: `<b>ItemName</b>(<b>"炎の剣"</b>)、<b>Attack</b>(int, <b>45</b>)を使って、<b>"炎の剣(攻撃力45)"</b>という1行を出力してください。`,
  answer: `ItemName := "炎の剣"
Attack : int = 45
Print("{ItemName}(攻撃力{Attack})")`,
  note: `補間を使いこなせると、デバッグ用のログがぐっと読みやすくなります。`
},

// ---------- 19. if/else ----------
{
  n: 19, lv: "b", cat: "条件分岐 if",
  concept: "if / else 文",
  explain: `<code>if (条件):</code>の次の行からインデントしたブロックが「条件がtrueのときの処理」です。<code>else:</code>を続けると「そうでないときの処理」を書けます。`,
  example: `Age : int = 12

if (Age >= 20):
    Print("大人料金です")
else:
    Print("こども料金です")`,
  problem: `<b>Hp</b>(int, <b>0</b>)を定義し、<b>Hpが0以下なら"倒れた"、そうでなければ"まだ立っている"</b>とPrintしてください。`,
  answer: `Hp : int = 0

if (Hp <= 0):
    Print("倒れた")
else:
    Print("まだ立っている")`,
  note: `<code>if (条件):</code>の行末には必ずコロンが必要です。ブロックの範囲はインデントで決まります。`
},

// ---------- 20 ----------
{
  n: 20, lv: "b", cat: "条件分岐 if",
  concept: "カンマでつなぐ複数条件(AND)",
  explain: `<code>if</code>のカッコの中にカンマ区切りで複数の条件を書くと、「すべて成立したら」という意味になります(and でつないだのと同じ)。`,
  example: `Age : int = 8

if (Age >= 6, Age < 12):
    Print("小学生ですね!")`,
  problem: `<b>Score</b>(int, <b>75</b>)を定義し、<b>60以上かつ80未満</b>のときだけ<b>"Bランク"</b>とPrintしてください。`,
  answer: `Score : int = 75

if (Score >= 60, Score < 80):
    Print("Bランク")`,
  note: `カンマは<code>and</code>より簡潔に「複数のハードルをすべて越えたら」を表現できます。`
},

// ---------- 21 ----------
{
  n: 21, lv: "b", cat: "条件分岐 if",
  concept: "if ... then ... else(式としてのif)",
  explain: `Verseの<code>if</code>は<strong>値を返す「式」</strong>としても使えます。<code>if (条件) then 値A else 値B</code>と1行で書くと、条件によってどちらかの値がそのまま返ってきます。`,
  example: `Score : int = 80
Message := if (Score >= 60) then "合格" else "不合格"
Print(Message)`,
  problem: `<b>Hp</b>(int, <b>30</b>)を使い、<b>0より大きければ"生存"、そうでなければ"戦闘不能"</b>を<b>Status</b>という変数に<code>if...then...else</code>で入れてPrintしてください。`,
  answer: `Hp : int = 30
Status := if (Hp > 0) then "生存" else "戦闘不能"
Print(Status)`,
  note: `if文とif式は同じ<code>if</code>ですが、<code>then</code>を使う1行の書き方は「値を作って代入する」ときに便利です。`
},

// ---------- 22 ----------
{
  n: 22, lv: "b", cat: "条件分岐 if",
  concept: "if式を関数の戻り値として使う",
  explain: `if式は数値だけでなく、変数への代入・Printの引数など「値が必要な場所」ならどこでも使えます。次の章で習う関数の中でも、if式1つで戻り値を作ることがよくあります。`,
  example: `X : int = 7
Print(if (X > 5) then "大きい" else "小さい")`,
  problem: `<b>Coins</b>(int, <b>0</b>)を定義し、<code>Print</code>の引数の中に直接if式を書いて、<b>0なら"文無し"、それ以外は"所持あり"</b>を出力してください。`,
  answer: `Coins : int = 0
Print(if (Coins = 0) then "文無し" else "所持あり")`,
  note: `Verseでは「すべてが式」という考え方が徹底されています。if式をPrintの引数にそのまま渡せるのはその一例です。`
},

// ---------- 23. for/loop ----------
{
  n: 23, lv: "b", cat: "くり返し for",
  concept: "for と数値の範囲(0..N)",
  explain: `<code>for (変数 := 開始..終了):</code>で、開始から終了まで(両端を含む)を1つずつ変数に入れながらくり返せます。`,
  example: `for (I := 1..3):
    Print("{I}本目の突き")`,
  problem: `<code>for</code>と<b>1..5</b>を使って、<b>1</b>から<b>5</b>までの数を1つずつPrintしてください。`,
  answer: `for (I := 1..5):
    Print("{I}")`,
  note: `<code>1..5</code>は1,2,3,4,5の5つの値を順番に生成します(終了の値も含まれます)。`
},

// ---------- 24 ----------
{
  n: 24, lv: "b", cat: "くり返し for",
  concept: "forの中でifを組み合わせる",
  explain: `forのブロックの中には、これまでに習ったif文もそのまま書けます。「くり返しながら、条件によって処理を変える」という組み合わせは非常によく使います。`,
  example: `for (I := 1..5):
    if (Mod(I, 2) = 0):
        Print("{I}は偶数")
    else:
        Print("{I}は奇数")`,
  problem: `<code>for (I := 1..3)</code>でくり返し、<b>Iが2以上なら"合格"、そうでなければ"未達"</b>をPrintしてください。`,
  answer: `for (I := 1..3):
    if (I >= 2):
        Print("合格")
    else:
        Print("未達")`,
  note: `<code>Mod(X, Y)</code>はXをYで割った余りを返す組み込み関数です。偶数・奇数判定によく使われます。`
},

// ---------- 25 ----------
{
  n: 25, lv: "b", cat: "くり返し for",
  concept: "loop と break",
  explain: `<code>loop:</code>は「自分で止めるまで無限にくり返す」構文です。止めるには<code>break</code>を使います。<code>loop</code>を書いたら、必ずどこかに<code>break</code>する条件があるか確認しましょう。`,
  example: `var Count : int = 0
loop:
    set Count += 1
    Print("{Count}回目")
    if (Count >= 3):
        break`,
  problem: `<code>var Total : int = 0</code>から始め、<code>loop</code>の中で<b>10ずつ増やし</b>、<b>Totalが30以上になったらbreak</b>してから最終的なTotalをPrintしてください。`,
  answer: `var Total : int = 0
loop:
    set Total += 10
    if (Total >= 30):
        break
Print("{Total}")   # → 30`,
  note: `<code>for (I := 開始..終了)</code>は回数が決まっているとき、<code>loop</code>は「条件を満たすまで」のように回数が読めないときに使い分けます。`
},

// ---------- 26 ----------
{
  n: 26, lv: "b", cat: "くり返し for",
  concept: "forは実は「値を作る式」でもある",
  explain: `forの結果を変数に代入すると、くり返しの中で最後に評価した値を集めた新しい配列が返ってきます。「くり返しながら、新しいデータの集まりを作る」という発想は中級編でさらに活躍します。`,
  example: `Doubled := for (I := 1..3):
    I * 2

Print("{Doubled}")   # → (2, 4, 6)`,
  problem: `<code>for (I := 1..4)</code>を使い、<b>Iを2乗した値</b>を集めた配列を<b>Squares</b>という変数に入れてPrintしてください。`,
  answer: `Squares := for (I := 1..4):
    I * I

Print("{Squares}")   # → (1, 4, 9, 16)`,
  note: `forブロックの最後の式が、その回のくり返しで「集められる値」になります。`
},

// ---------- 27. 配列 ----------
{
  n: 27, lv: "b", cat: "配列",
  concept: "array{} リテラルと要素アクセス",
  explain: `配列は<code>array{値1, 値2, ...}</code>で作ります。要素には<code>配列名[インデックス]</code>でアクセスでき、インデックスは0から始まります。`,
  example: `Members := array{"たろう", "はなこ", "けんじ"}
Print(Members[0])   # → たろう
Print(Members[2])   # → けんじ`,
  problem: `<b>Weapons</b>という配列を<b>"木刀", "鉄扇", "手裏剣"</b>の3要素で作り、<b>2番目の要素("鉄扇")</b>だけをPrintしてください。`,
  answer: `Weapons := array{"木刀", "鉄扇", "手裏剣"}
Print(Weapons[1])   # → 鉄扇`,
  note: `インデックスは0始まりなので、「2番目」は<code>[1]</code>になる点に注意しましょう。`
},

// ---------- 28 ----------
{
  n: 28, lv: "b", cat: "配列",
  concept: "配列と.Length",
  explain: `配列の要素数は<code>配列名.Length</code>で取得できます。この値はint型です。`,
  example: `Fruits := array{"りんご", "ばなな", "みかん"}
Print("{Fruits.Length}個")   # → 3個`,
  problem: `<b>Scores</b>を<b>array{60, 75, 90, 88}</b>で作り、その要素数を<code>Length</code>でPrintしてください。`,
  answer: `Scores := array{60, 75, 90, 88}
Print("{Scores.Length}")   # → 4`,
  note: `<code>.Length</code>はこの先、配列を扱うほぼすべての場面で登場する基本プロパティです。`
},

// ---------- 29 ----------
{
  n: 29, lv: "b", cat: "配列",
  concept: "forで配列をくり返す",
  explain: `<code>for (要素名 : 配列名):</code>と書くと、配列の先頭から順に1つずつ取り出しながらくり返せます。数値の範囲(<code>0..N</code>)と同じ<code>for</code>構文です。`,
  example: `Names := array{"ゆうた", "みお", "けん"}
for (Name : Names):
    Print("{Name}さん、こんにちは")`,
  problem: `<b>Techniques</b>を<b>array{"正拳突き", "回し蹴り", "投げ技"}</b>で作り、<code>for</code>ですべて表示してください。`,
  answer: `Techniques := array{"正拳突き", "回し蹴り", "投げ技"}
for (Technique : Techniques):
    Print(Technique)`,
  note: `配列を先頭から全部見たいときは、インデックス指定より<code>for (要素 : 配列)</code>の方がずっとシンプルです。`
},

// ---------- 30. option ----------
{
  n: 30, lv: "b", cat: "option型",
  concept: "?型 と option{} / false",
  explain: `「値があるかもしれないし、無いかもしれない」を表すのが<code>option</code>型です。型の前に<code>?</code>を付けて<code>?int</code>のように書きます。中身がある場合は<code>option{値}</code>、無い場合は<code>false</code>を代入します。`,
  example: `HasPrize : ?int = option{42}   # 中身入り
Empty : ?int = false            # 空っぽ`,
  problem: `<b>Nickname</b>という<b>?string</b>型の変数を、中身<b>"にゃんこ先生"</b>入りの状態で定義してください。`,
  answer: `Nickname : ?string = option{"にゃんこ先生"}`,
  note: `<code>?型</code>は「入っているかもしれない福袋」のようなイメージです。中身が無いときは<code>false</code>を使います。`
},

// ---------- 31 ----------
{
  n: 31, lv: "b", cat: "option型",
  concept: "?で中身を取り出す(if文の中で)",
  explain: `option型の中身を安全に取り出すには、<code>if (取り出した変数 := 元の変数?):</code>のように書きます。中身があればブロックが実行され、無ければ実行されません。`,
  example: `Prize : ?string = option{"金メダル"}

if (Result := Prize?):
    Print("中身は{Result}")
else:
    Print("空でした")`,
  problem: `<b>Reward</b>という<b>?int</b>型を<b>option{100}</b>で作り、<code>if</code>で中身を取り出して<b>"報酬は{値}"</b>とPrintしてください(空だった場合は"なし"とPrint)。`,
  answer: `Reward : ?int = option{100}

if (Amount := Reward?):
    Print("報酬は{Amount}")
else:
    Print("なし")`,
  note: `<code>?</code>は「取り出しに失敗するかもしれない操作」の印です。if文の条件部分に置くことで安全に扱えます。`
},

// ---------- 32 ----------
{
  n: 32, lv: "b", cat: "option型",
  concept: "空のoptionを扱う",
  explain: `<code>false</code>が入ったoption型の変数を<code>?</code>で取り出そうとすると失敗し、if文の<code>else</code>側が実行されます。「中身が無いかもしれない」ことを前提に、必ず両方のケースを考えるのがVerseらしい書き方です。`,
  example: `Prize : ?string = false

if (Result := Prize?):
    Print("中身は{Result}")
else:
    Print("今回はハズレ")`,
  problem: `<b>SecretItem</b>という<b>?string</b>型を<b>false</b>で作り、<code>if</code>で取り出しを試みて、失敗したときに<b>"何も見つからなかった"</b>とPrintしてください。`,
  answer: `SecretItem : ?string = false

if (Item := SecretItem?):
    Print("発見: {Item}")
else:
    Print("何も見つからなかった")`,
  note: `option型を使うと「値が無い」状態を、エラーを起こさずに安全に表現できます。`
},

// ---------- 33. tuple ----------
{
  n: 33, lv: "b", cat: "タプル",
  concept: "タプル (組)",
  explain: `タプルは<code>(値1, 値2, ...)</code>のように、異なる型を1セットにまとめられる入れ物です。要素には<code>タプル名(0)</code>のように丸カッコ＋インデックスでアクセスします。`,
  example: `Point := (3, 5)
Print("{Point(0)}, {Point(1)}")   # → 3, 5`,
  problem: `<b>PlayerInfo</b>というタプルを<b>("ゆうた", 12)</b>(名前, レベル)で作り、それぞれの要素をPrintしてください。`,
  answer: `PlayerInfo := ("ゆうた", 12)
Print(PlayerInfo(0))
Print("{PlayerInfo(1)}")`,
  note: `タプルは配列と違い、要素ごとに違う型(string型とint型など)を1つにまとめて持てます。`
},

// ---------- 34 ----------
{
  n: 34, lv: "b", cat: "タプル",
  concept: "型注釈つきのタプル",
  explain: `タプルの型は<code>(型1, 型2)</code>のように書けます。「名前と点数のペア」のような、意味のある小さなセットを表すのに向いています。`,
  example: `Score : (string, int) = ("けんじ", 88)
Print("{Score(0)}: {Score(1)}点")`,
  problem: `<b>Item</b>を<b>(string, int)</b>型で<b>("回復薬", 3)</b>(名前, 所持数)として定義し、<b>"回復薬×3"</b>のようにPrintしてください。`,
  answer: `Item : (string, int) = ("回復薬", 3)
Print("{Item(0)}×{Item(1)}")`,
  note: `型を明示しておくと、後で見返したときに「何と何のペアか」がひと目でわかります。`
},

// ---------- 35 ----------
{
  n: 35, lv: "b", cat: "タプル",
  concept: "3要素以上のタプル",
  explain: `タプルは2要素に限らず、3つ以上の値もまとめられます。要素数が増えすぎると読みにくくなるので、そういうときは中級編で習う<code>struct</code>(構造体)に切り替えるのが定石ですが、まずはタプルの基本を押さえましょう。`,
  example: `Rgb := (255, 128, 0)
Print("R:{Rgb(0)} G:{Rgb(1)} B:{Rgb(2)}")`,
  problem: `<b>Stats</b>というタプルを<b>(Hp, Mp, Atk)</b> = <b>(100, 50, 20)</b>として作り、3つすべてをPrintしてください。`,
  answer: `Stats := (100, 50, 20)
Print("HP:{Stats(0)} MP:{Stats(1)} ATK:{Stats(2)}")`,
  note: `要素が増えるほど「何番目が何か」を覚えておく必要があり読みにくくなります。名前をつけて管理したい場合はstructの出番です(中級編で学びます)。`
},

// ---------- 36. 関数 ----------
{
  n: 36, lv: "b", cat: "関数の基本",
  concept: "関数定義の基本形",
  explain: `関数は<code>関数名(引数名 : 型, ...) : 戻り値の型 = 処理</code>という形で作ります。処理が1行の式ならそのまま<code>=</code>の右に、複数行ならブロックにして最後の式が戻り値になります。`,
  example: `MakeJuice(Fruit : string) : string =
    "{Fruit}ジュース"

Print(MakeJuice("りんご"))   # → りんごジュース`,
  problem: `int型の<b>X</b>と<b>Y</b>を受け取り、<b>X + Y</b>を返す関数<code>Add</code>を作り、<code>Add(4, 7)</code>の結果をPrintしてください。`,
  answer: `Add(X : int, Y : int) : int = X + Y

Print("{Add(4, 7)}")   # → 11`,
  note: `関数の書き方は「材料(引数)を受け取り、決まった手順で加工して結果(戻り値)を出す機械」というイメージで覚えると理解しやすいです。`
},

// ---------- 37 ----------
{
  n: 37, lv: "b", cat: "関数の基本",
  concept: "複数行の関数(最後の式が戻り値)",
  explain: `処理が複数行にわたる関数は、インデントしたブロックとして書きます。ブロックの<strong>最後に書いた式</strong>が、そのまま関数の戻り値になります。`,
  example: `Greet(Name : string) : string =
    Prefix := "ようこそ、"
    Suffix := "さん!"
    Prefix + Name + Suffix

Print(Greet("はなこ"))`,
  problem: `int型の<b>X</b>を受け取り、<b>X</b>が偶数なら<b>"偶数"</b>、奇数なら<b>"奇数"</b>を返す関数<code>Judge</code>を作り、<code>Judge(7)</code>を表示してください。`,
  answer: `Judge(X : int) : string =
    if (Mod(X, 2) = 0) then "偶数" else "奇数"

Print(Judge(7))   # → 奇数`,
  note: `関数の中身が1つのif式だけでも問題ありません。「最後の式が戻り値」というルールは常に一貫しています。`
},

// ---------- 38 ----------
{
  n: 38, lv: "b", cat: "関数の基本",
  concept: "複数の引数を持つ関数",
  explain: `引数はカンマ区切りでいくつでも増やせます。関数の中でif式を使い、大小比較の結果を返すような処理もよく書きます。`,
  example: `Bigger(X : int, Y : int) : int =
    if (X > Y) then X else Y

Print("{Bigger(3, 7)}")   # → 7`,
  problem: `3つのint(<b>A</b>, <b>B</b>, <b>C</b>)を受け取り、<b>その合計</b>を返す関数<code>SumThree</code>を作り、<code>SumThree(1, 2, 3)</code>を表示してください。`,
  answer: `SumThree(A : int, B : int, C : int) : int = A + B + C

Print("{SumThree(1, 2, 3)}")   # → 6`,
  note: `引数がいくつになっても、書き方の基本ルール(<code>名前:型</code>をカンマで並べる)は変わりません。`
},

// ---------- 39. まとめ ----------
{
  n: 39, lv: "b", cat: "総合演習",
  concept: "if・for・関数の組み合わせ",
  explain: `ここまで習った、変数・if・for・配列・関数を組み合わせると、簡単な判定プログラムが書けるようになります。1つの関数の中でforとifを両方使っても問題ありません。`,
  example: `CountPass(Scores : []int) : int =
    var PassCount : int = 0
    for (S : Scores):
        if (S >= 60):
            set PassCount += 1
    PassCount

Print("{CountPass(array{45, 70, 82, 55, 91})}")   # → 3`,
  problem: `int配列<code>Scores</code>を受け取り、<b>80点以上の人数</b>を数えて返す関数<code>CountExcellent</code>を作り、<code>array{45, 82, 90, 58, 88}</code>を渡した結果をPrintしてください。`,
  answer: `CountExcellent(Scores : []int) : int =
    var Count : int = 0
    for (S : Scores):
        if (S >= 80):
            set Count += 1
    Count

Print("{CountExcellent(array{45, 82, 90, 58, 88})}")   # → 3`,
  note: `<code>[]int</code>は「int型の配列」を表す型注釈です。関数の中でvarを使ってカウントし、forでくり返し、最後にその変数を返す――この組み合わせパターンはこれから何度も登場します。`
},

// ---------- 40 ----------
{
  n: 40, lv: "b", cat: "総合演習",
  concept: "初級の集大成:自己紹介プログラム",
  explain: `最後の1問は、これまで習ったすべて(変数・型・文字列補間・if・for・配列・タプル・関数)を1つのプログラムにまとめる総仕上げです。焦らず、ひとつずつ部品を組み立てていきましょう。`,
  example: `Introduce(Name : string, Level : int) : string =
    Rank := if (Level >= 10) then "上級者" else "初心者"
    "{Name}(Lv.{Level}, {Rank})"

Members := array{("たろう", 3), ("はなこ", 15)}
for (Member : Members):
    Print(Introduce(Member(0), Member(1)))`,
  problem: `タプルの配列<code>Fighters := array{("けん", 8), ("みお", 22)}</code>(名前, レベル)を用意し、各要素について<b>レベル10未満なら"見習い"、10以上なら"師範代"</b>と判定して、<b>"けん(Lv.8, 見習い)"</b>のように<code>for</code>で全員分Printしてください。`,
  answer: `Fighters := array{("けん", 8), ("みお", 22)}

for (Fighter : Fighters):
    Name := Fighter(0)
    Level := Fighter(1)
    Rank := if (Level < 10) then "見習い" else "師範代"
    Print("{Name}(Lv.{Level}, {Rank})")`,
  note: `お疲れさまでした!これで初級40問はクリアです。次はいよいよclass・interface・並行処理などが登場する中級編。腰を据えてかかりましょう。`
}

];
