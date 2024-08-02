import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  isEditing: boolean;
  onInputChange: (name: string, value: any) => void;
}

export default function FAQ({ faqs = [], isEditing, onInputChange }: FAQProps) {
  const { t } = useTranslation('common');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t('faq')}</h2>
      {faqs.length > 0 ? (
        faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="flex justify-between items-center w-full text-left font-semibold p-4 bg-gray-100 rounded-lg"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white rounded-b-lg">{faq.answer}</div>
            )}
          </div>
        ))
      ) : (
        <p>{t('no_faqs_available')}</p>
      )}
    </div>
  );
}