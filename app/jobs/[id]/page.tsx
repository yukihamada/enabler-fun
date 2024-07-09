"use client";

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { db } from '../../../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ArrowLeftIcon, MapPinIcon, BuildingOfficeIcon, CurrencyYenIcon, ClockIcon, CalendarIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface JobListing {
  id: string;
  shop_name: string;
  job_title: string;
  job_description: string;
  location: string;
  industry: string;
  salary: string;
  working_hours: string;
  requirements: string;
  customer_unit_price: string;
  seats: number;
  smoking_info: string;
  nearest_station: string;
  holidays: string;
  company: string;
  days_off: string;
  benefits: string;
  ideal_candidate: string;
  skills_to_acquire: string;
  company_info?: string;
  status: 'open' | 'closed';
}

async function fetchImages(query: string) {
  const response = await fetch(`/api/search-images?q=${encodeURIComponent(query)}`)
  const data = await response.json()
  return data.images
}

export default function JobDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobListing | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedJob, setEditedJob] = useState<JobListing | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchJob = async () => {
      if (typeof id !== 'string') return
      const jobDoc = doc(db, 'jobs', id)
      const jobSnapshot = await getDoc(jobDoc)
      if (jobSnapshot.exists()) {
        const jobData = { id: jobSnapshot.id, ...jobSnapshot.data() } as JobListing
        setJob(jobData)
        const fetchedImages = await fetchImages(jobData.shop_name)
        setImages(fetchedImages)
      }
    }

    fetchJob()
  }, [id])

  useEffect(() => {
    if (images.length > 0) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 5000)

      return () => clearInterval(imageInterval)
    }
  }, [images])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedJob(job)
  }

  const handleSave = async () => {
    if (!editedJob) return
    const jobDoc = doc(db, 'jobs', editedJob.id)
    const { id, ...updateData } = editedJob
    await updateDoc(jobDoc, updateData)
    setJob(editedJob)
    setIsEditing(false)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // ここで画像アップロードのロジックを実装
      // アップロード後、imagesステートを更新
    }
  }

  if (!job) {
    return <Layout><div className="flex justify-center items-center h-screen">読み込み中...</div></Layout>
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 bg-gray-50">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          求人一覧に戻る
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
          {job.status !== 'open' && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              この求人は現在下書きです
            </div>
          )}

          {images.length > 0 && (
            <div className="relative h-64 md:h-96">
              <Image
                src={images[currentImageIndex]}
                alt={`${job.shop_name}の画像`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{job.job_title}</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-700">{job.shop_name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">{job.location}</span>
              </div>
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">{job.industry}</span>
              </div>
              <div className="flex items-center">
                <CurrencyYenIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">{job.salary}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">{job.working_hours}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">{job.days_off}</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">席数: {job.seats}</span>
              </div>
              <div className="flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-700">客単価: {job.customer_unit_price}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">仕事内容</h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.job_description}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">応募資格</h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.requirements}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">求める人物像</h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.ideal_candidate}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">身につくスキル</h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.skills_to_acquire}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">待遇・福利厚生</h3>
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.benefits}</p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">勤務地情報</h3>
            <p className="mb-6 text-gray-700">
              <strong>最寄り駅:</strong> {job.nearest_station}<br />
              <strong>喫煙情報:</strong> {job.smoking_info}<br />
              <strong>休日:</strong> {job.holidays}
            </p>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">会社情報</h3>
            <p className="mb-6 text-gray-700">
              <strong>会社名:</strong> {job.company}<br />
              {job.company_info && <><strong>会社詳細:</strong> {job.company_info}<br /></>}
            </p>

            <div className="mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-medium w-full md:w-auto">
                応募する
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}