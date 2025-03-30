"use client"
import { configType, useQuizConfig } from '@/store'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  quiz
}: {
  children: React.ReactNode,
  quiz: React.ReactNode,

}) {
  const config = useQuizConfig((state: any) => state.config)
  let render = config.status ? quiz : children;
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="absolute h-screen w-full bg-slate-950 -z-10"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div></div>

        {render}
      </body>
    </html>
  )
}
