import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';


function bootstrap() {
    platformBrowser().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  };


 if (document.readyState === 'complete') {
   bootstrap();
 } else {
   document.addEventListener('DOMContentLoaded', bootstrap);
 }
 
