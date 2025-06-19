// components/PawRating.tsx
import React from 'react'
import PawIcon from './PawIcon'

interface PawRatingProps {
  rating: number // 0 ~ 5
}

const PawRating: React.FC<PawRatingProps> = ({rating}) => {
  const paws = Array.from({length: 5}, (_, i) => {
    const diff = rating - i
    const fillRatio = diff >= 1 ? 1 : diff > 0 ? 0.5 : 0

    // === 여기에 로그 찍기 ===
    // console.log(
    //   `[PawRating] Paw ${i}: rating=${rating}, diff=${diff}, calculated fillRatio=${fillRatio}`
    // )
    // ======================

    return <PawIcon key={i} fillRatio={fillRatio} />
  })

  return <div style={{display: 'flex', gap: 4}}>{paws}</div>
}

export default PawRating
