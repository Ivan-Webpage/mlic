import { NavigationEnd, Router } from '@angular/router';

// blog/gallery/article/online-class 元件都需要在路由參數變化時重新整理頁面內容，
// 統一集中這段訂閱邏輯，行為與原本各自 inline 訂閱完全相同。
export function onNavigationEnd(router: Router, callback: () => void): void {
  router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      callback();
    }
  });
}
