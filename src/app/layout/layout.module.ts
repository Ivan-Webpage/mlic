import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule, // 共用套件
    CommonModule
  ]
})
export class LayoutModule { }
