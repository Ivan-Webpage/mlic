import { NgModule } from '@angular/core';
import { StickyDirective } from './sticky.directive';
import { NavbarComponent } from "../navbar/navbar.component";

@NgModule({
    declarations: [StickyDirective],
    exports: [StickyDirective],
})
export class StickyModule {}
