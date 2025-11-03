'use client'

import { useState } from 'react'
import { DataTable, ColumnDef, TableAction } from '@/components/admin/data-table'
import { Search, Filter, PackagePlus } from 'lucide-react'
import { products } from '@/data/products'

interface CourseAdmin {
  id: string
  name: string
  category: string
  price: string
  duration: string
  level: string
  status: 'active' | 'inactive' | 'discontinued'
  isVisible: boolean
  enrolledStudents: number
  createdAt: string
  updatedAt: string
}

const mockCourses: CourseAdmin[] = products.map((product, index) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  duration: product.duration,
  level: product.level,
  status: 'active' as const,
  isVisible: true,
  enrolledStudents: Math.floor(Math.random() * 200) + 50,
  createdAt: '2025-01-10',
  updatedAt: '2025-10-15',
}))

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  discontinued: 'bg-red-100 text-red-700',
}

const statusLabels = {
  active: '운영중',
  inactive: '비활성',
  discontinued: '종료',
}

export default function ProductsManagement() {
  const [courses, setCourses] = useState<CourseAdmin[]>(mockCourses)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('전체')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'discontinued'>(
    'all'
  )

  const categories = ['전체', ...Array.from(new Set(courses.map((p) => p.category)))]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === '전체' || course.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const columns: ColumnDef<CourseAdmin>[] = [
    {
      key: 'name',
      label: '강의명',
      sortable: true,
    },
    {
      key: 'category',
      label: '카테고리',
      sortable: true,
    },
    {
      key: 'price',
      label: '가격',
      sortable: true,
    },
    {
      key: 'enrolledStudents',
      label: '수강생',
      sortable: true,
      render: (value) => `${value}명`,
    },
    {
      key: 'duration',
      label: '기간',
    },
    {
      key: 'level',
      label: '난이도',
    },
    {
      key: 'status',
      label: '상태',
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            statusColors[value as keyof typeof statusColors]
          }`}
        >
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      ),
    },
    {
      key: 'isVisible',
      label: '노출',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
          {value ? '노출' : '숨김'}
        </span>
      ),
    },
  ]

  const actions: TableAction<CourseAdmin>[] = [
    {
      label: '수정',
      onClick: (course) => {
        alert(`강의 수정: ${course.name}`)
      },
    },
    {
      label: '노출 전환',
      onClick: (course) => {
        setCourses(
          courses.map((c) =>
            c.id === course.id ? { ...c, isVisible: !c.isVisible } : c
          )
        )
      },
    },
    {
      label: '삭제',
      onClick: (course) => {
        if (confirm(`정말 ${course.name} 강의를 삭제하시겠습니까?`)) {
          setCourses(courses.filter((c) => c.id !== course.id))
        }
      },
      variant: 'destructive',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">강의 관리</h1>
          <p className="text-gray-600 mt-1">온라인 강의 목록을 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PackagePlus className="w-5 h-5" />
          강의 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="강의명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">전체 상태</option>
              <option value="active">운영중</option>
              <option value="inactive">비활성</option>
              <option value="discontinued">종료</option>
            </select>
          </div>
        </div>

        <DataTable data={filteredCourses} columns={columns} actions={actions} />
      </div>
    </div>
  )
}
