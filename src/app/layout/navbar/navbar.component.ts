import { Component, ViewChild } from '@angular/core';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})

export class NavbarComponent {
  constructor() {}

  isNavbarCollapsed = true;

  @ViewChild('dropdown1') articleDropdownMenu1: any;
  @ViewChild('dropdown2') articleDropdownMenu2: any;
  @ViewChild('basicNavbar') ngbCollapse: any;

  // 點下去以後，選單全部要關起來
  hideNavbar() {
    this.ngbCollapse.toggle();
    this.articleDropdownMenu1.close();
    this.articleDropdownMenu2.close();
  }
}
