'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/types/formTypes';
import Layout from '@/components/Layout';

export default function PostJobPage() {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('jobPostFormData');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('jobPostFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prevData: Record<string, string>) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // APIを呼び出してデータを送信
    try {
      const response = await fetch('/api/postJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {

        localStorage.removeItem('jobPostFormData');
        setFormData({});
      } else {
        throw new Error('投に失ました');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  const renderField = (field: FormField) => {
    const baseInputClass = "shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";

    return (
      <div>
        <p className="text-lg font-medium text-gray-800 mb-2">{field.label}</p>
        {field.example && (
          <p className="text-sm text-gray-600 mb-2">{field.example}</p>
        )}
        {(() => {
          switch (field.type) {
            case 'textarea':
              return (
                <textarea
                  className={`${baseInputClass} h-32`}
                  id={field.id}
                  placeholder={field.placeholder}
                  rows={4}
                  required={field.required}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  value={formData[field.id] || ''}
                />
              );
            case 'select':
              return (
                <select
                  className={baseInputClass}
                  id={field.id}
                  required={field.required}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  value={formData[field.id] || ''}
                >
                  <option value="">選択してください</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              );
            default:
              return (
                <input
                  className={baseInputClass}
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  value={formData[field.id] || ''}
                />
              );
          }
        })()}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentField = formFields[currentStep];

  return (
    <Layout>
      <div className="container mx-auto px-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <main>
          <section className="py-12">

            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    進捗状況: {currentStep + 1} / {formFields.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentStep + 1) / formFields.length) * 100}%` }} />
                  </div>
                  <div className="mb-6">
                    {renderField(currentField)}
                  </div>
                  <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
                      >
                        戻る
                      </button>
                    )}
                    {currentStep < formFields.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full ml-auto"
                      >
                        次へ
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full ml-auto"
                      >
                        投稿する
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

const formFields = [
  { 
    id: 'shop_name', 
    label: '店舗名を教えてください。', 
    type: 'text', 
    placeholder: '店舗名', 
    required: true,
    example: '例: カフェ空、レストラン太陽など'
  },
  { 
    id: 'location', 
    label: '店舗の所在地を教えてください。', 
    type: 'text', 
    placeholder: '所在地', 
    required: true,
    example: '例: 東京都渋谷区神南1-2-3'
  },
  { 
    id: 'industry', 
    label: 'お店の業態を教えてください。', 
    type: 'select', 
    options: ['居酒屋', 'レストラン', 'カフェ', 'バー'], 
    required: true,
    example: '例: レストラン、カフェ、居酒屋など'
  },
  { 
    id: 'customer_unit_price', 
    label: '客単価はどのくらいですか？', 
    type: 'select', 
    options: ['~1000円', '1000~3000円', '3000~5000円', '5000円~'], 
    required: true,
    example: '例: 1000~3000円'
  },
  { 
    id: 'job_title', 
    label: 'どんな職種を募集していますか？', 
    type: 'text', 
    placeholder: '募集職種', 
    required: true,
    example: '例: ホールスタッフ、キッチンスタッフ、バーテンダーなど'
  },
  { 
    id: 'job_description', 
    label: '具体的な仕事内容を教えてください。', 
    type: 'textarea', 
    placeholder: '仕事内容', 
    required: true,
    example: '例: 接客、オーダー取り、料理の提供、レジ業務など。新人スタッフの教育もお願いします。'
  },
  { 
    id: 'seats', 
    label: '席数', 
    type: 'number', 
    placeholder: '席数', 
    required: true,
    example: '例: 30（半角数字で入力してください）'
  },
  { 
    id: 'smoking_info', 
    label: '喫煙情報', 
    type: 'select', 
    options: ['全面禁煙', '分煙', '喫煙可'], 
    required: true,
    example: '例: 全面禁煙'
  },
  { 
    id: 'nearest_station', 
    label: '最寄駅', 
    type: 'text', 
    placeholder: '最寄駅', 
    required: true,
    example: '例: JR山手線 渋谷駅 徒歩5分'
  },
  { 
    id: 'holidays', 
    label: '定休日', 
    type: 'text', 
    placeholder: '定休日', 
    required: true,
    example: '例: 毎週月曜日、年末年始'
  },
  { 
    id: 'company', 
    label: '運営会社', 
    type: 'text', 
    placeholder: '運営会社', 
    required: true,
    example: '例: 株式会社〇〇フーズ'
  },
  { 
    id: 'salary', 
    label: '給与情報', 
    type: 'text', 
    placeholder: '給与情報', 
    required: true,
    example: '例: 時給1,200円〜、昇給あり'
  },
  { 
    id: 'qualifications', 
    label: '応募資格', 
    type: 'text', 
    placeholder: '応募資格', 
    required: true,
    example: '例: 未経験者歓迎、高校生不可'
  },
  { 
    id: 'working_hours', 
    label: '勤務時間', 
    type: 'text', 
    placeholder: '勤務時間', 
    required: true,
    example: '例: 10:00〜22:00の間でシフト制、1日4時間〜OK'
  },
  { 
    id: 'holidays_vacations', 
    label: '休日・休暇', 
    type: 'text', 
    placeholder: '休日・休暇', 
    required: true,
    example: '例: 週休2日制、有給休暇あり、夏季・冬季休暇あり'
  },
  { 
    id: 'benefits', 
    label: '待遇', 
    type: 'text', 
    placeholder: '待遇', 
    required: true,
    example: '例: 交通費支給、制服貸与、まかない付き、社会保険完備'
  },
  { 
    id: 'desired_personality', 
    label: '求める人物像', 
    type: 'textarea', 
    placeholder: '求める人物像', 
    required: true,
    example: '例: 明るく元気な方、チームワークを大切にできる方、接客が好きな方'
  },
  { 
    id: 'skills_knowledge', 
    label: '身につくスキルや学べる知識', 
    type: 'textarea', 
    placeholder: '身に���くスキルや学べる知識', 
    required: true,
    example: '例: 接客スキル、調理技術、ワインの知識、マネジメントスキルなど'
  },
  { 
    id: 'shop_features', 
    label: 'お店の特徴', 
    type: 'textarea', 
    placeholder: 'お店の特徴',
    example: '例: 創業30年の老舗、有機野菜にこだわった料理、落ち着いた雰囲気のカフェなど'
  },
  { 
    id: 'message_from_recruiter', 
    label: '採用担当からのメッセージ', 
    type: 'textarea', 
    placeholder: '採用担当者からのメッセージ',
    example: '例: 私たちと一緒に、お客様に最高のサービスを提供しましょう！未経験者も大歓迎です。'
  },
  { 
    id: 'company_info', 
    label: '経営企業情報', 
    type: 'textarea', 
    placeholder: '経営企業情報',
    example: '例: 設立年：1990年、資本金：1000万円、従業員数：50名、事業内容：飲食店経営'
  },
  { 
    id: 'shop_info', 
    label: 'ショップ情報', 
    type: 'textarea', 
    placeholder: 'ショップ情報',
    example: '例: 営業時間：11:00〜23:00、定休日：毎週月曜日、座席数：40席、駐車場：あり（5台）'
  },
  { 
    id: 'sns_links', 
    label: 'SNSリンク', 
    type: 'text', 
    placeholder: 'SNSリンク',
    example: '例: Instagram: @cafe_example, Twitter: @cafe_example'
  },
  { 
    id: 'related_jobs', 

    type: 'textarea', 

    example: '例: 系列店「レストランABC」でもホールスタッフを募集中です。'
  },
  { 
    id: 'other_stores_info', 
    label: '運営会社の他の店舗情報', 
    type: 'textarea', 
    placeholder: '運営会社の他の店舗情報',
    example: '例: 東京都内に5店舗展開中。新宿店、渋谷店、池袋店、上野店、銀座店'
  },
  { 
    id: 'recently_viewed_jobs', 

    type: 'textarea', 

    example: '例: この項目は自動的に生成されます。'
  },
  { 
    id: 'owner_background', 
    label: 'オーナーの経歴', 
    type: 'textarea', 
    placeholder: 'オーナーの経歴',
    example: '例: 料理人として20年のキャリアを持ち、5年前に独立。地元の食材を活かした料理で人気を集めています。'
  },
];
