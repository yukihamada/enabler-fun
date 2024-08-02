export interface FormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  checkInDate: string;
  checkOutDate: string;
  dueDate: string;
  status: string;
  stripeInfo?: {
    paymentIntentId: string;
    paymentMethod: string;
    paymentStatus: string;
  };
  propertyId?: string;
  customerId?: string;
}