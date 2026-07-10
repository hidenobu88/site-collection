/* ============================================================
   STELLA PRODUCTION - サイト共通データ
   タレント・ニュース・SNSの内容はすべてこのファイルで管理します。
   ここを書き換えるだけで全ページに反映されます。
   ============================================================ */

/* ------------------------------------------------------------
   ★ トップページのピックアップスライダー（8名）
   下の TALENTS の id を並べるだけでメンバーを入れ替えられます。
   ------------------------------------------------------------ */
const PICKUP_TALENTS = ['m01', 'm02', 'm03', 'm04', 'f01', 'f02', 'f03', 'f04'];

/* ------------------------------------------------------------
   所属タレント（男性 m01〜m20 / 女性 f01〜f20）
   info は「職種 / 生年月日」の形式で書いてください。
   hometown / hobby / skill は省略可（省略時はサンプル表示）。
   ------------------------------------------------------------ */
const TALENTS = [
  // ---- 男性 ----
  { id: 'm01', gender: 'male', name: '蒼井 隼人', kana: 'AOI HAYATO', info: '俳優 / 1995.04.12' },
  { id: 'm02', gender: 'male', name: '一之瀬 蓮', kana: 'ICHINOSE REN', info: '俳優 / 1998.07.23' },
  { id: 'm03', gender: 'male', name: '宇田川 樹', kana: 'UDAGAWA ITSUKI', info: 'モデル / 2000.01.15' },
  { id: 'm04', gender: 'male', name: '榎本 大和', kana: 'EMOTO YAMATO', info: '俳優 / 1993.11.02' },
  { id: 'm05', gender: 'male', name: '緒方 湊', kana: 'OGATA MINATO', info: 'タレント / 1997.05.30' },
  { id: 'm06', gender: 'male', name: '香坂 亮介', kana: 'KOSAKA RYOSUKE', info: '俳優 / 1990.09.18' },
  { id: 'm07', gender: 'male', name: '桐生 翔太', kana: 'KIRYU SHOTA', info: 'アーティスト / 1999.02.08' },
  { id: 'm08', gender: 'male', name: '九条 遥斗', kana: 'KUJO HARUTO', info: '俳優 / 2001.06.21' },
  { id: 'm09', gender: 'male', name: '剣持 悠', kana: 'KENMOCHI YU', info: 'モデル / 1996.12.05' },
  { id: 'm10', gender: 'male', name: '西園寺 光', kana: 'SAIONJI HIKARU', info: '俳優 / 1994.03.27' },
  { id: 'm11', gender: 'male', name: '柴崎 拓海', kana: 'SHIBASAKI TAKUMI', info: 'タレント / 1998.10.11' },
  { id: 'm12', gender: 'male', name: '朱雀 玲央', kana: 'SUZAKU REO', info: '俳優 / 2002.08.09' },
  { id: 'm13', gender: 'male', name: '瀬名 陸', kana: 'SENA RIKU', info: 'アーティスト / 1997.01.19' },
  { id: 'm14', gender: 'male', name: '高嶺 颯', kana: 'TAKANE SO', info: '俳優 / 1995.07.07' },
  { id: 'm15', gender: 'male', name: '月島 圭吾', kana: 'TSUKISHIMA KEIGO', info: 'モデル / 1999.04.25' },
  { id: 'm16', gender: 'male', name: '天堂 誠', kana: 'TENDO MAKOTO', info: '俳優 / 1988.05.14' },
  { id: 'm17', gender: 'male', name: '如月 奏多', kana: 'KISARAGI KANATA', info: 'タレント / 2000.11.30' },
  { id: 'm18', gender: 'male', name: '氷室 隆', kana: 'HIMURO TAKASHI', info: '俳優 / 1992.02.17' },
  { id: 'm19', gender: 'male', name: '藤堂 慶', kana: 'TODO KEI', info: '俳優 / 1996.08.03' },
  { id: 'm20', gender: 'male', name: '真行寺 悟', kana: 'SHINGYOJI SATORU', info: 'アーティスト / 1994.12.24' },
  // ---- 女性 ----
  { id: 'f01', gender: 'female', name: '相沢 美月', kana: 'AIZAWA MITSUKI', info: '女優 / 1997.03.14' },
  { id: 'f02', gender: 'female', name: '五十嵐 凛', kana: 'IGARASHI RIN', info: 'モデル / 1999.06.28' },
  { id: 'f03', gender: 'female', name: '雨宮 心愛', kana: 'AMAMIYA KOKOA', info: 'タレント / 2001.09.05' },
  { id: 'f04', gender: 'female', name: '恵比寿 花音', kana: 'EBISU KANON', info: '女優 / 1995.12.19' },
  { id: 'f05', gender: 'female', name: '小野寺 結衣', kana: 'ONODERA YUI', info: '女優 / 1998.02.11' },
  { id: 'f06', gender: 'female', name: '神楽坂 澪', kana: 'KAGURAZAKA MIO', info: 'アーティスト / 2000.05.22' },
  { id: 'f07', gender: 'female', name: '如月 光莉', kana: 'KISARAGI HIKARI', info: 'モデル / 1996.10.08' },
  { id: 'f08', gender: 'female', name: '胡桃沢 芽衣', kana: 'KURUMIZAWA MEI', info: '女優 / 2002.01.31' },
  { id: 'f09', gender: 'female', name: '小早川 詩織', kana: 'KOBAYAKAWA SHIORI', info: 'タレント / 1994.07.16' },
  { id: 'f10', gender: 'female', name: '沙羅 双樹', kana: 'SARA SOJU', info: '女優 / 1999.11.09' },
  { id: 'f11', gender: 'female', name: '雫石 麻央', kana: 'SHIZUKUISHI MAO', info: 'モデル / 1997.04.03' },
  { id: 'f12', gender: 'female', name: '涼風 千夏', kana: 'SUZUKAZE CHINATSU', info: '女優 / 2001.08.26' },
  { id: 'f13', gender: 'female', name: '瀬里奈 楓', kana: 'SERINA KAEDE', info: 'アーティスト / 1998.12.13' },
  { id: 'f14', gender: 'female', name: '橘 さくら', kana: 'TACHIBANA SAKURA', info: '女優 / 1993.03.29' },
  { id: 'f15', gender: 'female', name: '椿 玲奈', kana: 'TSUBAKI RENA', info: 'モデル / 2000.06.17' },
  { id: 'f16', gender: 'female', name: '手鞠 和花', kana: 'TEMARI NODOKA', info: 'タレント / 1996.09.21' },
  { id: 'f17', gender: 'female', name: '長谷部 いろは', kana: 'HASEBE IROHA', info: '女優 / 2002.04.07' },
  { id: 'f18', gender: 'female', name: '一二三 望美', kana: 'HIFUMI NOZOMI', info: '女優 / 1995.01.25' },
  { id: 'f19', gender: 'female', name: '冬木 千代', kana: 'FUYUKI CHIYO', info: 'アーティスト / 1998.05.10' },
  { id: 'f20', gender: 'female', name: '真鶴 陽菜', kana: 'MANAZURU HINA', info: 'モデル / 2001.10.02' },
];

/* ------------------------------------------------------------
   最新情報（NEWS）
   month: 掲載する月（1〜12） / talentId: 関連タレント（省略可）
   body: 詳細ページの本文（段落ごとの配列）
   ------------------------------------------------------------ */
const NEWS_ITEMS = [
  { id: 'n01', month: 8, date: '2026.08.02', cat: '舞台', talentId: 'f06',
    title: '舞台「月光のソナタ」開幕（出演：神楽坂澪・高嶺颯）',
    summary: '8月2日（土）〜17日（日）サンプル劇場にて上演。チケット好評発売中です。（サンプル）',
    body: ['神楽坂澪と高嶺颯が出演する舞台「月光のソナタ」が、8月2日（土）よりサンプル劇場にて開幕いたします。（サンプル本文）',
           '公演は8月17日（日）まで。チケットは各プレイガイドにて好評発売中です。皆さまのご来場を心よりお待ちしております。'] },
  { id: 'n02', month: 7, date: '2026.07.18', cat: '映画', talentId: 'f01',
    title: '映画「約束の海」全国ロードショー（出演：相沢美月）',
    summary: '7月18日（金）より全国の劇場にて公開。舞台挨拶付き上映も予定しています。（サンプル）',
    body: ['相沢美月が出演する映画「約束の海」が、7月18日（金）より全国の劇場にて公開されます。（サンプル本文）',
           '公開初日には都内劇場にて舞台挨拶付き上映を予定しております。詳細は劇場公式サイトをご確認ください。'] },
  { id: 'n03', month: 7, date: '2026.07.10', cat: 'バラエティ', talentId: 'm05',
    title: '緒方湊が「サンプルバラエティSHOW」にゲスト出演',
    summary: '7月10日（金）19:00〜 サンプルテレビ系にて放送。（サンプル）',
    body: ['緒方湊が7月10日（金）放送の「サンプルバラエティSHOW」にゲスト出演いたします。（サンプル本文)',
           '普段は見られない素顔が満載の内容となっております。ぜひご覧ください。'] },
  { id: 'n04', month: 7, date: '2026.07.01', cat: 'CM', talentId: 'm02',
    title: '一之瀬蓮が「クリアスパークリング」新CMに出演',
    summary: '7月1日（火）より全国でオンエア開始。特設サイトでメイキング映像も公開中。（サンプル）',
    body: ['一之瀬蓮が出演するサンプル飲料「クリアスパークリング」の新CMが、7月1日（火）より全国でオンエア開始となりました。（サンプル本文）',
           'ブランド特設サイトでは、撮影の裏側を収めたメイキング映像とインタビューも公開中です。'] },
  { id: 'n05', month: 6, date: '2026.06.20', cat: 'ドラマ', talentId: 'm01',
    title: '蒼井隼人 主演ドラマ「星降る夜のカルテ」放送スタート',
    summary: '毎週金曜22:00〜 サンプルテレビ系にて放送中。見逃し配信もあります。（サンプル）',
    body: ['蒼井隼人が主演を務める連続ドラマ「星降る夜のカルテ」が、6月20日（金）より放送スタートしました。（サンプル本文）',
           '毎週金曜22:00〜 サンプルテレビ系にて放送。各種配信サービスでの見逃し配信もございます。'] },
  { id: 'n06', month: 6, date: '2026.06.05', cat: '雑誌', talentId: 'f02',
    title: '五十嵐凛が「サンプルマガジン」7月号の表紙に登場',
    summary: '6月5日（金）発売。特集ページにてロングインタビューを掲載。（サンプル）',
    body: ['五十嵐凛が6月5日（金）発売の「サンプルマガジン」7月号の表紙を飾ります。（サンプル本文）',
           '誌面では最新ファッション特集のほか、8ページにわたるロングインタビューを掲載しています。'] },
  { id: 'n07', month: 5, date: '2026.05.24', cat: 'イベント',
    title: '「STELLA FES 2026」開催のお知らせ',
    summary: '所属タレントが多数出演するファンイベントをサンプルホールにて開催しました。（サンプル）',
    body: ['所属タレントが一堂に会するファンイベント「STELLA FES 2026」を、5月24日（日）にサンプルホールにて開催いたしました。（サンプル本文）',
           'ご来場いただいた皆さま、誠にありがとうございました。次回開催もお楽しみに。'] },
  { id: 'n08', month: 4, date: '2026.04.12', cat: '音楽', talentId: 'm07',
    title: '桐生翔太 ニューシングル「Starlight」リリース',
    summary: '各種音楽配信サービスにて配信中。MVも公開しています。（サンプル）',
    body: ['桐生翔太のニューシングル「Starlight」が4月12日（日)より各種音楽配信サービスにて配信開始となりました。（サンプル本文）',
           '公式チャンネルではミュージックビデオも公開中です。ぜひお聴きください。'] },
  { id: 'n09', month: 3, date: '2026.03.08', cat: 'ラジオ', talentId: 'f03',
    title: '雨宮心愛が「サンプルラジオ ミッドナイト」パーソナリティに就任',
    summary: '毎週日曜25:00〜 サンプル放送にてオンエア。（サンプル）',
    body: ['雨宮心愛が「サンプルラジオ ミッドナイト」の新パーソナリティに就任いたしました。（サンプル本文）',
           '毎週日曜25:00〜 サンプル放送にてオンエア。メッセージもお待ちしております。'] },
  { id: 'n10', month: 1, date: '2026.01.15', cat: 'ドラマ', talentId: 'f04',
    title: '恵比寿花音が冬ドラマ「雪解けの向こう」にレギュラー出演',
    summary: '毎週水曜21:00〜 サンプルテレビ系にて放送。（サンプル）',
    body: ['恵比寿花音が冬ドラマ「雪解けの向こう」にレギュラー出演いたします。（サンプル本文）',
           '毎週水曜21:00〜 サンプルテレビ系にて放送。ヒロインの妹役を演じます。'] },
];

/* ------------------------------------------------------------
   SNS投稿
   talentId: 投稿したタレントの id / hasImage: 画像付き投稿か
   ------------------------------------------------------------ */
const SNS_POSTS = [
  { id: 's01', talentId: 'm01', account: '@aoi_hayato_sample', service: 'X', hasImage: true,
    date: '2026.07.04 18:30',
    text: 'ドラマ「星降る夜のカルテ」第3話、今夜22時放送です！今回は物語が大きく動く回になっています。ぜひご覧ください✨（サンプル投稿）' },
  { id: 's02', talentId: 'f01', account: '@mitsuki_aizawa_sample', service: 'Instagram', hasImage: true,
    date: '2026.07.03 20:15',
    text: '映画「約束の海」の舞台挨拶に登壇させていただきました🌊 会場の皆さまの温かい拍手が忘れられません。公開まであと少し！（サンプル投稿）' },
  { id: 's03', talentId: 'm02', account: '@ren_ichinose_sample', service: 'X', hasImage: false,
    date: '2026.07.01 10:00',
    text: '「クリアスパークリング」の新CM、本日からオンエアです！撮影の裏話はまた後日…🥤（サンプル投稿）' },
  { id: 's04', talentId: 'f02', account: '@rin_igarashi_sample', service: 'Instagram', hasImage: true,
    date: '2026.06.28 12:00',
    text: 'サンプルマガジン7月号、本日発売です📖 表紙を担当させていただきました。インタビューもぜひ読んでください！（サンプル投稿）' },
  { id: 's05', talentId: 'f06', account: '@mio_kagurazaka_sample', service: 'X', hasImage: false,
    date: '2026.06.25 21:40',
    text: '舞台「月光のソナタ」の稽古が始まりました🎭 初共演の高嶺さんとのシーン、稽古場から熱量がすごいです。チケット発売中！（サンプル投稿）' },
  { id: 's06', talentId: 'm07', account: '@shota_kiryu_sample', service: 'YouTube', hasImage: true,
    date: '2026.06.22 19:00',
    text: '新曲「Starlight」のMVをプレミア公開しました🎵 たくさんのコメントありがとうございます！（サンプル投稿）' },
];
