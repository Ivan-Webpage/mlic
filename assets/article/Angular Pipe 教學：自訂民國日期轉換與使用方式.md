# Angular Pipe 教學：自訂民國日期轉換與使用方式

## Pipe 概念與內建範例

在 Angular 中，**Pipe** 用來在**資料顯示階段**進行格式化（transform），常見內建管線包含：
- `DatePipe`：時間格式轉換
- `CurrencyPipe`：貨幣（含千分位）

官方文件：<https://angular.io/guide/pipes>

Pipe 的核心就是實作 `transform()` 方法，將輸入值轉換後回傳。

### 建立自訂 pipe（指令）

```bash
ng g p test  # 產生名為 test 的 Pipe，Class 會自動變成 TestPipe
```

產生後的基本骨架：

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'test' })
export class TestPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value;
  }
}
```

---

## 建立「民國日期」 Pipe 與邏輯

需求很常見：將使用者給的西元日期，顯示為**民國年（西元年 − 1911）**格式，例如 `民國112年12月31日 23時59分00秒`。

同時也要考慮：
- 使用者可能給 **string** 或 **Date**（或錯誤字串），需能**容錯**。
- 轉換失敗時不要讓畫面崩潰，至少以字串回傳、或提示錯誤。

**範例 `roc-date.pipe.ts`：**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rocDate' })
export class RocDatePipe implements PipeTransform {
  /**
   * 將西元 Date 物件/字串轉為民國日期字串
   */
  transform(value: string | Date): string {
    let getDate: Date;

    // 將字串轉為 Date，並處理不合法字串
    if (typeof value === 'string') {
      try {
        getDate = new Date(value); // 可能拋例外或變 Invalid Date
      } catch (e) {
        console.log(e);
        return value.toString(); // 原資料不可解析則原樣輸出
      }
    } else {
      getDate = value;
    }

    // 無法解析的情況（Invalid Date）
    if (isNaN(getDate.getTime())) {
      return value?.toString() ?? '';
    }

    const year = getDate.getFullYear() - 1911; // 西元轉民國
    const mm = getDate.getMonth() + 1;
    const dd = getDate.getDate();
    const hh = getDate.getHours();
    const mi = getDate.getMinutes();
    const ss = getDate.getSeconds();

    return `民國${year}年${mm}月${dd}日 ${hh}時${mi}分${ss}秒`;
  }
}
```

---

## 在元件中使用 Pipe

只要在元件內準備要顯示的日期資料，例如：

**`father.component.ts`**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss']
})
export class FatherComponent {
  today: Date = new Date();
  constructor() {}
}
```

在 HTML 以「**值 | pipe名稱**」的語法使用：

**`father.component.html`**
```html
<div>{{ today | rocDate }}</div>
<!-- or: <div>{{ '2025-12-26T23:59:00' | rocDate }}</div> -->
```

> 記得將 `RocDatePipe` 加入對應的 `NgModule` 的 `declarations`（或在 Library/Standalone 架構下正確匯出/匯入），否則模板無法識別。

---

### 小結
- Pipe 用於**模板顯示階段**的資料轉換，核心為 `transform()`。
- 自訂 Pipe 能封裝企業常用格式（例如民國日期），並以簡潔語法在模板中使用。
- 注意**型別與容錯**：字串與 `Date` 都要能處理；遇到不合法輸入，至少回傳可顯示的字串，避免畫面壞掉。
