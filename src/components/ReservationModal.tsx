import React from 'react'
import axios from 'axios'
import { PersonStanding } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  memberId: number
  petId: number
  postId: number
  postType: 'PET_OWNER' | 'PET_SITTER'
}

export function ReservationModal({
  isOpen,
  onClose,
  memberId,
  petId,
  postId,
  postType
}: Props) {
  if (!isOpen) return null

  const handleSubmit = async (formData: any) => {
    try {
      const korToEnum = {
        산책: 'WALK',
        돌봄: 'CARE',
        호텔: 'HOTEL'
      }

      const payload: Record<string, any> = {
        confirmationDate: formData.confirmationDate,
        futureDate: formData.futureDate,
        defaultLocation: formData.defaultLocation,
        serviceCategory: korToEnum[formData.serviceCategory],
        decideHourRate: Number(formData.decideHourRate),
        mid: memberId,
        flexibleLocation: '',
        chat: '',
        readTheOriginalText: true
      }
      
      if (postType === 'PET_SITTER') {
        if (petId) payload.petId = petId
        payload.petSitterPostId = postId
      } else if (postType === 'PET_OWNER') {
        payload.petOwnerPostId = postId
      }
      console.log('🟡 수정 payload 확인:', payload)

      await axios.post('http://localhost:8080/unknownPaw/api/appointment', payload)
      alert('✅ 예약이 완료되었습니다!')
      onClose()
    } catch (error) {
      console.error('❌ 예약 실패', error)
      alert('예약에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-12 rounded-2xl w-full max-w-2xl shadow-2xl space-y-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800">서비스 예약</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="닫기">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form
          onSubmit={e => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const formData = {
              confirmationDate: form.confirmationDate.value,
              futureDate: form.futureDate.value,
              defaultLocation: form.defaultLocation.value,
              serviceCategory: form.serviceCategory.value,
              decideHourRate: form.decideHourRate.value
            }
            handleSubmit(formData)
          }}
          className="space-y-6 text-base text-gray-700">
          {/* 필드 */}
          {[
            {
              label: '서비스 종류',
              name: 'serviceCategory',
              type: 'select',
              options: ['산책', '돌봄', '호텔']
            },
            {
              label: '서비스 예약일',
              name: 'confirmationDate',
              type: 'datetime-local'
            },
            {
              label: '서비스 종료일',
              name: 'futureDate',
              type: 'datetime-local'
            },
            {
              label: '기본 위치',
              name: 'defaultLocation',
              type: 'text',
              placeholder: '예: 서울시 강남구'
            },
            {
              label: '시급 (원)',
              name: 'decideHourRate',
              type: 'number',
              placeholder: '예: 12000'
            }
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block mb-1 font-medium">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200">
                  {field.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              )}
            </div>
          ))}

          {/* 버튼 */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-32 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition">
              취소
            </button>
            <button
              type="submit"
              className="w-32 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition">
              예약 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
