import { NgModule, SecurityContext } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

import { LayoutComponent } from './layout/layout.component';
import { BlogComponent } from './blog/blog.component';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared.module';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    BlogComponent
  ],
  imports: [
    SharedModule, // 共用套件
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({appId:'serverApp'}),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE, // 關閉安全模式，這樣才能在ngx-markdown套件中使用ID
      loader: HttpClient, // optional, only if you use [src] attribute
      markedOptions: {
        provide: MarkedOptions,
      }
    }),

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
