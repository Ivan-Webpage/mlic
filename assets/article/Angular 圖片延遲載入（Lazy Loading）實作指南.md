# Angular 圖片延遲載入（Lazy Loading）實作指南

## 為什麼需要 Lazy Loading

當頁面有大量圖片時，若一次載入所有圖片，會造成：
- **效能問題**：頁面初始載入時間過長。
- **流量浪費**：使用者未必會瀏覽到所有圖片。

解決方案：**Lazy Loading** 只在圖片進入可視範圍時才載入，減少不必要的資源消耗。

### 核心技術
- 使用 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 監控元素是否進入視窗。
- 將圖片的真實路徑放在 `data-src` 屬性，初始 `src` 可為空或預設佔位圖。
- 當圖片進入視窗時，將 `data-src` 的值賦給 `src`，完成載入。

---

## HTML 設定

```html
<!-- 預留圖片位置 -->
<div style="width: 100px; height: 200px;"></div>

<!-- Lazy Loading 圖片 -->
<img class="lazy" data-src="assets/fatimg.png" />
```

> 將圖片的真實路徑放在 `data-src`，並加上 `class="lazy"` 作為標記。

---

## Component 設定 Intersection Observer

**test.component.ts**
```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
})
export class TestComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // 建立 IntersectionObserver
    const watcher: IntersectionObserver = new IntersectionObserver(
      this.onEnterView
    );

    // 抓取所有 class 為 lazy 的 img
    const lazyImages: NodeListOf<Element> =
      document.querySelectorAll("img.lazy");

    lazyImages.forEach((img) => {
      watcher.observe(img); // 開始監控
    });
  }

  // 當圖片進入視窗範圍時觸發
  onEnterView(entries, observer) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.setAttribute("src", img.dataset.src); // 將 data-src 賦值給 src
        observer.unobserve(img); // 停止監控已載入的圖片
      }
    }
  }
}
```

---

### 核心重點
- **IntersectionObserver**：監控元素是否進入視窗。
- **data-src**：存放圖片真實路徑，避免初始載入。
- **observer.unobserve()**：載入後停止監控，提升效能。
