import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule, // 共用套件
  ]
})
export class HomeModule { }
