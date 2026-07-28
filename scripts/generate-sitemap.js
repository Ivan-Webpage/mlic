// 依 src/assets/config.json 產生 src/assets/sitemap.xml。
// 每次新增/修改文章後，跑一次 `npm run generate-sitemap`（或直接 `npm run build`，
// build 前會自動跑這支腳本），確保 sitemap 跟 config.json 同步。
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://marketingliveincode.com';
const configPath = path.join(__dirname, '../src/assets/config.json');
const outputPath = path.join(__dirname, '../src/sitemap.xml');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const staticUrls = [
  '/home',
  '/about',
  '/classification/marketing',
  '/classification/financial',
  '/classification/technology',
  '/classification/manage',
  '/classification/angular',
];

const articleUrls = Object.entries(config.article).map(
  ([id, article]) => `/classification/${article.classification}/${id}`
);

const urls = [...staticUrls, ...articleUrls];

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((url) => `  <url>\n    <loc>${SITE_URL}${url}/</loc>\n  </url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`sitemap.xml 已產生，共 ${urls.length} 筆網址 -> ${outputPath}`);
