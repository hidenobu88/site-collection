/* =========================================================
 * projects.js — 作品・プロフィールのデータファイル
 *
 * ★ このファイルだけ編集すればサイトが更新されます ★
 *
 * 作品を追加する手順：
 *   1. 下の PROJECTS の配列に、既存のブロックをコピーして貼り付ける
 *   2. title / description / url などを書き換える
 *   3. 保存してブラウザを再読み込み → カードが自動で増えます
 * ========================================================= */

/* ---------- 基本設定 ---------- */
const PROFILE = {
  name: "Hidenobu/Toranobu",      // ← お名前（フッターの © 表記に使用）
  siteName: "Site Collection",    // ← サイト名（ヘッダー・フッターに表示）
};

/* 1ページに表示する作品数。
 * ページ数は作品数に応じて自動で増えます（作品100件なら25ページ）。
 * 上限はないので、各カテゴリに20ページ分(80作品)以上入れても大丈夫です */
const ITEMS_PER_PAGE = 4;

/* ---------- カテゴリ定義 ----------
 * id      : PROJECTS 側の category と対応させる英語ID
 * label   : 画面に表示される日本語名
 * 新しいジャンルを作りたければ、ここに1行追加してください
 */
const CATEGORIES = [
  { id: "webapp",  label: "Webアプリ" },
  { id: "website", label: "Webサイト" },
  { id: "game",    label: "ゲーム" },
];

/* ---------- 作品一覧 ----------
 * 各項目の説明：
 *   title       : 作品名
 *   description : 1〜2文の紹介文（カードに表示）
 *   url         : クリックで開くリンク（公開URL）
 *   category    : 上の CATEGORIES の id のどれか
 *   tags        : 使用技術など（3つ前後がきれいに収まります）
 *   emoji       : カードのサムネイルに大きく表示される絵文字
 *   image       : スクリーンショット画像のパス（例: "images/app1.png"）
 *                 指定すると絵文字の代わりに画像が表示されます。省略可
 *   date        : 制作時期（表示用。形式は自由）
 *   featured    : true にすると一覧の先頭で大きく表示（1つだけ推奨）
 *   sample      : true のものはサンプル表示。実物と差し替えたら削除してください
 */
const PROJECTS = [
  {
    title: "黒井戸ノ家 ―KUROIDO― お化け屋敷サイト",
    description: "ジャパニーズホラー映画の空気感をまとった架空お化け屋敷の公式サイト。警告ゲート、VHSノイズ、一瞬だけ映る女、乱れる生還者カウンターなど恐怖演出満載。心霊写真・恐怖体験談・7種の料金プランを収録。",
    url: "works/haunted-house/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "👻",
    date: "2026.07",
    featured: true,
  },
  {
    title: "TORALUCE PRODUCTION — 芸能事務所サイト",
    description: "架空の芸能事務所の公式サイト。所属タレント40名の一覧・プロフィール、ピックアップスライダー、月別の出演情報、SNS投稿、オーディション応募フォームまで備えた全14ページ構成。データは1ファイルで一括管理できる設計です。",
    url: "works/entertainment-website/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "✨",
    image: "images/entertainment-website.png",
    date: "2026.07",
    featured: true,
  },
  {
    title: "NAGI hair atelier — 表参道の美容室サイト",
    description: "東京・表参道の架空プライベートヘアサロンの公式サイト。相場に沿った料金メニュー、スタイリスト4名のプロフィール、ヘアカタログ、口コミ、WEB予約フォームまで実在するかのような情報量。上品なミニマルデザインでスマホ・タブレット完全対応。",
    url: "works/nagi-hair-salon/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "✂️",
    image: "images/nagi-hair-salon.png",
    date: "2026.07",
  },
  {
    title: "古着屋ラクガキ堂 — 下北沢のヴィンテージショップ",
    description: "落書きノート風のちょっと奇抜なデザインでつくった架空の古着屋サイト。春・夏・秋・冬のタブで商品を切り替えられ、セットアップ・帽子・アクセなど35点以上を古着相場の値段で掲載。半額や〇〇%OFFのセールバッジ、手描き風マップ付き。スマホ・タブレット対応。",
    url: "works/rakugaki-vintage/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "👕",
    image: "images/rakugaki-vintage.png",
    date: "2026.07",
  },
  {
    title: "ソウル横丁 서울골목 — ネオレトロ韓国食堂",
    description: "路地裏のネオレトロな架空韓国料理店。サムギョプサルからスンドゥブ、チーズハットグまで50品超のメニューページ付き。テイクアウトOK。",
    url: "works/korea-site/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🌶️",
    date: "2026.07",
  },
  {
    title: "Belle Éclat — コスメティックストア",
    description: "リップ・ベースメイク・アイメイク・スキンケアまで、毎日のキレイがすべて揃う架空コスメブランドのECサイト。",
    url: "works/cosmetics-website/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "💄",
    date: "2026.07",
  },
  {
    title: "TORANOBU_GAME — フォートナイト制作マップ",
    description: "公式クリエイターページから実際にプレイできます。フォローも是非よろしくお願いします♪",
    url: "works/fortnite/index.html",
    category: "game",
    tags: ["UEFN", "Verse", "Fortnite"],
    emoji: "⚡",
    image: "images/fortnite.png",
    date: "2026.07",
    featured: true,  // 2ページ目の先頭に大きく表示
  },
  {
    title: "STRIDE FITNESS CLUB — スポーツジムサイト",
    description: "24時間ジム・25mプール・スタジオを備えた架空の総合フィットネスクラブ。施設紹介、週間レッスン表、4つの料金プラン、入会キャンペーン、FAQまで実在するかのような情報量でまとめたモダンなサイトです。",
    url: "works/stride-fitness/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "💪",
    image: "images/stride-fitness.png",
    date: "2026.07",
  },
  {
    title: "麻雀 虎の間 — 本格四人打ち麻雀",
    description: "CPU3人と対戦できる1人用の本格麻雀。強さは弱・中・強の3段階、東風戦/半荘戦を選択可能。リーチ・鳴き・赤ドラ・裏ドラ・符計算までフルルールで、役と点数もきちんと計算します。スマホ・タブレット対応。",
    url: "apps/mahjong/index.html",
    category: "webapp",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🀄",
    image: "images/mahjong.png",
    date: "2026.07",
  },
  {
    title: "スミカ不動産 — 賃貸物件検索",
    description: "架空の不動産会社の賃貸物件検索サイト。条件を指定して物件を絞り込めます。",
    url: "works/rental-properties/index.html",
    category: "webapp",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🏠",
    date: "2026.07",
  },
  {
    title: "奇想美術館 — MUSEUM OF CURIOSITIES",
    description: "少し変な絵ばかりを集めた架空の美術館。キュビスム風の肖像、少し怖い絵、名画の超訳、プラトンやアリストテレスの名言絵画などをSVGで描き起こした常設展。絵をクリックすると学芸員の解説が読めます。",
    url: "works/kiso-museum/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript", "SVG"],
    emoji: "👁️",
    image: "images/kiso-museum.png",
    date: "2026.07",
  },
  {
    title: "トイトイパーク — 夢のおもちゃやさん",
    description: "トイ・ストーリーのような青空と雲の世界観でつくった、子ども向けの架空おもちゃ屋サイト。ラジコン・プラモデル・ゲーム・おままごと・お人形など42点のおもちゃを手描きSVGイラスト+相場価格で掲載し、男の子用/女の子用×カテゴリで絞り込めます。スマホ・タブレット対応。",
    url: "works/toy-park/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript", "SVG"],
    emoji: "🧸",
    image: "images/toy-park.png",
    date: "2026.07",
  },
  {
    title: "NEON 2048 — スライドパズル",
    description: "ネオンデザインの2048風パズルゲーム。タイルをスライドして同じ数字を合体させ、2048を目指します。スマホはスワイプ、PCは矢印キーで操作。ベストスコアは端末に自動保存されます。",
    url: "apps/neon-2048/index.html",
    category: "webapp",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🎯",
    image: "images/neon-2048.png",
    date: "2026.07",
  },
  {
    title: "もふもふパーク — 猫と犬のふれあいカフェ",
    description: "かわいい猫と犬にエサをあげたり、撫でたり、おもちゃで遊んだり。時間制で気軽に楽しめるふれあいカフェの公式サイトです。",
    url: "works/cat-dog/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🐾",
    date: "2026.07",
  },
  {
    title: "日本史クイズ 〜いにしえの偉人〜",
    description: "旧石器時代から江戸時代までの有名な人物を出題する4択の日本史クイズ。全24問を「簡単・普通・難しい・激ムズ」の4難易度で用意し、各問に難易度と時代、解説つき。和紙風のやさしいデザインで1人でも楽しめます。",
    url: "apps/history-quiz/index.html",
    category: "webapp",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🏯",
    image: "images/history-quiz.png",
    date: "2026.07",
  },
  {
    title: "パンダオセロ — 1人用リバーシ",
    description: "かわいいパンダとあそぶ1人用オセロ(リバーシ)。黒石がパンダ、CPUと対戦できます。強さは3段階(よわい・ふつう・つよい)から選べ、つよいはαβ法の先読みAI。竹林グリーンのやさしいデザインでスマホでも快適に遊べます。",
    url: "apps/othello/index.html",
    category: "webapp",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🐼",
    image: "images/othello.png",
    date: "2026.07",
  },
  {
    title: "DRINK GARDEN — 世界のドリンク専門店",
    description: "コーラやタピオカミルクティーなど、世界の定番ドリンク62種類を実写真つきで「炭酸飲料」「フルーツジュース」「お茶」「コーヒー」など8カテゴリーに分けてあいうえお順で掲載。ドリンクをクリックすると詳細ページ、カートは数量変更・削除も自由自在なド派手でポップなドリンクスタンドサイトです。",
    url: "works/drink-garden/index.html",
    category: "website",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🥤",
    image: "images/drink-garden.png",
    date: "2026.07",
  },
  {
    // ※「すべて」で最後に表示させたいので、このカードは配列の末尾に置いています
    title: "かわいいクイズランド — ○×クイズアプリ",
    description: "ディズニー○×クイズ(全20問・ランダム出題)、パズル、タイマーの3つの遊びを収録したパステルかわいいWebアプリ。このままブラウザで遊べます。本体は問題管理CRUD付きのフルスタック構成(Java / Spring Boot / PostgreSQL)。",
    url: "apps/quiz-claude/app/index.html",
    category: "webapp",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
    emoji: "🍬",
    image: "images/quiz-claude.png",
    date: "2026.07",
  },
];
