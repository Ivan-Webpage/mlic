import { Component, OnInit } from '@angular/core';
import { faFacebookF,faYoutube,faGithub,faMedium,faGoogle,faTelegram } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
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
