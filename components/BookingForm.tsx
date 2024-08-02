import React from 'react';
import { Property } from '../types/property';

type BookingFormProps = {
  properties: Property[];
  selectedDates: { [propertyId: string]: string[] };
  formData: { name: string; phone: string; email: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; phone: string; email: string }>>;
  setShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleBookingClick: (e: React.FormEvent) => void;
};

const BookingForm: React.FC<BookingFormProps> = ({ properties, selectedDates, formData, setFormData, setShowBookingForm, handleBookingClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">予約情報を入力</h2>
        {properties.map((property) => (
          <div key={property.id} className="mb-4">
            <p className="font-bold">{property.title}</p>
            <ul>
              {selectedDates[property.id].map((date) => (
                <li key={date}>
                  - {date}: ¥{property.price.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <form onSubmit={handleBookingClick}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              氏名
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              予約する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;