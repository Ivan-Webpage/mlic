# Angular 監聽大師：@HostListener 裝飾器

## @HostListener 基本介紹

[@HostListener](https://angular.io/api/core/HostListener) 是 Angular 內建的裝飾器，類似於 JavaScript 的 `addEventListener()` 方法，用來監聽 DOM 事件。使用 @HostListener 可以簡化事件監聽的寫法，並且支援多種事件類型。

### 常見事件類型
| 事件名稱       | 說明                     |
|---------------|--------------------------|
| resize        | 視窗大小改變時觸發       |
| input         | input 欄位輸入時觸發     |
| change        | input 值改變時觸發       |
| focus         | input 聚焦時觸發         |
| blur          | input 失焦時觸發         |
| keydown       | 鍵盤按下時觸發           |
| keypress      | 鍵盤按鍵持續按下時觸發   |
| keyup         | 鍵盤按鍵釋放時觸發       |
| compositionstart | 輸入法開始組字時觸發 |
| compositionend   | 輸入法結束組字時觸發 |
| click         | 滑鼠點擊時觸發           |
| dblclick      | 滑鼠雙擊時觸發           |
| mouseenter    | 滑鼠進入元素範圍時觸發   |
| mouseleave    | 滑鼠離開元素範圍時觸發   |
| mouseover     | 滑鼠懸停在元素上時觸發   |
| mouseout      | 滑鼠移出元素時觸發       |

### @HostListener 基本語法
```typescript
@HostListener(eventName, args)
myFunction(){
  // 事件觸發後執行的內容
}
```

---

## @HostListener 參數與範例

@HostListener 裝飾器有兩個參數：`eventName` 與 `args`。
- `eventName`：必填，事件名稱（如 click、resize）。
- `args`：選填，事件物件或其他參數。

範例：
```typescript
@HostListener('click', ['$event']) // 常見用法
myFunction(getEvent: any){
  console.log(getEvent);
}
```

事件物件中包含許多資訊，例如：
```json
{
  "isTrusted": true,
  "clientX": 137,
  "clientY": 51,
  "button": 0,
  "cancelable": true
}
```

---

## 檢驗與監控工具

可以透過以下方式監控事件：
1. 在 HTML 中綁定事件，並在 TS 檔案中使用 @HostListener。
2. 在事件觸發後，於 console 中輸出事件物件，檢查屬性。

範例 HTML：
```html
<div>目前事件：{{action}}</div>
<input />
```

範例 TS：
```typescript
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  action = "";

  @HostListener('resize', ['$event'])
  @HostListener('input', ['$event'])
  @HostListener('click', ['$event'])
  monitor(event: any){
    this.action = event.type;
    console.log(event);
  }
}
```

---

## 綜合範例：多事件監聽

```typescript
export class TestComponent {
  action = "";

  constructor(){}

  @HostListener("resize", ["$event"])
  @HostListener("input", ["$event"])
  @HostListener("change", ["$event"])
  @HostListener("focus", ["$event"])
  @HostListener("blur", ["$event"])
  @HostListener("keydown", ["$event"])
  @HostListener("keyup", ["$event"])
  @HostListener("compositionstart", ["$event"])
  @HostListener("compositionend", ["$event"])
  @HostListener("click", ["$event"])
  @HostListener("dblclick", ["$event"])
  @HostListener("mouseenter", ["$event"])
  @HostListener("mouseleave", ["$event"])
  @HostListener("mouseover", ["$event"])
  @HostListener("mouseout", ["$event"])
  monitor(event: any){
    this.action = event.type;
    console.log(event);
  }
}
```

---

## 方法註解與最佳實務

```typescript
/**
 * @param who 事件名稱
 * @param event 事件物件
 * @memberof ChildComponent
 */
monitor(who: string, event: any){
  this.action = who;
  console.log("事件：" + who);
  console.log(event);
}
```

### 最佳實務
- 使用 @HostListener 取代 HTML 綁定事件，讓程式碼更集中。
- 對於多事件監聽，可以統一使用一個方法處理，並透過參數判斷事件類型。
- 在 console 中檢查事件物件，確認屬性是否符合需求。
