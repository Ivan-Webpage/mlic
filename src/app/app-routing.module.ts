import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path: 'home',
        component: HomeComponent
      },{
        path: 'about',
        component: AboutComponent
      },{
        path: 'classification/:cls',
        component: GalleryComponent
      },{
        path: 'classification/:cls/:id',
        component: BlogComponent
      },{
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload', //網頁物件有變化時，允許重新整理
      enableTracing: true, //網頁物件有變化時，允許重新整理
      useHash: false, //去掉url的#符號
      initialNavigation: 'enabledBlocking',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
