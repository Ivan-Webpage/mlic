# Angular Directive 實戰：輸入格式化與事件監聽

## Directive 基本介紹

Directive 是 Angular 中用來擴充 HTML 標籤功能的工具，分為兩類：
- **Structural Directive**：控制 DOM 結構（如 `*ngIf`、`*ngFor`）。
- **Attribute Directive**：改變元素外觀或行為（如 `ngClass`、`ngStyle`）。

官方文件：[Angular Built-in Directives](https://angular.io/guide/built-in-directives)

### Attribute vs Structural 差異
| Attribute | Structural |
|-----------|-----------|
| 改變元素外觀 | 改變 DOM 結構 |
| 例如 ngClass | 例如 *ngIf、*ngFor |

建立 Directive 的基本語法：
```typescript
import { Directive } from '@angular/core';

@Directive({
  selector: '[appTest]',
})
export class TestDirective {}
```

---

## Directive 與 @HostListener

@HostListener 是 Angular 提供的裝飾器，用來監聽 DOM 事件，類似 `addEventListener()`。

### 常見事件
- click
- keyup
- keydown
- keypress

### Directive 中使用 @HostListener
```typescript
import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[appTest]' })
export class TestDirective {
  constructor(private ngCtl: NgControl, private elmRf: ElementRef) {}

  /** 取得 input value */
  get inputValue() {
    return this.nativeEl.value;
  }

  /** 取得 input element */
  get nativeEl() {
    return this.elmRf.nativeElement;
  }
}
```

---

## 手機號碼格式化需求

需求：輸入手機號碼時，自動格式化為 `XXXX-XXX-XXX`。

### 思路
- 監聽 keyup 事件
- 檢查輸入內容並格式化
- 更新 input 顯示值

---

## 事件監聽與輸入檢查

```typescript
@HostListener('click')
onClickInit() {
  if (this.inputValue.length === 0) {
    this.ngCtl.valueAccessor.writeValue('＿＿＿＿-＿＿＿-＿＿＿');
    this.nativeEl.setSelectionRange(0, 0, 'none');
  }
}

@HostListener('keyup')
onKeyUpInit() {
  this.onInputChange(this.inputValue);
}
```

---

## 輸入檢查與格式化邏輯

```typescript
/**
 * @param value 使用者輸入內容
 */
onInputChange(value: string) {
  let newVal = value.replace(/\D/g, ''); // 去除非數字
  let selectPoint = newVal.length; // 游標位置

  switch (newVal.length) {
    case 0:
      newVal = '＿＿＿＿-＿＿＿-＿＿＿';
      break;
    case 1:
      newVal = newVal.replace(/^(\d{0,4})/, '$1＿＿-＿＿＿-＿＿＿');
      break;
    case 2:
      newVal = newVal.replace(/^(\d{0,4})/, '$1＿＿-＿＿＿-＿＿＿');
      break;
    case 3:
      newVal = newVal.replace(/^(\d{0,4})/, '$1＿＿-＿＿＿-＿＿＿');
      break;
    case 4:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})/, '$1-$2＿＿-＿＿＿');
      selectPoint += 1;
      break;
    case 5:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})/, '$1-$2＿＿-＿＿＿');
      selectPoint += 1;
      break;
    case 6:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})/, '$1-$2-＿＿＿');
      selectPoint += 1;
      break;
    case 7:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(\d{0,3})/, '$1-$2-$3＿＿');
      selectPoint += 1;
      break;
    case 8:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(\d{0,3})/, '$1-$2-$3＿');
      selectPoint += 2;
      break;
    case 9:
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(\d{0,3})/, '$1-$2-$3');
      selectPoint += 2;
      break;
    default:
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(\d{0,3})/, '$1-$2-$3');
      selectPoint = 10;
      break;
  }

  // 更新 input 顯示值
  this.ngCtl.valueAccessor.writeValue(newVal);
  this.ngCtl.control.setValue(newVal);
  this.nativeEl.setSelectionRange(selectPoint, selectPoint, 'none');
}
```

---

## 完整 Directive 程式碼

```typescript
import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[appTest]' })
export class TestDirective {
  constructor(private ngCtl: NgControl, private elmRf: ElementRef) {}

  @HostListener('click')
  onClickInit() {
    if (this.inputValue.length === 0) {
      this.ngCtl.valueAccessor.writeValue('＿＿＿＿-＿＿＿-＿＿＿');
      this.nativeEl.setSelectionRange(0, 0, 'none');
    }
  }

  @HostListener('keyup')
  onKeyUpInit() {
    this.onInputChange(this.inputValue);
  }

  onInputChange(value: string) {
    // 格式化邏輯（同上）
  }

  get inputValue() {
    return this.nativeEl.value;
  }

  get nativeEl() {
    return this.elmRf.nativeElement;
  }
}
```

---

## 使用 Directive

在父元件中使用剛剛建立的 Directive：

```typescript
@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss']
})
export class FatherComponent {
  getValue: string;
}
```

HTML：
```html
<input appTest [(ngModel)]="getValue" />
```

---

## FormsModule 設定

在 `app.module.ts` 中加入：

```typescript
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
```

---

## 最佳實務

- 使用 Directive 封裝輸入檢查與格式化，避免在 Component 中重複撰寫。
- 善用 @HostListener 監聽事件，集中管理邏輯。
- 對於複雜格式化需求，建議封裝成獨立方法，並保持程式碼可讀性。

---

## 結論

Directive 是 Angular 中強大的工具，能讓我們將輸入檢查、格式化、事件監聽等邏輯集中管理，提升程式碼維護性與可讀性。
