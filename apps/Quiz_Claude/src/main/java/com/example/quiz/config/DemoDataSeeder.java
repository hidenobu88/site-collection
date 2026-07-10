package com.example.quiz.config;

import com.example.quiz.entity.Question;
import com.example.quiz.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * プレビュー用（h2 プロファイル）のサンプルデータ投入。
 *
 * <p>本番の PostgreSQL では Flyway（V3）がシードするため、この Seeder は
 * {@code h2} プロファイルのときだけ動作する。DBが空のときのみ投入する。
 * 問題データは V3__disney_questions.sql と同じ20問。
 */
@Component
@Profile("h2")
public class DemoDataSeeder implements CommandLineRunner {

    private final QuestionRepository repository;

    public DemoDataSeeder(QuestionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }
        repository.saveAll(List.of(
                new Question("ミッキーマウスのスクリーンデビュー作は、1928年公開の『蒸気船ウィリー』である。", true, "1928年11月18日公開。この日はミッキーの誕生日とされています。"),
                new Question("ミッキーマウスの飼い犬の名前はプルートである。", true, "プルートはミッキーの愛犬です。"),
                new Question("ミッキーマウスの恋人はデイジーダックである。", false, "ミッキーの恋人はミニーマウス。デイジーはドナルドの恋人です。"),
                new Question("ドナルドダックのミドルネームは「フォントルロイ」である。", true, "フルネームはドナルド・フォントルロイ・ダックです。"),
                new Question("グーフィーはネコをモデルにしたキャラクターである。", false, "グーフィーは犬がモデルのキャラクターです。"),
                new Question("東京ディズニーランドは東京都内にある。", false, "実は千葉県浦安市にあります。"),
                new Question("東京ディズニーランドが開園したのは1983年である。", true, "1983年4月15日に開園しました。"),
                new Question("東京ディズニーランドのシンボルはシンデレラ城である。", true, "ちなみに東京ディズニーシーのシンボルはプロメテウス火山です。"),
                new Question("『アナと雪の女王』の雪だるまオラフは、夏が大きらいである。", false, "オラフは夏に強いあこがれを持っています。"),
                new Question("『リトル・マーメイド』のセバスチャンはカニである。", true, "トリトン王に仕える宮廷音楽家のカニです。"),
                new Question("『アラジン』に登場するランプの魔人の名前はジーニーである。", true, "3つの願いをかなえてくれる陽気な魔人です。"),
                new Question("『美女と野獣』のヒロインの名前はオーロラである。", false, "ヒロインはベル。オーロラ姫は『眠れる森の美女』です。"),
                new Question("『ライオン・キング』の主人公シンバはトラの子どもである。", false, "シンバはライオンの子どもです。"),
                new Question("くまのプーさんの大好物ははちみつである。", true, "プーさんははちみつが大好きです。"),
                new Question("プーさんの友だちのピグレットはウサギである。", false, "ピグレットは小さな子ブタです。ウサギの友だちはラビットです。"),
                new Question("『トイ・ストーリー』のウッディはカウボーイの人形である。", true, "アンディのお気に入りのカウボーイ人形です。"),
                new Question("『モンスターズ・インク』の世界では、子どもの悲鳴より笑い声の方が大きなエネルギーを生む。", true, "映画の終盤で、笑い声の方がずっと強力だと分かります。"),
                new Question("チップとデールは2匹ともシマリスである。", true, "鼻の色(チップ=黒、デール=赤茶)で見分けられます。"),
                new Question("『ピーター・パン』に登場する妖精の名前はティンカー・ベルである。", true, "ピーター・パンの相棒の小さな妖精です。"),
                new Question("スティッチはハワイ生まれの犬である。", false, "宇宙で作られた試作品626号のエイリアンで、犬のふりをしています。")
        ));
    }
}
