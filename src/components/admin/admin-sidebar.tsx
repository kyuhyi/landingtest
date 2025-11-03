'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, Package, ShoppingCart, Settings } from 'lucide-react'

const adminMenuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: BarChart3
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users
  },
  {
    title: '강의 관리',
    href: '/admin/products',
    icon: Package
  },
  {
    title: '주문 관리',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: Settings
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">관리자 패널</h2>
      </div>
      <nav className="px-4">
        {adminMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
