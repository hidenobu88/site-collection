/* ═══════════════════════════════════════════
   Belle Éclat — 商品データ(全ページ共通)
   ═══════════════════════════════════════════ */

// カテゴリー定義
const CATEGORIES = [
  {
    id: "lip",
    eyebrow: "LIP MAKE",
    title: "リップ・口紅",
    lead: "ひと塗りで気分が上がる。あなたの「運命の一本」がきっと見つかる。",
  },
  {
    id: "base",
    eyebrow: "BASE MAKE",
    title: "ベースメイク",
    lead: "素肌がキレイな人に見える。崩れ知らずのつややか肌へ。",
  },
  {
    id: "eye",
    eyebrow: "EYE MAKE",
    title: "アイメイク",
    lead: "マスカラ、つけまつ毛、アイシャドウ。視線を集める印象的な目元に。",
  },
  {
    id: "cheek",
    eyebrow: "CHEEK & HIGHLIGHT",
    title: "チーク・ハイライト",
    lead: "内側からにじみ出るような血色感と、光を味方につけるツヤを。",
  },
  {
    id: "skincare",
    eyebrow: "SKIN CARE",
    title: "スキンケア",
    lead: "メイクの仕上がりは素肌で決まる。毎日の積み重ねが未来の肌をつくる。",
  },
  {
    id: "tools",
    eyebrow: "BEAUTY TOOLS",
    title: "メイクツール",
    lead: "プロ級の仕上がりは道具から。毎日使うものこそ、良いものを。",
  },
  {
    id: "lifestyle",
    eyebrow: "FASHION & INNER BEAUTY",
    title: "ファッション・ダイエット",
    lead: "外見も内側も、まるごとキレイに。ライフスタイルまでトータルサポート。",
  },
];

// 商品詳細ページに表示するカテゴリー別のおすすめポイント
const CATEGORY_FEATURES = {
  lip: [
    "うるおい成分(ヒアルロン酸・シアバター)配合で、乾燥しがちな唇をケア",
    "日本人の肌色に合わせて開発されたオリジナルカラー",
    "皮膚科医監修のパッチテスト済み(すべての方に刺激が起きないわけではありません)",
  ],
  base: [
    "汗・皮脂に強く、朝の仕上がりが夕方まで続くロングラスティング処方",
    "スキンケア成分配合で、メイクしながら素肌をケア",
    "全7色展開。イエベ・ブルベどちらにも合う色設計",
  ],
  eye: [
    "お湯でするんとオフできるフィルムタイプ",
    "にじみにくいウォータープルーフ処方で夜まで美しい目元をキープ",
    "敏感な目元のことを考えた低刺激設計",
  ],
  cheek: [
    "微細パール配合で、光を味方につける自然なツヤ感",
    "ブラシでも指でもムラなくなじむしっとりパウダー",
    "美容保湿成分配合で粉っぽくならない",
  ],
  skincare: [
    "無香料・無着色・アルコールフリーのやさしい処方",
    "敏感肌の方の協力によるパッチテスト済み",
    "毎日たっぷり使えるコストパフォーマンス",
  ],
  tools: [
    "プロのヘアメイクアップアーティスト監修",
    "洗って繰り返し使える衛生的な設計",
    "持ち運びしやすいコンパクトサイズ",
  ],
  lifestyle: [
    "着心地・使い心地を追求した、毎日続けられる設計",
    "体型や生活リズムに合わせて選べるサイズ・バリエーション",
    "管理栄養士・スタイリスト監修のもと企画開発",
  ],
};

// 商品データ(価格は日本国内の相場を参考にした税込価格)
const PRODUCTS = [
  /* ── リップ ── */
  { cat: "lip", brand: "Rouge Muse", name: "ルージュミューズ モイストシャインリップ #05 ローズペタル", desc: "うるおい続く濃密ルージュ。塗った瞬間、花びらのような発色。", price: 3850, emoji: "💄", bg: "linear-gradient(135deg,#ffd3dd,#ff9eb5)", rating: 4.8, reviews: 2314, badge: "人気No.1", rank: 1 },
  { cat: "lip", brand: "ChouChou Tokyo", name: "シュシュ ウォーターティントリップ コーラルピンク", desc: "落ちにくいのに軽いつけ心地。マスクにつきにくい水感ティント。", price: 1540, emoji: "💧", bg: "linear-gradient(135deg,#ffe0d1,#ffb199)", rating: 4.6, reviews: 1892, badge: "NEW" },
  { cat: "lip", brand: "Belle Éclat", name: "エクラ グロウリッププランパー クリアレッド", desc: "ぷっくり唇に導く美容液プランパー。じんわり血色カラー。", price: 2970, emoji: "✨", bg: "linear-gradient(135deg,#ffd9e3,#f7a8bf)", rating: 4.5, reviews: 976 },
  { cat: "lip", brand: "Velvet Bloom", name: "ベルベットブルーム マットリップスティック #12 テラコッタ", desc: "ふわっと軽いのに高発色。大人のこなれマットリップ。", price: 4290, emoji: "🌹", bg: "linear-gradient(135deg,#f3c1ad,#d98e70)", rating: 4.7, reviews: 1543, badge: "人気" },
  { cat: "lip", brand: "ChouChou Tokyo", name: "シュシュ とろけるリップバーム ハニーベージュ", desc: "唇の温度でとろける保湿バーム。寝る前ケアにも。", price: 1320, emoji: "🍯", bg: "linear-gradient(135deg,#ffe8c9,#f7c983)", rating: 4.4, reviews: 754 },
  { cat: "lip", brand: "Rouge Muse", name: "ルージュミューズ リップライナー #02 ヌードローズ", desc: "にじまず描ける極細芯。口紅の持ちも格上げ。", price: 1650, emoji: "✏️", bg: "linear-gradient(135deg,#ecd4d4,#d1a3a3)", rating: 4.3, reviews: 432 },
  { cat: "lip", brand: "Lumière Paris", name: "リュミエール シアーグロス #08 シャンパンピンク", desc: "上品なツヤと透け感。重ねづけで自分だけの色に。", price: 3080, emoji: "🥂", bg: "linear-gradient(135deg,#ffe4ec,#f9c9d8)", rating: 4.6, reviews: 1187 },
  { cat: "lip", brand: "Pure Botanica", name: "ピュアボタニカ オーガニックリップ 無香料", desc: "天然由来成分99%。敏感な唇にもやさしい処方。", price: 1980, emoji: "🌿", bg: "linear-gradient(135deg,#ddefd8,#a8d5a2)", rating: 4.5, reviews: 668 },

  /* ── ベースメイク ── */
  { cat: "base", brand: "Belle Éclat", name: "エクラ グロウクッションファンデーション SPF50+/PA++++", desc: "ツヤ肌が一日続く。光を仕込むクッションファンデ。", price: 3960, emoji: "🌟", bg: "linear-gradient(135deg,#ffe9d9,#f6cba8)", rating: 4.8, reviews: 3021, badge: "人気No.1", rank: 2 },
  { cat: "base", brand: "Lumière Paris", name: "リュミエール スキンフィット リクイドファンデーション", desc: "素肌と一体化する薄膜フィット。毛穴も色ムラも自然にカバー。", price: 5500, emoji: "🫧", bg: "linear-gradient(135deg,#f9e2d2,#eec3a4)", rating: 4.7, reviews: 2156, badge: "人気" },
  { cat: "base", brand: "ChouChou Tokyo", name: "シュシュ 皮脂くずれ防止 化粧下地 SPF30", desc: "テカリ・崩れを徹底ブロック。夕方までサラサラ肌。", price: 3080, emoji: "🛡️", bg: "linear-gradient(135deg,#e3ecf7,#b9cfe8)", rating: 4.6, reviews: 1834 },
  { cat: "base", brand: "Belle Éclat", name: "エクラ ステイパーフェクト コンシーラー", desc: "クマ・シミ・ニキビ跡をピタッとカバー。ヨレずに密着。", price: 2750, emoji: "🎯", bg: "linear-gradient(135deg,#f3ddc9,#dcb28e)", rating: 4.5, reviews: 1245 },
  { cat: "base", brand: "Velvet Bloom", name: "ベルベットブルーム シルクフェイスパウダー ルーセント", desc: "絹のようなふんわり質感。仕上げのひと重ねで極上肌。", price: 4950, emoji: "🪞", bg: "linear-gradient(135deg,#fdf0e0,#f2d7b6)", rating: 4.7, reviews: 987 },
  { cat: "base", brand: "Pure Botanica", name: "ピュアボタニカ ミネラルBBクリーム SPF35", desc: "石けんで落ちるやさしさ。これ一本で下地・ファンデ・UVケア。", price: 2640, emoji: "🌾", bg: "linear-gradient(135deg,#eee6d8,#d6c3a3)", rating: 4.4, reviews: 812 },
  { cat: "base", brand: "Lumière Paris", name: "リュミエール トーンアップUVプライマー ラベンダー", desc: "くすみを飛ばして透明感アップ。上品なラベンダー下地。", price: 3520, emoji: "💜", bg: "linear-gradient(135deg,#eae0f5,#c9b3e8)", rating: 4.6, reviews: 1409, badge: "NEW" },
  { cat: "base", brand: "ChouChou Tokyo", name: "シュシュ メイクキープミスト", desc: "シュッとひと吹きでメイク崩れを防止。うるおいチャージにも。", price: 1870, emoji: "💦", bg: "linear-gradient(135deg,#d9f0f4,#a5d8e2)", rating: 4.5, reviews: 2287 },

  /* ── アイメイク ── */
  { cat: "eye", brand: "Belle Éclat", name: "エクラ ロング&カールマスカラ 漆黒ブラック", desc: "束にならず一本一本を長く、上向きカールを一日キープ。", price: 1650, emoji: "👁️", bg: "linear-gradient(135deg,#e0dbe8,#a99bc4)", rating: 4.8, reviews: 4102, badge: "人気No.1", rank: 3 },
  { cat: "eye", brand: "Dolly Wink+", name: "ドーリーウィンク+ つけまつ毛 No.5 ナチュラルロング", desc: "自まつ毛に自然に馴染む軽量タイプ。目尻長めで大人かわいく。", price: 1210, emoji: "🦋", bg: "linear-gradient(135deg,#f4e3f0,#dbaed3)", rating: 4.6, reviews: 1567, badge: "人気" },
  { cat: "eye", brand: "Dolly Wink+", name: "ドーリーウィンク+ つけまつ毛 No.12 ボリュームグラマー", desc: "パーティーや特別な日に。濃密ボリュームで印象的な目元。", price: 1320, emoji: "🎀", bg: "linear-gradient(135deg,#f7d9e3,#e8a7bd)", rating: 4.5, reviews: 893 },
  { cat: "eye", brand: "Velvet Bloom", name: "ベルベットブルーム アイシャドウパレット #03 サンセットブラウン", desc: "捨て色なしの9色パレット。マットからラメまで自由自在。", price: 6380, emoji: "🎨", bg: "linear-gradient(135deg,#f0d9c4,#c99a6e)", rating: 4.9, reviews: 2745, badge: "人気" },
  { cat: "eye", brand: "ChouChou Tokyo", name: "シュシュ リキッドアイライナー 極細0.1mm ブラウンブラック", desc: "手ブレしにくい安定筆。にじまず夜まで美ライン。", price: 1430, emoji: "🖋️", bg: "linear-gradient(135deg,#ddd6ce,#a89a8a)", rating: 4.7, reviews: 3156 },
  { cat: "eye", brand: "Belle Éclat", name: "エクラ アイブロウペンシル&パウダー 2WAY", desc: "描いてぼかして立体眉。汗・皮脂に強いウォータープルーフ。", price: 1540, emoji: "🌰", bg: "linear-gradient(135deg,#e8dcd0,#bfa284)", rating: 4.5, reviews: 1298 },
  { cat: "eye", brand: "Lumière Paris", name: "リュミエール まつ毛美容液 EX", desc: "ハリ・コシのある自まつ毛へ。朝晩のひと塗り習慣。", price: 3300, emoji: "🌙", bg: "linear-gradient(135deg,#dfe8f5,#aec4e5)", rating: 4.4, reviews: 1876, badge: "NEW" },
  { cat: "eye", brand: "ChouChou Tokyo", name: "シュシュ カラーマスカラ テラコッタブラウン", desc: "抜け感のあるニュアンスカラーで、やわらかな印象の目元に。", price: 1760, emoji: "🍂", bg: "linear-gradient(135deg,#f2d5c4,#d49a7a)", rating: 4.6, reviews: 967 },
  { cat: "eye", brand: "Dolly Wink+", name: "ドーリーウィンク+ アイラッシュ接着剤 クリアタイプ", desc: "強力キープなのにお湯でオフ。敏感な目元にもやさしい。", price: 880, emoji: "💠", bg: "linear-gradient(135deg,#e2f0f2,#b3d9de)", rating: 4.3, reviews: 542 },
  { cat: "eye", brand: "Velvet Bloom", name: "ベルベットブルーム ダイヤモンドグリッターライナー", desc: "涙袋や目頭にきらめきをプラス。濡れたようなツヤ感。", price: 2200, emoji: "💎", bg: "linear-gradient(135deg,#eef0f7,#c3c9e8)", rating: 4.5, reviews: 789 },

  /* ── チーク・ハイライト ── */
  { cat: "cheek", brand: "Belle Éclat", name: "エクラ シアーブラッシュ #02 ピーチグロウ", desc: "内側からにじむような血色感。ふわっと溶け込むパウダーチーク。", price: 2860, emoji: "🍑", bg: "linear-gradient(135deg,#ffe3d5,#ffb598)", rating: 4.7, reviews: 1654, badge: "人気" },
  { cat: "cheek", brand: "Lumière Paris", name: "リュミエール ハイライター シャンパンビーム", desc: "光を集める繊細パール。頬の高さに天使のツヤを。", price: 4180, emoji: "🌟", bg: "linear-gradient(135deg,#fdf3dd,#f4dba6)", rating: 4.8, reviews: 1123 },
  { cat: "cheek", brand: "ChouChou Tokyo", name: "シュシュ クリームチーク ロージーレッド", desc: "指でポンポン、じゅわっと血色。ツヤ感続くクリームタイプ。", price: 1650, emoji: "🌺", bg: "linear-gradient(135deg,#ffd6dd,#f490a5)", rating: 4.5, reviews: 987 },
  { cat: "cheek", brand: "Velvet Bloom", name: "ベルベットブルーム シェーディングパレット", desc: "自然な立体感で小顔見え。迷わず使える3色セット。", price: 3520, emoji: "🤎", bg: "linear-gradient(135deg,#e5d5c5,#b99b7d)", rating: 4.4, reviews: 765 },

  /* ── スキンケア ── */
  { cat: "skincare", brand: "Pure Botanica", name: "ピュアボタニカ 薬用ホワイトニング化粧水 200mL", desc: "うるおいで満たしながら透明感ケア。とろみのある贅沢テクスチャー。", price: 3960, emoji: "🌸", bg: "linear-gradient(135deg,#ffeef3,#f9cdd9)", rating: 4.7, reviews: 2534, badge: "人気" },
  { cat: "skincare", brand: "Belle Éclat", name: "エクラ リペア美容液 30mL", desc: "ハリ・ツヤ・キメを一本で。夜のスペシャルケアに。", price: 8800, emoji: "💧", bg: "linear-gradient(135deg,#e8f0f7,#bcd4e8)", rating: 4.8, reviews: 1876, badge: "人気No.1", rank: 4 },
  { cat: "skincare", brand: "Pure Botanica", name: "ピュアボタニカ クレンジングオイル 180mL", desc: "するんと落ちてつっぱらない。W洗顔不要のやさしいオフ。", price: 2420, emoji: "🫒", bg: "linear-gradient(135deg,#f2eeda,#dcd3a3)", rating: 4.6, reviews: 3211 },
  { cat: "skincare", brand: "ChouChou Tokyo", name: "シュシュ モイストシートマスク 30枚入", desc: "毎日使える大容量。お風呂上がりの5分うるおいチャージ。", price: 1980, emoji: "🎭", bg: "linear-gradient(135deg,#e4f2ef,#aedcd2)", rating: 4.5, reviews: 4523 },
  { cat: "skincare", brand: "Lumière Paris", name: "リュミエール エイジングケアクリーム 50g", desc: "濃密クリームが夜通し働く。翌朝、ふっくらハリ肌へ。", price: 9900, emoji: "🌙", bg: "linear-gradient(135deg,#f5ecdf,#e0c9a5)", rating: 4.7, reviews: 1342 },
  { cat: "skincare", brand: "Belle Éclat", name: "エクラ UVプロテクトジェル SPF50+/PA++++ 90g", desc: "みずみずしいジェルで白浮きなし。顔にも体にも毎日たっぷり。", price: 2530, emoji: "☀️", bg: "linear-gradient(135deg,#fff3d6,#ffd98a)", rating: 4.6, reviews: 2987 },
  { cat: "skincare", brand: "Pure Botanica", name: "ピュアボタニカ 泡洗顔フォーム 150mL", desc: "きめ細かいもっちり泡が毛穴の奥まですっきり。", price: 1760, emoji: "🫧", bg: "linear-gradient(135deg,#eaf3f7,#c2dde8)", rating: 4.4, reviews: 1654 },
  { cat: "skincare", brand: "ChouChou Tokyo", name: "シュシュ ハンド&ネイルクリーム ローズの香り", desc: "サラッとべたつかない。持ち歩きたくなるかわいさ。", price: 1100, emoji: "🌹", bg: "linear-gradient(135deg,#fde3ea,#f5b8c9)", rating: 4.5, reviews: 2109 },

  /* ── メイクツール ── */
  { cat: "tools", brand: "Belle Éclat", name: "エクラ メイクブラシ 7本セット 専用ポーチ付", desc: "プロ監修の柔らか毛質。これだけでフルメイクが完成。", price: 5280, emoji: "🖌️", bg: "linear-gradient(135deg,#efe3f2,#cfaed9)", rating: 4.8, reviews: 1432, badge: "人気" },
  { cat: "tools", brand: "ChouChou Tokyo", name: "シュシュ アイラッシュカーラー(替えゴム2個付)", desc: "日本人のまぶたに合う設計。根元からぐいっと上向きカール。", price: 1100, emoji: "🌀", bg: "linear-gradient(135deg,#e6e6ee,#b8b8d1)", rating: 4.6, reviews: 2765 },
  { cat: "tools", brand: "Belle Éclat", name: "エクラ マシュマロメイクスポンジ 3個入", desc: "水を含ませてぷにぷに。ファンデがムラなく密着。", price: 990, emoji: "🍡", bg: "linear-gradient(135deg,#ffe9ef,#f7bccd)", rating: 4.5, reviews: 1876 },
  { cat: "tools", brand: "Lumière Paris", name: "リュミエール LED付き折りたたみミラー", desc: "明るさ3段階調整。旅行にも便利なコンパクト設計。", price: 3300, emoji: "💡", bg: "linear-gradient(135deg,#fdf6e3,#f0dfa8)", rating: 4.7, reviews: 954, badge: "NEW" },
  { cat: "tools", brand: "ChouChou Tokyo", name: "シュシュ ビューティーポーチ キルティングピンク", desc: "たっぷり入って自立する。ふわっと可愛いキルティング素材。", price: 2420, emoji: "👝", bg: "linear-gradient(135deg,#ffe0e9,#f4a7bd)", rating: 4.4, reviews: 687 },

  /* ── ファッション・ダイエット ── */
  { cat: "lifestyle", sub: "fashion", brand: "Belle Éclat Room", name: "とろみシフォンブラウス オフホワイト", desc: "オフィスにもデートにも。着るだけで女性らしいシルエット。", price: 4990, emoji: "👚", bg: "linear-gradient(135deg,#f7f3ee,#e3d9cc)", rating: 4.5, reviews: 876, badge: "NEW" },
  { cat: "lifestyle", sub: "fashion", brand: "Belle Éclat Room", name: "美脚ハイウエストテーパードパンツ", desc: "脚長効果◎。ストレッチ素材で一日中ラクちんキレイ。", price: 5940, emoji: "👖", bg: "linear-gradient(135deg,#e4e7ec,#b9c0cd)", rating: 4.6, reviews: 1243 },
  { cat: "lifestyle", sub: "diet", brand: "Slim Charme", name: "スリムシャルム 置き換えプロテインスムージー ベリーMIX 30食分", desc: "1食たった78kcal。美容成分配合で、キレイに続くダイエット。", price: 3980, emoji: "🥤", bg: "linear-gradient(135deg,#f7dfe8,#e8a3c0)", rating: 4.4, reviews: 2456, badge: "人気" },
  { cat: "lifestyle", sub: "diet", brand: "Slim Charme", name: "スリムシャルム 骨盤サポート着圧レギンス", desc: "はくだけで美姿勢&引き締め。就寝時にも使える段階着圧。", price: 3520, emoji: "🧘‍♀️", bg: "linear-gradient(135deg,#e2ecf2,#a9c8d8)", rating: 4.3, reviews: 1687 },
  { cat: "lifestyle", sub: "diet", brand: "Pure Botanica", name: "ピュアボタニカ 美容コラーゲンサプリ 90粒(30日分)", desc: "内側からハリとうるおいを。ビタミンC・ヒアルロン酸配合。", price: 2980, emoji: "💊", bg: "linear-gradient(135deg,#fdf1dc,#f2d391)", rating: 4.5, reviews: 1932 },
  { cat: "lifestyle", sub: "fashion", brand: "Belle Éclat Room", name: "シアーロングカーディガン ピンクベージュ", desc: "羽織るだけでこなれ感。冷房対策にもうれしい一枚。", price: 4400, emoji: "🧥", bg: "linear-gradient(135deg,#f9e8e2,#e5bfae)", rating: 4.4, reviews: 754 },
];

// 各商品に通し番号のIDを付与(product.html?id=◯ で参照)
PRODUCTS.forEach((p, i) => (p.id = i));

/* ── 共通ヘルパー ── */
const yen = (n) => "¥" + n.toLocaleString("ja-JP");
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

// 商品カードHTML(カード全体クリックで詳細ページへ)
function cardHTML(p, rank) {
  return `
    <article class="product-card" data-id="${p.id}" tabindex="0" role="link" aria-label="${p.name}の詳細を見る">
      <div class="product-visual" style="background:${p.bg}">
        ${p.badge ? `<span class="badge ${p.badge === "NEW" ? "green" : p.badge === "人気No.1" ? "gold" : ""}">${p.badge}</span>` : ""}
        ${rank ? `<span class="rank-medal">${rank}位</span>` : ""}
        <span>${p.emoji}</span>
      </div>
      <div class="product-body">
        <p class="product-brand">${p.brand}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <p class="product-rating">${stars(p.rating)}<span>${p.rating}(${p.reviews.toLocaleString()}件)</span></p>
        <div class="product-foot">
          <p class="product-price">${yen(p.price)}<small> 税込</small></p>
          <button class="add-btn" data-id="${p.id}">カートに追加</button>
        </div>
      </div>
    </article>`;
}
