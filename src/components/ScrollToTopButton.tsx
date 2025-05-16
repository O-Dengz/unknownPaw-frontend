// components/ScrollToTopButton.tsx
import React, {useEffect, useState} from 'react'

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    setVisible(scrolled > 300)
  }

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible)
    return () => window.removeEventListener('scroll', toggleVisible)
  }, [])

  return (
    visible && (
      <span
        onClick={handleScrollTop}
        className="scroll-top btn-hover fixed bottom-4 right-4 z-50">
        <i className="lni lni-chevron-up text-2xl" />
      </span>
    )
  )
}

export default ScrollToTopButton
