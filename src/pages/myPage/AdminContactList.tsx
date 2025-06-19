
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface ContactMessage {
  id: number
  title: string
  content: string
  senderMid: number
  createdAt: string
  answered: boolean
}

export default function AdminContactList() {
  const [messages, setMessages] = useState<ContactMessage[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get('/api/contact')
      setMessages(response.data)
    }
    fetchMessages()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">문의 목록 (관리자)</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">제목</th>
            <th className="p-2 border">작성자</th>
            <th className="p-2 border">작성일</th>
            <th className="p-2 border">답변여부</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} className="text-center">
              <td className="p-2 border">{msg.id}</td>
              <td className="p-2 border">
                <Link to={`/admin/contact/${msg.id}`} className="text-blue-500 underline">
                  {msg.title}
                </Link>
              </td>
              <td className="p-2 border">{msg.senderMid}</td>
              <td className="p-2 border">{new Date(msg.createdAt).toLocaleString()}</td>
              <td className="p-2 border">{msg.answered ? '✅ 완료' : '❌ 미완료'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
