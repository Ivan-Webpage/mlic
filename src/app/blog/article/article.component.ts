import { Component, OnInit, Output } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { faGithub, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { makeMeta } from '../../makeMeta'

@Component({
  selector: 'app-article',
  template: '',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})

export class ArticleComponent implements OnInit {
  // 網頁建構區塊
  faGithub = faGithub;
  faFacebook = faFacebook;
  config = require("src/assets/config.json");; // 存放文章資訊
  title = ""; // 網頁標題
  description = ""; // SEO呈現描述
  article = ''; // 文章檔案
  cover = '' // 文章的封面
  urlDownload = ''; // 檔案下載
  showDownload = true; // 有沒有檔案可以下載
  pageurl = '' // 上下篇文章的連結，分成文章、課程
  @Output() size: number;
  // 參數區塊
  postData_classification = "" //抓取post傳遞過來的課程編號
  postData_article = "" //抓取post傳遞過來的文章編號
  faChevronLeft = faChevronLeft; // 向左符號
  faChevronRight = faChevronRight; // 向左右號
  article_title = ''; // h1標題，整篇文章只會有一個，下面會補上
  content_col = 'col-sm-9'; // 畫面區塊的寬度設定
  article_col = 'col-sm-9'; // 文章區塊的寬度設定
  prev_art = ''; // 上一篇文章
  next_art = ''; // 下一篇文章
  classtype = '/class';
  count = [0, 0, 0, 0, 0]; // h2、h3、h4、h5、h6標題，打包成陣列，用來計算標題編號
  temp = '';
  catalog_arr: (string)[][]= [[], [], [], [], []]; // H2 H3 H4 H5 H6
  catalog_map = new Map(); // H3 H4 H5 H6
  // 摺疊按鈕的開關，預設為打開
  panelOpenState = true;

  constructor(
    private MDservice: MarkdownService,
    private route: ActivatedRoute,
    private router: Router,
    private meta: makeMeta
  ) {
    this.postData_classification = String(this.route.snapshot.params['cls']);
    this.postData_article = String(this.route.snapshot.params['id']);
    meta.makeMeta(this.postData_classification, this.postData_article);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // 重新載入前，要先把之前的變數全部清掉
        this.catalog_arr = [[], [], [], [], []];
        this.catalog_map = new Map();
        this.count = [0, 0, 0, 0, 0];
        this.reset();
      }
    });
  }

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.article = './assets/article/' + this.config['article'][this.postData_article]['title'] + '.md';
    this.cover = this.config['article'][this.postData_article]['cover-image'];
    this.urlDownload = this.config['article'][this.postData_article]['download'];


    // 判斷是否有檔案可下載，沒有就不顯示下載按鈕了
    this.showDownload = true;
    if (this.urlDownload == '') {
      this.showDownload = false;
    };

    // 圖片下面會黏文字，因此加兩個換行
    this.MDservice.renderer.image = (href: string, text: string) => {
      if (text == null) {
        text = "行銷搬進大程式";
      };
      return '<img src="' + href + '" alt = "' + text + '" class="d-block mx-auto">';
    };

    // 標題樣式
    this.MDservice.renderer.heading = (text: string, level: number) => {

      switch (String(level)) {
        case '1': // 拿來做標題與介紹使用
          this.article_title = text;
          return '';
        case '2':
          this.catalog_arr[0].push(text)
          this.temp = text;
          this.count[0] = this.count[0] + 1; // 計算編號到第幾了
          // 比她小的階層全部歸零計算
          this.count[1] = 0;
          this.count[2] = 0;
          this.count[3] = 0;
          this.count[4] = 0;
          return '<br><br><hr class="line-style back-major-ten">' +
            '<h2 id="' + text + '" class="md-h2">' + this.count[0] + '. ' + text + '</h2>'

        default:
          this.catalogMapping(this.catalog_arr[level - 3], this.catalog_arr[level - 2], text, level);
          return '<h' + level + ' id="' + text + '" class="md-h' + level + '">' + this.count[level - 2] + '. ' + text + '</h' + level + '>';
      }
    };
    
    // 上下篇文章按鈕
    this.prev_art = this.config['article'][this.postData_article]['previous'];
    this.next_art = this.config['article'][this.postData_article]['next'];
  }

  // 組裝出所有各階層標題的物件
  catalogMapping(fatherArr: Array<string>, childArr: Array<string>, text: string, level: number) {
    childArr.push(text); // 先儲存這個層級的標題
    var preFather = fatherArr[fatherArr.length - 1]; // 抓前一個層級的標題
    if (this.catalog_map.has(preFather)) { // 判斷該標題是否已經被記錄
      // 有被記錄過了，那再新增一筆
      this.catalog_map.get(preFather)?.push(text);
      // faTemperature0.push(text);
    } else {
      // 沒被記錄過，新增一筆紀錄
      this.catalog_map.set(preFather, [text]);
    }

    // 計算編號
    this.count[level - 2] = this.count[level - 2] + 1; // 同階層就繼續累加
    // 比她小的階層全部歸零計算
    for (var i = level - 1; i < 5; i++) {
      this.count[i] = 0;
    }
  }

  // 下載程式碼按鈕
  downloadZip() {
    location.href = this.urlDownload;
  }

  // 跳動目錄
  scroll(el: string) {
    const box = document.getElementById(el) as HTMLDivElement;
    box.scrollIntoView();
}
}



