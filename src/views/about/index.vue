<script lang="ts">
import Vue from "vue"
// import Loading from '@/components/loading/index.vue'
import useLoading from "@/hooks/useLoading";
import { ELanguageType } from "@/plugins/i18n";
import { createMainScrollerControl, createToTopControl } from "@/mixins";
import Icon from "@/components/icon/index.vue"
useLoading()
export default Vue.extend({
	data() {
		return {
			loading: true,
			loading1: true,
			loading2: true,
		}
	},
	components: {
		Icon
	},
	mixins: [
		createToTopControl({
			refName: "aboutContainer",
		}),
		createMainScrollerControl({
			refName: "aboutContainer"
		})
	],
	computed: {
		isJp() {
			return this.$i18n.locale === 'jp'
		},
		arrowDown: () => "arrowDown",
	}
})
</script>

<template>

	<div class="about-container" ref="aboutContainer">

		<template v-if="isJp">
			<div class="paragraph">
				<title>このホームページにて</title>

				<div class="content">
					私のホームページに来ていただいて、ありがとうございます。ちょっとすみませんですが、一応バックエンドの方も完成しましたけど、サーバーないので、静的なウェブサイトになりました。
					全てのデータはPromiseのcatchからもらったものです。勿論そのデータはデータベースと一致しております。それについてはご了承ください。今後は、多分cloudとかと契約して、
					本物のホームページにする予定です。私も色々試したいことがありまして、SSRとかnginxとか、知識は揃ってるんけど、でもやったことがないから、ちょっと興味持ってます。
					後は、このページの内容は全部自分で書いたものです。きっと文法の間違いとか、変な言い方がありますので、大目に見ていただけると幸いです。無論、指摘しても嬉しいです。気楽に読んだ方がいいと思います。

					<title>なぜこのホームページを作ったにて</title>
					このホームページ作って理由はいくつがあります。自分の試したい技術の応用とか、復習とか、ポートフォリオの変わりになりそうとかになりますが。でも、やはり一番の理由は記録したいです。生きて
					きた証みたいなやつ、ちょっと大袈裟かもしれませんけど。でも記録しないと、本当に忘れちょうから。今振り返ると、三年前のこととかははっきり覚え切れませんので。今までやってきたプロジェクト
					は、今の自分だと見くびがちです。それも成長の証かもしれないが、でもあれはあの時私の全て、あまり否定したくなくて、だから今後は当時の自分に記録をお任せつもりです。
					<br />
					やはりやりがいがあったんですね。正直最初は「ホームページって簡単なもんだろ、UIとかも使う必要ない、練習としてさっさと終わらせよう」って感じで始まり、
					でも色々な問題に遭遇し、イマイチの解決方法しかできない自分に「やはり自分を買いかぶり過ぎだ」って実感しました。それからこつこつやってきて、以前の解決できない問題に挑んで、挑戦したいことを試みて
					今の結果になりました。今の私ができる全てじゃあないが、でも胸を張って言えるくらい、「これは仕事し始めからの経験を糧にして作ったものです」ってこと。勿論、納得できていない部分もあって、やはり今の私が
					いい解決策がない問題においてはイマイチのやり方でしました。だから、勉強はやめられないって事は、再び実感しました。
				</div>
				<div class="arrow-down arrow">
					<Icon :type="arrowDown" @click="currentIndex++" />
				</div>
			</div>
			<div class="paragraph">
				<title>私と日本語</title>
				<div class="content">
					私の日本語は多分全部アニメから身に付いたものかもしれません。
					<br />
					私は小さな村に生まれ育ち、高校に入る前に世界はあの小さな町だげでした。それを不思議とか何とも思わなかったです。中学校の時は両親に泥を塗らないため、そこそこ勉強頑張ってきて町の中では高校入学試験のトップ取って、
					県立の一番の高校に入りました。が、そこから、衝撃を受けました。自分が生きてきた場所がいかなる小さいってこと、自分自身もこんなちっぽけないものってこと。トップから落ちこぼれになり下がりました。いくら頑張っても、
					成績があんまり上がれなくて、クラスの中の落ちこぼれになりました。あの時の学園生活は灰色でした。
					高校二年生の時、もっと偏差値の低いクラスに編入されて、私はもうダメかと思ってました。でも、思わぬ出会いがありました。私の同席の人が結構アニメ好きで、
					ある日、彼の自慢したアニメの葉書を見せてくれました。あの時の私が真人間過ぎるかもしれない故に、こういう対話が成り立ちました。
					<br />
					<br />
					「これがキリト、これがアスナ、あれが娘のユイちゃんです」
					<br />
					「ええ！どう見ても高校生ですよね。つまり１６歳ぐらいの年頃で、子供は、６歳はあるよね。日本でそんなにやぱい国だったの、少子化とかじゃないの」
					<br />
					<br />
					勿論、相手は呆れました。それははっきり覚えてます。返れるのは「見ればわかる」だけ。でもそういう事のおかけで、興味を抱きました。
					ある休暇前の放課後、こっそりネットカーフに行って、アニメ二つをダウンロードして後、実家に帰りました。
					当然のこと、一つは以上の言ってた『ソードアート・オンライン』略して『SAO』って言うやつ。もう一つは当時男子グループの間で流行ってた『冴えないヒロンの育て方』でした。
					実家には何にもないから(ネットもテレビもスマホもないが、丁度メモリカードを読むデバイスがあった)、全部の時間はこの二つのアニメを見るにして、少なくとも三回は見ました。感想は「面白かった。憧れだった。他の生き方とかがあるなんて思わなかった」でした。
					他にも「主人公達の声似てなくない」っていうのもあるんですが、それは別の話。
					<br />
					好きなものができたからかな、学園生活が色付いたというのはちょっと大袈裟かもしれないが、でも先に進む勇気ぐらいはもらえました。それから勉強怠らず、
					アニメも沢山見て、そこそこの大学に入って、いつの間にか日本語が聞き取れるようになりました。勿論、あの時は字はまだ読めなかったです。
					<br />
					<br />
					中国だと、高校時代がきつければきついほど、大学に入ると気を緩む傾向があります。それはちょっとおかしいと思うけど、でも中国の大学入学試験が一番公平なものとか、階層流動の一番効率的なやり方とかに言われていて、
					私には何にも言えないです。大学時代は私もちょっときを緩みすぎたようです。何もやってない訳じゃいが、でも何にも成し遂げられなかったです。幸いアニメに興味あるんだから、日本語の感覚が身に付いてました。
					ちょっと恥ずかしいんですけど、あの時は結構数のアニソングを歌ったタイムラインが残りました。発音とかイントネーションとかは問題だらけですが、でも五十音表の大部は覚えてたかもしれません。そして、ホームページの
					『ダンまち』に出会ったのもあの時でした。どれだけハマるというと、ゲームの『ダンメモ』は二周年からずっとやってきて見届ける事もちゃんとしたり、オープニングの全部と他好きな曲を歌ったり、原作は全部買ったりしました。でも、
					原作読むのはできませんでした。初心者にとってレベルが高すぎて、根性とかないと本当に無理です。最初は一頁読むだけでも一時かけるのも普通なので、理由とかないと続けられないのもしょうがないと思って、ソースは私自身だけ
					ですけど。
					<br />
					<br />
					本気で日本語を勉強しようとしたのは二年前です。この前はずっと『原神』にはまってて、毎日『精鋭狩り』やってました。あの時の原神は今と違って、世界一の座を譲れなかったですね。私は結構日本の方の原神配信を見てました。
					でも、やはりゲームに時間を使いすぎるのもよくないから、変わりたいと思って日本語を勉強しようとしました。勿論、他の理由もあって、多分後はこれについてほかの理由が出てくるかもしれませんが、とにかくようやく日本語勉強が始めました。
					あの時の自分に感謝、続けられなかったら、今の私に至らなかったから。自分の『ダンまち』十八巻の朗読録音がまだ残ってて、たまに自分でも聞くんです。
					<br />
					正直自分のレベルが一体どれくらいなのかは、自分でもよくわかりません。高いと思う時があれば、低いと思うのもあります。N2は満点取れたが、片仮名苦手がありのままです。確定できるのは日本語が詰まってるだけ、後は使わないと徐々に
					忘れていくってこと。だから、環境がほしいです。でも、どんな環境いても、努力は欠かせないって事は知ってます。頑張るしかありませんね。
				</div>
			</div>
			<div class="paragraph">
				<title> 仕事について</title>
				<div class="content">
					まとめて言うと、本当にたまたまプログラミングの仕事をやって意外に向いてる。会社の雰囲気とか、フロントエンドにおいての自由度とかが気に入りのため、やって来られたのです。
					<br />
					<br />
					大学卒業前に、正直すっごく悩みました。何をやったらいいのか自分でもよくわからなかったです。運か不運か、大学四年生の冬休みの間、コロナが流行り始めました。
					あの時、仕事さえ見つければいいという流れが周囲にあって、私もその波に飲み込まれました。仕事見つけたなり、すぐ就職しました。そして今にも至りました。プログラミングの仕事をやってて意外に向いてる
					かもしれない。これもある種のもの作りだと思いまして、やはりもの作りの達成感が好きなようです。後は、性格が理由かな。コミュニケーションは好きな方だが、少なくとも私が陽キャじゃないと思いますから、
					自分がこつこつやってるのも悪くないと思いました。
					<br />
					初めての仕事だったから、最初は本当にすっごく緊張して、常に気を引き締めました。そうすると、以外に疲れました。でも、みんながすっごく優しく接してくれて、助けていただいて、段々と慣れてきました。
					オフィスの雰囲気もすごく気に入りでした。自分もちゃんと頑張って期待を応えて、戦力になりました。つくつく成長してきた自分を見るのも一興でした。
					<br />
					最初任されたのは同僚さんが開発したシステムの中の一つのページです。バックエンドは.Net
					FrameWork4.0で、開発ツールはVS2010で、フロントエンドで使用したのはjqueryでした。体験は最悪とも言えるだろ、特に
					フロントエンドで、objectに何があるのは知らないので、domの操作も結構面倒で、あの時はフロントエンドは全然好きじゃなかったです。丁度あの時、とある同僚さんが仕事を辞めるので、
					新人の私が彼の仕事を引き継ぐことになりました。その中、wechatの中で使ったサイトがあって、それは私とvueとの初めて出会いでした。Reactivityをやったら以外
					と楽しかったです。これなら好きかもと思いました。でもいいツールがあっても、使いこなせる基礎が欠くと意味がないですね。私のプロジェクトのページにもあるんだが、
					あの時明滅の効果を実現するには遠回りしすぎでした。animation一つで完成した筈のに、opacityをコントロールするなんておかしかったですよね。あれは四年前の私でした。あれから、基礎を勉強しつつ、
					仕事やってきました。小さいプロジェクトはほぼ自分が全てやるから、色な技術が試みられるので、そういう点も結構好きです。フロントエンドにおいてはどんどん上達してきて、楽しくなってきました。

					バックエンドにおいては、特に何にも感じませんでした。クラシックな三層構造(Router/Controller、Service、Daoのやつ)しか覚えてません。多分やってるビジネスロジックは特に難しいことがなかったのでこういう感じに覚えたかもしれない。
					データベースの操作は全部SQL Sentenceで、多分SQL Sentenceのレベルだけはかなり上がった気がしました。

					フロントエンドとバックエンド両方やるけど、正直慣れたら、難しくなかったです。でもやってるうちに、やはりフロントエンドの方が興味があるみたいです。会社からの育てはないが、自分はプライベートでちゃんと
					勉強しました。多分私のタイピングのスピードがちょっと遅いから、ずっと自分にとって快適の環境を作ろうとしました。少なくとも、補完とか、objectに何があるのかは知りたい。それが私が最初typescriptを使う理由でした。
					今私はもうtypescriptから離れられないが、でも気にしない人も会社では結構いらっしゃる。だから以下の状況になりました。バックエンドについて問題あると、先輩達に助けをいただけるけど、フロントエンドにおいては叶えませんでした。
					私の方がフロントエンドについて理解が深いようです。ちょっと寂しかったです。フロントエンドにおいても交流したかったです。


					<br />
					<br />
					勿論、納得いかない点もありました。
					<ul>
						<li>フロントエンドはあんまり重視されない事</li>
						データの重要性が高いのも理解できるんだけど、でもやはり差別がよくないです。ユーザーにとって一番近いのはフロントエンドですから。個人の感じですけど、今までやってきたものは大体一緒のようです。vueで例えると、layoutを除けば、router-viewの中では全部formと,buttonと,tableと,chartと終わりです。
						自分は快速開発のため、自分なりに色々なfunctionとかを書いてきたが、やはりちょっとしょぼいかもと覚えました。正直もっと挑戦したい気持ちもあるんです。
						<li> 平均気温３０度超えないとクーラー付けて貰えない事</li>
						それは本当に勘弁して欲しいです。本当に座るだけでも精一杯で。私去年丁度あの時コロナにかかったので、もじで死にそうだったです。皆がけちとか、人扱いじゃないとか愚痴っても、上は何も聞いてくれなかってです。
						<li>寮の管理がすごく混んでる事</li>
						同じ部門の同僚さんとなるべく一緒に暮らせることが普通と思うが、ここではすごく混んでる。初めてのルームメイトは自分の部門の同僚達じゃなくて、工場の人達でした。別に軽蔑とかの話じゃないですが。
						彼らは多分私の親みたいな年頃で、普段は挨拶しかやり取りがなかったです。でも、彼らはよく寮で酒を飲んだり、凄い音量でTikTokの動画を流したり、アニメとかを見る私をオタクとして悪口で言ったりしました。
						私が部屋にいるのに、なんてってすら思いました。でも私は逃げました。できるだけ寮にいないように。多分筋は取らないと思ったから。

						これも日本語勉強続けられる理由のーつでした。だって環境が変わらないなら、自分を変えるしかない。私はもっと勉強したい、見返りを見せたいという気持ちもありました。そういう環境のおかげで、続けるモチベーションができた
						のはちょっとおかしいけど、でもいい結果が出しましたから、今はちょっと感謝してるかも。『ダンまち』本編の18巻を読み終えた後、自分の日本語レベルが跳ね上げたと
						思いました。もしかしたら、N1とか一発合格できるかもとか。「じゃあ、7月N1をうけて、10月日本に一人で旅行でもしに行こうか」っていう計画も立てました。でも結局、実現できなかった。原因が以下にあるのです。
					</ul>
				</div>
			</div>
			<div class="paragraph">
				<title>転職したい理由</title>
				<div class="content">
					<ul>
						<li>新しいもの挑戦したい</li>
						前も言ってた、今まで使って来た物は結構似ているんですね。別に悪い話しじゃないが、私もそれにつれて、段々リファインして来たのも分かります。でも、今は本当に自分の腕に自信があって、それだけじゃものたらなく
						なってきたのも事実です。ずっとこのままじゃ、技術が偏りかねないので、それは嫌です。
						<li>疲れが溜まりすぎて、体が心配です</li>
						去年から、コロナが影響が出始め、会社は結構減員しました。特に直接に生産に関係しない私達。クビにされない自信があるんだが、
						仕事の状態が一気に変わりました。人手不足だから、残業も日常茶飯事、それはまだ許容範囲内でした。本部では新しいCEOが就任して、彼の直々から監視システムの開発任務が下りました。でも余りにも抽象的で、概念的で、
						工場の人は上が何か欲しいのかすらわかりませんので、私達も分かる筈もない。だから、スケジュールもなくて、会議する度にダメとか仕様変更とか言われて、でも明日とか明後日が新しいやつを見たいって言って、毎日残業して作り直しの繰り返し。
						最初は私も前向きで、中国のよくある「996」を体験できると、軽い感じでこの仕事やってる同僚さんと冗談してたけど。1年以上もに続くと、それはもうダメと思いました。
						別に頑張りたくないとか、そういうことじゃなくて、私はいい休憩は取れないから。実は、高校二年生の時から、ずっと睡眠がよくなくて、やむを得ず親に言って、父が彼の弟（つまりおじさん）に頼んで、彼家に居候してました。
						それで、高校時代乗り越えました。でも、今はそれはできません。男子寮だから、イビキとか普通ですよね。寮も結構古いので、夏ともなると、エアコンのノイズがやばいです。私はヤイホをつけたまま寝るようになりました。
						悪いのは知ってるが、多分寝れないよりはマシだと。後は、まだ若いから耐えられるってやって来たけど、そういう状況じゃ無理です、長時間じゃ耐え切れません。実際、去年は何回も病院に行ってました。ちょっと腰の状況が変なので、
						幸いまだ大丈夫みたいです(でも今年の健康診断は体重結構増えてて、異常の数値があって)。毎日頭がぐじゃぐじゃになって、仕事後はもう何にもしたくなくなりました。だから、去年は日本語勉強全然してませんので、直接にN1受けるのは不安で、
						N2にした。でもまさか満点取れたなんて、やはりN1を受けるべきかもしれない。

						<li>給料が低い</li>
						正直、給料が高ければ、多少は改善できると思うけど。でも仮設が成立しないから、何も意味ないですね。後は家族のためにもいい給料がないと心配です。うちは田舎で、両親はちゃんとした仕事がないです。日本みたいな福利厚生がないから、
						老後生活とか気に掛かるんです。正直、うちな母はすっごく勤勉な人で、でも教育はあんまりうけてませんから、肉体労働のアルバイトみたいな事しかできません。毎日四時から起きてご飯を作ってから、家を出ます。午後６時ぐらいおわり、
						七時ぐらい戻って色々やって９時前に寝ます。ずっと言いたかった言葉があって、「そんなに頑張らなくてもいいって、ちゃんと休んで、もうそうな年だから。金なら心配しなくていいって」。でも、言えなかったよ。たまには人の子失格と
						思っておりました。父は教育は結構受けてたけど、物知りだと思うけど、教師にもやったことがあるけど、選択を誤ったから、本当に不遇な人生です。今は何もできない状況です。肉体労働が無理のタイプです。
						杞憂かもしれませんが、もし病を患ったら、私は金出せる自信がないです。それも私が一番恐れている状況です。私は一人っ子だから、親の養う責任果たすべきで、それも私の存在意味の一つだと思います。

						<li>会社の中心はベトナムに移りつつある</li>
						深い話はあんまりしたくないが、でもこれも事実。中国の労働者は段々高くなっていて、後は美中の関係やらで、この状況になりました。十年後はどうなるかは不安で、今から考えた方がいざの時よりずっとマシだと思います。
					</ul>
				</div>
			</div>
			<div class="paragraph">
				<title>今後について</title>
				<div class="content">
					今年の二月、中国の旧暦新年、差しぶりに実家に帰りました。差しぶりにアニメも一つ見ました。『ぼっち・ザ・ロック』でした。その中の一つの歌を聞いた途端、涙が溢れだそうとしました。
					<br />
					<br />
					「空気を握って空を殴るよ。何にも起きない、私は無力さ。だけとさ、その手で、この鉄を弾いたら、何かが変わって見えたような……」
					<br />
					<br />
					てっきり私はもう共感できないと思いました。でも体の中には、まだ大切な何かが残っているようです。自分と向き合って、色々まとめて、結論を下しました。
					<br />
					今の仕事はもう一区切りしてもいい。やるべきこともやったつもりで、成果もちゃんと残りました。無念とかはないでした。
					<br />
					休憩がよくなくて、疲れとか解消してないなら。次の仕事は生活と健康にも重視ししょうよ。少なくとも、一人のベッドルームが欲しい。イヤホンを付けたまま寝るのは本当にもう御免です。
					<br />
					やってきた仕事がもの足りないとかを思うなら、時間をかけてちゃんと勉強ししょうよ。その間ちゃんと貯金もして。
					<br />
					アニメ好きで、日本に興味があって、生活してみたかったと思うなら。日本の仕事も探してみよう。でもやはり、雇ってもらえる保証がないから、来年から国内の仕事も一緒に探して、先に国内のいい仕事見つけたら、
					日本で仕事するのをやめます。それは日本で仕事するには無縁ってこと。日本に仕事しにいけるかとうか定かではないか、最善を尽くすつもりです。できるかできないかに関係ない、やると決めたんだから。
					何にもしないで今後後悔するより、やっててできなくて悔しいの方がまだマシです。日本に夢見がないと言ったら嘘になりますけど。でもこの世に楽な生き方がないってことは知ってます。どこにいても、生活が続く、
					努力が必要とする。
					<br />
					たらか、止まるな、前に進め、躓く暇がない。行けるまで行きたいでしょ、見くびさせないで。
					<br />

					実は、去年は辛くて、仕事やめたくて、弱音を吐いたこともありました。今の日本によくある転生系アニメにちょっと憧れて、もし生まれ変わったらとか、ちょっと妄想もしてました。
					結局やめました。この世にまだ大事の人がいて、愛してくれる人がいて、しっかりしなくちゃと。私は一度っきりの人生に後悔したくないです。
					勉強を決まる以来、本当に頑張りました。別に自慢とかしたい訳じゃないげと、今年の仕事後はパーソナルパソコン前に座って、いつものに夜１時になることがよくありました。それは良くない、ちょっと運動した方がいいのも知ってますが。
					でも勉強しないと本当に心細くて、いい仕事が見つけられないかもって心配してます。疲れるけど、意外に充実してます。今はまだ若い、若いと思えるから、ちょっとぐらい無理してもいいかもしれない。
					<br />
					本題に戻ろう。次の仕事ではちょっと新しいとか、挑戦的の内容やってみたいですね、正直自分のjsの腕に自信があります。興味のあるものと言えば、WebGLとかは気になってて、ちょっと派手なサイト作りたいです。
					Electronでapplication開発もやってみたい。とにかく、楽しみが一杯あるんので、これからも頑張ります。


				</div>
			</div>
			<div class="paragraph">
				<title>最近やったこと</title>
				<div class="content">
					ここの詳細は文章のページにありますので、気になる方はそこに見てください。それは勉強中のノートみたいなものです、理解できるか否かは定かではないんですけど。
					<ul>
						<li>node</li>
						勉強を決めたので、結構勉強に励んでました。jQueryからnpm run
						devとかになって、気にしてるかとうかはわかりませんが、私はすっごく気になりました。原理は何ですか。ずっとnodeのこと気にかけたので、
						nodeで始まりました。vscodeがnodeの技術で開発したこと知った時ショックでした。もしかしたら、以後自分のAppをjsで開発できるなんて考えたらワクワクします。性能面の話置いておいて、私は本当に
						js好きで、自由度が高いし、OOPでやってもいい。このサイトのバックエンドもnodeで開発しました。
						<li>typescriptの勉強直し</li>
						以前は本当に補完のためだけに使ってまして、正直OOPとかを使わないと、typescriptの真価が発揮できませんと思います。練習として、ミニゲームをやってみました。難しかったです。でもやってて面白かったです。
						typeの計算もちゃんと勉強したが、そこはちょっとイマイチかも。日常はあんまり複雑の計算使わないので、どれだけ使えるのかは疑問を持つね。
						<li>webpack</li>
						vue2の時一番怖かったものでした。webpack.config.jsの内容全然わかりません。ちょっと古い話ですが、初めてvue2のプロジェクトを受け継ぐ時、先輩から
						「bulid後は、srcの'/'を'./'に変えること忘れないでね」。ちょっとおかしいと思ったが、何にも分からなかったので、長い間このやり方でしました。その後はpublicPath:'./'でしたんだけど、
						何の意味なのかは知らなかったです。だから勉強したいと思いました。今は、viteとか使ってるけど、やはり原理知りたいですね。vue3がwebpackをやめた理由も分かれます。多分勉強しても、
						自分がゼロからconfigをやる機会がないけど、でも勉強したら納得できます。それが一番大事。
						<li>vueの原理</li>
						vueのReactivityは何と聞いたら。大体の人から、Object.definePropetyとかProxyの答えがもらえると思います。私もそうでした。
						じゃあ、Object.definePropetyとかProxyを使って、データ変わる時、functionを呼び出すこと実現できるか。多分結構数の人はできない。
						別に知らなくても、仕事に支障が来さないなと思うが、でも上級者になるには知るべきだと思います。だから今回はちゃんと自分がVueの中の
						trackとtriggerとeffectをやってみました。effectがあってから、computedとwatchとrenderと初めてReactivityができました。Observer
						Patternもちゃんと理解できました。diffのアルゴリズムは今の僕にはちょっとハードルが高い。
						アルゴリズムを簡単なやつからやっていこうと思っております。
						<li>React</li>
						Reactも勉強中です。MVVMと言えば、vueとReactが欠かせないですね。vueは上級者になったかもしれないが、でも思想とかが固まった可能性があるので、私もちょっと
						興味があってやってみました。TSXとかはちょっと癖強と感じました。vueもあるんですが、templateからrenderにcompileした際、最適化があるので、それは捨てがたいですね。
						でもfunctionのcomponentとジェネリックスとの相性も半端ないです。個々にアドバンテージがあります。でもやはり一番の収穫はreactからcomposition
						apiが身に付けたこと。
						ずっとvueでやってるので、Vue3に変えたけど、vue2の影響が残って、書き方とかはちょっとイマイチな気がしてました。今はreactの影響を受け、エレガントなコードが書けそうと覚えました。
					</ul>
				</div>
			</div>
			<div class="ps">
				PS:
				何だか、くそ長い文章になったような気がしますね。多分日本語への最初印象が中二に向いてるから、日本語で話すとちょっと感情入れすぎがちみたいですね。
				中国語ではそこまではしません、正直恥かしくて、痛いから。ここまで見られないと思うけど、もし本当に読んだら、礼を言います。ちょっと変な文章になるけど、
				私の人柄が伝わったかな、伝われたらいいな。自己へ評価は、自信があんまりなくて、それとちょっと生真面目な感じです。合ってるかとか知りませんですけど。
				ここまで読んでいただいて誠にありがとうございました。
			</div>
		</template>
		<template v-else>
			<div class="paragraph">
				<title>此网站占时还是静态网站,所有数据的是catch出来的,动态版coming soon</title>
			</div>
		</template>

	</div>



</template>

<style lang="less" scoped>
.about-container {
	width: 100%;
	height: 100%;
	position: relative;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 0;
		display: none;
		/* 设置滚动条的宽度 */
	}

	.paragraph {
		display: flex;
		min-height: 100%;
		flex-direction: column;

		title {
			display: block;
			font-size: 20px;
			font-weight: bold;
			height: 5rem;
			line-height: 5rem;
			text-align: center;

			box-sizing: border-box;
			// align-self: center;
			font-family: 'Noto Sans Japanese', 'Noto Sans JP', sans-serif;




		}

		.content {
			height: 85%;

			box-sizing: border-box;
			padding: 1em 15rem;
			line-height: 2em;
			font-size: 18px;
			vertical-align: baseline;
			font-family: 'Noto Sans Japanese', 'Noto Sans JP', sans-serif;

			ul {
				li {
					list-style: decimal;
					list-style-position: inside;
				}
			}


		}

		&:nth-child(2n) {
			color: #0d3b56;
			background-color: rgba(13, 59, 86, 0.04);
		}

		.arrow-down {
			// transform: translateX(-50%);
			top: initial;
			bottom: .5em;
			animation: jump-down 2s infinite;
			font-size: 2em;
			padding: 0 15rem;
			text-align: center;
			opacity: .4;

			@keyframes jump-down {
				0% {
					ransform: translateY(-.2em);
				}

				50% {
					transform: translateY(.2em);
				}

				100% {
					ransform: translateY(-.2em);
				}
			}
		}
	}

	.ps {
		font-family: 'Noto Sans Japanese', 'Noto Sans JP', sans-serif;
		padding: 1em 15rem;
		background-color: rgba(13, 59, 86, 0.2);
		line-height: 2em;
	}

	.test {
		width: 200px;
		height: 200px;
		background: #999;
		margin-top: 1rem;
	}
}
</style>