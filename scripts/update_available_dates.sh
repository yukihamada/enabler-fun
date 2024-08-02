#!/bin/bash

# 物件IDのリスト
properties=(
  "5Bsf7sZSsX2I1mjaLNAR"
  "7fSrbaL8Uotnjl7zEZZi"
  "JWgMHTshZcRvVuRH3o2O"
  "UtdexAq729gSzgifHBGA"
  "VA6yl9e8Z5yhJQ2nGs8i"
  "diHRIJ6nUI7R79R1fJbc"
  "gyKajWFP5FdrZX1cAnq7"
  "iHeXGtKas5FWO5ls1RKR"
  "vyCnmILGsNL8gdoDL4Bo"
  "vzoBIc0n0HTkn3w5KHWv"
  "zGypL5Sjo5aUI49mdMmM"
)

# 各物件に対してアップデートを実行
for id in "${properties[@]}"
do
  # 現在の物件データを取得
  current_data=$(curl -s "http://localhost:3001/api/properties/$id")
  
  # 現在の availableDates を抽出
  current_dates=$(echo $current_data | jq -r '.availableDates')
  
  # 新しい availableDates を生成（価格を追加）
  new_dates=$(echo $current_dates | python3 -c "
import json
import sys
from datetime import datetime

data = json.load(sys.stdin)
new_data = []

for date in data:
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    base_price = 100000  # ベース価格
    if date_obj.weekday() >= 5:  # 土日は20%増し
        price = int(base_price * 1.2)
    else:
        price = base_price
    new_data.append({'date': date, 'price': price})

print(json.dumps(new_data))
")

  # 物件名を設定（スペースを適切に調整）
  case $id in
    "5Bsf7sZSsX2I1mjaLNAR") name="🌴 ハワイビーチハウス" ;;
    "7fSrbaL8Uotnjl7zEZZi") name="🍂 京都町家ステイ" ;;
    "JWgMHTshZcRvVuRH3o2O") name="🌲 弟子屈サウナリトリート" ;;
    "UtdexAq729gSzgifHBGA") name="🏢 乃木坂サウナハウス" ;;
    "VA6yl9e8Z5yhJQ2nGs8i") name="🌊 熱海絶景ヴィラ" ;;
    "diHRIJ6nUI7R79R1fJbc") name="🏪 渋谷民泊アパート" ;;
    "gyKajWFP5FdrZX1cAnq7") name="🏕️ 弟子屈キャンプ場" ;;
    "iHeXGtKas5FWO5ls1RKR") name="🎤 六本木音楽スタジオ" ;;
    "vyCnmILGsNL8gdoDL4Bo") name="🐕 名古屋庭園別荘" ;;
    "vzoBIc0n0HTkn3w5KHWv") name="🏞 野尻湖ログハウス" ;;
    "zGypL5Sjo5aUI49mdMmM") name="🖼 東京タワービュー" ;;
    *) name="物件名" ;;
  esac

  # curlコマンドを実行してデータをアップデート
  curl -X PUT \
    "http://localhost:3001/api/properties/$id" \
    -H 'Content-Type: application/json' \
    -d "{
      \"name\": \"$name\",
      \"availableDates\": $new_dates
    }"

  echo "Updated property: $id"
done