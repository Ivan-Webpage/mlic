# Angular：使用 MatDialog 實作 Loading 與 Message 遮罩

## 需求背景與整體思路

相較在專案寫很多個地方時，不容易找下發，這邊整理：畫面會出現一個「圖層」的彈窗（依不同設計而不同）。此處因需要依照前端與後端的設計資料作為參考。一般情況，建議在整體畫面都會顯示且固定位置；現在畫面是透明的，使用者在畫面上僅能做基本的程式操作與按鈕控制，無法與其他地方互動。此遮罩可用在大量資料時，或資料讀取中，避免誤操作。

我們先準備一個 `dialog-loading` 組件，之後會在各流程中呼叫它作為 Loading 遮罩。

---

## app.module 必要套件設置

### 必要套件
若尚未安裝 `@angular/material` 與 `@angular/cdk`，請先安裝（版本需與目前 Angular 相容）：

```bash
npm install @angular/material
npm install @angular/cdk
```

### 加入套件與 Component

請在 `app.module.ts` 加入以下設定，才能正常使用對話框與動畫：

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogLoadingComponent } from '../components/dialog-loading/dialog-loading.component'; // 請依你的實際路徑

@NgModule({
  declarations: [
    DialogLoadingComponent, // 建立在 components 時，Angular 會自動加入
  ],
  imports: [
    BrowserAnimationsModule, // 必須加上
    MatDialogModule,         // 必須加上
  ],
  entryComponents: [
    DialogLoadingComponent,  // 早期 Angular 版本需加上
  ],
})
export class AppModule {}
```

---

## dialog-message 樣式與邏輯

### `dialog-message.component.scss`

```css
.cover {
  position: fixed;
  z-index: 9998;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: start;
}

.message-box {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px 0 0 10px;
}
```

### `dialog-message.component.ts`
> 使用 `MAT_DIALOG_DATA` 接收外部傳入資料，讓同一個元件可顯示不同訊息。

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.scss'],
})
export class DialogMessageComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {}
}
```

---

## API 逾時處理與訊息彈窗

在正式的服務中，避免過度依賴多重 `catchError()`。這裡示範於請求逾時或錯誤時，開啟 `DialogMessageComponent` 顯示簡要訊息。

```typescript
).pipe(
  timeout(300000), // API 請求逾時（5 分鐘）
  map((source: any) => {
    // 監控後端回傳訊息
    const bodyData = source[0].body;
    if (bodyData.message !== 'OK') {
      this.dialog.cover_open('DialogMessageComponent', 5000, {
        title: '出現異常！',
        message: bodyData.message, // 顯示後端提供的錯誤訊息
      });
    }
    return source[0].body;
  }),
  catchError((error) => {
    this.dialog.cover_close('DialogLoadingComponent'); // 關閉遮罩
    this.dialog.cover_open('DialogMessageComponent', 5000, {
      title: error.statusText,
      message: error.message,
    });
    return throwError(() => error);
  }),
  finalize(() => {
    this.dialog.cover_close('DialogLoadingComponent'); // 關閉遮罩
  })
);
```

> 建議仍保留「出現異常、請稍後再試」等友善字樣；錯誤訊息盡量由後端回傳，前端只做展示。

---

## 使用與封裝：基礎開關方法

以下提供示範架構，將**遮罩開啟**與**遮罩關閉**封裝為 `cover_open()`、`cover_close()` 方法：

```typescript
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogLoadingComponent } from '../components/dialog-loading/dialog-loading.component';

constructor(private dialog: MatDialog) {}

// 開啟遮罩
cover_open(): void {
  let loadingDialogRef: MatDialogRef<any>;
  loadingDialogRef = this.dialog.open(DialogLoadingComponent);
  setTimeout(() => {
    if (loadingDialogRef.getState() === 0) {
      this.cover_close();
    }
  }, 3000);
}

// 關閉遮罩
cover_close(): void {
  // 依你的情境保存/取得 ref 後 close
}
```

---

## 在 app.module.ts 中加入 DialogMessageComponent

```typescript
import { DialogMessageComponent } from './dialog-message/dialog-message.component';

@NgModule({
  declarations: [
    ...,
    DialogMessageComponent, // 建立在 components 時，會自動加入
  ],
  entryComponents: [
    ...,
    DialogLoadingComponent, // 早期 Angular 版本需加上
  ],
})
export class AppModule {}
```

---

## 建立中控 Service：`dialog.service.ts`

將 Loading 與 Message 統一透過 Service 管理，便於在任何地方呼叫。

```typescript
import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogLoadingComponent } from './dialog-loading/dialog-loading.component';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * 開啟遮罩／訊息 Dialog（依 id 決定要開哪一種）
   */
  cover_open(id: string, timeout: number = 300000, data?: object): void {
    const dialogRef: MatDialogRef<object> = this.dialog.open(
      this.getClassFactory(id), { id, data }
    );

    // 保險：逾時自動關閉
    setTimeout(() => {
      const openedRef = this.dialog.getDialogById(id);
      if (openedRef) {
        openedRef.close();
      }
    }, timeout);
  }

  /** 指定 id 關閉 Dialog */
  cover_close(id: string): void {
    const ref = this.dialog.getDialogById(id);
    if (ref) ref.close();
  }

  /** 依 id 取得對應 Component 類型（Simple Factory） */
  private getClassFactory(id: string): ComponentType<object> {
    switch (id) {
      case 'DialogLoadingComponent':
        return DialogLoadingComponent;
      case 'DialogMessageComponent':
        return DialogMessageComponent;
      default:
        return DialogLoadingComponent;
    }
  }
}
```

---

## Service 內進階補充與範例

- `afterAllClosed: Observable<void>`：所有 dialog 關閉時觸發。
- `openDialogs: MatDialogRef<any>[]`：目前所有開啟中的 dialogs。

查看所有開閉中的 dialogs：

```typescript
console.log(this.dialog.openDialogs);
```

開啟時指定 `id` 與 `data`，方便後續單獨關閉與傳值：

```typescript
const ref = this.dialog.open(this.getClassFactory(id), {
  id,
  data, // 由目標 Dialog 組件的 MAT_DIALOG_DATA 接收
});
```

---

## API 範例：載入與錯誤流程

只要在 API 前先開一個 `DialogLoadingComponent` 畫面，後續若成功或出現錯誤，都會自動關閉；若錯誤則再打開 `DialogMessageComponent` 提示 5 秒後自動關閉。

```typescript
this.dialog.cover_open('DialogLoadingComponent'); // 打開遮罩

this.http.post('https://marketingliveincode.com/api/1', {}, {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response',
})
.pipe(
  timeout(300000),
  map((source: any) => source[0].body),
  catchError((error) => {
    this.dialog.cover_close('DialogLoadingComponent');
    this.dialog.cover_open('DialogMessageComponent', 5000, {
      title: error.statusText,
      message: error.message,
    });
    return throwError(() => error);
  }),
  finalize(() => {
    this.dialog.cover_close('DialogLoadingComponent');
  }),
)
.subscribe();
```

---

## Loading 組件樣板

### `dialog-loading.component.html`

```html
<div class="cover">
  <img src="assets/loading-cover-image.svg" width="150" height="150" />
</div>
```

### `dialog-loading.component.css`

```css
.cover {
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

## dialog-message 樣板

### `dialog-message.component.html`

```html
<div class="cover">
  <div class="message-box">
    <h3>{{ data.title }}</h3>
    <p>{{ data.message }}</p>
  </div>
</div>
```

---

## 備註與最佳實務

- **逾時保護**：`cover_open()` 內使用 `setTimeout()`，預設 **300 秒（5 分鐘）** 自動關閉，避免 API 永遠無回應導致介面一直被遮住。
- **Service 化**：以 `DialogService` 統一管理，方便在任何 `component` 或其他服務中呼叫。
- **常見兩種情境**：
  1. **Loading 遮罩**：進入系統或資料讀取中。
  2. **Message 提示**：顯示結果或異常訊息。
- **以 id 管理 Dialog**：`MatDialog.getDialogById(id)` 取得並關閉指定彈窗；`openDialogs` 可觀察目前所有開啟中的 dialogs；`afterAllClosed` 可監聽全關閉事件。
