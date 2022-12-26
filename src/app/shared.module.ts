import { NgModule, ModuleWithProviders   } from '@angular/core';
import { CommonModule } from '@angular/common';
// 引入網頁區塊
import { FooterComponent } from './layout/footer/footer.component';
import { ArticleComponent } from './blog/article/article.component';
import { OnlineClassComponent } from './blog/online-class/online-class.component'
import { GalleryComponent } from './gallery/gallery.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RightBottonComponent } from './layout/right-botton/right-botton.component';

// 引入外部套件
import { StickyModule } from './layout/sticky/sticky.module'; // 自設套件
import { makeMeta } from './makeMeta'; // 自設套件
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { NgxMasonryModule } from 'ngx-masonry';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

var importModule=[
  StickyModule,
  NgbModule,
  MatIconModule,
  MatSidenavModule,
  MatExpansionModule,
  MatButtonModule,
  CommonModule,
  MarkdownModule,
  RouterModule, 
  // NgxMasonryModule, 
  FontAwesomeModule,
  NgxScrollTopModule,
  HttpClientModule,
  MdbCollapseModule,
  MdbDropdownModule,
]
@NgModule({
  imports: importModule,

  declarations: [
    FooterComponent, 
    OnlineClassComponent, 
    ArticleComponent, 
    GalleryComponent,
    NavbarComponent,
    RightBottonComponent
  ],
  exports: [
    FooterComponent,
    OnlineClassComponent,
    ArticleComponent,
    GalleryComponent,
    NavbarComponent,
    RightBottonComponent,
    importModule
  ],
  providers: [makeMeta ]
})

export class SharedModule {
  static forRoot(providers = []): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [ 
        MarkdownModule 
      ]
    };
  }
}
