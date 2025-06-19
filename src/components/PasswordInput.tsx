// src/components/common/PasswordInput.tsx
import React, {useState} from 'react'
import {FaEye, FaEyeSlash} from 'react-icons/fa' // react-icons 설치 필요

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  className = 'form-control',
  label = '',
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword)
  }

  return (
    <div className="form-group password-input-group" style={{position: 'relative'}}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && '*'}
        </label>
      )}
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="password-toggle-btn"
        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
        style={{
          position: 'absolute',
          right: '10px',
          top: label ? '50%' : '50%', // CSS로 조정하는 것이 더 좋지만 일단 인라인
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          zIndex: 10,
          color: '#888'
        }}>
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>
  )
}
