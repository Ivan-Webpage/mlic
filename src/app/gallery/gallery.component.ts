import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { makeMeta } from '../makeMeta'

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  postData_classification = "" //抓取post傳遞過來的類別
  config = require("src/assets/config.json")['article']; // 存放文章資訊
  title = '';
  star_icon = faStar;
  rndArray: number[]=[];
  masonryImages: any;
  limit = 15;
  howlong = Object.keys(this.config).length;

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private meta: makeMeta
    ) {
      this.postData_classification = String(this.route.snapshot.params['cls']);
      meta.makeMeta('gallery', this.postData_classification);

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.location.reload();
        }
      });
    }

  ngOnInit(): void {
    this.showImages();
  }

  showImages() {
    if (this.postData_classification != 'undefined'){
      switch (this.postData_classification){
        case 'marketing':
          this.title = '行銷與商業分析';
          break;
        case 'financial':
          this.title = '投資與程式金融';
          break;
        case 'technology':
          this.title = '工程技術紀錄';
          break;
        case 'manage':
          this.title = '管理與經理人思維';
          break;
      }
      for (var i = this.howlong;i>=1;i--){
        if (this.config[i]['classification'] == this.postData_classification){
          this.rndArray.push(Number(i))
        }
      }
    } else {
      this.title = '最新文章'
      for (var i = this.howlong;i>=1;i--){
        if ( ['marketing','financial','technology','manage'].find(x => x === this.config[i]['classification'])){
          this.rndArray.push(Number(i))
        }
      }
      // this.rndArray = this.randomsInt(1, this.howlong, this.howlong)
    }
    this.masonryImages = this.rndArray.slice(0, this.limit);
  }

  showMoreImages() {
    this.limit += 15;
    this.masonryImages = this.rndArray.slice(0, this.limit);
  }

  randomsInt(min: number, max: number, n: number) {
    if (n > max - min) {
      n = max - min;
    }
    let arr: number[] = Array.from({ length: max - min }, (v, k) => k + min);// arr = [min, max];
    for (let i = 0; i < n; i++) {// 洗牌算法(随机乱置算法), 仅打乱[0, n);
      let j = Math.floor(Math.random() * (arr.length - i) + i);// j = [i, arr.length)之间的随机整数
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.length = n;// 取前n项
    return arr;
  }
}
