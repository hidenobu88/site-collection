// =========================================================
// FLORIA GARDENS フローリア・ガーデンズ - データファイル
// attractions.html / attraction.html / characters.html / character.html
// shop.html がこのデータを読み込んで表示します。
// 画像はすべて Wikimedia Commons のフリーライセンス実写素材を使用しています。
// =========================================================

window.FG_DATA = {

  attractions: [
    {
      id: 'sky-streak',
      name: 'スカイストリーク',
      en: 'SKY STREAK COASTER',
      cats: ['thrill', 'night'],
      catLabels: ['絶叫系', '夜も運行'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Olympia_Looping_-_steel_roller_coaster.jpg/1920px-Olympia_Looping_-_steel_roller_coaster.jpg',
      copy: '大きならせんループが目印。花の丘をひとっ飛びする絶叫No.1コースター',
      desc: '丘のてっぺんから一気に急降下したあと、2回転する大きならせんループへ突入！ フローリア・ガーデンズいちばんのスピードと落差をほこる看板コースターです。コース脇には季節の花壇が広がっていて、絶叫のあいまにチラッと見える花畑がちょっとした癒やしポイント。ライトアップされる夜の便は昼とはまったく違う迫力で、リピーターの多くが「まずは昼、そして夜」の2回乗りをおすすめしています。',
      specs: { '身長制限': '130cm以上', '最高速度': '時速88km', '最大落差': '35m', 'コース全長': '950m', '所要時間': '約2分30秒', '定員': '1編成24名' },
      tips: [
        '最前列は花畑ごしの絶景、最後尾はいちばんの浮遊感。好みで選んで！',
        '夜のライトアップ運行は行列が長くなりがち。日没直後がねらい目',
        '大きな手荷物はスタート前の無料ロッカーへ。飛んでいっちゃいます'
      ]
    },
    {
      id: 'thunder-vine',
      name: 'サンダーヴァイン',
      en: 'THUNDER VINE',
      cats: ['thrill'],
      catLabels: ['絶叫系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Roller_coaster_at_Kozhikode.jpg/1920px-Roller_coaster_at_Kozhikode.jpg',
      copy: '木漏れ日の森をぬうように走る、うねうねターン連発コースター',
      desc: '「つる植物にひっぱられるように進む」がコンセプトの、左右にうねうねと大きく揺れるコースター。落差よりもターンの連続で目がまわる系の絶叫が味わえます。森の中を抜けるコースなので、天気のいい日は木漏れ日がキラキラ差しこんで気持ちいい特別な体験に。絶叫初心者からベテランまで、幅広く楽しめる2台目コースターです。',
      specs: { '身長制限': '120cm以上', '最高速度': '時速62km', 'コース全長': '620m', '所要時間': '約1分50秒', '定員': '1編成20名', '特徴': '急旋回7回' },
      tips: [
        '横Gがすごいので、隣の人としっかり肩を組んでおくと安心',
        '午前中は空いていて2〜3周待ちなしのことも',
        '森の中は夏でもすずしいので、暑い日の絶叫はここから'
      ]
    },
    {
      id: 'drop-blossom',
      name: 'ドロップ・ブロッサム',
      en: 'DROP BLOSSOM',
      cats: ['thrill'],
      catLabels: ['絶叫系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Drop_tower_ride.jpg/1920px-Drop_tower_ride.jpg',
      copy: '花びらの形のシートで一気に急降下！心臓が跳ねる自由落下',
      desc: '大きな花のつぼみをイメージしたゴンドラが、ゆっくりゆっくり高さ45mまで上昇。頂上でパーク全体と花回廊のパノラマを楽しんだ次の瞬間——予告なしの自由落下！ つぼみがパッと開くように一気に地上へ落ちていきます。落下は1回だけでなく、小さく2回バウンドするおまけつき。絶叫デビューにもぴったりな高さと強さです。',
      specs: { '身長制限': '120cm以上', '高さ': '45m', '所要時間': '約2分', '定員': '16名', '落下回数': '大1回＋小2回', 'こわさ目安': '★★★★☆' },
      tips: [
        '頂上で3秒ほど静止する演出があります。ここが一番ドキドキ',
        '眼下に花回廊が一望できるので、勇気があれば目を開けてみて',
        '写真は落下の瞬間を自動撮影。出口の掲示モニターでチェックできるよ'
      ]
    },
    {
      id: 'dragon-swing',
      name: 'ドラゴンスイング',
      en: 'DRAGON SWING',
      cats: ['thrill'],
      catLabels: ['絶叫系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Dragon_Swing.jpg/1920px-Dragon_Swing.jpg',
      copy: '大きく振り子のように揺れる、無重力タイムが気持ちいいスイングライド',
      desc: 'ドラゴンの背中に見立てた座席が、左右に大きく弧を描いて揺れるパワフルなスイングライド。一番高いところでは体がふわっと浮く無重力タイムがあり、絶叫系の中では「叫ぶより笑っちゃう」派に人気。夕方の便は夕焼け空を独り占めできる、隠れフォトスポットでもあります。',
      specs: { '身長制限': '125cm以上', '最大振れ幅': '左右60度', '所要時間': '約2分30秒', '定員': '24名', 'こわさ目安': '★★★☆☆' },
      tips: [
        '両端の席がいちばん揺れます。真ん中は控えめな揺れでファミリー向け',
        '夕方17時前後の便は空がオレンジに染まって最高',
        '髪ゴムはしっかり結んでから乗車を！'
      ]
    },
    {
      id: 'grand-wheel',
      name: 'グランド・フラワーホイール',
      en: 'GRAND FLOWER WHEEL',
      cats: ['family', 'night'],
      catLabels: ['ファミリー', '夜◎'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Giant_Ferris_Wheel_Vienna_from_W_on_2010-09-20.jpg/1920px-Giant_Ferris_Wheel_Vienna_from_W_on_2010-09-20.jpg',
      copy: '高さ55m！花回廊とパーク全景をまるごと見わたす大観覧車',
      desc: 'てっぺんの高さ55mから、色とりどりの花回廊とパーク全体、天気がよければ遠くの海までも見わたせる大観覧車。ゆっくり12分かけて1周する間、ゴンドラの中はとても静か。デートや家族の記念撮影の定番スポットです。夜はゴンドラの縁が優しい光でふちどられ、パークいちのフォトジェニックな存在に。',
      specs: { '年齢制限': 'なし', '高さ': '55m', '1周の時間': '約12分', 'ゴンドラ数': '32台', '定員': '1台5名', '車いす対応': 'あり(専用ゴンドラ2台)' },
      tips: [
        '夕暮れどきは花回廊がオレンジに染まって特別な景色に',
        '土日の夕方は混みやすいので、午前中に乗るのがおすすめ',
        'カップルパックだと乗車優先券がついてくるよ'
      ]
    },
    {
      id: 'carousel-belle',
      name: 'メリーゴーランド・ラ・フルール',
      en: 'CAROUSEL LA FLEUR',
      cats: ['family', 'kids'],
      catLabels: ['ファミリー', 'キッズ'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Carousel_La_Belle.jpg/1920px-Carousel_La_Belle.jpg',
      copy: '花かざりのお馬さんがくるくる♪ 0歳から乗れる2階建てカルーセル',
      desc: '一頭一頭ちがう花のかざりがついたお馬さんが、やさしいオルゴールの音色にあわせてくるくる回る2階建てのカルーセル。0歳の赤ちゃんから保護者と一緒に乗車OKなので、はじめての遊園地デビューにもぴったり。夜は電球3,000個が灯って、まるで宝石箱のように輝きます。',
      specs: { '年齢制限': '0歳〜OK(未就学児は付添必要)', '所要時間': '約3分', '定員': '60名', 'お馬さん': '32頭', '演奏': 'オルゴール生演奏(毎時0分)' },
      tips: [
        '2階の馬車席は写真映えばつぐん！',
        '生演奏タイムは回転がゆっくりになるので赤ちゃん連れも安心',
        '夜のライトアップとの組み合わせが家族写真のベストタイム'
      ]
    },
    {
      id: 'log-flume',
      name: 'フォレスト・ログフルーム',
      en: 'FOREST LOG FLUME',
      cats: ['family', 'water'],
      catLabels: ['ファミリー', '水遊び系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Log_Flume_ride_at_Alton_Towers_-_geograph.org.uk_-_8143512.jpg',
      copy: '丸太ボートで森の水路をのんびり進み、最後は大きな水しぶき',
      desc: '丸太型のボートに乗って、緑ゆたかな水路をゆったり進む定番アトラクション。終盤の落差で一気にダイブすると、まわりまで届く豪快な水しぶきが上がります。夏場はぬれるのを楽しみに乗るお客さんも多い人気ライド。着水シーンは自動カメラで撮影されます。',
      specs: { '身長制限': '110cm以上', '最大落差': '12m', '所要時間': '約6分', '定員': '1艇4名', 'ぬれ度': '★★★★☆', '運休期間': '12月〜2月' },
      tips: [
        '前方の席がいちばんぬれます。ぬれたくない人は後方へ',
        '夏はレインコートが売店で購入できます',
        '着水後は乾燥エリアの温風ベンチでひとやすみ'
      ]
    },
    {
      id: 'bumper-cars',
      name: 'ラビットバンパーカー',
      en: 'RABBIT BUMPER CARS',
      cats: ['family', 'kids'],
      catLabels: ['ファミリー', 'キッズ'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bumper_Cars.jpg/1920px-Bumper_Cars.jpg',
      copy: 'うさぎ耳がついたカラフルカーで思いっきりゴツン！定番バンパーカー',
      desc: 'うさぎの耳がついたポップなデザインのバンパーカーで、思いっきりぶつかりあえる定番アトラクション。小さなお子さまは保護者と2人乗りもOK。速度はひかえめに設定されているので、家族みんなで安心して楽しめます。',
      specs: { '身長制限': '100cm以上(未就学児は付添可)', '所要時間': '約4分', '定員': '20台', '最高速度': '時速8km', '2人乗り': '可能' },
      tips: [
        '角のあたりはぶつかりやすいスポット。狙い目です',
        '2人乗りは保護者がハンドル操作、お子さまはベルで応援がおすすめ',
        '雨の日でも屋根つきなので運行することが多いです'
      ]
    },
    {
      id: 'pirate-ship',
      name: 'パイレーツ・スイング',
      en: 'PIRATE SWING',
      cats: ['family'],
      catLabels: ['ファミリー'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/RLZ_Superland_Pirate_ship_01.JPG/1920px-RLZ_Superland_Pirate_ship_01.JPG',
      copy: '大きな海賊船がザブーンと大きく揺れる、家族向けスイングシップ',
      desc: '大きな海賊船の形をしたゴンドラが、左右に大きく揺れるファミリー向けスイングライド。絶叫系ほどの強さはないけれど、船が高く上がる瞬間はしっかりドキドキ。船の両端は揺れが大きく、中央は控えめなので、乗る場所でスリルの強さを選べます。',
      specs: { '身長制限': '110cm以上', '最大振れ幅': '左右45度', '所要時間': '約3分', '定員': '40名', 'こわさ目安': '★★☆☆☆' },
      tips: [
        '端の席は迫力満点、中央は小さいお子さまでも安心',
        'すぐそばにミニトレイン乗り場があるのでハシゴしやすい',
        '船首・船尾は写真撮影の人気スポットです'
      ]
    },
    {
      id: 'mini-train',
      name: 'フローリア・ミニトレイン',
      en: 'FLORIA MINI TRAIN',
      cats: ['family', 'kids'],
      catLabels: ['ファミリー', 'キッズ'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Midway_State_Park_Miniature_Train_Ride.jpg/1920px-Midway_State_Park_Miniature_Train_Ride.jpg',
      copy: 'パークをぐるり一周。ベビーカーごと乗れるのんびり汽車の旅',
      desc: '花回廊やアトラクションエリアのまわりをゆっくり一周する、小さな汽車型トレイン。園内の移動手段としても便利で、ベビーカーのまま乗車できる車両もあります。車掌さんによる沿線ガイドアナウンスも人気で、歩きつかれたときの休憩がわりにもぴったり。',
      specs: { '年齢制限': 'なし', '所要時間': '1周約14分', '定員': '48名', '駅の数': '3駅', 'ベビーカー': 'そのまま乗車OK(1両のみ)' },
      tips: [
        '進行方向右側の席は花回廊がよく見えます',
        '午後の遅い時間は混みにくくゆったり乗れる',
        '3駅とも自由に乗り降りできるので移動手段としても優秀'
      ]
    },
    {
      id: 'go-kart',
      name: 'スピードガーデン・カート',
      en: 'SPEED GARDEN KART',
      cats: ['family'],
      catLabels: ['ファミリー'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Go-kart_course.jpg/1920px-Go-kart_course.jpg',
      copy: '花畑を見ながら自分のハンドルで走る、本格ゴーカートコース',
      desc: '色とりどりの花壇にそったコースを、自分のハンドルとアクセルで走れる本格ゴーカート。小さなお子さまは保護者と2人乗り用のカートもあり、免許がなくても家族みんなでドライブ気分が味わえます。1周ごとにタイムが計測されるので、大人も本気になれる隠れた人気施設。',
      specs: { '身長制限': '130cm以上(1人乗り)/100cm以上(2人乗り)', '所要時間': '1周約4分', 'コース全長': '600m', '最高速度': '時速20km', 'タイム計測': 'あり' },
      tips: [
        '2人乗り用カートは台数が少なめ。午前中の来場がおすすめ',
        'コーナーはスピードを落として安全運転で',
        'ベストタイムを記録すると出口のランキングボードに名前が載るかも'
      ]
    },
    {
      id: 'teacup',
      name: 'くるくるティーカップ',
      en: 'TWIRLING TEACUPS',
      cats: ['kids', 'family'],
      catLabels: ['キッズ', 'ファミリー'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Thorpe_Park_Teacups_2024-03-25.jpg/1920px-Thorpe_Park_Teacups_2024-03-25.jpg',
      copy: '自分でハンドルを回して速さ調整。カラフルなティーカップでくるくる',
      desc: 'かわいい花柄のティーカップに乗って、自分たちでハンドルを回しながらくるくる回転する定番アトラクション。ハンドルを回す力加減で回転スピードを自由に調整できるので、ゆっくり派もはやく派も好きなだけ楽しめます。小さなお子さまとの記念撮影にもぴったり。',
      specs: { '年齢制限': '3歳〜OK(未就学児は付添必要)', '所要時間': '約3分', '定員': '5〜6名/カップ', 'カップ数': '14台' },
      tips: [
        '回しすぎるとかなり目がまわります。ほどほどが正解',
        '花柄はカップごとに違うので、お気に入りを探してみて',
        '待ち時間は比較的短め。ちょっとした空き時間におすすめ'
      ]
    },
    {
      id: 'petting-village',
      name: 'ふれあい動物村',
      en: 'PETTING VILLAGE',
      cats: ['kids'],
      catLabels: ['キッズ'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Liberty_Farms_Petting_Zoo_5.jpg/1920px-Liberty_Farms_Petting_Zoo_5.jpg',
      copy: 'うさぎ・やぎ・ひつじたちと直接ふれあえる、小さな動物村',
      desc: 'うさぎ、やぎ、ひつじなど、人なつっこい小動物たちと直接ふれあえるエリア。エサやり体験(有料/1カップ300円)も大人気で、動物たちに囲まれる時間は子どもも大人も夢中になります。抱っこ体験ができるうさぎ広場は特に女の子に人気。手洗い場が各所に完備されているので衛生面も安心です。',
      specs: { '年齢制限': 'なし(保護者同伴推奨)', '営業時間': '10:00〜16:30', 'エサやり体験': '1カップ300円', '手洗い場': '完備' },
      tips: [
        '朝いちばんは動物たちも元気いっぱいでおすすめ',
        'やぎは紙も食べようとするのでチケットやマップは要注意',
        'うさぎ抱っこ体験は整理券制。午前中の受付が確実'
      ]
    },
    {
      id: 'hedge-maze',
      name: 'はなの立体めいろ',
      en: 'FLOWER HEDGE MAZE',
      cats: ['kids', 'garden'],
      catLabels: ['キッズ', '花・癒し系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Dublin%2C_Hedge_maze_in_Iveagh_Gardens_%28101%29.jpg/1920px-Dublin%2C_Hedge_maze_in_Iveagh_Gardens_%28101%29.jpg',
      copy: '高さ2mの生け垣でできた本格めいろ。ゴールで見える景色がごほうび',
      desc: '高さ2mの生け垣で作られた、ちょっと本格的な立体めいろ。園内マップとは別に配布される「めいろヒントカード」を頼りに進む家族向けアトラクションです。中央の展望台にたどりつくと、花回廊が一望できるごほうびが待っています。最短ルートはだいたい15分ですが、迷いながら回ると30分以上楽しめることも。',
      specs: { '年齢制限': 'なし', '所要時間': '約15〜30分', '広さ': '2,000㎡', 'ヒントカード': '入口で無料配布' },
      tips: [
        '迷ったら右手を壁につけて進む「右手法」が定番の攻略テク',
        '中央展望台からは記念撮影も忘れずに',
        '雨上がりは足元がすべりやすいので歩きやすい靴で'
      ]
    },
    {
      id: 'flower-promenade',
      name: '花回廊フラワープロムナード',
      en: 'FLOWER PROMENADE',
      cats: ['garden'],
      catLabels: ['花・癒し系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tulip_fields_of_Holland.jpg/1920px-Tulip_fields_of_Holland.jpg',
      copy: 'パーク自慢の大花壇。季節ごとに表情を変える800mの花の回廊',
      desc: 'フローリア・ガーデンズのシンボルともいえる、全長800mの大花壇。春はチューリップとポピー、初夏はバラとアジサイ、秋はコスモス、冬はパンジーと、季節ごとに植え替えられる約120万株の花々が一面に広がります。中央のフォトスポットからは花の絨毯を一望でき、パークいちばんの撮影スポットとして知られています。',
      specs: { '全長': '800m', '植栽面積': '約18,000㎡', '花の株数': '季節ごとに約120万株', '見頃': '通年(季節替わり)' },
      tips: [
        '午前中の斜光がいちばん花がきれいに映えます',
        '週替わりで花摘み体験を開催していることも(公式SNSで告知)',
        '花粉が気になる方は入口の案内板で開花状況をチェック'
      ]
    },
    {
      id: 'butterfly-house',
      name: 'バタフライ温室ドーム',
      en: 'BUTTERFLY GREENHOUSE DOME',
      cats: ['garden'],
      catLabels: ['花・癒し系'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Brookside_Gardens_Conservatory_01.jpg/1920px-Brookside_Gardens_Conservatory_01.jpg',
      copy: '南国の花と数百匹の蝶が舞う、あたたかいガラスの温室',
      desc: '年間を通してあたたかく保たれたガラスドームの中に、南国の花々と数百匹の蝶が放し飼いにされている癒やしの施設。運がよければ蝶が手や肩にとまってくれることも。雨の日でも快適に過ごせるので、天候に左右されないおでかけスポットとしても重宝されています。',
      specs: { '室温': '通年25℃前後', '飼育種': '蝶 約8種・数百匹', '所要時間': '目安15分', 'ベビーカー': '入場可' },
      tips: [
        '明るい色の服だと蝶がとまりやすいそうです',
        '出口の羽化ケースでは蝶がかえる瞬間が見られることも',
        '室内は多湿なのでメガネが曇りやすい点にご注意を'
      ]
    },
    {
      id: 'splash-garden',
      name: 'じゃぶじゃぶスプラッシュガーデン',
      en: 'SPLASH GARDEN',
      cats: ['water', 'kids'],
      catLabels: ['水遊び系', 'キッズ'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Splash_Pad_at_Pioneer_Park_%2843450100404%29.jpg/1920px-Splash_Pad_at_Pioneer_Park_%2843450100404%29.jpg',
      copy: '水着不要で遊べる、噴水がたくさんの無料水遊び広場',
      desc: '地面から噴きあがる噴水やアーチ状の水のトンネルで自由に遊べる、無料の水遊び広場。水深がないので小さなお子さまでも安心。更衣室とロッカーも近くに完備されているので、着替えを持って気軽に立ち寄れます。夏休み期間は特に大人気のエリアです。',
      specs: { '年齢制限': 'なし(乳幼児は付添必要)', '利用料金': '無料(入園料のみ)', '更衣室': '隣接', '営業期間': '4月下旬〜10月上旬' },
      tips: [
        '着替え・タオルは必須。ロッカー(有料)も用意されています',
        '噴水の間隔は不規則。予測できないのが逆に楽しい',
        '日焼け対策は忘れずに。屋根つきの休憩ベンチもあります'
      ]
    },
    {
      id: 'game-plaza',
      name: 'わくわくゲームプラザ',
      en: 'GAME PLAZA',
      cats: ['kids', 'family'],
      catLabels: ['キッズ', 'ファミリー'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/DFC_2901_Children_concentrating_at_a_crowded_carnival_shooting_game_booth_aiming_toy_rifles_at_targets_while_families_watch_nearby.jpg/1920px-DFC_2901_Children_concentrating_at_a_crowded_carnival_shooting_game_booth_aiming_toy_rifles_at_targets_while_families_watch_nearby.jpg',
      copy: '射的・輪投げ・すくい取り。景品ゲットを目指す縁日ゲーム広場',
      desc: '射的、輪投げ、スーパーボールすくいなど、縁日の定番ゲームが並ぶプラザ。1回300円〜プレイでき、成功すると限定ぬいぐるみやお菓子などの景品がもらえます。ゲーム好きの子どもも、童心にかえりたい大人も楽しめる、いつも笑い声が絶えないエリアです。',
      specs: { '料金': '1回300円〜', '種類': '射的・輪投げ・すくい取りほか全6種', '景品': 'ぬいぐるみ・お菓子など' },
      tips: [
        '射的は3回チャレンジのセット券がお得',
        '雨の日は屋根つきなので安心して遊べます',
        '景品の交換は当日中のみ有効です'
      ]
    },
    {
      id: 'night-illumination',
      name: '光の花園ナイトイルミネーション',
      en: 'ILLUMINATED FLOWER NIGHT WALK',
      cats: ['night'],
      catLabels: ['ナイト限定'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Park_bridge_in_night_1.JPG/1920px-Park_bridge_in_night_1.JPG',
      copy: '日没後、花回廊が30万球のLEDでまばゆい光の庭にかわる',
      desc: '日没とともに、花回廊とパーク全体が約30万球のLEDで彩られる、夜だけの特別な景色。橋や噴水もライトアップされ、昼間の花畑とはまったく違う幻想的な雰囲気に包まれます。カップルのデートスポットとしても、家族の思い出づくりとしても人気の時間帯です。',
      specs: { '点灯時間': '日没〜閉園', 'LED数': '約30万球', '開催期間': '通年(演出は季節替わり)' },
      tips: [
        '日没直後の「マジックアワー」は空の色とライトが重なって特に美しい',
        '三脚を使った撮影は指定エリアのみ利用可能',
        '冬季は防寒対策をお忘れなく'
      ]
    },
    {
      id: 'floria-yu',
      name: 'フローリアの湯',
      en: 'FLORIA HOT SPRING',
      cats: ['relax'],
      catLabels: ['温浴施設(別料金)'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Outdoor_hot_spring_bath_in_Nigorigo_Onsen.jpg/1920px-Outdoor_hot_spring_bath_in_Nigorigo_Onsen.jpg',
      copy: 'アトラクションで遊んだあとは、花を見ながらの露天風呂でひとやすみ',
      desc: 'パーク内に併設された天然温泉施設。花回廊を望む露天風呂や、家族で楽しめる大浴場、岩盤浴などがそろいます。フリーパスとは別料金の施設ですが、1日中歩き回った疲れをいやすのにぴったり。「遊んで、浸かって、また遊ぶ」がフローリア・ガーデンズ流の楽しみ方です。',
      specs: { '営業時間': '10:00〜22:00(最終受付21:00)', '料金': '大人1,200円/子供700円', 'タオルセット': '貸出300円', '定休日': '無休' },
      tips: [
        '入園券と湯めぐりのセット券を買うとお得',
        '露天風呂から花回廊のライトアップが見える夜がおすすめ',
        '館内着に着替えてパーク内を回れる「ゆったりコース」も人気'
      ]
    }
  ],

  characters: [
    {
      id: 'fuwan',
      name: 'ふわん',
      en: 'FUWAN',
      role: 'はなうさぎ・パークの看板マスコット',
      color: 'pink',
      catch: '花のかんむりがトレードマーク。うれしいと耳がぴょこんと立つ',
      desc: 'フローリア・ガーデンズがオープンした日、花回廊のいちばん大きなチューリップの中から生まれたと言われている、はなうさぎの女の子。花のことなら何でも知っていて、季節ごとに違うかんむりをかぶり分けるおしゃれさんです。とにかく人なつっこく、パークに来たゲストひとりひとりに「ようこそ！」と声をかけてまわるのが日課。',
      profile: {
        '誕生日': '4月第1日曜日(パーク開園記念日)',
        '出身': '花回廊の大きなチューリップの中',
        'すきなもの': 'はちみつクッキー、花がら摘み、おしゃべり',
        'にがてなもの': '強い風(かんむりが飛ばされる)',
        '性格': '社交的でお世話好き、ちょっぴり天然',
        'ひみつ': 'うれしいことがあると耳の先がほんのりピンク色になる'
      },
      meet: 'エントランス広場で毎日10:30と15:00からグリーティング。花回廊のフォトスポットにもよく出没するよ。',
      friendTip: '「今日のかんむりかわいいね！」と声をかけると、その場でくるっと回ってポーズを決めてくれる。',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><path d="M40 8 C 30 8 26 34 32 52 C 36 62 46 62 46 50 C 46 32 50 8 40 8Z" fill="#FFE1EA" stroke="#3a2c28" stroke-width="3"/><path d="M80 8 C 90 8 94 34 88 52 C 84 62 74 62 74 50 C 74 32 70 8 80 8Z" fill="#FFE1EA" stroke="#3a2c28" stroke-width="3"/><path d="M40 8 C 34 8 31 30 35 45 C 38 52 44 52 44 44 C 44 30 46 8 40 8Z" fill="#FFAFC6"/><path d="M80 8 C 86 8 89 30 85 45 C 82 52 76 52 76 44 C 76 30 74 8 80 8Z" fill="#FFAFC6"/><circle cx="60" cy="75" r="42" fill="#FFF3F6" stroke="#3a2c28" stroke-width="3.5"/><circle cx="46" cy="72" r="5" fill="#3a2c28"/><circle cx="74" cy="72" r="5" fill="#3a2c28"/><circle cx="48" cy="70" r="1.6" fill="#fff"/><circle cx="76" cy="70" r="1.6" fill="#fff"/><ellipse cx="38" cy="82" rx="5.5" ry="3.6" fill="#FF8FAE" opacity=".85"/><ellipse cx="82" cy="82" rx="5.5" ry="3.6" fill="#FF8FAE" opacity=".85"/><ellipse cx="60" cy="80" rx="4" ry="3" fill="#3a2c28"/><path d="M52 88 Q60 94 68 88" stroke="#3a2c28" stroke-width="3" fill="none" stroke-linecap="round"/><g stroke="#3a2c28" stroke-width="2.4"><circle cx="60" cy="34" r="6" fill="#FF8FAE"/><circle cx="46" cy="40" r="5" fill="#FFC94D"/><circle cx="74" cy="40" r="5" fill="#FFC94D"/><circle cx="53" cy="30" r="4.4" fill="#4FD3AE"/><circle cx="67" cy="30" r="4.4" fill="#4FD3AE"/></g></svg>'
    },
    {
      id: 'pyonta',
      name: 'ぴょんた',
      en: 'PYONTA',
      role: 'そらまめうさぎ・冒険リーダー',
      color: 'sky',
      catch: 'アトラクションなら何でも一番乗り！好奇心いっぱいの冒険うさぎ',
      desc: 'ふわんの幼なじみで、パーク中のアトラクションを誰よりも早く制覇することが自慢の男の子うさぎ。いつもゴーグルを頭にかけていて、絶叫コースターに乗るときだけキリッと目にかける。実はちょっぴりこわがりだけど、ふわんの前では強がってしまうところが憎めないキャラクターです。',
      profile: {
        '誕生日': '10月10日',
        '出身': '花回廊のとなりの菜園',
        'すきなもの': '絶叫コースター、そらまめスナック、探検ごっこ',
        'にがてなもの': 'おばけ屋敷系(実はかなりこわがり)',
        '性格': '元気いっぱい、ちょっと負けず嫌い',
        'ひみつ': 'ドロップ・ブロッサムに乗る前、こっそり深呼吸している'
      },
      meet: 'スカイストリーク乗り場の近くで毎日13:00からグリーティング。絶叫アトラクションのまわりをうろうろしていることが多いよ。',
      friendTip: '「一緒に競争しよう！」と声をかけると全力で応じてくれる。ハイタッチのお返しは必ずダブルタッチ。',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><path d="M38 10 C 26 12 24 40 32 56 C 36 64 46 62 45 50 C 44 34 48 10 38 10Z" fill="#EAF8FD" stroke="#3a2c28" stroke-width="3"/><path d="M82 10 C 94 12 96 40 88 56 Q 76 66 76 50 C 76 34 72 10 82 10Z" fill="#EAF8FD" stroke="#3a2c28" stroke-width="3"/><path d="M38 12 C 31 14 30 36 36 48 C 39 54 43 52 42 44 C 41 32 44 12 38 12Z" fill="#A7DDF5"/><circle cx="60" cy="76" r="42" fill="#FFFFFF" stroke="#3a2c28" stroke-width="3.5"/><circle cx="46" cy="73" r="5" fill="#3a2c28"/><circle cx="74" cy="73" r="5" fill="#3a2c28"/><circle cx="48" cy="71" r="1.6" fill="#fff"/><circle cx="76" cy="71" r="1.6" fill="#fff"/><ellipse cx="38" cy="83" rx="5.5" ry="3.6" fill="#5FC3EA" opacity=".7"/><ellipse cx="82" cy="83" rx="5.5" ry="3.6" fill="#5FC3EA" opacity=".7"/><path d="M50 90 Q60 97 70 90" stroke="#3a2c28" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="30" y="30" width="60" height="16" rx="8" fill="#3a2c28" opacity=".85"/><circle cx="42" cy="38" r="11" fill="#FFC94D" stroke="#3a2c28" stroke-width="2.6"/><circle cx="78" cy="38" r="11" fill="#FFC94D" stroke="#3a2c28" stroke-width="2.6"/><rect x="53" y="34" width="14" height="8" rx="4" fill="#3a2c28"/></svg>'
    },
    {
      id: 'kurumi',
      name: 'くるみ',
      en: 'KURUMI',
      role: 'はりねずみのフローリスト・花回廊の案内人',
      color: 'sun',
      catch: '花回廊を毎日お手入れする、ちょっぴり照れ屋な花の妖精',
      desc: '花回廊の花壇の下で暮らしていたはりねずみ。花のお世話がじょうずすぎて、いつのまにか公式フローリストとして働くことになりました。背中のトゲには季節の小さな花をかざるのがこだわり。人前に出るのは少し苦手だけど、花の話になると止まらないおしゃべりさんに変身します。',
      profile: {
        '誕生日': '5月15日',
        '出身': '花回廊の花壇の地下',
        'すきなもの': '花の手入れ、押し花づくり、どんぐり茶',
        'にがてなもの': '人前でのスピーチ(すぐ顔が赤くなる)',
        '性格': '控えめで働き者、花のことになると饒舌',
        'ひみつ': '背中のトゲの本数だけ、覚えている花の名前がある(らしい)'
      },
      meet: '花回廊フラワープロムナードで水やり中の姿をよく見かけるよ。土日の11:00からミニガーデンツアーも開催。',
      friendTip: '花について質問すると目をキラキラさせて教えてくれる。おすすめは「今日いちばん元気な花はどれ？」',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><path d="M18 66 C14 40 34 18 60 18 C86 18 106 40 102 66 L96 64 L92 70 L86 62 L80 70 L74 61 L68 70 L62 60 L56 70 L50 61 L44 70 L38 62 L32 70 L26 64 Z" fill="#C8A27A" stroke="#3a2c28" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="80" rx="40" ry="34" fill="#F6E7D7" stroke="#3a2c28" stroke-width="3.5"/><ellipse cx="60" cy="96" rx="14" ry="10" fill="#3a2c28"/><circle cx="46" cy="76" r="4.6" fill="#3a2c28"/><circle cx="74" cy="76" r="4.6" fill="#3a2c28"/><circle cx="47.5" cy="74.5" r="1.4" fill="#fff"/><circle cx="75.5" cy="74.5" r="1.4" fill="#fff"/><ellipse cx="38" cy="86" rx="5" ry="3.4" fill="#FFC94D" opacity=".8"/><ellipse cx="82" cy="86" rx="5" ry="3.4" fill="#FFC94D" opacity=".8"/><g stroke="#3a2c28" stroke-width="2.2"><circle cx="34" cy="34" r="5.5" fill="#FF8FAE"/><circle cx="60" cy="24" r="5.5" fill="#4FD3AE"/><circle cx="86" cy="34" r="5.5" fill="#B79CF0"/></g></svg>'
    },
    {
      id: 'potteri',
      name: 'ぽってり',
      en: 'POTTERI',
      role: 'たぬきの料理長・パークいちの食いしんぼう',
      color: 'lav',
      catch: '丸いおなかとコック帽がトレードマーク。味見という名の味見が多め',
      desc: 'パーク内の食べ歩きグルメを一手にプロデュースする、たぬきの料理長。花びらを練り込んだオリジナルスイーツを開発するのが得意で、季節ごとに新メニューを考案しています。丸いおなかは「味見のしすぎ」が原因だとうわさされていますが、本人はいたって気にしていません。',
      profile: {
        '誕生日': '9月9日',
        '出身': 'パーク裏手の雑木林',
        'すきなもの': '新作スイーツの試作、お昼寝、たき火',
        'にがてなもの': '早起き(仕込みの時間だけは早起きできる)',
        '性格': 'おおらかでマイペース、面倒見がいい',
        'ひみつ': 'しっぽの模様が実は毎年少しずつ変わっている'
      },
      meet: 'モグモグキッチン前で毎日12:00ごろ試食タイムを開催。厨房の窓からひょっこり顔を出すことも。',
      friendTip: '「今日のおすすめは？」と聞くと、うれしそうに新作メニューを教えてくれる。',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><ellipse cx="60" cy="82" rx="46" ry="40" fill="#E3C7AC" stroke="#3a2c28" stroke-width="3.5"/><path d="M60 30 C40 30 30 46 34 62 C38 74 82 74 86 62 C90 46 80 30 60 30Z" fill="#F6E7D7" stroke="#3a2c28" stroke-width="3"/><ellipse cx="46" cy="60" rx="10" ry="12" fill="#3a2c28"/><ellipse cx="74" cy="60" rx="10" ry="12" fill="#3a2c28"/><circle cx="46" cy="62" r="3.4" fill="#fff"/><circle cx="74" cy="62" r="3.4" fill="#fff"/><ellipse cx="60" cy="72" rx="6" ry="4.4" fill="#3a2c28"/><path d="M50 80 Q60 86 70 80" stroke="#3a2c28" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M20 100 Q10 80 24 66" stroke="#3a2c28" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M20 100 Q10 80 24 66" stroke="#C8A27A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M28 18 Q60 -4 92 18 Q96 30 84 30 L36 30 Q24 30 28 18Z" fill="#fff" stroke="#3a2c28" stroke-width="3"/><rect x="40" y="96" width="40" height="10" rx="5" fill="#FF8FAE"/></svg>'
    },
    {
      id: 'sora-sensei',
      name: 'ソラ先生',
      en: 'SORA-SENSEI',
      role: 'ふくろうの案内係・パーク一の物知り博士',
      color: 'lav',
      catch: '大きなまん丸メガネがトレードマーク。パークの豆知識をなんでも教えてくれる',
      desc: 'パークができるずっと前から丘に住んでいたという、もの知りなふくろう博士。花の名前からアトラクションの仕組みまで、聞けば何でも答えてくれる「歩く花図鑑」。園内アナウンスの声も、実はソラ先生が担当していると言われています。',
      profile: {
        '誕生日': '不明(本人いわく「若葉の季節」)',
        '出身': 'パーク裏の大きな樫の木',
        'すきなもの': '読書、星空観察、木の実のクッキー',
        'にがてなもの': '大きな音(耳がとても良いので)',
        '性格': '物静かで博学、たまにダジャレを言う',
        'ひみつ': '実は口ぐせの「フム。」の意味を誰も知らない'
      },
      meet: '花回廊の展望デッキで夕方によく見かけるよ。土日は「ソラ先生のミニ講座」を開催(所要10分)。',
      friendTip: '花や星について質問すると、目を輝かせて長めの解説をしてくれる。時間に余裕があるときに聞くのがおすすめ。',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><ellipse cx="60" cy="78" rx="40" ry="44" fill="#D6C3F7" stroke="#3a2c28" stroke-width="3.5"/><path d="M30 40 Q18 20 34 12 Q34 30 40 38Z" fill="#B79CF0" stroke="#3a2c28" stroke-width="2.6"/><path d="M90 40 Q102 20 86 12 Q86 30 80 38Z" fill="#B79CF0" stroke="#3a2c28" stroke-width="2.6"/><circle cx="44" cy="66" r="17" fill="#fff" stroke="#3a2c28" stroke-width="3"/><circle cx="76" cy="66" r="17" fill="#fff" stroke="#3a2c28" stroke-width="3"/><circle cx="44" cy="66" r="7" fill="#3a2c28"/><circle cx="76" cy="66" r="7" fill="#3a2c28"/><path d="M61 66 Q66 62 71 66" stroke="#3a2c28" stroke-width="3" fill="none"/><path d="M27 66 Q22 62 17 66" stroke="#3a2c28" stroke-width="3" fill="none"/><path d="M52 84 L60 94 L68 84Z" fill="#FFC94D" stroke="#3a2c28" stroke-width="2.4" stroke-linejoin="round"/><path d="M46 102 Q60 108 74 102" stroke="#3a2c28" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'gorota',
      name: 'ごろた',
      en: 'GOROTA',
      role: 'くまの安全パトロール隊長・パークいちの力もち',
      color: 'brown',
      catch: '大きな体でみんなを見守る、やさしいパトロール隊長',
      desc: 'パーク中をパトロールして、みんなが安全に楽しめるよう見守っている、体の大きなくま。見た目はいかついけれど、実はとても涙もろく、迷子の子を見つけて保護者と再会できた瞬間にはいつも号泣しています。腕相撲はパーク内で無敗、ハグの上手さもパークいちと評判です。',
      profile: {
        '誕生日': '11月11日',
        '出身': 'パーク北側の丘の森',
        'すきなもの': 'ハグ、はちみつパン、パトロール中のラジオ体操',
        'にがてなもの': '迷子の子を見ると号泣してしまう',
        '性格': '力持ちで頼れる、実は涙もろい',
        'ひみつ': '休憩中はいつもベンチでうたた寝している'
      },
      meet: 'パーク内を常時パトロール中。迷子になったら黄色い帽子のごろたを探してみて。写真撮影にも気軽に応じてくれるよ。',
      friendTip: 'ハグをお願いするとやさしく受け止めてくれる。ただし力がとても強いので覚悟してね。',
      svg: '<svg viewBox="0 0 120 130" aria-hidden="true"><circle cx="30" cy="34" r="15" fill="#C8A27A" stroke="#3a2c28" stroke-width="3"/><circle cx="90" cy="34" r="15" fill="#C8A27A" stroke="#3a2c28" stroke-width="3"/><circle cx="30" cy="34" r="7" fill="#8a6448"/><circle cx="90" cy="34" r="7" fill="#8a6448"/><circle cx="60" cy="76" r="46" fill="#C8A27A" stroke="#3a2c28" stroke-width="3.5"/><ellipse cx="60" cy="86" rx="24" ry="20" fill="#F6E7D7" stroke="#3a2c28" stroke-width="3"/><circle cx="46" cy="70" r="5" fill="#3a2c28"/><circle cx="74" cy="70" r="5" fill="#3a2c28"/><circle cx="47.5" cy="68.5" r="1.5" fill="#fff"/><circle cx="75.5" cy="68.5" r="1.5" fill="#fff"/><ellipse cx="60" cy="88" rx="6" ry="4.6" fill="#3a2c28"/><path d="M50 96 Q60 102 70 96" stroke="#3a2c28" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="24" y="106" width="72" height="14" rx="7" fill="#FFC94D" stroke="#3a2c28" stroke-width="2.4"/><circle cx="60" cy="113" r="4" fill="#3a2c28"/></svg>'
    }
  ],

  goods: [
    { id: 'g1', name: 'ふわんうさぎのぬいぐるみ(M)', cat: 'plush', price: 2400, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bunnies_in_a_Basket_%28Where_toys_go_to_die%29.jpg/1920px-Bunnies_in_a_Basket_%28Where_toys_go_to_die%29.jpg', shop: 'フローリア・マーケット', tag: '一番人気' },
    { id: 'g2', name: 'ごろたくまのぬいぐるみ(L)', cat: 'plush', price: 2800, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Red_toy_bear.JPG/1920px-Red_toy_bear.JPG', shop: 'フローリア・マーケット', tag: '' },
    { id: 'g3', name: 'ふわん&ぴょんた なかよしペアぬいぐるみ', cat: 'plush', price: 4600, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bunnies_in_a_Basket_%28Where_toys_go_to_die%29.jpg/1920px-Bunnies_in_a_Basket_%28Where_toys_go_to_die%29.jpg', shop: 'フローリア・マーケット', tag: 'ギフトに' },
    { id: 'g4', name: 'フローリア キャンバストートバッグ', cat: 'apparel', price: 1800, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Canvas_two-tone_tote_Navy_and_Natural7_%289038437258%29.jpg/1920px-Canvas_two-tone_tote_Navy_and_Natural7_%289038437258%29.jpg', shop: 'フローリア・マーケット', tag: '' },
    { id: 'g5', name: 'フローリア パークTシャツ(大人/キッズ)', cat: 'apparel', price: 2900, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/DFC_4462_Evening_market_stalls_glow_as_shoppers_browse_rows_of_colorful_Tshirts_and_accessories_under_canopy_lights.jpg/1920px-DFC_4462_Evening_market_stalls_glow_as_shoppers_browse_rows_of_colorful_Tshirts_and_accessories_under_canopy_lights.jpg', shop: 'フローリア・マーケット', tag: '全5色' },
    { id: 'g6', name: 'フローリア キャンディボックス(お土産用)', cat: 'sweets', price: 1000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Sweets_%286055655662%29.jpg/1920px-Sweets_%286055655662%29.jpg', shop: 'フローリア・マーケット', tag: '日持ち3ヶ月' },
    { id: 'g7', name: 'マシュマロ&キャンディスティック', cat: 'sweets', price: 500, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/DFC_5229-_Colorful_skewers_of_marshmallows%2C_candies%2C_and_gummies_ready_to_brighten_any_sweet_tooth.jpg/1920px-DFC_5229-_Colorful_skewers_of_marshmallows%2C_candies%2C_and_gummies_ready_to_brighten_any_sweet_tooth.jpg', shop: 'キャンディワゴン', tag: '食べ歩き' },
    { id: 'g8', name: 'くるみのおしごとエプロン(キッズ用)', cat: 'apparel', price: 2200, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Dublin%2C_Hedge_maze_in_Iveagh_Gardens_%28101%29.jpg/1920px-Dublin%2C_Hedge_maze_in_Iveagh_Gardens_%28101%29.jpg', shop: 'フローリア・マーケット', tag: '' }
  ],

  foods: [
    { id: 'f1', name: 'ふわふわソフトクリーム', cat: 'sweets', price: 450, img: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Soft_Serve_Ice_Cream_in_cone_%2828966999042%29.jpg', shop: 'モグモグキッチン' },
    { id: 'f2', name: 'お花のチュロス', cat: 'sweets', price: 480, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Small_Churros%2C_San_Churro_Carousel%2C_2026_%2801%29.jpg/1920px-Small_Churros%2C_San_Churro_Carousel%2C_2026_%2801%29.jpg', shop: 'モグモグキッチン' },
    { id: 'f3', name: 'フローリアだこ焼き(8個)', cat: 'meal', price: 600, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Takoyaki_in_Ueno_Park%2C_Tokyo%2C_Japan_-_September_2015.jpg/1920px-Takoyaki_in_Ueno_Park%2C_Tokyo%2C_Japan_-_September_2015.jpg', shop: '屋台エリア' },
    { id: 'f4', name: '光るわたあめ', cat: 'sweets', price: 550, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Glowing_Cotton_Candy.jpg/1920px-Glowing_Cotton_Candy.jpg', shop: 'ナイトワゴン' },
    { id: 'f5', name: 'パークバーガーセット', cat: 'meal', price: 980, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Burger_and_fries_on_a_wooden_plate.jpg/1920px-Burger_and_fries_on_a_wooden_plate.jpg', shop: 'モグモグキッチン' },
    { id: 'f6', name: 'フローリアキャンディボックス(店内用)', cat: 'sweets', price: 900, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Sweets_%286055655662%29.jpg/1920px-Sweets_%286055655662%29.jpg', shop: 'キャンディワゴン' }
  ]
};
