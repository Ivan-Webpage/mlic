import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { makeMeta } from '../makeMeta'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  star_icon = faStar;
  constructor(private meta: makeMeta) {
    meta.makeMeta('home','');
  }
  ngOnInit() {
    
  }
}


