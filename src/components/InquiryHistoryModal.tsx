import { useEffect, useState } from 'react'
import axios from 'axios'

interface Inquiry {
  messageId: number
  subject: string
  message: string
  createdAt: string
  answers: {
    answerId: number
    content: string
    adminName: string
    createdAt: string
  }[]
}

export function InquiryHistoryModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberString = sessionStorage.getItem('member')
        const member = memberString ? JSON.parse(memberString) : null
        const mid = member?.mid
        const res = await axios.get(`/api/contact/my?mid=${mid}`)
        setData(res.data)
      } catch (err) {
        setError('조회 실패')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">나의 문의 내역</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}>
          ✕
        </button>
        {loading ? (
          <p>불러오는 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length === 0 ? (
          <p>문의 내역이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {data.map(inquiry => (
              <div key={inquiry.messageId} className="border p-4 rounded">
                <p className="font-semibold">{inquiry.subject}</p>
                <p className="text-sm text-gray-600">{inquiry.createdAt}</p>
                <p className="mt-2 whitespace-pre-line">{inquiry.message}</p>
                {inquiry.answers.length > 0 && (
                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">답변</p>
                    {inquiry.answers.map(ans => (
                      <div key={ans.answerId} className="mt-2">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {ans.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">- {ans.adminName}, {ans.createdAt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
