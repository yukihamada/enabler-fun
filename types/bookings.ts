import { Timestamp } from "firebase/firestore";

export interface Booking {
  selectedDates: any; // selectedDates の型を適切なものに置き換えてください
  customerInfo: any; // formData の型を適切なものに置き換えてください
  properties: any; // selectedProperties の型を適切なものに置き換えてください
  createdAt: Timestamp;
  status: string;
  pricing: {
    [date: string]: { // 日付ごとの金額を格納
      price: number;
      cleaningFee: number; 
    }
  }
}