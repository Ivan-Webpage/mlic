# Angular Router Guard：使用 CanActivate 保護路由

## Guard 的用途與官方文件

在 Angular 中，**Guard** 用來控制路由存取權限，常見場景：
- 使用者必須登入才能進入某頁面
- 根據角色或狀態決定是否允許進入

官方文件：
- [CanActivate](https://angular.io/api/router/CanActivate)
- [CanDeactivate](https://angular.io/api/router/CanDeactivate)

建立 Guard 指令：
```bash
ng g g test
```
此指令會產生 `test.guard.ts`，並自動建立 Class 名稱 `TestGuard`。

---

## CanActivate 介面與基本骨架

`canActivate()` 方法回傳值類型：
- `boolean`
- `UrlTree`
- `Observable<boolean | UrlTree>`
- `Promise<boolean | UrlTree>`

基本範例：
```typescript
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true; // 允許進入
  }
}
```

---

## 加入驗證邏輯與路由設定

在 `canActivate()` 中加入檢查，例如判斷是否有 token：
```typescript
canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {
  console.log('AuthGuard#canActivate 被觸發');
  console.log(next);
  console.log(state);

  const token = localStorage.getItem('token');
  if (!token) {
    return false; // 沒有 token，禁止進入
  }
  return true; // 有 token，允許進入
}
```

在 `app-routing.module.ts` 中設定：
```typescript
const routes: Routes = [
  {
    path: '',
    component: BackendComponent,
    canActivate: [TestGuard]
  }
];
```

---

## 完整範例

`test.guard.ts` 完整程式：
```typescript
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot, // 欲前往的路由
    state: RouterStateSnapshot // 當下的路由快照
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('AuthGuard#canActivate 被觸發');
    console.log(next);
    console.log(state);

    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return true;
  }
}
```

---

### 核心重點
- **Guard** 是 Angular Router 的安全機制，用來控制路由存取。
- `canActivate()` 回傳布林值或 `UrlTree`，也可用 `Observable` 或 `Promise`。
- 常見應用：登入驗證、角色權限檢查。
- 在 `app-routing.module.ts` 中使用 `canActivate: [TestGuard]` 綁定。
