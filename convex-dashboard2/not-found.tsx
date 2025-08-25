'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

// Dynamically import the client-only SplashCursor to avoid RSC manifest issues
const SplashCursor = dynamic(() => import('@/components/react-bits/splash-cursor'), {
  ssr: false,
  loading: () => null,
})

export default function NotFoundPage() {
  return (
    <section className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-6xl font-black tracking-tight text-white text-center">Page not found</h1>
      <Link href="/">
        <div className="mt-16 bg-white text-black text-xl font-medium flex items-center justify-center px-6 py-3 rounded-full">
          <span>Home</span>
          <IconArrowRight className="ml-2" />
        </div>
      </Link>
      <SplashCursor />
    </section>
  )
}