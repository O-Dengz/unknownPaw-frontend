// components/ReservationModal.tsx
import React from 'react'
import axios from 'axios'

interface ReservationDetails {
  rno: number
  type: string
  date: string
  owner: string
  petName: string
  duration: string
  price: string
  rating: string
  chat: string
  location: string
}

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

      const payload = {
        ...formData,
        serviceCategory: korToEnum[formData.serviceCategory],
        mid: memberId,
        petId: petId,
        petOwnerPostId: postType === 'PET_OWNER' ? postId : null,
        petSitterPostId: postType === 'PET_SITTER' ? postId : null
      }

      const response = await axios.post(
        'http://localhost:8080/unknownPaw/api/appointment',
        payload
      )

      alert('✅ 예약이 완료되었습니다!')
      console.log('서버 응답:', response.data)
      onClose()
    } catch (error) {
      console.error('❌ 예약 실패', error)
      alert('예약에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">예약하기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg
              className="w-6 h-6"
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

        <form
          onSubmit={e => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const formData = {
              confirmationDate: form.confirmationDate.value + ':00',
              futureDate: form.futureDate.value + ':00',
              defaultLocation: form.defaultLocation.value,
              serviceCategory: form.serviceCategory.value
            }
            handleSubmit(formData)
          }}
          className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">서비스 종류</label>
            <select name="serviceCategory" className="w-full px-4 py-2 border rounded-lg">
              <option value="산책">산책</option>
              <option value="돌봄">돌봄</option>
              <option value="호텔">호텔</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">예약일</label>
            <input
              name="confirmationDate"
              type="datetime-local"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              서비스 실행일
            </label>
            <input
              name="futureDate"
              type="datetime-local"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">기본 위치</label>
            <input
              name="defaultLocation"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-gray-700">
              취소
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
              예약 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
