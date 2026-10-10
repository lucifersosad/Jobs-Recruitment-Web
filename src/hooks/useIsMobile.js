import { useState, useEffect } from 'react'

export const MOBILE_BREAKPOINT = 768

const checkIsMobile = () => window.innerWidth < MOBILE_BREAKPOINT

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(checkIsMobile)

  useEffect(() => {
    let timer
    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIsMobile(checkIsMobile()), 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useIsMobile
