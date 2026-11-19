'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Redirecionar({ para }: { para: string }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(para)
  }, [router, para])
  return null
}
