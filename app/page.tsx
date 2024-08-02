'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Info, Menu, Users, Bed, Bath, Wifi, Car, Cigarette, Bone, Moon, Sun } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format, addDays, subMonths, isAfter } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '../types/property'; // Property型をインポート
import { useAuth0 } from '@auth0/auth0-react';
import ImageCarousel from '../components/ImageCarousel'; // ImageCarouselコンポーネントをインポート
import { loadStripe } from '@stripe/stripe-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer'; // CountdownTimerコンポーネントをインポート
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Favicon from '../components/Favicon'; // Faviconコンポーネントをインポート
import PropertyDetails from '../components/PropertyDetails'; // PropertyDetailsコンポーネントをインポート

// Stripeの公開鍵を設定します。
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const formatDate = (date: Date): string => {
  return format(date, 'M/d(E)', { locale: ja });
};

export default function CuratedSharingService() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isPastMonth, setIsPastMonth] = useState(false); // 過去月かどうかを示す状態を追加
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dates, setDates] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('ja');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: '',
    type: 'property', // デフォルト値を追加
    isPremium: false,
    description: '',
    price: 30000, // price プパティを初期化
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ここで新しい物件をFirestoreに追加する処理を実装
    // 例: await addDoc(collection(db, 'properties'), newProperty);
    console.log('新しい物件を登録:', newProperty);
    // 登録後、フォームをリセットし、物件リストを更新
    setNewProperty({
      title: '',
      type: 'property',
      isPremium: false,
      description: '',
      price: 0
    });
    // 物件リストを再取得する処理をここに追加
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching properties...');
        const propertiesCollection = collection(db, 'properties');
        const propertiesSnapshot = await getDocs(propertiesCollection);
        console.log('Snapshot received:', propertiesSnapshot.size, 'documents');
        const propertiesList = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property)); // Property型を適用
        console.log('Properties list:', propertiesList);
        setProperties(propertiesList);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('物件の取得中にエラーが発生しました。しばらくしてからもう一度お試しください。'); // エラーメッセージを修正
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const newDates = getDates(currentDate, 30); // 30日分のデータを取得
    setDates(newDates);
  }, [currentDate]);

  const getDates = (startDate: Date, days: number = 7): Date[] => {
    return Array.from({ length: days }, (_, i) => addDays(startDate, i));
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);

    // newDateが現在の月より前の月の場合は、日付を現在の月の1日に設定
    if (newDate.getMonth() < new Date().getMonth()) {
      newDate.setDate(1);
    }

    setCurrentDate(newDate);
    setIsPastMonth(newDate.getMonth() < new Date().getMonth()); // 過去月かどうかを更新
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // ここで言語切り替えのロジックを実装します
    // 例: i18nライブラリを使用する場合は、ここでロケールを変更します
  };

  useEffect(() => {
    // システムの設定を確認
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    // システムの設定変更を監視
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addListener(listener);
    return () => darkModeMediaQuery.removeListener(listener);
  }, []);

  useEffect(() => {
    // ダークモードの切り替え
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const [selectedDates, setSelectedDates] = useState<{ [propertyId: string]: string[] }>({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showBookingCompleteModal, setShowBookingCompleteModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState<string | null>(null); // 追加

  const handleDateClick = (propertyId: string, date: string) => {
    const threeMonthsLater = subMonths(new Date(), -3); // 3ヶ月後の日付を取得
    if (!isAuthenticated && isAfter(new Date(date), threeMonthsLater)) {
      // 3ヶ月後以降の日付がクリックされ、かつ未ログインの場合はアラートを表示
      alert('3ヶ月後以降の予約は会員登録が必要です。');
      return; 
    }

    setSelectedDates(prev => {
      const updatedDates = prev[propertyId] ? [...prev[propertyId]] : [];
      const dateIndex = updatedDates.indexOf(date);
      if (dateIndex > -1) {
        updatedDates.splice(dateIndex, 1);
      } else {
        updatedDates.push(date);
      }
      return {
        ...prev,
        [propertyId]: updatedDates,
      };
    });
  };

  const handlePropertyDetailsClick = (propertyId: string) => {
    setShowPropertyDetails(prev => prev === propertyId ? null : propertyId);
  };

  const handleBookingClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 予約を完了させる処理
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedDates,
          formData,
          selectedProperties: properties.filter(property => Object.keys(selectedDates).includes(property.id))
        }),
      });

      if (!response.ok) {
        throw new Error('予約に失敗しました');
      }

      const result = await response.json();

      // 予約が完了した、支払いURLを設定
      setPaymentUrl(result.paymentUrl);
      setShowBookingForm(false);
      setShowBookingCompleteModal(true); // モーダルを表示

      // 成功メッセージを表示
      // alert('予約が完了しました。支払いページに進んでください。');

    } catch (error) {
      console.error('予約エラー:', error);
      alert('予約の処理中にラーが発生しました。もう一度お試しください。');
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-bold mt-10">
        {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return <div>物件が見つかりませんでした。</div>;
  }

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-2 sm:p-4`}>
      <Favicon /> {/* Faviconコンポーネントを追加 */}
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        changeLanguage={changeLanguage}
      />
      <div className="max-w-[2000px] mx-auto"> {/* この部分を削除 */}
        {/* カレンダー部分 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleDateChange(-30)}
              className={`
                ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} 
                p-2 rounded-md shadow flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isPastMonth ? '' : 'opacity-50 cursor-not-allowed'} // 過去月でない場合は非活性化
              `}
              aria-label="前月"
            >
              <ChevronLeft className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              <span className={`hidden sm:inline ml-2 whitespace-nowrap ${isPastMonth ? 'text-white' : 'text-gray-400'}`}>前月</span> {/* ラベルの色を変更 */}
            </button>
            <div className={`flex items-center text-sm sm:text-base ${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow`}>
              <Calendar className={`mr-2 h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} aria-hidden="true" />
              <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>{formatDate(dates[0])} ～ {formatDate(dates[dates.length - 1])}</span>
            </div>
            <button 
              onClick={() => handleDateChange(30)} 
              className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} p-2 rounded-md shadow flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="翌月"
            >
              <span className={`hidden sm:inline mr-2 whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>翌月</span>
              <ChevronRight className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="relative">
            <div className={`overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
              <div className="min-w-[800px] w-full">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={`p-3 text-left ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'} w-[288px] sticky left-0 z-20`}>物件名</th>
                      {dates.map((date, index) => (
                        <th key={index} className={`p-3 text-center whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'}`}>
                          {formatDate(date)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <React.Fragment key={property.id}>
                        <tr className={`border-t ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                          <td className={`p-3 sticky left-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} z-10 w-[288px]`}>
                            <div className="flex items-center">
                              <span className={`font-medium truncate max-w-[24ch] text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`} title={property.title}>
                              {property.name || property.title || "無題"}
                              </span>
                              <button
                                onClick={() => handlePropertyDetailsClick(property.id)} // 変更
                                 className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full`}
                                aria-label={`${property.title}の詳細を${showPropertyDetails === property.id ? '隠す' : '表示する'}`} // 変更
                              >
                                <Info className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                               </button>
                             </div>
                           </td>
                          {dates.map((date, dateIndex) => (
                            <td key={dateIndex} className="p-3 text-center" style={{ minWidth: '100px' }}>
                              <div
                                onClick={() => handleDateClick(property.id, format(date, 'yyyy-MM-dd'))}
                                className={`cursor-pointer rounded-full py-1 px-2 text-xs font-medium transition-colors duration-150 ${
                                  property.availableDates?.includes(format(date, 'yyyy-MM-dd'))
                                    ? selectedDates[property.id]?.includes(format(date, 'yyyy-MM-dd')) 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                              >
                                {/* 金額表示部分を条件付きで変更 */}
                                {isAuthenticated ? (
                                  property.availableDates?.includes(format(date, 'yyyy-MM-dd'))
                                    ? `¥100,000`
                                    : '準備中'
                                ) : (
                                  isAfter(date, subMonths(new Date(), -3)) ? (
                                    '会員限定'
                                  ) : (
                                    property.availableDates?.includes(format(date, 'yyyy-MM-dd'))
                                      ? `¥100,000`
                                      : '準備中'
                                  )
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        {showPropertyDetails === property.id && ( // 変更
                          <tr>
                            <td colSpan={dates.length + 1} className={`p-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <div className="fixed inset-0 flex items-center justify-center z-40">
                                <div className={`w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                                  <div className="flex justify-end">
                                    <button onClick={() => setShowPropertyDetails(null)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                  </div>
                                  <PropertyDetails property={property} isDarkMode={isDarkMode} /> {/* PropertyDetailsを表示 */}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-75 p-2 rounded-l-md shadow-md sm:hidden`}>
              <ChevronRight className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
            </div>
          </div>
        </div>

        {/* 物件情報入力フォームの代わりに以下のボタンを配置 */}
        <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow text-center`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>新しい物件を追加しませんか？</h3>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>あなたの物件を登録して、新しい収入源を見つけましょう！</p>
          <Link href="/add-property" className={`inline-block ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-3 px-6 rounded-md transition duration-150 ease-in-out`}>
            物件を登録する
          </Link>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />

      {/* 予約フォーム */}
      {showBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">予約報を入力</h2>
            {properties
              .filter(property => Object.keys(selectedDates).includes(property.id))
              .map((property) => (
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
                  電話番
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
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 合計金額と予約ボタン */}
      {!showBookingCompleteModal && Object.keys(selectedDates).length > 0 && 
        properties
          .filter(property => Object.keys(selectedDates).includes(property.id))
          .reduce((total, property) => total + property.price * selectedDates[property.id].length, 0) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white p-4 flex justify-between items-center z-50">
          <span className="font-bold text-lg">
            合計金額: ¥
            {properties
              .filter(property => Object.keys(selectedDates).includes(property.id))
              .reduce((total, property) => total + property.price * selectedDates[property.id].length, 0)
              .toLocaleString()}
          </span>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            予約する
          </button>
        </div>
      )}

      {/* 支払いURLが設定されたら表示 */}
      {showBookingCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CheckCircleIcon className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">予約仮押さえ完了</h2>
            <p className="mb-4 text-center">
              予約が仮押さえされました。1時間以内にお支払いを完了してください。
            </p>
            <p className="mb-6 text-center text-red-500 font-bold">
              <CountdownTimer time={60 * 60} /> 以内に支払いが完了しない場合、自動的にキャンセルされます。
            </p>
            <a
              href={`/payment/${paymentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-150 ease-in-out"
            >
              支払いに進む
            </a>
          </div>
        </div>
      )}
    </div>
  );
}