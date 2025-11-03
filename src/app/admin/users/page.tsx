'use client'

import { useState, useEffect } from 'react'
import { DataTable, ColumnDef, TableAction } from '@/components/admin/data-table'
import { Search, Filter, UserPlus } from 'lucide-react'
import { getAllUsers } from '@/lib/firestore-utils'
import { User } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

interface UserTableData {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLoginAt?: string
}

const mockUsers: UserTableData[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-01-15',
    lastLoginAt: '2025-11-02',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-02-20',
    lastLoginAt: '2025-11-02',
  },
  {
    id: '3',
    name: '박지민',
    email: 'park@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-03-10',
    lastLoginAt: '2025-11-01',
  },
  {
    id: '4',
    name: '최민수',
    email: 'choi@example.com',
    role: 'user',
    status: 'suspended',
    createdAt: '2025-04-05',
    lastLoginAt: '2025-10-25',
  },
  {
    id: '5',
    name: '정수연',
    email: 'jung@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-05-12',
    lastLoginAt: '2025-11-01',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
}

const statusLabels = {
  active: '활성',
  inactive: '비활성',
  suspended: '정지',
}

const roleColors = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
}

const roleLabels = {
  admin: '관리자',
  user: '사용자',
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error('회원 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return date.toLocaleDateString('ko-KR')
  }

  const filteredUsers: UserTableData[] = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
    .map((user) => ({
      id: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active' as const,
      createdAt: formatDate(user.createdAt),
      lastLoginAt: user.updatedAt ? formatDate(user.updatedAt) : undefined,
    }))

  const columns: ColumnDef<UserTableData>[] = [
    {
      key: 'name',
      label: '이름',
      sortable: true,
    },
    {
      key: 'email',
      label: '이메일',
      sortable: true,
    },
    {
      key: 'role',
      label: '역할',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${roleColors[value as keyof typeof roleColors]}`}>
          {roleLabels[value as keyof typeof roleLabels]}
        </span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {statusLabels[value as keyof typeof statusLabels]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '가입일',
      sortable: true,
    },
    {
      key: 'lastLoginAt',
      label: '최근 로그인',
      render: (value) => value || '없음',
    },
  ]

  const actions: TableAction<UserTableData>[] = [
    {
      label: '수정',
      onClick: (user) => {
        alert(`회원 수정: ${user.name}`)
      },
    },
    {
      label: '삭제',
      onClick: (user) => {
        if (confirm(`정말 ${user.name} 회원을 삭제하시겠습니까?`)) {
          setUsers(users.filter((u) => u.uid !== user.id))
        }
      },
      variant: 'destructive',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600 mt-1">회원 계정 및 권한을 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          회원 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">전체 역할</option>
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
          </div>
        </div>

        <DataTable data={filteredUsers} columns={columns} actions={actions} />
      </div>
    </div>
  )
}
