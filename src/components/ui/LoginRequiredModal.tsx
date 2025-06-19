import {useNavigate} from 'react-router-dom'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginRequiredModal({isOpen, onClose}: LoginRequiredModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleJoin = () => {
    onClose()
    navigate('/join')
  }

  const handleLogin = () => {
    onClose()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-6">
          해당 기능을 이용하기 위해서는 로그인이 필요합니다. 회원가입 후 이용해 주세요.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleJoin}
            className="w-full bg-[#f1a852] hover:bg-[#e89a42] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
            회원가입
          </button>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
            로그인
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
