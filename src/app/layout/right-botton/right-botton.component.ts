import { Component, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF,faYoutube,faGithub,faMedium,faGoogle,faTelegram } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-right-botton',
  templateUrl: './right-botton.component.html',
  styleUrls: ['./right-botton.component.scss']
})
export class RightBottonComponent implements OnInit {
  up = faChevronUp;
  mail_icon = faGoogle;
  github_icon = faGithub;
  medium_icon = faMedium;
  FB_icon = faFacebookF;
  youtube_icon = faYoutube;
  telegram_icon = faTelegram;

  constructor() { }

  ngOnInit(): void {
  }

}
