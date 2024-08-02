type InvoiceStatus = '未払い' | '支払済' | '期限切れ';

interface BaseInvoice {
  id: string;
  customerName: string;
  amount: number;
  checkInDate: string;
  checkOutDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface UnpaidInvoice extends BaseInvoice {
  status: '未払い' | '期限切れ';
}

interface PaidInvoice extends BaseInvoice {
  status: '支払済';
  stripeInfo: StripeInfo;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  checkInDate: string;
  checkOutDate: string;
  dueDate: string;
  status: InvoiceStatus;
  stripeInfo?: StripeInfo;
}

interface StripeInfo {
  paymentIntentId: string;
  paymentMethod: string;
  paymentStatus: string;
}