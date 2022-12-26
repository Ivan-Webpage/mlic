import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { SharedModule } from '../shared.module';
@NgModule({
  declarations: [AboutComponent],
  imports: [
    SharedModule,
  ]
})
export class AboutModule { }
