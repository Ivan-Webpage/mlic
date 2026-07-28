# Angular Component 父子資料傳遞：@Input() 與 @Output() 全攻略

## 基本概念與語法

在 Angular 中，component 之間的資料傳遞主要透過：
- **@Input()**：父 → 子（由父元件將資料傳入子元件）
- **@Output()**：子 → 父（由子元件向父元件輸出事件或資料）

在 HTML 模板中，綁定語法對應如下：

```html
<!-- 屬性綁定：@Input -->
<my-test [dataIn]="A" [dataOut]="B" [dataInOut]="C"></my-test>
```

> 其中 `dataIn` 是子元件宣告的 `@Input()` 欄位；若父元件使用 `[dataIn]`，代表以**屬性綁定**傳入值。

**子元件宣告範例：**
```typescript
// my-test.component.ts（子元件）
@Input() dataIn!: any;          // 接收父元件傳入的值
@Output() dataOut!: EventEmitter<any>; // 由子元件往外輸出事件/資料
```

> 若父元件以字串常值方式綁定（例如 `dataIn="A"`），需在子元件中對應宣告該欄位（`@Input() dataIn`），否則會出現屬性不存在的錯誤。

---

## 單向與雙向綁定、命名慣例

### 單向綁定
父元件只把值傳給子元件（`@Input`）：
```html
<my-test [dataOut]="B"></my-test>
```

也可傳入**函式呼叫**作為輸出欄位的值（但仍是屬性綁定的形式）：
```html
<my-test [dataOut]="myfunction()"></my-test>
```

> 備註：上例只是將函式**回傳值**當成屬性值傳入，並非 `@Output` 的事件回傳；`@Output` 應以 `EventEmitter` 的 `emit()` 通知父元件。

### 雙向綁定
若要在子元件內改動資料、並反映回父元件，可使用 **雙向綁定** 語法（`[(...)]`）。

```html
<my-test [(data)]="C"></my-test>
```

**命名慣例：**雙向綁定需要 `@Input()` 與 `@Output()` **同名**（欄位名 + `Change`），例如：
```typescript
// 子元件 my-test.component.ts
import { Input, Output, EventEmitter } from '@angular/core';

@Input() data!: any;
@Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
```

父元件即可使用：
```html
<my-test [(data)]="C"></my-test>
```

> 若 `@Output()` 欄位名稱**不是** `dataChange`，Angular 無法推斷雙向綁定對應，`[(data)]` 會失敗。

---

## 字串/數字傳入、函式作為值、@Output 事件

### 字串與數字
- 字串常值：`dataIn="A"`（用引號包起來）
- 數字常值：`[dataIn]="1"`（需屬性綁定，直接給數字字面量）

```html
<my-test dataIn="A"></my-test>   <!-- 字串 -->
<my-test [dataIn]="1"></my-test> <!-- 數字：用屬性綁定 -->
```

若以函式作為屬性值：
```html
<my-test [dataIn]="myfunction()"></my-test>
```
上例表示把 `myfunction()` 的**回傳值**傳入 `dataIn`；若函式沒有回傳值，會以 `null`（或 `undefined`）傳入。

### @Output：事件往外送
在子元件內需要建立 `@Output()` 欄位並於適當時機 `emit()`：

```typescript
// 子元件 my-test.component.ts
@Output() dataOut = new EventEmitter<any>();

someAction() {
  this.dataOut.emit('B'); // 由子元件向父元件輸出事件/資料
}
```

父元件接收事件：
```html
<!-- 事件綁定：() -->
<my-test (dataOut)="onChildEmit($event)"></my-test>
```

> 一般不建議把 `@Output` 欄位同時用作屬性值（例如 `[dataOut]="B"`），正確用法是**事件綁定** `()` 來接收子元件 `emit()` 的資料。

---

### 小結
- `@Input()`：父 → 子，屬性綁定：`[prop]`；字串常值可用 `prop="text"`。
- `@Output()`：子 → 父，事件綁定：`(event)`；於子元件 `emit()` 通知父元件。
- **雙向綁定** `[(prop)]` 需要 `@Input() prop` 與 `@Output() propChange` **成對**。
- 函式做為屬性值時，傳入的是**回傳值**；無回傳則為 `null/undefined`。
