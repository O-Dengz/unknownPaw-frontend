// src/pages/admin/AdminContactDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface ContactMessage {
  id: number
  title: string
  content: string
  senderMid: number
  createdAt: string
  answer?: {
    content: string
    responderMid: number
    createdAt: string
  }
}

export default function AdminContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [answer, setAnswer] = useState('')

  const member = JSON.parse(sessionStorage.getItem('member') || '{}')

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await axios.get(`/api/contact/${id}`)
      setMessage(response.data)
    }
    fetchMessage()
  }, [id])

  const handleSubmit = async () => {
    if (!member?.mid || member?.role !== 'ADMIN') {
      alert('관리자 권한이 필요합니다.')
      return
    }

    try {
      await axios.post('/api/contact/answer', {
        contactMessageId: Number(id),
        content: answer,
        responderMid: member.mid
      })
      alert('답변이 등록되었습니다.')
      navigate('/admin/contact')
    } catch (err) {
      alert('답변 등록에 실패했습니다.')
    }
  }

  if (!message) return <div>로딩 중...</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">문의 상세</h2>
      <div className="border p-4 mb-4">
        <h3 className="font-semibold">제목: {message.title}</h3>
        <p className="mt-2 whitespace-pre-line">{message.content}</p>
        <p className="text-sm text-gray-500 mt-2">작성자 ID: {message.senderMid}</p>
        <p className="text-sm text-gray-500">작성일: {new Date(message.createdAt).toLocaleString()}</p>
      </div>

      {message.answer ? (
        <div className="border p-4 bg-green-50">
          <h4 className="font-semibold text-green-700">답변</h4>
          <p className="mt-2 whitespace-pre-line">{message.answer.content}</p>
          <p className="text-sm text-gray-500 mt-2">답변자 ID: {message.answer.responderMid}</p>
          <p className="text-sm text-gray-500">답변일: {new Date(message.answer.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            className="w-full border p-2 h-40"
            placeholder="답변 내용을 입력하세요..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            답변 등록
          </button>
        </div>
      )}
    </div>
  )
}
