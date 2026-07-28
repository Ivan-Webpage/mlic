# 用 `*ngFor` 產生目錄：巢狀資料渲染與子元件拆分

## 需求與目標

在之前的 Directive 文章中，我們介紹過 Structural Directive 的 [`*ngFor`](https://angular.io/api/common/NgFor)。這次延伸：在文章頁中要顯示**目錄**（catalogs），例如：

```
Java教學
1. 型態
2. 變數與運算
3. 物件導向
  3.1 建構子
  3.2 封裝
  3.3 繼承
  3.4 多型
4. 兩類框架
...
Angular教學
1. 生命週期
2. component元件
```

對應的資料物件（簡化後）：

```json
{
  "title": "Java教學",
  "subTitle": [
    { "title": "型態", "subTitle": [] },
    { "title": "變數與運算", "subTitle": [] },
    { "title": "物件導向", "subTitle": [
      { "title": "建構子", "subTitle": [] },
      { "title": "封裝", "subTitle": [] },
      { "title": "繼承", "subTitle": [] },
      { "title": "多型", "subTitle": [
        { "title": "什麼是多型", "subTitle": [] },
        { "title": "與其他語言比較", "subTitle": [] }
      ] }
    ] },
    { "title": "兩類框架", "subTitle": [] }
  ]
}
```

---

## 僅用 `*ngFor` 的直覺寫法

若一口氣在同一個 HTML 裡處理所有層級，會變成多重巢狀 `*ngFor`：

```html
<!-- 假設父層資料陣列叫 data -->
<div *ngFor="let data of datas">
  {{ data.title }}
  <div *ngFor="let subdata1 of data.subTitle">
    {{ subdata1.title }}
    <div *ngFor="let subdata2 of subdata1.subTitle">
      {{ subdata2.title }}
      <div *ngFor="let subdata3 of subdata2.subTitle">
        {{ subdata3.title }}
        <!-- 可能還有更多層... -->
      </div>
    </div>
  </div>
</div>
```

**問題：**
1. HTML 結構過度巢狀、難維護。
2. 若層級稍微調整或增減，需同時改動多個 `*ngFor`，易出錯。

---

## 改善思路：拆成子元件

使用 Component 的 `@Input` / `@Output` 溝通機制，將「**一層資料渲染**」抽成子元件，父元件只需傳入陣列即可。流程：
1. 建一個子元件（假設名：`catalogs`）。
2. 父元件在畫面放一個 `<app-catalogs>`。
3. 用 `@Input() catalogs` 把資料陣列丟給子元件。

---

## 子元件 `catalogs` 實作

**catalogs.component.ts**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent {
  @Input() catalogs: any[] = []; // 主要是加上這行
}
```

**catalogs.component.html**
```html
<!-- 只處理一層 *ngFor -->
<ul>
  <li *ngFor="let catalog of catalogs">
    {{ catalog.title }}
    <!-- 把子目錄交給另一個子元件處理（自己）：app-catalogs -->
    <app-comments [catalogs]="catalog.subTitle" *ngIf="catalog.subTitle?.length"></app-comments>
  </li>
</ul>
```

> 註：若希望統一用同一個元件遞迴顯示，可改成 `<app-catalogs [catalogs]="catalog.subTitle"></app-catalogs>` 讓元件自我遞迴（需再處理 selector 與匯入）。

---

## 父元件：提供資料並引入子元件

**father.component.ts**（摘要）
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss']
})
export class FatherComponent {
  catalogs = [
    {
      title: 'Java教學',
      subTitle: [
        { title: '型態', subTitle: [] },
        { title: '變數與運算', subTitle: [] },
        { title: '物件導向', subTitle: [
          { title: '建構子', subTitle: [] },
          { title: '封裝', subTitle: [] },
          { title: '繼承', subTitle: [] },
          { title: '多型', subTitle: [
            { title: '什麼是多型', subTitle: [] },
            { title: '與其他語言比較', subTitle: [] }
          ] }
        ] },
        { title: '兩類框架', subTitle: [] },
      ]
    },
    {
      title: 'Angular教學',
      subTitle: [
        { title: '生命週期', subTitle: [] },
        { title: 'component元件', subTitle: [] }
      ]
    }
  ];
  constructor() {}
}
```

**father.component.html**
```html
<app-catalogs [catalogs]="catalogs"></app-catalogs>
```

---

## 這樣拆分的好處

- **易維護**：每個元件只處理自己的層級，結構更乾淨。
- **可擴充**：要增加/減少層級，改動集中在子元件邏輯。
- **可重用**：同一個子元件可於多處呈現目錄。

### 實作步驟摘要
1. 先 `ng g c catalogs` 建子元件。
2. 在子元件加入 `@Input() catalogs`。
3. 在子元件 HTML 中以單一層 `*ngFor` 呈現，下一層再交給子元件遞迴或另一個元件。
4. 在父元件準備 `catalogs` 陣列，並在 HTML 放入 `<app-catalogs>`。

---

## 延伸：資料結構建議

若目錄層級很多，建議統一資料結構：

```ts
interface CatalogItem {
  title: string;
  subTitle: CatalogItem[];
}
```

並在子元件中以**型別保護**與**空陣列預設**降低防呆成本：

```ts
@Input() catalogs: CatalogItem[] = [];
```

---

### 小結
- 巢狀資料請**避免在單一 HTML 中層層 `*ngFor`**，改以**子元件遞迴/拆分**呈現。
- `@Input()` 是串接父/子元件資料的關鍵；必要時可加入 `@Output()` 回傳點擊事件等互動。
- 若要自我遞迴：將 `app-catalogs` 改為顯示後再呼叫自己，並留心 `NgModule` 宣告、`selector` 與匯入循環問題。
