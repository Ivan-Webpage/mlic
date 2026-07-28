# Angular Services：封裝 API 呼叫、HttpHeaders 與 RxJS 管線

## 為什麼要用 Service

在 Angular 應用中，**Service** 用來承載跨元件共用的邏輯，例如：**資料請求**、**狀態管理**、**工具方法**。把 API 邏輯集中在 Service，可讓 Component 專注在畫面與互動，提升**維護性**與**測試性**。

> 官方文件參考：Angular Services 與 DI 架構（Architecture - Services）。

建立 Service 指令：

```bash
ng g s test  # 產生 test.service.ts（Class 名稱為 TestService）
```

產生檔案基本骨架：

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor() {}
}
```

---

## 準備工作：匯入 HttpClient 與 RxJS

在要使用 API 的 Service 中，需先**匯入 HttpClient** 並於 `app.module.ts` **加入 `HttpClientModule`**。

**test.service.ts** 必要匯入：

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { finalize, catchError, timeout, map } from 'rxjs/operators';
import { DialogService } from '../services/dialog.service';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient, private dialog: DialogService) {}
}
```

**app.module.ts**：

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule // 加入這行
  ]
})
export class AppModule {}
```

---

## 設計 API Service：Header 與 Token

集中處理 `HttpHeaders` 生成，並預留把 **JWT Token** 放入 Header 的擴充點：

```typescript
private make_header(): Object {
  const header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // 例如：從 localStorage 讀取 token
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    // 常見寫法：Authorization: Bearer <token>
    return {
      headers: header.set('Authorization', `Bearer ${jwt}`),
      observe: 'response' as 'response',
      responseType: 'json' as 'json',
    };
  }

  // 沒有 token 的預設
  return {
    headers: header,
    observe: 'response' as 'response',
    responseType: 'json' as 'json',
  };
}
```

---

## 封裝請求流程：開關遮罩與逾時、例外處理

在送出 API 前開啟 Loading 遮罩，結束時關閉；並以 RxJS 管線統一處理：`timeout()`、`map()`、`catchError()`、`finalize()`。

```typescript
requestT(url: string, type: 'get' | 'post' = 'get', data: Object = {}): Observable<any> {
  this.dialog.cover_open('DialogLoadingComponent'); // 打開遮罩

  let req: Observable<any>;
  req = type === 'post' ? this.post_request(url, data) : this.get_request(url);

  return req.pipe(
    timeout(300000), // API 請求逾時（5分鐘）
    map((source: any) => {
      const body = source[0]?.body ?? source.body ?? source; // 視後端結構而定
      if (body?.message !== 'OK') {
        console.log('出現錯誤訊息');
      }
      return body;
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
}
```

---

## 拆分 get/post 方法與統一入口

將 `get` 與 `post` 實作獨立為 **private** 方法，避免元件直接呼叫低層細節；再以 `request()` 作為統一入口。

```typescript
private get_request(url: string): Observable<any> {
  return this.http.get(url, this.make_header());
}

private post_request(url: string, data: Object): Observable<any> {
  return this.http.post(url, data, this.make_header());
}

request(url: string, type: 'get' | 'post' = 'get', data: Object = {}): Observable<any> {
  const req = type === 'post' ? this.post_request(url, data) : this.get_request(url);
  return req.pipe(
    timeout(300000),
    map((source: any) => source[0]?.body ?? source.body ?? source),
    catchError((error) => throwError(() => error)),
    finalize(() => console.log('打 API 結束'))
  );
}
```

---

## 常用 RxJS 管線與用途摘要

| 方法 | 說明 |
|---|---|
| `AsyncPipe` | 模板中直接訂閱 `Observable<string>` 並顯示結果。 |
| `timeout(ms)` | API 一定要設逾時，否則遇到網路不佳會一直卡住。 |
| `map(fn)` | 統一處理回傳資料的解構或轉換。 |
| `catchError(fn)` | 把 Error 拋出或轉成訊息，並觸發 UI 提示。 |
| `finalize(fn)` | 所有管線完成或中斷時做清理（關閉遮罩、記錄 log）。 |

---

## 服務完整程式

**test.service.ts（整合）**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { finalize, catchError, timeout, map } from 'rxjs/operators';
import { DialogService } from '../services/dialog.service';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient, private dialog: DialogService) {}

  requestT(url: string, type: 'get' | 'post' = 'get', data: Object = {}): Observable<any> {
    this.dialog.cover_open('DialogLoadingComponent');
    const req = type === 'post' ? this.post_request(url, data) : this.get_request(url);
    return req.pipe(
      timeout(300000),
      map((source: any) => source[0]?.body ?? source.body ?? source),
      catchError((error) => {
        this.dialog.cover_close('DialogLoadingComponent');
        this.dialog.cover_open('DialogMessageComponent', 5000, {
          title: error.statusText,
          message: error.message,
        });
        return throwError(() => error);
      }),
      finalize(() => this.dialog.cover_close('DialogLoadingComponent'))
    );
  }

  private get_request(url: string): Observable<any> {
    return this.http.get(url, this.make_header());
  }

  private post_request(url: string, data: Object): Observable<any> {
    return this.http.post(url, data, this.make_header());
  }

  private make_header(): Object {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      responseType: 'json' as 'json',
    };
  }
}
```

---

## 在元件中使用 Service

先在元件匯入與注入 Service，接著用 `subscribe()` 送出請求：

```typescript
import { TestService } from './services/test.service';

constructor(private api: TestService) {}

this.api
  .requestT('https://marketingliveincode.com/api/1', 'post', {})
  .subscribe((response) => {
    console.log(response);
  });
```

---

## 小結與實務建議

- **集中 API 邏輯**在 Service，Component 專心處理 UI 與互動。
- **統一 Header 生成**，方便加入 JWT 或其他認證資訊。
- **RxJS 管線**加上逾時、錯誤提示與清理，避免請求卡住或 UI 不回應。
- 若需顯示 Loading / Error，透過 **DialogService** 開關覆蓋層與訊息視窗。

---

> 延伸：可將 `TestService` 抽象化為 `ApiService`，再以方法或泛型統一處理多種 API；並以 Interceptor 處理共用 Header 與錯誤攔截。
