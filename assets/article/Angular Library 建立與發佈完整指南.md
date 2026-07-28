# Angular Library 建立與發佈完整指南

## Library 基本概念

使用 Library 的目的：
- 將常用的元件、服務、管道（pipe）等封裝成獨立模組，方便重複使用。
- 可整合專案內的組成物件，並可發佈至 npm 供其他專案使用。

官方文件：[Creating Libraries](https://angular.io/guide/creating-libraries)

Angular CLI 提供建立 Library 的指令，並支援打包與發佈流程。

### 建立 Library 專案
```bash
ng g library [自訂名稱] --prefix [前綴字]
```

建立後，會在 `projects` 資料夾下生成 Library 結構：
```
projects
 └─ src
    └─ lib
       ├─ lib.component.ts
       ├─ lib.module.ts
       ├─ lib.service.ts
       └─ public-api.ts
 ├─ README.md
 ├─ ng-package.json
```

---

## 打包與發佈 Library

### 打包 Library
```bash
ng build [Library名稱]
cd dist/[Library名稱] && npm pack
```

### 註冊 npm 帳號
```bash
npm login
npm whoami
```

### 發佈 Library
```bash
npm publish
```

完成後，任何人都可以在 npm 上下載並使用此 Library。

---

## Library 檔案結構與說明

主要檔案：
| 檔案路徑 | 說明 |
|----------|------|
| src/public-api.ts | 將 Library 對外公開的元件與服務匯出 |
| src/lib/lib.component.ts | Angular 元件檔案 |
| src/lib/lib.service.ts | Angular 服務檔案 |
| src/lib/lib.module.ts | Angular 模組檔案 |

### 加入新元件或服務
```bash
ng g c [元件名稱] --project=[Library名稱]
```

---

## Library 匯出與使用

在 `public-api.ts` 中匯出元件：
```typescript
export * from './lib/foo/foo.component';
```

在應用程式中使用 Library：
```typescript
import { LibModule } from 'lib';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, LibModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

若出現 `Cannot find module 'lib'` 錯誤，需在 `tsconfig.json` 中設定 paths：
```json
"paths": {
  "lib": ["projects/lib/src/public-api.ts"],
  "lib/*": ["projects/lib/src/*"]
}
```

---

## Library 測試與安裝

若僅在本地測試，可打包成 `.tgz` 檔案並安裝：
```bash
ng build [Library名稱]
cd dist/[Library名稱] && npm pack
npm install [Library名稱].tgz
```

### package.json 重要欄位
| 欄位 | 說明 |
|------|------|
| name | 套件名稱 |
| version | 版本號 |
| repository | 原始碼位置 |
| description | 套件描述 |

---

## Library 發佈至 npm registry

完成設定後，執行：
```bash
npm publish
```

即可將 Library 發佈至 npm，供其他專案下載使用。

---

### 核心重點
- 使用 Angular CLI 建立 Library，並在 `public-api.ts` 匯出元件與服務。
- 打包後可選擇本地安裝或發佈至 npm。
- 設定 `tsconfig.json` paths 以避免匯入錯誤。
