# Angular 非同步處理：使用 async 與 await 管理執行順序

## 範例前準備

以下程式需要先 import 相關套件，並在 constructor 宣告，才能進行後續範例。

```typescript
import { HttpClient } from '@angular/common/http';
constructor(private http: HttpClient) {}
```

### app.module.ts 中需加入 HttpClientModule

```typescript
import { HttpClientModule } from '@angular/common/http'; // 加入這行

@NgModule({
  imports: [
    HttpClientModule // 加入這行
  ]
})
```

---

## 典型的非同步問題

現在的系統都會有前後端 API 溝通的需求，前端通常透過 API 取得資料。以下是 Angular 中使用 API 的範例：

```typescript
ngOnInit(): void {
  var result1;
  this.http.get('https://marketingliveincode.com/api/1').subscribe(data => {
    result1 = data; // 取得第一次 API 回傳的結果
  });
}
```

---

## 多層非同步請求

當有多個 API 需要依序執行時，若直接巢狀撰寫，會造成程式碼難以維護：

```typescript
ngOnInit(): void {
  var result;
  this.http.get('https://marketingliveincode.com/api/1').subscribe(data1 => {
    this.http.post('https://marketingliveincode.com/api/2', { 'sendData': data1 }).subscribe(data2 => {
      this.http.post('https://marketingliveincode.com/api/3', { 'sendData': data2 }).subscribe(data3 => {
        this.http.post('https://marketingliveincode.com/api/4', { 'sendData': data3 }).subscribe(data4 => {
          this.http.post('https://marketingliveincode.com/api/5', { 'sendData': data4 }).subscribe(data5 => {
            this.http.post('https://marketingliveincode.com/api/6', { 'sendData': data5 }).subscribe(data6 => {
              result = data6; // 最終取得結果
            });
          });
        });
      });
    });
  });
}
```

---

## 使用 Async 與 Await

Async 與 Await 可以讓程式碼看起來像同步執行，避免巢狀結構：

```typescript
ngOnInit(): void {
  this.init();
}

async init() {
  await this.callApi();
  console.log('我在 API 但順序有執行');
}
```

---

## API 與 Promise

```typescript
callApi(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.http.get('https://marketingliveincode.com/api/1').subscribe(data => {
      console.log('API 請求完成');
      resolve(true); // 完成後回傳
    });
  });
}
```

### 完整範例：

```typescript
ngOnInit(): void {
  this.init();
}

async init() {
  var data = await this.callApi();
  await this.callApi2(data);
  console.log('API 請求完成');
}

callApi(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get('https://marketingliveincode.com/api/1').subscribe(data => {
      resolve(data);
    });
  });
}

callApi2(data): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.http.post('https://marketingliveincode.com/api/2', { 'sendData': data }).subscribe(() => {
      resolve(true);
    });
  });
}
```

---

## 巢狀請求問題與改善

若直接巢狀撰寫，容易出現變數未定義或錯誤，以下是改善方式：

```typescript
ngOnInit(): void {
  var result;
  this.http.get('https://marketingliveincode.com/api/1').subscribe(data1 => {
    this.http.post('https://marketingliveincode.com/api/2', { 'sendData': data1 }).subscribe(data2 => {
      result = data2; // 第二次 API 回傳結果
    });
  });
}
```

### 改善方式：使用 Async/Await

```typescript
async init() {
  var data = await this.callApi1();
  await this.callApi2(data);
  console.log('API 請求完成');
}
```

---

## 最佳實務與結論

- 使用 Async/Await 可讓程式碼更易讀，避免巢狀結構。
- 將 API 請求封裝成 Promise，並在 Async function 中使用 await。
- 避免在 UI 邏輯中直接撰寫多層 subscribe，應集中管理 API 請求。

**重點：**
- 非同步處理是現代前端必備技能，尤其在 Angular 中，API 請求幾乎都需要非同步。
- 良好的程式結構能降低維護成本，並提升可讀性。
