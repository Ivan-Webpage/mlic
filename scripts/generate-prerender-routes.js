// 產生給 `ng run mlic:prerender --routes-file=<這支腳本輸出的檔案>` 用的路由清單，
// 一行一個路徑（不含網域、不含結尾斜線，對應實際的 Angular route），
// 資料來源跟 scripts/generate-sitemap.js 一樣是 src/assets/config.json。
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/assets/config.json');
const outputPath = path.join(__dirname, '../prerender-routes.txt');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const staticRoutes = [
  '/',
  '/home',
  '/about',
  '/classification/marketing',
  '/classification/financial',
  '/classification/technology',
  '/classification/manage',
  '/classification/angular',
];

const articleRoutes = Object.entries(config.article).map(
  ([id, article]) => `/classification/${article.classification}/${id}`
);

const routes = [...staticRoutes, ...articleRoutes];

fs.writeFileSync(outputPath, routes.join('\n') + '\n', 'utf8');
console.log(`prerender-routes.txt 已產生，共 ${routes.length} 條路由 -> ${outputPath}`);
