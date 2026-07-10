// ============================================================
// スミカ不動産 物件データ
// ・images 配列にパスを追加すると NoImage から差し替わります
//   例: images: ["images/rooms/r101-1.jpg", "images/rooms/r101-2.jpg"]
// ・賃料/管理費は「円」、敷金/礼金は「賃料の何ヶ月分」で指定
// ============================================================

const CURRENT_YEAR = 2026;

// ---------------- 建物データ ----------------
// let 宣言なのは、APIサーバー稼働時に PostgreSQL のデータで置き換えるため(js/api.js 参照)
let BUILDINGS = [
  // ===== アパート(ボロボロ〜普通) =====
  {
    id: "b01",
    name: "幸荘(さいわいそう)",
    type: "apartment",
    address: "東京都青葉川区仲宿町3-14-8",
    access: [
      { line: "東都線", station: "仲宿", walk: 18 },
      { line: "青葉川バス「仲宿三丁目」", station: "停留所", walk: 4 }
    ],
    builtYear: 1974,
    structure: "木造",
    totalFloors: 2,
    totalUnits: 8,
    note: "昭和の風情が残る味わい深いアパート。家賃重視の方に。"
  },
  {
    id: "b02",
    name: "コーポ久保田",
    type: "apartment",
    address: "東京都青葉川区栄町1-22-6",
    access: [{ line: "東都線", station: "青葉川", walk: 14 }],
    builtYear: 1988,
    structure: "木造",
    totalFloors: 2,
    totalUnits: 6,
    note: "商店街そば。生活利便性は良好な昔ながらのアパート。"
  },
  {
    id: "b03",
    name: "メゾン・ド・たんぽぽ",
    type: "apartment",
    address: "神奈川県湊川市白鳥台2-8-15",
    access: [{ line: "湊川線", station: "白鳥台", walk: 10 }],
    builtYear: 1997,
    structure: "軽量鉄骨造",
    totalFloors: 2,
    totalUnits: 10,
    note: "敷地内駐車場ありの郊外型アパート。ファミリーにも。"
  },
  {
    id: "b04",
    name: "ハイツ青葉台II",
    type: "apartment",
    address: "東京都青葉川区青葉台4-6-21",
    access: [{ line: "東都線", station: "青葉台", walk: 7 }],
    builtYear: 2009,
    structure: "軽量鉄骨造",
    totalFloors: 2,
    totalUnits: 8,
    note: "小型犬飼育相談可。手頃な賃料と設備のバランスが良い一棟。"
  },

  // ===== マンション(普通〜やや良い) =====
  {
    id: "b05",
    name: "グランメール藤沢台",
    type: "mansion",
    address: "東京都藤沢台区本町2-11-3",
    access: [{ line: "都心環状線", station: "藤沢台", walk: 9 }],
    builtYear: 2005,
    structure: "RC(鉄筋コンクリート)造",
    totalFloors: 7,
    totalUnits: 28,
    note: "管理良好な中規模マンション。単身〜二人暮らしに人気。"
  },
  {
    id: "b06",
    name: "パークサイド千歳レジデンス",
    type: "mansion",
    address: "東京都千歳野区千歳公園1-3-12",
    access: [
      { line: "都心環状線", station: "千歳野", walk: 6 },
      { line: "東都線", station: "千歳公園", walk: 11 }
    ],
    builtYear: 2014,
    structure: "RC(鉄筋コンクリート)造",
    totalFloors: 10,
    totalUnits: 45,
    note: "公園隣接・ペット可(小型犬・猫)。敷地内駐車場あり。"
  },
  {
    id: "b07",
    name: "ルミエール桜ヶ丘",
    type: "mansion",
    address: "東京都桜ヶ丘区桜通り5-2-9",
    access: [{ line: "桜ヶ丘線", station: "桜ヶ丘", walk: 4 }],
    builtYear: 2022,
    structure: "RC(鉄筋コンクリート)造",
    totalFloors: 8,
    totalUnits: 32,
    note: "築浅・インターネット無料・宅配ボックス完備のデザイナーズ。"
  },

  // ===== タワーマンション(良い〜高級) =====
  {
    id: "b08",
    name: "セレスティアタワー湊風",
    type: "tower",
    address: "東京都湾岸区湊風1-1-1",
    access: [
      { line: "湾岸線", station: "湊風", walk: 5 },
      { line: "都心環状線", station: "湾岸中央", walk: 12 }
    ],
    builtYear: 2019,
    structure: "SRC(鉄骨鉄筋コンクリート)造",
    totalFloors: 38,
    totalUnits: 320,
    note: "運河沿いの38階建てタワー。スカイラウンジ・フィットネス完備。"
  },
  {
    id: "b09",
    name: "ザ・グランスカイタワー中央",
    type: "tower",
    address: "東京都中央川区大手町通り2-1-1",
    access: [
      { line: "都心環状線", station: "中央川", walk: 3 },
      { line: "東都線", station: "大手町通り", walk: 1, note: "駅直結" }
    ],
    builtYear: 2024,
    structure: "SRC(鉄骨鉄筋コンクリート)造",
    totalFloors: 52,
    totalUnits: 480,
    note: "駅直結52階建て。コンシェルジュ・ゲストルーム・プール併設の最高級レジデンス。"
  }
  ,
  // ===== 新着物件(2026年追加) =====
  {
    id: "b10",
    name: "サニーコート青葉台",
    type: "apartment",
    address: "東京都青葉川区青葉台4-6-2",
    access: [{ line: "東都線", station: "青葉台", walk: 7 }],
    builtYear: 2015,
    structure: "軽量鉄骨造",
    totalFloors: 2,
    totalUnits: 10,
    note: "築浅めで室内キレイなアパート。単身・学生さんに人気のエリアです。"
  },
  {
    id: "b11",
    name: "グランレジデンス桜ヶ丘",
    type: "mansion",
    address: "東京都桜ヶ丘区桜通り5-12-3",
    access: [
      { line: "都心環状線", station: "桜ヶ丘", walk: 6 },
      { line: "東都線", station: "桜通り", walk: 9 }
    ],
    builtYear: 2021,
    structure: "RC(鉄筋コンクリート)造",
    totalFloors: 9,
    totalUnits: 45,
    note: "オートロック・宅配ボックス完備の築浅マンション。桜並木沿いの静かな住環境。"
  },
  {
    id: "b12",
    name: "アズールタワー天空橋",
    type: "tower",
    address: "東京都湾岸区天空橋3-2-1",
    access: [
      { line: "湾岸線", station: "天空橋", walk: 4 },
      { line: "モノレール", station: "天空橋東", walk: 6 }
    ],
    builtYear: 2025,
    structure: "SRC(鉄骨鉄筋コンクリート)造",
    totalFloors: 44,
    totalUnits: 380,
    note: "2025年竣工の最新タワー。空港アクセス良好、スカイデッキ・ラウンジ・ジム完備。"
  }
];

// ---------------- 部屋データ ----------------
// deposit / keyMoney : 賃料の何ヶ月分(0 = なし)
// parking : "" = なし / それ以外は内容を記載
let ROOMS = [
  // ========== 幸荘(築52年・ボロボロ) ==========
  {
    id: "r0101", buildingId: "b01", roomNo: "101", floor: 1,
    layout: "1K", area: 16.5, direction: "北",
    rent: 25000, managementFee: 1000, deposit: 0, keyMoney: 0,
    parking: "", pet: false,
    tags: ["敷金なし", "礼金なし", "和室", "プロパンガス"],
    description: "とにかく家賃を抑えたい方へ。昭和49年築、味のある和室6畳のお部屋です。水回りは年季が入っていますが、その分この賃料。共用廊下の床は少しきしみますが、大家さんが月1回掃除に来てくれます。"
  },
  {
    id: "r0102", buildingId: "b01", roomNo: "103", floor: 1,
    layout: "1K", area: 16.5, direction: "南",
    rent: 28000, managementFee: 1000, deposit: 1, keyMoney: 0,
    parking: "", pet: true,
    tags: ["礼金なし", "和室", "ペット相談可", "プロパンガス", "庭付き"],
    description: "1階南向き・小さな専用庭付き。古いお部屋ですがペット相談可(小型犬・猫1匹まで)は貴重です。畳は入居時に表替え済み。ガス給湯器は3年前に交換済みで、お湯はすぐ出ます。"
  },
  {
    id: "r0103", buildingId: "b01", roomNo: "201", floor: 2,
    layout: "2K", area: 28.0, direction: "南",
    rent: 38000, managementFee: 2000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["和室", "2人入居可", "プロパンガス", "日当たり良好"],
    description: "2階角の2K。和室4.5畳+6畳で、二人入居も相談可能です。南向きで日当たりは抜群。窓サッシは古く冬はやや冷えますが、家賃を考えれば十分の住み心地です。"
  },
  {
    id: "r0104", buildingId: "b01", roomNo: "203", floor: 2,
    layout: "1K", area: 17.0, direction: "西",
    rent: 27000, managementFee: 1000, deposit: 0, keyMoney: 0,
    parking: "", pet: false,
    tags: ["敷金なし", "礼金なし", "和室", "プロパンガス"],
    description: "初期費用を最小限に抑えられる敷金・礼金なしのお部屋。西日がよく入るので冬は意外と暖かいです。壁の一部にへこみがありますが、その分家賃はご近所最安クラス。"
  },

  // ========== コーポ久保田(築38年) ==========
  {
    id: "r0201", buildingId: "b02", roomNo: "102", floor: 1,
    layout: "1DK", area: 25.5, direction: "東",
    rent: 42000, managementFee: 2000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["礼金なし", "和室", "都市ガス", "商店街近く"],
    description: "徒歩2分の栄町商店街が生活の味方。夕方はお惣菜の値引きも。DK部分は板張り、居室は和室6畳です。給湯器・ガスコンロは交換済み。"
  },
  {
    id: "r0202", buildingId: "b02", roomNo: "201", floor: 2,
    layout: "1DK", area: 26.0, direction: "南東",
    rent: 47000, managementFee: 2000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["フローリング", "都市ガス", "リフォーム済", "2階以上"],
    description: "2023年に室内リフォーム済み。和室をフローリングに変更し、壁紙も一新しました。築年数を感じさせない室内です。外観は昔ながらですが、中はきれい。コスパ重視の方におすすめ。"
  },
  {
    id: "r0203", buildingId: "b02", roomNo: "202", floor: 2,
    layout: "2DK", area: 38.0, direction: "南",
    rent: 52000, managementFee: 3000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["和室", "2人入居可", "都市ガス", "日当たり良好", "2階以上"],
    description: "この賃料で2DK・38㎡はなかなか出ません。和室2間続きで、ふすまを開ければ広々ワンルームのようにも使えます。二人暮らしのスタートにどうぞ。"
  },
  {
    id: "r0204", buildingId: "b02", roomNo: "103", floor: 1,
    layout: "1K", area: 19.5, direction: "北東",
    rent: 39000, managementFee: 2000, deposit: 0, keyMoney: 0,
    parking: "", pet: false,
    tags: ["敷金なし", "礼金なし", "フローリング", "都市ガス"],
    description: "敷金・礼金ゼロで初期費用を抑えられる1K。北東向きで夏は涼しく過ごせます。室内洗濯機置場あり(防水パンは小型サイズ)。単身の方の仮住まいにも人気です。"
  },

  // ========== メゾン・ド・たんぽぽ(築29年) ==========
  {
    id: "r0301", buildingId: "b03", roomNo: "101", floor: 1,
    layout: "2DK", area: 40.5, direction: "南",
    rent: 55000, managementFee: 3000, deposit: 1, keyMoney: 0,
    parking: "敷地内 5,000円/月", pet: false,
    tags: ["礼金なし", "駐車場あり", "フローリング", "都市ガス", "専用庭"],
    description: "敷地内駐車場が月5,000円と格安。1階専用庭付きで、ガーデニングや子どもの遊び場に。小学校まで徒歩5分の子育て環境です。"
  },
  {
    id: "r0302", buildingId: "b03", roomNo: "203", floor: 2,
    layout: "2DK", area: 40.5, direction: "南",
    rent: 58000, managementFee: 3000, deposit: 1, keyMoney: 1,
    parking: "敷地内 5,000円/月", pet: false,
    tags: ["駐車場あり", "フローリング", "都市ガス", "日当たり良好", "2階以上", "バス・トイレ別"],
    description: "2階南向きで日当たり・風通しとも良好。バス・トイレ別、独立した洗面スペースありで、築年数の割に水回りが使いやすい間取りです。"
  },
  {
    id: "r0303", buildingId: "b03", roomNo: "105", floor: 1,
    layout: "1DK", area: 29.0, direction: "東",
    rent: 45000, managementFee: 3000, deposit: 1, keyMoney: 0,
    parking: "敷地内 5,000円/月", pet: true,
    tags: ["礼金なし", "駐車場あり", "ペット相談可", "フローリング", "バス・トイレ別"],
    description: "小型犬・猫飼育相談可(1匹まで・敷金1ヶ月積み増し)。近くに白鳥台中央公園があり、お散歩コースに困りません。車+ペットの暮らしを手頃に実現できます。"
  },
  {
    id: "r0304", buildingId: "b03", roomNo: "206", floor: 2,
    layout: "3DK", area: 52.0, direction: "南西",
    rent: 63000, managementFee: 3000, deposit: 2, keyMoney: 1,
    parking: "敷地内 5,000円/月", pet: false,
    tags: ["駐車場あり", "フローリング", "2人入居可", "2階以上", "バス・トイレ別", "追い焚き"],
    description: "ファミリー向け3DK。全居室に窓があり明るいお部屋です。2020年に給湯器を追い焚き付きに交換済み。この広さと駐車場込みでこの価格は郊外ならでは。"
  },

  // ========== ハイツ青葉台II(築17年) ==========
  {
    id: "r0401", buildingId: "b04", roomNo: "101", floor: 1,
    layout: "1K", area: 23.0, direction: "南",
    rent: 62000, managementFee: 3000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["フローリング", "バス・トイレ別", "独立洗面台", "都市ガス", "エアコン付"],
    description: "単身者に人気の設備充実1K。バス・トイレ別+独立洗面台で朝の支度がスムーズ。駅徒歩7分、コンビニ徒歩1分の便利な立地です。"
  },
  {
    id: "r0402", buildingId: "b04", roomNo: "202", floor: 2,
    layout: "1LDK", area: 33.5, direction: "南",
    rent: 75000, managementFee: 4000, deposit: 1, keyMoney: 1,
    parking: "近隣 12,000円/月", pet: true,
    tags: ["ペット相談可", "フローリング", "バス・トイレ別", "独立洗面台", "2階以上", "エアコン付", "宅配ボックス"],
    description: "小型犬1匹まで飼育相談可の1LDK。LDK10帖+洋室6帖のゆとりある間取り。2階角部屋で足音を気にせずペットと暮らせます。宅配ボックスも後付け設置済み。"
  },
  {
    id: "r0403", buildingId: "b04", roomNo: "103", floor: 1,
    layout: "1K", area: 22.5, direction: "東",
    rent: 58000, managementFee: 3000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["礼金なし", "フローリング", "バス・トイレ別", "都市ガス", "エアコン付"],
    description: "礼金なしの東向き1K。朝日で気持ちよく目覚められるお部屋です。室内は白基調で清潔感があり、女性の入居者も多い一棟です。"
  },
  {
    id: "r0404", buildingId: "b04", roomNo: "205", floor: 2,
    layout: "2LDK", area: 45.0, direction: "南西",
    rent: 89000, managementFee: 4000, deposit: 1, keyMoney: 1,
    parking: "近隣 12,000円/月", pet: false,
    tags: ["フローリング", "バス・トイレ別", "独立洗面台", "2人入居可", "2階以上", "追い焚き", "エアコン付"],
    description: "アパートながら2LDK・45㎡の広さ。カウンターキッチンと追い焚き付きバスで、マンション顔負けの設備です。二人暮らし・新婚さんに。"
  },

  // ========== グランメール藤沢台(築21年) ==========
  {
    id: "r0501", buildingId: "b05", roomNo: "203", floor: 2,
    layout: "1K", area: 24.5, direction: "東",
    rent: 72000, managementFee: 6000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["オートロック", "バス・トイレ別", "独立洗面台", "フローリング", "エアコン付", "2階以上"],
    description: "オートロック付きRCマンションの1K。上下階の音が響きにくい鉄筋コンクリート造で、在宅ワークにも向いています。管理人が週3日巡回しており共用部はいつも清潔。"
  },
  {
    id: "r0502", buildingId: "b05", roomNo: "405", floor: 4,
    layout: "1LDK", area: 36.0, direction: "南",
    rent: 88000, managementFee: 7000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["オートロック", "バス・トイレ別", "独立洗面台", "宅配ボックス", "フローリング", "2階以上", "エアコン付"],
    description: "4階南向きの明るい1LDK。前面に高い建物がなく、眺望・採光良好です。宅配ボックス完備で不在時の荷物受け取りも安心。"
  },
  {
    id: "r0503", buildingId: "b05", roomNo: "601", floor: 6,
    layout: "2LDK", area: 55.0, direction: "南東",
    rent: 98000, managementFee: 8000, deposit: 2, keyMoney: 1,
    parking: "", pet: false,
    tags: ["オートロック", "バス・トイレ別", "追い焚き", "浴室乾燥機", "角部屋", "2人入居可", "2階以上", "エアコン付"],
    description: "6階南東角部屋の2LDK。二面採光で風通し抜群。追い焚き+浴室乾燥機付きで雨の日の洗濯も安心です。ファミリー・DINKSに。"
  },
  {
    id: "r0504", buildingId: "b05", roomNo: "302", floor: 3,
    layout: "1DK", area: 30.0, direction: "西",
    rent: 78000, managementFee: 6000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["礼金なし", "オートロック", "バス・トイレ別", "独立洗面台", "リフォーム済", "2階以上", "エアコン付"],
    description: "2025年リフォーム済み・礼金なし。キッチンと洗面台を新品交換し、築年数を感じない室内に生まれ変わりました。夕日がきれいな西向きです。"
  },

  // ========== パークサイド千歳レジデンス(築12年) ==========
  {
    id: "r0601", buildingId: "b06", roomNo: "305", floor: 3,
    layout: "1LDK", area: 40.0, direction: "南",
    rent: 105000, managementFee: 8000, deposit: 1, keyMoney: 1,
    parking: "敷地内 18,000円/月", pet: true,
    tags: ["ペット可", "駐車場あり", "オートロック", "宅配ボックス", "バス・トイレ別", "独立洗面台", "浴室乾燥機", "2階以上", "エアコン付"],
    description: "小型犬・猫2匹まで飼育可(敷金1ヶ月積み増し)。目の前が千歳公園で、朝のお散歩が日課になります。1階に足洗い場あり。ペットと暮らすための設計が随所に。"
  },
  {
    id: "r0602", buildingId: "b06", roomNo: "702", floor: 7,
    layout: "2LDK", area: 58.5, direction: "南東",
    rent: 135000, managementFee: 10000, deposit: 1, keyMoney: 1,
    parking: "敷地内 18,000円/月", pet: true,
    tags: ["ペット可", "駐車場あり", "オートロック", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "角部屋", "2階以上", "エアコン付"],
    description: "7階角部屋・公園ビューの2LDK。リビング床暖房+追い焚き付きで冬も快適。窓から千歳公園の緑を一望でき、季節の移ろいを感じられるお部屋です。"
  },
  {
    id: "r0603", buildingId: "b06", roomNo: "201", floor: 2,
    layout: "1K", area: 26.0, direction: "東",
    rent: 85000, managementFee: 7000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["礼金なし", "オートロック", "宅配ボックス", "バス・トイレ別", "独立洗面台", "2階以上", "エアコン付"],
    description: "礼金なしの築浅感ある1K。26㎡と単身向けにしてはゆとりがあり、テレワーク用デスクも置けます。共用部の植栽が美しい、管理の行き届いたマンションです。"
  },
  {
    id: "r0604", buildingId: "b06", roomNo: "805", floor: 8,
    layout: "3LDK", area: 72.0, direction: "南",
    rent: 168000, managementFee: 12000, deposit: 2, keyMoney: 1,
    parking: "敷地内 18,000円/月", pet: true,
    tags: ["ペット可", "駐車場あり", "オートロック", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "2人入居可", "2階以上", "エアコン付"],
    description: "ファミリー向け3LDK・72㎡。全居室収納付き+ウォークインクローゼットで収納力抜群。学区の千歳小学校は徒歩6分。ペットも家族も伸び伸び暮らせます。"
  },
  {
    id: "r0605", buildingId: "b06", roomNo: "506", floor: 5,
    layout: "2DK", area: 48.0, direction: "西",
    rent: 112000, managementFee: 8000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["オートロック", "宅配ボックス", "バス・トイレ別", "独立洗面台", "追い焚き", "2人入居可", "2階以上", "エアコン付"],
    description: "使い勝手の良い2DK。ダイニングキッチンが10帖あり、実質1LDKのように使えます。夕焼けがきれいな西向きバルコニーはガーデニングにも。"
  },

  // ========== ルミエール桜ヶ丘(築4年) ==========
  {
    id: "r0701", buildingId: "b07", roomNo: "202", floor: 2,
    layout: "1K", area: 26.5, direction: "南",
    rent: 105000, managementFee: 10000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["インターネット無料", "オートロック", "宅配ボックス", "バス・トイレ別", "独立洗面台", "浴室乾燥機", "デザイナーズ", "2階以上", "エアコン付"],
    description: "築浅デザイナーズの1K。コンクリート打ちっぱなしの壁と間接照明レールがおしゃれな室内。インターネット無料(1Gbps)で開通工事も不要です。"
  },
  {
    id: "r0702", buildingId: "b07", roomNo: "503", floor: 5,
    layout: "1LDK", area: 42.0, direction: "南",
    rent: 138000, managementFee: 12000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["インターネット無料", "オートロック", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "デザイナーズ", "2階以上", "エアコン付", "カウンターキッチン"],
    description: "駅徒歩4分・築4年の1LDK。アイランド風カウンターキッチンが主役の、料理が楽しくなるお部屋です。桜ヶ丘駅前の再開発エリアで、商業施設も充実。"
  },
  {
    id: "r0703", buildingId: "b07", roomNo: "801", floor: 8,
    layout: "2LDK", area: 60.0, direction: "南西",
    rent: 160000, managementFee: 14000, deposit: 2, keyMoney: 1,
    parking: "近隣 25,000円/月", pet: false,
    tags: ["インターネット無料", "オートロック", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "角部屋", "最上階", "デザイナーズ", "エアコン付"],
    description: "最上階南西角の2LDK。桜通りの桜並木を見下ろすバルコニーは、春には特等席になります。天井高2.6mのゆとりある空間設計。"
  },
  {
    id: "r0704", buildingId: "b07", roomNo: "304", floor: 3,
    layout: "1DK", area: 32.0, direction: "東",
    rent: 118000, managementFee: 10000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["礼金なし", "インターネット無料", "オートロック", "宅配ボックス", "バス・トイレ別", "独立洗面台", "浴室乾燥機", "デザイナーズ", "2階以上", "エアコン付"],
    description: "礼金なしキャンペーン中の1DK。土間風の玄関スペースが特徴で、自転車や観葉植物を置くのも◎。個性的な間取りがお好きな方へ。"
  },

  // ========== セレスティアタワー湊風(築7年・タワー) ==========
  {
    id: "r0801", buildingId: "b08", roomNo: "1205", floor: 12,
    layout: "1LDK", area: 45.0, direction: "東",
    rent: 165000, managementFee: 15000, deposit: 1, keyMoney: 1,
    parking: "敷地内(機械式) 35,000円/月", pet: true,
    tags: ["タワーマンション", "ペット可", "駐車場あり", "オートロック", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "フィットネス", "エアコン付"],
    description: "12階東向き、運河を望む1LDK。朝は水面に反射する朝日が室内を満たします。24時間有人管理+コンシェルジュサービス(クリーニング取次など)付き。"
  },
  {
    id: "r0802", buildingId: "b08", roomNo: "2103", floor: 21,
    layout: "2LDK", area: 62.0, direction: "南",
    rent: 235000, managementFee: 20000, deposit: 2, keyMoney: 1,
    parking: "敷地内(機械式) 35,000円/月", pet: true,
    tags: ["タワーマンション", "ペット可", "駐車場あり", "オートロック", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "眺望良好", "フィットネス", "エアコン付"],
    description: "21階南向き2LDK。レインボーカラーにライトアップされる湾岸の夜景が毎晩の楽しみに。ディスポーザー・食洗機・タンクレストイレと設備もフルスペック。"
  },
  {
    id: "r0803", buildingId: "b08", roomNo: "3002", floor: 30,
    layout: "2LDK", area: 68.5, direction: "南西",
    rent: 280000, managementFee: 25000, deposit: 2, keyMoney: 2,
    parking: "敷地内(機械式) 35,000円/月", pet: true,
    tags: ["タワーマンション", "ペット可", "駐車場あり", "オートロック", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "角部屋", "眺望良好", "フィットネス", "エアコン付"],
    description: "30階南西角住戸。リビングのワイドサッシから海と都心のビル群を一望できます。35階のスカイラウンジ、3階のフィットネスジム(24時間)は住人無料。"
  },
  {
    id: "r0804", buildingId: "b08", roomNo: "905", floor: 9,
    layout: "1K", area: 30.0, direction: "北",
    rent: 125000, managementFee: 12000, deposit: 1, keyMoney: 1,
    parking: "", pet: false,
    tags: ["タワーマンション", "オートロック", "コンシェルジュ", "宅配ボックス", "バス・トイレ別", "独立洗面台", "浴室乾燥機", "フィットネス", "エアコン付"],
    description: "タワーライフを手の届く価格で。9階北向きは直射日光が少なく、夏も涼しく在宅ワークに最適。共用施設(ラウンジ・ジム・ゲストルーム)はすべて利用可能です。"
  },
  {
    id: "r0805", buildingId: "b08", roomNo: "3501", floor: 35,
    layout: "3LDK", area: 85.0, direction: "南",
    rent: 350000, managementFee: 30000, deposit: 2, keyMoney: 2,
    parking: "敷地内(平置き) 45,000円/月", pet: true,
    tags: ["タワーマンション", "ペット可", "駐車場あり", "オートロック", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "眺望良好", "高層階", "フィットネス", "エアコン付"],
    description: "35階・スカイラウンジと同フロアのプレミアム3LDK。85㎡の広さに加え、天井高2.7m・複層ガラス・全室床暖房。花火大会の日は自宅が特等席になります。"
  },

  // ========== ザ・グランスカイタワー中央(築2年・最高級) ==========
  {
    id: "r0901", buildingId: "b09", roomNo: "1808", floor: 18,
    layout: "1LDK", area: 50.0, direction: "東",
    rent: 250000, managementFee: 25000, deposit: 2, keyMoney: 1,
    parking: "敷地内(機械式) 50,000円/月", pet: true,
    tags: ["タワーマンション", "駅直結", "ペット可", "駐車場あり", "オートロック", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "フィットネス", "プール", "エアコン付"],
    description: "駅直結・雨に濡れずに帰宅できる18階1LDK。ホテルライクな内廊下設計で、廊下には絨毯とアートが。スマートキー+顔認証エントランスの最新セキュリティ。"
  },
  {
    id: "r0902", buildingId: "b09", roomNo: "2704", floor: 27,
    layout: "2LDK", area: 70.0, direction: "南東",
    rent: 380000, managementFee: 35000, deposit: 2, keyMoney: 2,
    parking: "敷地内(機械式) 50,000円/月", pet: true,
    tags: ["タワーマンション", "駅直結", "ペット可", "駐車場あり", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "眺望良好", "フィットネス", "プール", "エアコン付"],
    description: "27階南東向き2LDK。LDK20帖の大空間に、御影石カウンターのオーダーキッチン。共用部には25mプール・サウナ・ゲストスイートを完備しています。"
  },
  {
    id: "r0903", buildingId: "b09", roomNo: "3902", floor: 39,
    layout: "3LDK", area: 95.0, direction: "南",
    rent: 550000, managementFee: 45000, deposit: 3, keyMoney: 2,
    parking: "敷地内(平置き) 60,000円/月", pet: true,
    tags: ["タワーマンション", "駅直結", "ペット可", "駐車場あり", "コンシェルジュ", "宅配ボックス", "追い焚き", "浴室乾燥機", "床暖房", "眺望良好", "高層階", "フィットネス", "プール", "エアコン付"],
    description: "39階・95㎡の3LDK。バスルームからも夜景を望める贅沢な設計です。専属コンシェルジュによるハウスキーピング・タクシー手配などホテルサービスを日常に。"
  },
  {
    id: "r0904", buildingId: "b09", roomNo: "4501", floor: 45,
    layout: "3LDK", area: 110.0, direction: "南西",
    rent: 780000, managementFee: 60000, deposit: 3, keyMoney: 2,
    parking: "敷地内(平置き) 60,000円/月", pet: true,
    tags: ["タワーマンション", "駅直結", "ペット可", "駐車場あり", "コンシェルジュ", "追い焚き", "浴室乾燥機", "床暖房", "角部屋", "眺望良好", "高層階", "フィットネス", "プール", "エアコン付"],
    description: "45階南西角のエグゼクティブ住戸。二面のコーナーサッシが切り取る夕景は圧巻の一言。ワインセラー・ミーレ製食洗機・天然石の玄関と、細部まで一切妥協のない仕様です。"
  },
  {
    id: "r0905", buildingId: "b09", roomNo: "5201", floor: 52,
    layout: "4LDK", area: 165.0, direction: "南",
    rent: 1500000, managementFee: 100000, deposit: 6, keyMoney: 0,
    parking: "専用2台(平置き) 無料", pet: true,
    tags: ["タワーマンション", "駅直結", "ペントハウス", "ペット可", "駐車場あり", "コンシェルジュ", "追い焚き", "浴室乾燥機", "床暖房", "眺望良好", "高層階", "フィットネス", "プール", "ルーフバルコニー", "エアコン付"],
    description: "最上階52階・ワンフロア半分を占めるペントハウス。165㎡+50㎡のルーフバルコニー、天井高3.2m。専用エレベーターで玄関前まで直行できます。都心の全景を独り占めする、東京で数少ない賃貸最高峰の住まい。内見は事前審査制です。"
  }
  ,
  // ========== サニーコート青葉台(新着・築浅アパート) ==========
  {
    id: "r1001", buildingId: "b10", roomNo: "102", floor: 1,
    layout: "1K", area: 22.4, direction: "南",
    rent: 68000, managementFee: 3000, deposit: 1, keyMoney: 0,
    parking: "", pet: false,
    tags: ["新着", "礼金なし", "築浅", "独立洗面台", "室内洗濯機置場", "エアコン付", "都市ガス"],
    description: "2015年築のキレイな1K。白基調の室内に独立洗面台付きで、この賃料はお得です。駅徒歩7分・コンビニ1分の好立地。女性の一人暮らしにもおすすめです。"
  },
  {
    id: "r1002", buildingId: "b10", roomNo: "201", floor: 2,
    layout: "1LDK", area: 33.6, direction: "南東",
    rent: 89000, managementFee: 3000, deposit: 1, keyMoney: 1,
    parking: "近隣月極 12,000円", pet: true,
    tags: ["新着", "築浅", "ペット相談可", "2人入居可", "対面キッチン", "エアコン付", "日当たり良好"],
    description: "角部屋の1LDK。対面キッチンとゆとりのリビングで、カップル・新婚さんにも。小型犬・猫1匹まで相談可能です。"
  },
  // ========== グランレジデンス桜ヶ丘(新着・築浅マンション) ==========
  {
    id: "r1101", buildingId: "b11", roomNo: "305", floor: 3,
    layout: "1LDK", area: 40.2, direction: "南",
    rent: 138000, managementFee: 8000, deposit: 1, keyMoney: 1,
    parking: "敷地内 18,000円", pet: false,
    tags: ["新着", "築浅", "オートロック", "宅配ボックス", "浴室乾燥機", "追い焚き", "システムキッチン", "エアコン付"],
    description: "2021年築・設備充実の1LDK。浴室乾燥機と追い焚き付きで、忙しい社会人の毎日を快適に。窓の外には桜並木が広がり、春の眺めは格別です。"
  },
  {
    id: "r1102", buildingId: "b11", roomNo: "801", floor: 8,
    layout: "2LDK", area: 58.7, direction: "南西",
    rent: 198000, managementFee: 10000, deposit: 2, keyMoney: 1,
    parking: "敷地内 18,000円", pet: true,
    tags: ["新着", "築浅", "角部屋", "ペット可", "オートロック", "宅配ボックス", "床暖房", "カウンターキッチン", "眺望良好"],
    description: "8階角部屋の2LDK。リビング床暖房・ワイドバルコニー付きで、ファミリーにぴったり。ペット可(小型犬・猫2匹まで)の希少物件です。"
  },
  // ========== アズールタワー天空橋(新着・最新タワー) ==========
  {
    id: "r1201", buildingId: "b12", roomNo: "1508", floor: 15,
    layout: "1LDK", area: 45.8, direction: "東",
    rent: 225000, managementFee: 15000, deposit: 1, keyMoney: 1,
    parking: "機械式 25,000円", pet: false,
    tags: ["新着", "タワーマンション", "築浅", "コンシェルジュ", "ディスポーザー", "浴室乾燥機", "床暖房", "眺望良好", "フィットネス"],
    description: "2025年竣工・15階東向きの1LDK。朝日と運河の眺めが自慢です。共用部にはコワーキングラウンジとジムを完備。空港へも好アクセスで出張の多い方に。"
  },
  {
    id: "r1202", buildingId: "b12", roomNo: "3902", floor: 39,
    layout: "3LDK", area: 85.3, direction: "南",
    rent: 420000, managementFee: 25000, deposit: 2, keyMoney: 1,
    parking: "機械式 25,000円", pet: true,
    tags: ["新着", "タワーマンション", "高層階", "ペット可", "コンシェルジュ", "ゲストルーム", "床暖房", "ウォークインクローゼット", "眺望良好", "スカイデッキ"],
    description: "39階南向きの3LDK。リビングから東京湾を一望できる特等席です。全居室収納付き+WIC、キッチンはディスポーザー・食洗機標準装備。最上級の暮らしをどうぞ。"
  }
];

// ---------------- ヘルパー ----------------
const TYPE_LABELS = {
  apartment: "アパート",
  mansion: "マンション",
  tower: "タワーマンション"
};

function getBuilding(id) {
  return BUILDINGS.find((b) => b.id === id);
}

function getRoom(id) {
  return ROOMS.find((r) => r.id === id);
}

function buildingAge(building) {
  return CURRENT_YEAR - building.builtYear;
}

function formatRent(yen) {
  return (yen / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 }) + "万円";
}

function formatYen(yen) {
  return yen.toLocaleString("ja-JP") + "円";
}

function formatMonths(months, rent) {
  if (months === 0) return "なし";
  return `${months}ヶ月(${formatYen(rent * months)})`;
}

function accessText(building) {
  return building.access
    .map((a) => `${a.line}「${a.station}」${a.note ? a.note : "徒歩" + a.walk + "分"}`)
    .join(" / ");
}

function minWalk(building) {
  return Math.min(...building.access.map((a) => a.walk));
}

// ---------------- 画像の自動割り当て ----------------
// images 未指定の部屋には自動生成のイメージ画像(SVG)を割り当てます。
// 実写真に差し替える場合は各部屋に images: ["images/rooms/xxx.jpg", ...] を指定するか、
// この関数の呼び出しをやめれば NoImage 表示に戻ります。
function assignDefaultImages(rooms) {
  for (const r of rooms) {
    if (!r.images || r.images.length === 0) {
      r.images = [`images/rooms/${r.id}.svg`, `images/buildings/${r.buildingId}.svg`];
    }
  }
}

assignDefaultImages(ROOMS);
