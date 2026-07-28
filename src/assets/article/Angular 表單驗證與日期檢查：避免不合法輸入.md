# Angular 表單驗證與日期檢查：避免不合法輸入

## null 比較與基本檢查

在將 input 資料送往 API 前，應先檢查內容，避免不合法字元或防呆錯誤。以下是常見檢查 function 範例：

```typescript
// 範例日期格式：111/11/06
check(startDate, endDate) {
  if (!startDate || !endDate) {
    alert("您沒有輸入資料");
    return false;
  }

  var year_end = (parseInt(endDate.substring(0,3))+1911).toString();
  var year_start= (parseInt(startDate.substring(0,3))+1911).toString();
  var time_end=endDate.substring(3,9).replace(/[//]/g,"-");
  var time_start=startDate.substring(3,9).replace(/[//]/g,"-");
  var dateDiff =Math.floor((new Date(time_end).getTime() - new Date(time_start).getTime())/(24*3600*1000)); // 計算差異天

  if (dateDiff > 90) {
    alert("查詢時間超過3個月內");
    return false;
  }
  return true;
}
```

**重點：**
- 檢查 `startDate` 與 `endDate` 是否為空值。
- 若輸入為 `null` 或空字串，直接 return false。
- 計算日期差異，若超過 90 天則提示錯誤。

---

## 加入正規化與防呆

上述方法雖能檢查空值，但若使用者輸入錯誤格式（例如 `111/13/99`），仍可能導致計算錯誤。建議加入正規化檢查：

```typescript
check(startDate, endDate) {
  if (!startDate || !endDate) {
    alert("您沒有輸入資料");
    return false;
  }

  // 加上正規化檢查
  const regExp = /^(\\d{3})\\/\\d{2}\\/\\d{2}$/;
  if (!regExp.test(startDate) || !regExp.test(endDate)) {
    alert("時間格式錯誤");
    return false;
  }

  var year_end=(parseInt(endDate.substring(0,3))+1911).toString();
  var year_start=(parseInt(startDate.substring(0,3))+1911).toString();
  var time_end=endDate.substring(3,9).replace(/[//]/g,"-");
  var time_start=startDate.substring(3,9).replace(/[//]/g,"-");
  var dateDiff =Math.floor((new Date(time_end).getTime() - new Date(time_start).getTime())/(24*3600*1000));

  if (dateDiff > 90) {
    alert("查詢時間超過3個月內");
    return false;
  }
  return true;
}
```

**優化重點：**
- 使用正規表示式檢查格式是否符合 `YYY/MM/DD`。
- 避免使用者輸入非數字或錯誤日期格式。

---

## 進階檢查與錯誤排除

即使正規化檢查通過，仍可能出現不合法日期（例如 `2021/01/32`）。若需更嚴謹檢查，可在正規化後進一步驗證日期物件是否有效：

```typescript
check(startDate, endDate) {
  if (!startDate || !endDate) {
    alert("您沒有輸入資料");
    return false;
  }

  const regExp = /^(\\d{3})\\/\\d{2}\\/\\d{2}$/;
  if (!regExp.test(startDate) || !regExp.test(endDate)) {
    alert("時間格式錯誤");
    return false;
  }

  var year_end=(parseInt(endDate.substring(0,3))+1911).toString();
  var year_start=(parseInt(startDate.substring(0,3))+1911).toString();
  var time_end=endDate.substring(3,9).replace(/[//]/g,"-");
  var time_start=startDate.substring(3,9).replace(/[//]/g,"-");

  const dateStart = new Date(`${year_start}-${time_start}`);
  const dateEnd = new Date(`${year_end}-${time_end}`);

  if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime())) {
    alert("日期不合法");
    return false;
  }

  var dateDiff = Math.floor((dateEnd.getTime() - dateStart.getTime())/(24*3600*1000));
  if (dateDiff > 90) {
    alert("查詢時間超過3個月內");
    return false;
  }
  return true;
}
```

**進階重點：**
- 使用 `isNaN(date.getTime())` 檢查日期是否合法。
- 避免錯誤日期（如 32 號）導致計算異常。

---

### 核心總結
- **第一層檢查**：空值（null）與基本格式。
- **第二層檢查**：正規化（Regex）確保格式正確。
- **第三層檢查**：驗證日期物件合法性，避免錯誤日期。
- **額外檢查**：日期範圍（例如 90 天內）。
