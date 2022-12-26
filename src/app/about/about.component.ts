import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions,  } from 'ngx-masonry';
import { makeMeta } from '../makeMeta'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
  };

  masonryImages: (string)[][] = [
    ['中華電信', 'assets/images/about/1.jpg'],
    ['成功大學', 'assets/images/about/2.jpg'],
    ['台灣大學', 'assets/images/about/3.jpg'],
    ['台科大', 'assets/images/about/4.jpg'],
    ['財經商學院', 'assets/images/about/5.jpg'],
    ['外貿協會', 'assets/images/about/7.jpg'],
    ['資策會', 'assets/images/about/8.jpg'],
    ['文藻大學', 'assets/images/about/9.jpg'],
    ['政治大學', 'assets/images/about/11.jpg'],
  ]
  constructor(private meta: makeMeta) {
    meta.makeMeta('about','');
  }

  ngOnInit() {}
}

