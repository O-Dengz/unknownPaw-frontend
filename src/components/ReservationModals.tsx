import './ReservationModal.css'
import React from 'react'
import axios from 'axios'
import {X, Trash2} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/* 공통 래퍼 – 바깥(Backdrop) + 안쪽(Card)                                    */
/* -------------------------------------------------------------------------- */
interface BaseModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}
const ModalCard: React.FC<BaseModalProps> = ({isOpen, title, onClose, children}) => {
  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal-card">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ========================================================================== */
/* 1) 예약 생성 모달 (상세 페이지 → “예약하기”)                               */
/* ========================================================================== */
type NewModalProps = {
  isOpen: boolean
  onClose: () => void
  memberId: number
  petId?: number
  postId: number
  postType: 'PET_OWNER' | 'PET_SITTER'
}

export const ReservationModal: React.FC<NewModalProps> = ({
  isOpen,
  onClose,
  memberId,
  petId,
  postId,
  postType
}) => {
  const handleSubmit = async (formData: Record<string, string>) => {
    const korToEnum = {산책: 'WALK', 돌봄: 'CARE', 호텔: 'HOTEL'} as const

    const payload: any = {
      confirmationDate: formData.confirmationDate,
      futureDate: formData.futureDate,
      defaultLocation: formData.defaultLocation,
      serviceCategory: korToEnum[formData.serviceCategory as keyof typeof korToEnum],
      decideHourRate: Number(formData.decideHourRate),
      mid: memberId,
      flexibleLocation: '',
      chat: '',
      readTheOriginalText: true
    }

    if (postType === 'PET_SITTER') {
      if (petId) payload.petId = petId
      payload.petSitterPostId = postId
    } else {
      payload.petOwnerPostId = postId
    }

    await axios.post('/unknownPaw/api/appointment', payload)
    alert('✅ 예약이 완료되었습니다!')
    onClose()
  }

  /* ---------------------------- 렌더링 ----------------------------------- */
  return (
    <ModalCard isOpen={isOpen} title="서비스 예약" onClose={onClose}>
      <FormBody onSubmit={handleSubmit} onCancel={onClose} />
    </ModalCard>
  )
}

/* ========================================================================== */
/* 2) 예약 수정 모달 (예약 목록 → “수정”)                                     */
/* ========================================================================== */
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

type EditModalProps = {
  isOpen: boolean
  onClose: () => void
  reservation: Reservation | null
  onUpdate?: () => void
}

export const ReservationEditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onUpdate
}) => {
  if (!isOpen || !reservation) return null

  const kor = {WALK: '산책', CARE: '돌봄', HOTEL: '호텔'} as const
  const enumMap = {산책: 'WALK', 돌봄: 'CARE', 호텔: 'HOTEL'} as const

  const handleSubmit = async (formData: Record<string, string>) => {
    const payload: any = {
      confirmationDate: formData.confirmationDate,
      futureDate: formData.futureDate,
      defaultLocation: formData.defaultLocation,
      serviceCategory: enumMap[formData.serviceCategory as keyof typeof enumMap],
      decideHourRate: Number(formData.decideHourRate),
      mid: reservation.mid,
      flexibleLocation: '',
      chat: '',
      readTheOriginalText: true
    }

    if (reservation.postType === 'PET_SITTER') {
      if (reservation.petId) payload.petId = reservation.petId
      payload.petSitterPostId = reservation.petSitterPostId
    } else {
      payload.petOwnerPostId = reservation.petOwnerPostId
    }

    await axios.put(`/unknownPaw/api/appointment/${reservation.rno}`, payload)
    alert('✅ 예약이 수정되었습니다!')
    onUpdate?.()
    onClose()
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return
    await axios.delete(`/unknownPaw/api/appointment/${reservation.rno}`)
    alert('🚫 예약이 취소되었습니다.')
    onUpdate?.()
    onClose()
  }

  /* ---------------------------- 렌더링 ----------------------------------- */
  return (
    <ModalCard isOpen={isOpen} title="예약 수정" onClose={onClose}>
      <FormBody
        defaultValues={{
          confirmationDate: reservation.confirmationDate.slice(0, 16),
          futureDate: reservation.futureDate.slice(0, 16),
          defaultLocation: reservation.defaultLocation,
          serviceCategory: kor[reservation.serviceCategory],
          decideHourRate: String(reservation.decideHourRate)
        }}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />

      {/* 하단 취소 버튼 */}
      <button
        onClick={handleDelete}
        className="mt-6 flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
        <Trash2 size={16} /> 예약 취소
      </button>
    </ModalCard>
  )
}

/* -------------------------------------------------------------------------- */
/* 🔸 재사용 가능한 폼 바디 컴포넌트                                         */
/* -------------------------------------------------------------------------- */
type FormBodyProps = {
  onSubmit: (f: Record<string, string>) => void
  onCancel: () => void
  defaultValues?: Partial<Record<string, string>>
}

const FormBody: React.FC<FormBodyProps> = ({onSubmit, onCancel, defaultValues}) => (
  <form
    className="space-y-5"
    onSubmit={e => {
      e.preventDefault()
      const f = e.target as HTMLFormElement
      onSubmit({
        confirmationDate: f.confirmationDate.value,
        futureDate: f.futureDate.value,
        defaultLocation: f.defaultLocation.value,
        serviceCategory: f.serviceCategory.value,
        decideHourRate: f.decideHourRate.value
      })
    }}>
    {/* 필드 배열 돌리기 */}
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
        placeholder: '예) 서울시 강남구'
      },
      {
        label: '시급 (원)',
        name: 'decideHourRate',
        type: 'number',
        placeholder: '예) 12000'
      }
    ].map(field => (
      <div key={field.name} className="reservation-form-field">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {field.label}
        </label>

        {field.type === 'select' ? (
          <select
            name={field.name}
            defaultValue={defaultValues?.[field.name] ?? field.options?.[0]}
            className="w-full rounded-lg border px-4 py-2">
            {field.options!.map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            defaultValue={defaultValues?.[field.name]}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
            required
          />
        )}
      </div>
    ))}

    {/* 하단 버튼 */}
    <div className="flex justify-end gap-3 pt-4">
      <button type="submit" className="custom-btn custom-btn-primary">
        저장
      </button>
      <button type="button" onClick={onCancel} className="custom-btn custom-btn-cancel">
        취소
      </button>
    </div>
  </form>
)
