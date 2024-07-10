"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface JobListing {
  id: string;
  job_title: string;
  company: string;
  location: string;
  salary: string;
  createdAt: Date;
}

export default function Jobs() {
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=100');
        if (!response.ok) {
throw new Error('情報の取得に失敗しました');
        }
        const jobsList = await response.json();
        setJobListings(jobsList);
      } catch (error) {
console.error('情報の取得中にエラーが発生しました:', error);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobListings.filter(job => 
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
<h1 className="text-3xl font-bold mb-6 text-center">情報一覧</h1>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
placeholder="情報を検索..."
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-2">{job.job_title}</h2>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-sm text-gray-500 mb-2">{job.location}</p>
              <p className="text-sm text-gray-500 mb-2">{job.salary}</p>
              <p className="text-xs text-gray-400 mb-2">
                {job.createdAt && typeof job.createdAt === 'string'
                  ? formatDistanceToNow(parseISO(job.createdAt), { addSuffix: true, locale: ja })
                  : '日付不明'}
              </p>
              <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline text-sm">
                詳細を見る
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  )
}
