import { Booking } from '../types/bookings';

// 料金計算ロジックを実装する
export const calculatePricing = (selectedDates: Booking['selectedDates'], selectedProperties: Booking['properties']): Booking['pricing'] => {
  // TODO: 実際の料金計算ロジックを実装する
  // selectedDates と selectedProperties から料金を計算
  // サンプル：ここでは仮の料金を返す
  const pricing: Booking['pricing'] = {};
  for (const date of selectedDates) {
    pricing[date] = {
      price: 10000, // 1泊の料金
      cleaningFee: 5000, // クリーニング料金
    };
  }

  return pricing;
};