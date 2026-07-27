import { Component, ViewChild } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  constructor() {}

  @ViewChild('dropdown1') articleDropdownMenu1: any;
  @ViewChild('dropdown2') articleDropdownMenu2: any;
  @ViewChild('basicNavbar') mdbCollapse: any;

  // 點下去以後，選單全部要關起來
  hideNavbar() { 
    this.mdbCollapse.toggle(); 
    this.articleDropdownMenu1.hide();
    this.articleDropdownMenu2.hide();
  }
}
