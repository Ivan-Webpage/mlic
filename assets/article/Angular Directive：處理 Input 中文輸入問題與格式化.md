# Angular Directive：處理 Input 中文輸入問題與格式化

## 中文輸入問題與事件說明

在 Angular 中，使用者進行**中文輸入法組字**時，常見的鍵盤事件行為與一般英文輸入不同。以下是簡要對照表：

| 編號 | 名稱             | 中文輸入是否觸發 | 說明                     |
|------|------------------|------------------|--------------------------|
| 1    | keydown          | Yes              | 一按下鍵盤按鍵就執行     |
| 2    | compositionstart | Yes              | 中文輸入開始             |
| 3    | keypress         | No               | 與 keydown 類似；非文字鍵通常不觸發 |
| 4    | compositionend   | Yes              | 中文輸入結束             |
| 5    | keyup            | Yes              | 在按下鍵盤鍵釋放時執行   |

**解決方案重點：**
- 透過 `compositionstart` 與 `compositionend` 判斷中文輸入的開始與結束。
- 在組字過程（`isComposing = true`）不進行格式化；於結束後再寫入格式化結果。

---

## Directive 基本結構

```typescript
import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[libDateMask]',
})
export class DateMaskDirective {
  /** 是否正在中文輸入 */
  isComposing = false;

  constructor(public ngControl: NgControl, private element: ElementRef) {}

  @HostListener('input', ['$event'])
  onModelChange(event: Event) {}
}
```

---

## 事件監聽與中文輸入處理

```typescript
/** 中文輸入開始 */
@HostListener('compositionstart')
onCompositionStart() {
  this.isComposing = true;
}

/** 中文輸入結束 */
@HostListener('compositionend')
onCompositionEnd() {
  this.isComposing = false;
  this.onInputChange(this.inputValue, false);
}

@HostListener('keydown.backspace')
keydownBackspace() {
  this.onInputChange(this.inputValue, true);
}

@HostListener('click')
onClickInit() {
  if (this.inputValue.length === 0) {
    this.ngControl.valueAccessor.writeValue('__/__/__');
    this.nativeEl.setSelectionRange(0, 0, 'none');
  }
}

@HostListener('blur')
onBlurInit() {
  if (this.inputValue.replace(/\D/g, '').length === 0) {
    this.ngControl.valueAccessor.writeValue('');
  }
}
```

---

## 格式化邏輯

```typescript
onInputChange(value: string, backspace: any) {
  // 組字期間不更新值；輸入結束後再寫入
  if (this.isComposing) {
    return;
  }

  let newVal = value.replace(/\D/g, '');
  let selectPoint = newVal.length;

  if (backspace && newVal.length <= 5) {
    newVal = newVal.substring(0, newVal.length - 1);
  }

  if (newVal.length === 0) {
    newVal = '';
  } else if (newVal.length <= 1) {
    newVal = newVal.replace(/^(\d{0,3})/, '$1__/__/__');
  } else if (newVal.length <= 2) {
    newVal = newVal.replace(/^(\d{0,3})/, '$1__/__/__');
  } else if (newVal.length <= 3) {
    newVal = newVal.replace(/^(\d{0,3})/, '$1__/__');
    selectPoint += 1;
  } else if (newVal.length <= 4) {
    newVal = newVal.replace(/^(\d{0,3})(\d{0,1})/, '$1/$2__/__');
    selectPoint += 1;
  } else if (newVal.length <= 5) {
    newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '$1/$2/__');
    selectPoint += 2;
  } else if (newVal.length <= 6) {
    newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,1})/, '$1/$2/$3_');
    selectPoint += 2;
  } else {
    newVal = newVal.substring(0, 7);
    newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,2})/, '$1/$2/$3');
    selectPoint = newVal.length;
  }

  this.ngControl.valueAccessor.writeValue(newVal);
  this.ngControl.control.setValue(newVal);
  this.nativeEl.setSelectionRange(selectPoint, selectPoint, 'none');
}
```

---

## 取得 input 與 element

```typescript
/** 取得 input value */
get inputValue() {
  return this.nativeEl.value;
}

/** 取得 input element */
get nativeEl() {
  return this.element.nativeElement;
}
```

---

### 核心重點
- 使用 `compositionstart` / `compositionend` 避免中文輸入過程誤觸格式化。
- 格式化邏輯考量 **刪除鍵（backspace）** 與 **游標位置（selectionRange）**。
- 以 Directive 封裝，集中管理輸入格式，提升可維護性。
