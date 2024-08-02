'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaShieldAlt, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

export default function AddProperty() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [property, setProperty] = useState({
    title: '',
    type: 'property',
    price: '',
    description: '',
    isPremium: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'properties'), {
        ...property,
        price: Number(property.price),
        createdAt: new Date(),
      });
      alert('物件が正常に登録されました！');
      router.push('/');
    } catch (error) {
      console.error('物件の登録中にエラーが発生しました:', error);
      alert('物件の登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const ProgressBar = ({ steps, currentStep }: { steps: number, currentStep: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(currentStep / steps) * 100}%` }}></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" className="w-64 h-32">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#7fb3ec",stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#5c7a9e",stopOpacity:1}} />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="300" height="160" fill="url(#bgGradient)"/>
          
          <text x="150" y="50" fontFamily="Poppins, sans-serif" fontSize="28" fill="#ffffff" textAnchor="middle" fontWeight="700">
            Enabler DAO
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
          </text>
          
          <g transform="translate(20,65) scale(0.75)">
            <rect x="10" y="50" width="80" height="50" fill="#FF9800">
              <animate attributeName="fill" values="#FF9800;#FFA726;#FF9800" dur="2s" repeatCount="indefinite" />
            </rect>
            <polygon points="50,10 10,50 90,50" fill="#FFC107"/>
            <rect x="35" y="70" width="20" height="30" fill="#F57C00"/>
          </g>
          
          <g transform="translate(110,65) scale(0.75)">
            <path d="M50,10 L70,40 L90,40 L90,50 L70,50 L60,80 L50,80 L55,50 L10,60 L10,50 L55,40 Z" fill="#03A9F4">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
          
          <g transform="translate(200,65) scale(0.75)">
            <rect x="10" y="50" width="80" height="30" fill="#E91E63"/>
            <rect x="20" y="35" width="50" height="20" fill="#F48FB1"/>
            <circle cx="30" cy="80" r="10" fill="#424242">
              <animateTransform attributeName="transform" type="rotate" values="0 30 80; 360 30 80" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="80" r="10" fill="#424242">
              <animateTransform attributeName="transform" type="rotate" values="0 70 80; 360 70 80" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">安全・簡単に物件を登録</h1>
      
      <div className="mb-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">当サービスの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FaShieldAlt className="text-blue-500 text-2xl" />}
            title="安全性重視"
            description="厳重な審査と保証制度で安心の貸し借り"
          />
          <FeatureCard
            icon={<FaCalendarAlt className="text-blue-500 text-2xl" />}
            title="簡単予約管理"
            description="カレンダー連携で予約状況を一元管理"
          />
          <FeatureCard
            icon={<FaMoneyBillWave className="text-blue-500 text-2xl" />}
            title="収益化サポート"
            description="料金設定アドバイスで最適な収益を実現"
          />
        </div>
      </div>

      <ProgressBar steps={5} currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <FormField
            label="物件名"
            name="title"
            value={property.title}
            onChange={handleChange}
            placeholder="例：静かな郊外の一軒家"
          />
        )}

        {currentStep === 2 && (
          <FormField
            label="種類"
            name="type"
            value={property.type}
            onChange={handleChange}
          >
            <select
              id="type"
              name="type"
              value={property.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="property">物件</option>
              <option value="vehicle">車両</option>
            </select>
          </FormField>
        )}

        {currentStep === 3 && (
          <FormField
            label="価格（1泊あたり）"
            name="price"
            value={property.price}
            onChange={handleChange}
            placeholder="例：10000"
            type="number"
          />
        )}

        {currentStep === 4 && (
          <FormField
            label="説明"
            name="description"
            value={property.description}
            onChange={handleChange}
            placeholder="物件の特徴や魅力を記入してください"
            rows={4}
          >
            <textarea
              id="description"
              name="description"
              value={property.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </FormField>
        )}

        {currentStep === 5 && (
          <div className="flex items-center">
            <FormField
              label="プレミアム物件として登録"
              name="isPremium"
              value={property.isPremium}
              onChange={handleChange}
              type="checkbox"
            >
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={property.isPremium}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </FormField>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <Button onClick={handlePrevStep} variant="secondary">
              戻る
            </Button>
          )}
          {currentStep < 5 ? (
            <Button onClick={handleNextStep} variant="primary">
              次へ
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} variant="success">
              {isSubmitting ? '登録中...' : '物件を登録する'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange, placeholder, type = 'text', children, rows }: {
  label: string;
  name: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  children?: React.ReactNode;
  rows?: number;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children || (
      <input
        type={type}
        id={name}
        name={name}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    )}
  </div>
);

const Button = ({ children, onClick, variant, type = 'button', disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'success';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) => {
  const baseStyle = "font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}