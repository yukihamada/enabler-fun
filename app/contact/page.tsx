'use client';

import { useState } from 'react'
import Layout from '@/components/Layout'

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
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-4xl font-bold mb-4 text-center">イネブラへのお問い合わせ</h1>
          <p className="text-xl mb-8 text-center">ご質問やご相談がございましたら���以下のフォームからお問い合わせください。</p>
          <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="name">お名前 <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-2 border rounded" type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="email">メールアドレス <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-2 border rounded" type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="company">会社名</label>
              <input className="w-full px-4 py-2 border rounded" type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="phoneNumber">電話番号</label>
              <input className="w-full px-4 py-2 border rounded" type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="inquiryType">お問い合わせ種別 <span className="text-red-500">*</span></label>
              <select className="w-full px-4 py-2 border rounded" id="inquiryType" name="inquiryType" required value={formData.inquiryType} onChange={handleChange}>
                <option value="">選択してください</option>
                <option value="service">サービスについて</option>
                <option value="price">料金について</option>
                <option value="support">サポートについて</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="message">お問い合わせ内容 <span className="text-red-500">*</span></label>
              <textarea className="w-full px-4 py-2 border rounded" id="message" name="message" rows={4} required value={formData.message} onChange={handleChange}></textarea>
            </div>
            <div className="text-center">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  )
}

export default ContactPage