import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  display = false;
  postData_classification = "" //抓取post傳遞過來的課程編號
  constructor(private route: ActivatedRoute,private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
      }
    });
    // 判斷是否要顯示影片
    this.postData_classification = String(this.route.snapshot.params['cls']);
    if (['python_foundation','lineBot','telegramBot','crawler_king'].find(x => x === this.postData_classification)) {
      console.log('=======================')
      this.display = true;
    }
  }

  ngOnInit(): void {
  }

}
