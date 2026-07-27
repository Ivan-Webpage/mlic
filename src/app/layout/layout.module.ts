import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { LayoutComponent } from './layout.component';
@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule, // 共用套件
    CommonModule
  ]
})
export class LayoutModule { }
