// 一鍵部署腳本：
//   1) npm run build            打包純前端 build（含 CNAME/robots.txt/sitemap.xml）
//   2) git push origin HEAD:main 把目前分支的內容推到遠端 main 分支
//   3) gh-pages -d dist/mlic/browser 把 build 產物推到 gh-pages 分支
//
// GitHub Pages 的 "Custom domain" 之所以每次 push 後被重設，是因為部署內容裡沒有
// CNAME 檔案。這支腳本每次都會透過 angular.json 的 asset glob 把 src/CNAME
// 複製進 dist/mlic/browser，所以 gh-pages 分支每次都會帶著 CNAME 一起發佈，
// GitHub 就會自動記住自訂網域，不需要每次手動回 GitHub 設定重填。
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function tryGetOutput(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

try {
  const dirty = tryGetOutput('git status --porcelain');
  if (dirty) {
    console.warn('\n⚠️  注意：目前有尚未 commit 的變更，這些變更不會被 push 到 main（git push 只會送出已經 commit 的內容）：');
    console.warn(dirty);
  }

  console.log('\n=== 1) Build 前端 ===');
  run('npm run build');

  console.log('\n=== 2) Push 原始碼到 origin main ===');
  run('git push origin HEAD:main');

  console.log('\n=== 3) 部署 dist/mlic/browser 到 gh-pages 分支 ===');
  // --cname 是雙重保險：即使 dist 裡的 CNAME 檔案不知為何漏掉，gh-pages 套件仍會自己補上
  // --nojekyll 避免 GitHub Pages 用 Jekyll 處理輸出內容（Angular 的靜態檔案不需要，也可能被誤判）
  run('npx gh-pages -d dist/mlic/browser -m "deploy: update site" --nojekyll --cname marketingliveincode.com');

  console.log('\n✅ 部署完成！');
  console.log('- 原始碼已推到 origin/main');
  console.log('- dist/mlic/browser 已推到 gh-pages 分支（含 CNAME，自訂網域設定不會再被重設）');
  console.log('- 第一次部署後，記得到 GitHub repo 的 Settings > Pages 確認 Source 是 "gh-pages" 分支、Custom domain 顯示 marketingliveincode.com');
} catch (err) {
  console.error('\n❌ 部署過程中發生錯誤，已中止：', err.message);
  process.exit(1);
}
