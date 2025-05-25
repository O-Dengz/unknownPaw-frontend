// components/ReservationEditModal.tsx
import React from 'react'
import axios from 'axios'

interface Reservation {
  rno: number
  confirmationDate: string
  futureDate: string
  defaultLocation: string
  serviceCategory: 'WALK' | 'CARE' | 'HOTEL'
  decideHourRate: number
  mid: number
  petId?: number
  postType?: 'PET_OWNER' | 'PET_SITTER'
  petOwnerPostId?: number
  petSitterPostId?: number
}

interface FormData {
  confirmationDate: string;
  futureDate: string;
  defaultLocation: string;
  serviceCategory: '산책' | '돌봄' | '호텔';
  decideHourRate: string;
}

interface ReservationPayload {
  confirmationDate: string;
  futureDate: string;
  defaultLocation: string;
  serviceCategory: 'WALK' | 'CARE' | 'HOTEL';
  decideHourRate: number;
  mid: number;
  chat: string;
  readTheOriginalText: true;
  flexibleLocation: string;
  petId?: number;
  petOwnerPostId?: number;
  petSitterPostId?: number;
}

interface Props {
  isOpen: boolean
  onClose: () => void
  reservation: Reservation
  onUpdate?: () => void
}

export function ReservationEditModal({isOpen, onClose, reservation, onUpdate}: Props) {
  if (!isOpen || !reservation) return null

  const handleSubmit = async (formData: FormData) => {
    try {
      const korToEnum: Record<FormData['serviceCategory'], ReservationPayload['serviceCategory']> = {
        산책: 'WALK',
        돌봄: 'CARE',
        호텔: 'HOTEL'
      } as const

      const payload: ReservationPayload = {
        confirmationDate: formData.confirmationDate,
        futureDate: formData.futureDate,
        defaultLocation: formData.defaultLocation,
        serviceCategory: korToEnum[formData.serviceCategory],
        decideHourRate: Number(formData.decideHourRate),
        mid: reservation.mid,
        chat: '',
        readTheOriginalText: true,
        flexibleLocation: ''
      }

      // 역할에 따라 postId 설정
      if (reservation.postType === 'PET_SITTER') {
        if (reservation.petId) payload.petId = reservation.petId;
        payload.petSitterPostId = reservation.petSitterPostId;
      } else if (reservation.postType === 'PET_OWNER') {
         payload.petOwnerPostId = reservation.petOwnerPostId;
      }

      await axios.put(
        `http://localhost:8080/unknownPaw/api/appointment/${reservation.rno}`,
        payload
      )

      alert('✅ 예약이 수정되었습니다!')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('❌ 수정 실패', error)
      alert('예약 수정에 실패했습니다.')
    }
  }

  const handleCancelReservation = async () => {
    try {
      const confirm = window.confirm('정말 이 예약을 취소하시겠습니까?')
      if (!confirm) return

      await axios.delete(
        `http://localhost:8080/unknownPaw/api/appointment/${reservation.rno}`
      )
      alert('🚫 예약이 취소되었습니다.')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('❌ 예약 취소 실패', error)
      alert('예약 취소에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl w-full max-w-2xl shadow-xl transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">예약 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
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
            const formData: FormData = {
              confirmationDate: form.confirmationDate.value,
              futureDate: form.futureDate.value,
              defaultLocation: form.defaultLocation.value,
              serviceCategory: form.serviceCategory.value as FormData['serviceCategory'],
              decideHourRate: form.decideHourRate.value
            }
            handleSubmit(formData)
          }}
          className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서비스 종류
            </label>
            <select
              name="serviceCategory"
              defaultValue={
                reservation.serviceCategory === 'WALK'
                  ? '산책'
                  : reservation.serviceCategory === 'CARE'
                  ? '돌봄'
                  : '호텔'
              }
              className="w-full px-4 py-2 border rounded-lg">
              <option value="산책">산책</option>
              <option value="돌봄">돌봄</option>
              <option value="호텔">호텔</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서비스 예약일
            </label>
            <input
              name="confirmationDate"
              type="datetime-local"
              defaultValue={reservation?.confirmationDate?.slice(0, 16)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서비스 종료일
            </label>
            <input
              name="futureDate"
              type="datetime-local"
              defaultValue={reservation?.futureDate?.slice(0, 16)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기본 위치
            </label>
            <input
              name="defaultLocation"
              defaultValue={reservation.defaultLocation}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시급 (원)
            </label>
            <input
              name="decideHourRate"
              type="number"
              min={0}
              defaultValue={reservation.decideHourRate}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleCancelReservation}
              className="px-2 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
              예약 취소
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-2 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
                닫기
              </button>
              <button
                type="submit"
                className="px-2 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
                수정 완료
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
