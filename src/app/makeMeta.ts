import { Title, Meta } from '@angular/platform-browser';
import { Injectable } from "@angular/core";

@Injectable()
export class makeMeta {
    config = require("src/assets/config.json"); // 存放文章資訊

    constructor(private titleService: Title, private metaService: Meta) { }

    makeMeta(postData_classification: string, postData_article: string) {
        var getobj = this.config['article'][postData_article]
        
        switch (postData_classification) {
            case 'home':
                this.titleService.setTitle('首頁－行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據');
                this.metaService.addTags([
                    { name: 'keywords', content: 'Python基礎 爬蟲 商業分析 行銷 數據' },
                    { name: 'description', content: '有多少人對行銷的領域充滿憧憬，一個永遠走在市場前端的知識型產業，曾經是你我的目標，卻漸漸被社會的巨輪輾過。Ivan台灣行銷業界的不平等，充滿創意的文案卻在離職後才被公司採用，行銷人的價值究竟是什麼呢行銷搬進大程式致力利用Python等資訊科技的力量，讓每個想要往前的生命能爬上自己的高峰。你很有價值' },
                    { property: "og:image", content: 'https://i.imgur.com/WQe0J3A.jpg' },
                    { property: "og:description", content: '有多少人對行銷的領域充滿憧憬，一個永遠走在市場前端的知識型產業，曾經是你我的目標，卻漸漸被社會的巨輪輾過。Ivan台灣行銷業界的不平等，充滿創意的文案卻在離職後才被公司採用，行銷人的價值究竟是什麼呢行銷搬進大程式致力利用Python等資訊科技的力量，讓每個想要往前的生命能爬上自己的高峰。你很有價值' },
                    { property: "og:title", content: '首頁－行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據' },
                ])
                break;
            case 'about':
                this.titleService.setTitle('關於Ivan－行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據');
                this.metaService.addTags([
                    { name: 'keywords', content: 'Python基礎 爬蟲 商業分析 行銷 數據' },
                    { name: 'description', content: '專案經驗 講課經驗 中華電信講師 外貿協會講師 資策會 台大 台科大 成大 文藻 數據分析 著作出版 STP行銷策略之Python商業應用實戰 打造股市小秘書' },
                    { property: "og:image", content: 'https://i.imgur.com/WQe0J3A.jpg' },
                    { property: "og:description", content: '專案經驗 講課經驗 中華電信講師 外貿協會講師 資策會 台大 台科大 成大 文藻 數據分析 著作出版 STP行銷策略之Python商業應用實戰 打造股市小秘書' },
                    { property: "og:title", content: '首頁－行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據' },
                ])
                break;
            case 'gallery':
                var title = '';
                switch (postData_article) {
                    case 'marketing':
                        title = '行銷與商業分析';
                        break;
                    case 'financial':
                        title = '投資與程式金融';
                        break;
                    case 'technology':
                        title = '工程技術紀錄';
                        break;
                    case 'manage':
                        title = '管理與經理人思維';
                        break;
                    default: // 首頁
                        title = '行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據'
                }
                console.log(postData_article)
                this.titleService.setTitle(title  + '－行銷搬進大程式');
                this.metaService.addTags([
                    { name: 'keywords', content: 'Python基礎 爬蟲 商業分析 行銷 數據' },
                    { name: 'description', content: '有多少人對行銷的領域充滿憧憬，一個永遠走在市場前端的知識型產業，曾經是你我的目標，卻漸漸被社會的巨輪輾過。Ivan台灣行銷業界的不平等，充滿創意的文案卻在離職後才被公司採用，行銷人的價值究竟是什麼呢行銷搬進大程式致力利用Python等資訊科技的力量，讓每個想要往前的生命能爬上自己的高峰。你很有價值' },
                    { property: "og:image", content: 'https://i.imgur.com/WQe0J3A.jpg' },
                    { property: "og:description", content: '有多少人對行銷的領域充滿憧憬，一個永遠走在市場前端的知識型產業，曾經是你我的目標，卻漸漸被社會的巨輪輾過。Ivan台灣行銷業界的不平等，充滿創意的文案卻在離職後才被公司採用，行銷人的價值究竟是什麼呢行銷搬進大程式致力利用Python等資訊科技的力量，讓每個想要往前的生命能爬上自己的高峰。你很有價值' },
                    { property: "og:title", content: '首頁－行銷搬進大程式｜Python基礎 爬蟲 商業分析 行銷 數據' },
                ])
                break;
            default:
                this.titleService.setTitle(getobj['title'] + '－行銷搬進大程式');
                this.metaService.addTags([
                    { name: 'keywords', content: getobj['tag'] },
                    { name: 'description', content: getobj['description'] },
                    { property: "og:image", content: getobj['cover-image'] },
                    { property: "og:description", content: getobj['description'] },
                    { property: "og:title", content: getobj['title'] + '－行銷搬進大程式' },
                ])
        }

        this.metaService.addTags([
            { name: 'robots', content: 'index, follow' },
            { property: "fb:app_id", content: "476736371047505" },
            { property: "fb:admins", content: "100063542455415" },
            { property: "og:image:alt", content: "行銷搬進大程式，每個行銷人都能藉由程式，讓自己的價值極大化" },
            { property: "og:image:width", content: "600" },
            { property: "og:image:height", content: "600" },
            { property: "og:url", content: "https://marketingliveincode.com" },
            { property: "og:locale", content: "zh_TW" },
            { property: "og:type", content: "article" },
            { property: "og:site_name", content: "行銷搬進大程式" },
            { property: "article:publisher", content: "https://www.facebook.com/marketingliveincode" },
        ]);
    }

}