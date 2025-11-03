'use client'

import { MetricCard } from '@/components/admin/metric-card'
import { Users, UserPlus, ShoppingCart, DollarSign } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const salesData = [
  { month: '1월', revenue: 45000000 },
  { month: '2월', revenue: 52000000 },
  { month: '3월', revenue: 48000000 },
  { month: '4월', revenue: 61000000 },
  { month: '5월', revenue: 55000000 },
  { month: '6월', revenue: 67000000 },
]

const courseSalesData = [
  { course: '풀스택 웹 개발', sales: 145 },
  { course: '프론트엔드 집중', sales: 98 },
  { course: '모바일 앱 개발', sales: 87 },
  { course: 'Python 데이터', sales: 72 },
  { course: '백엔드 개발자', sales: 65 },
]

const recentUsers = [
  { id: '1', name: '김철수', email: 'kim@example.com', date: '2025-11-02' },
  { id: '2', name: '이영희', email: 'lee@example.com', date: '2025-11-02' },
  { id: '3', name: '박지민', email: 'park@example.com', date: '2025-11-01' },
  { id: '4', name: '최민수', email: 'choi@example.com', date: '2025-11-01' },
  { id: '5', name: '정수연', email: 'jung@example.com', date: '2025-11-01' },
]

const recentOrders = [
  { id: '#12345', customer: '김철수', amount: 2400000, status: 'paid', date: '2025-11-02', course: '풀스택 웹 개발' },
  { id: '#12346', customer: '이영희', amount: 1800000, status: 'shipping', date: '2025-11-02', course: '프론트엔드 집중' },
  { id: '#12347', customer: '박지민', amount: 2200000, status: 'delivered', date: '2025-11-02', course: '모바일 앱 개발' },
  { id: '#12348', customer: '최민수', amount: 1600000, status: 'paid', date: '2025-11-01', course: 'Python 데이터' },
  { id: '#12349', customer: '정수연', amount: 2000000, status: 'preparing', date: '2025-11-01', course: '백엔드 개발자' },
  { id: '#12350', customer: '강동원', amount: 2400000, status: 'paid', date: '2025-11-01', course: '풀스택 웹 개발' },
  { id: '#12351', customer: '손예진', amount: 1800000, status: 'shipping', date: '2025-11-01', course: '프론트엔드 집중' },
  { id: '#12352', customer: '이정재', amount: 2200000, status: 'delivered', date: '2025-11-01', course: '모바일 앱 개발' },
  { id: '#12353', customer: '전지현', amount: 1600000, status: 'paid', date: '2025-10-31', course: 'Python 데이터' },
  { id: '#12354', customer: '송중기', amount: 2000000, status: 'preparing', date: '2025-10-31', course: '백엔드 개발자' },
]

const statusColors = {
  paid: 'bg-blue-100 text-blue-700',
  shipping: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  preparing: 'bg-purple-100 text-purple-700',
}

const statusLabels = {
  paid: '결제완료',
  shipping: '배송중',
  delivered: '수강중',
  preparing: '준비중',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">대시보드 개요</h1>
        <p className="text-gray-600">환영합니다! 오늘의 현황을 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="전체 회원"
          value="2,547명"
          change={12.5}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="오늘 신규 가입"
          value="34명"
          change={8.2}
          icon={UserPlus}
          color="green"
        />
        <MetricCard
          title="전체 주문"
          value="1,423건"
          change={-3.1}
          icon={ShoppingCart}
          color="purple"
        />
        <MetricCard
          title="총 매출"
          value="3억 2,845만원"
          change={15.3}
          icon={DollarSign}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 매출</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${(value / 10000).toFixed(0)}만원`, '매출']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">강의별 판매량</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="course" stroke="#666" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}명`, '수강생']}
              />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 가입 회원</h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <p className="text-sm text-gray-500">{user.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 주문</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer} - {order.course}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-900">{(order.amount / 10000).toFixed(0)}만원</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
