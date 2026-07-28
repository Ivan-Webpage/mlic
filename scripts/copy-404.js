// GitHub Pages 是純靜態主機，使用者直接連到 /about、/classification/xxx/yyy 這種子路由時，
// 伺服器端根本沒有對應的實體檔案，會回 404。GitHub Pages 有個慣例：找不到路徑時會改
// 回傳 gh-pages 分支根目錄的 404.html。這裡把 index.html 複製成 404.html，
// 讓 GitHub Pages 在 404 情境下改吐出完整的 Angular App shell，交給前端 Router
// 自己讀 URL 並渲染正確的頁面（HTTP 狀態碼仍會是 404，這是純靜態 SPA 部署的已知限制，
// 若要讓爬蟲看到 200 狀態碼，需要另外做 prerender，見 docs/deployment.md）。
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist/mlic/browser');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (!fs.existsSync(indexPath)) {
  console.error('找不到', indexPath, '，請先跑過 ng build');
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log('404.html（SPA fallback，內容同 index.html）已產生 ->', notFoundPath);
