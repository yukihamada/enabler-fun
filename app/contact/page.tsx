'use client';

import { useState } from 'react'
import Layout from '@/components/Layout'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phoneNumber: '',
    inquiryType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // ここにフォーム送信のロジックを追加
    await new Promise(resolve => setTimeout(resolve, 1000)) // 送信シミュレーション
    alert('お問い合わせありがとうございます。担当者より折り返しご連絡いたします。')
    setFormData({ name: '', email: '', company: '', phoneNumber: '', inquiryType: '', message: '' })
    setIsSubmitting(false)
    setStep(1)
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const renderFormField = (key: string, value: string, icon: JSX.Element) => (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={key}>
        {key === 'name' ? 'お名前' :
         key === 'email' ? 'メールアドレス' :
         key === 'company' ? '会社名' :
         key === 'phoneNumber' ? '電話番号' :
         key === 'inquiryType' ? 'お問い合わせ種別' :
         'お問い合わせ内容'}
        {['name', 'email', 'inquiryType', 'message'].includes(key) && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon}
        {key === 'inquiryType' ? (
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            id={key}
            name={key}
            required={['name', 'email', 'inquiryType', 'message'].includes(key)}
            value={value}
            onChange={handleChange}
          >
            <option value="">選択してください</option>
            <option value="service">サービスについて</option>
            <option value="price">料金について</option>
            <option value="support">サポートについて</option>
            <option value="other">その他</option>
          </select>
        ) : key === 'message' ? (
          <textarea
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            id={key}
            name={key}
            rows={4}
            required={['name', 'email', 'inquiryType', 'message'].includes(key)}
            value={value}
            onChange={handleChange}
          />
        ) : (
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            type={key === 'email' ? 'email' : key === 'phoneNumber' ? 'tel' : 'text'}
            id={key}
            name={key}
            required={['name', 'email', 'inquiryType', 'message'].includes(key)}
            value={value}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  )

  return (
    <Layout>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">イネブラへのお問い合わせ</h1>
        <p className="text-xl mb-12 text-center text-gray-700">ご質問やご相談がございましたら、以下のフォームからお問い合わせください。</p>
        <form className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              {renderFormField('name', formData.name, <FaUser className="absolute top-3 left-3 text-gray-400" />)}
              {renderFormField('email', formData.email, <FaEnvelope className="absolute top-3 left-3 text-gray-400" />)}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg hover:bg-indigo-700 transition duration-300"
                type="button"
                onClick={nextStep}
              >
                次へ
              </motion.button>
            </>
          )}
          {step === 2 && (
            <>
              {renderFormField('company', formData.company, <FaBuilding className="absolute top-3 left-3 text-gray-400" />)}
              {renderFormField('phoneNumber', formData.phoneNumber, <FaPhone className="absolute top-3 left-3 text-gray-400" />)}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg hover:bg-gray-400 transition duration-300"
                  type="button"
                  onClick={prevStep}
                >
                  戻る
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg hover:bg-indigo-700 transition duration-300"
                  type="button"
                  onClick={nextStep}
                >
                  次へ
                </motion.button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              {renderFormField('inquiryType', formData.inquiryType, <FaQuestionCircle className="absolute top-3 left-3 text-gray-400" />)}
              {renderFormField('message', formData.message, <FaPaperPlane className="absolute top-3 left-3 text-gray-400" />)}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg hover:bg-gray-400 transition duration-300"
                  type="button"
                  onClick={prevStep}
                >
                  戻る
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '送信中...' : '送信する'}
                </motion.button>
              </div>
            </>
          )}
        </form>
      </motion.main>
    </Layout>
  )
}

export default ContactPage