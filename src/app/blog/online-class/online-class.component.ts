import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router,NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { makeMeta } from '../../makeMeta'

@Component({
  selector: 'app-online-class',
  templateUrl: './online-class.component.html',
  styleUrls: ['./online-class.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OnlineClassComponent implements OnInit {
  postData_classification = "" //抓取post傳遞過來的課程編號
  postData_article = "" //抓取post傳遞過來的文章編號
  config = require("src/assets/config.json"); // 存放文章資訊
  thearticle: string;
  classObj: any;
  cover: string;
  video: any;
  chapter: Array<string>;

  leave_top = 'leave-top-0'
  article_col = 'col-sm-9'; // 文章區塊的寬度設定
  article = ''; // 文章的位置
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private meta: makeMeta
  ) {
    this.postData_classification = String(this.route.snapshot.params['cls']);
    this.postData_article = String(this.route.snapshot.params['id']);
    meta.makeMeta(this.postData_classification, this.postData_article);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.chapter = [];
        this.thearticle = '';
        this.video = '';
        this.classObj = null;
        this.cover = '';
        this.reset();
      }
    });
  }

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    var getobj = this.config['article'][this.postData_article]
    this.cover = this.config['class'][this.postData_classification]['cover-image'];
    this.classObj = this.config['class'][this.postData_classification];
    this.chapter = Object.keys(this.classObj['chapter']);

    this.getSafeUrl(getobj['video'] + "?autoplay=1&amp;showinfo=1&amp;modestbranding=1&amp;rel=0");
  }

  getSafeUrl(url: string) {
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
