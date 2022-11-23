# Html爬蟲Post實戰－全球美食平台UberEat爬蟲
![圖片取自：Uber Eats官網畫面](https://i.imgur.com/NVSRjFB.png)

Uber（優步）成立於西元2009年3月，並最早在西元2010年推出服務，創辦人為格瑞特·坎普（Garrett Camp）與崔維斯·卡蘭尼克（Travis Cordell Kalanick），目前總部位於美國加利福尼亞州舊金山。近年 Uber 看到了美食外送市場，積極推動Uber Eats，而在台灣 Uber Eats 目前已經是前三大的美食外送平台，勢力不容小覷。

現在台灣大多餐飲業都有與Uber合作，尤其在2019年新冠肺炎（COVID-19）的情勢下，Uber Eats 的產值水漲船高，在足不出戶的疫情情況下，外送平台竟成了餐飲業的「唯一通路」，因此藉由 Uber Eats 資料能夠探訪每個地區的餐飲情況分布。

> 你必須先知道：[資料傳遞Get與Post差異]()

本課程使用request的套件進行請求，是使用Post的形式傳送 headers與 data ，而在課程中排除掉了許多不需要傳送的資料：
## headers 資料
```python
# 請求附帶的資料
post_head = {
# 'accept': '*/*',
# 'accept-encoding': 'gzip, deflate, br',
# 'accept-language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
# 'content-length': '911',
# 'content-type': 'application/json',
'cookie': 'dId=4815da68-ec54-41d4-97...太多了，詳情請下載程式碼',
# 'dnt': '1',
# 'origin': 'https://www.ubereats.com',
# 'referer': 'https://www.ubereats.com/tw/feed?pl=JTdCJTIyYWRkcmVzcyUyMiU...太多了，詳情請下載程式碼',
# 'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
# 'sec-ch-ua-mobile': '?0',
# 'sec-fetch-dest': 'empty',
# 'sec-fetch-mode': 'cors',
# 'sec-fetch-site': 'same-origin',
# 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
'x-csrf-token': 'x',
# 'x-uber-xps': '%7B%22eats_web_promo_...太多了，詳情請下載程式碼'
        }
```
## data 資料
```python
post_data = {
# 'billboardUuid': "",
'cacheKey': "JTdCJTIyYWRkcmVzcyUyMiUzQSUyMiVFNSVCQiVCQSVFNSU5QyU4QiVFNSU4QyU5NyVFOCVCNyVBRiVFNCVCOCU4MCVFNiVBRSVCNTIyJUU4JTk5JTlGJTIyJTJDJTIycmVmZXJlbmNlJTIyJTNBJTIyRWxST2J5NGdNaklzSUZObFkzUnBiMjRnTVN3Z1NtbGhibWQxYnlCT2IzSjBhQ0JTYjJGa0xDQmFhRzl1WjNOb1lXNGdSR2x6ZEhKcFkzUXNJRlJoYVhCbGFTQkRhWFI1TENCVVlXbDNZVzRnTVRBME9URWlVQkpPQ2pRS01nblRkLTE2WXFsQ05CRkFfb2FTeDg1WE9ob2VDeER1d2U2aEFSb1VDaElKbTJ3dFh2bXJRalFSZGNlY2U0ZjZHczRNRUJZcUZBb1NDU3NmeFA1aHFVSTBFUXhfa2RRNFJlU1QlMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBMjUuMDQ2ODYxMSUyQyUyMmxvbmdpdHVkZSUyMiUzQTEyMS41MzY0MjYlN0Q=/DELIVERY///0/0//JTVCJTVE///",
# 'carouselId': "",
# 'date': "",
# 'endTime': '0',
# 'feedProvider': "",
# 'feedSessionCount': {'announcementCount': '0', 'announcementLabel': ""},
# 'getFeedItemType': "PINNED",
# 'marketingFeedType': "",
# 'showSearchNoAddress': False,
# 'sortAndFilters': [],
# 'startTime': '0',
# 'userQuery': ""
    }
```

Uber Eats 的網站不只會檢查hearder，主要會檢查data 裡面的cacheKey 參數，需要兩者皆有才能進行請求。
```python
#請求網站
list_req = requests.post(url, 
                         headers = post_head,
                         data = post_data)
getdata = json.loads(list_req.content)
```
