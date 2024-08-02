import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    dueDate: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="customerName"
              id="customerName"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="顧客名"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">金額</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="10000"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">円</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">チェックイン日</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="checkInDate"
              id="checkInDate"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.checkInDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">チェックアウト日</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="checkOutDate"
              id="checkOutDate"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">支払期限</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          請求書を作成
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;