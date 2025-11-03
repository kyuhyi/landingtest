'use client'

import { useState, useEffect } from 'react'
import { DataTable, ColumnDef, TableAction } from '@/components/admin/data-table'
import { Search, Filter, Eye } from 'lucide-react'
import { getAllOrders } from '@/lib/firestore-utils'
import { Order } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

interface OrderData {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  amount: number
  status: OrderStatus
  items: number
  createdAt: string
  updatedAt: string
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  shipping: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const firestoreOrders = await getAllOrders()
        const formattedOrders: OrderData[] = firestoreOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderId,
          customerName: order.userName,
          customerEmail: order.userEmail,
          amount: order.amount,
          status: order.status as OrderStatus,
          items: 1, // 현재는 각 주문이 1개의 상품
          createdAt: order.createdAt.toDate().toISOString().split('T')[0],
          updatedAt: order.updatedAt.toDate().toISOString().split('T')[0],
        }))
        setOrders(formattedOrders)
      } catch (error) {
        console.error('주문 데이터 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Firestore에서 주문 상태 업데이트
      await import('@/lib/firestore-utils').then(module =>
        module.updateOrderStatus(orderId, newStatus as Order['status'])
      )

      // 로컬 상태 업데이트
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
            : order
        )
      )
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
      alert('주문 상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  const columns: ColumnDef<OrderData>[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
      render: (value) => <span className="font-medium text-blue-600">{value}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'items',
      label: 'Items',
      render: (value) => `${value} item${value > 1 ? 's' : ''}`,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => <span className="font-medium">${value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[value as OrderStatus]}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Order Date',
      sortable: true,
    },
  ]

  const actions: TableAction<OrderData>[] = [
    {
      label: 'View Details',
      onClick: (order) => {
        setSelectedOrder(order)
      },
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="preparing">Preparing</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <DataTable data={filteredOrders} columns={columns} actions={actions} />
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        statusColors[selectedOrder.status]
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">${selectedOrder.amount}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {(['paid', 'preparing', 'shipping', 'delivered', 'cancelled', 'refunded'] as OrderStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, status)
                          setSelectedOrder({ ...selectedOrder, status })
                        }}
                        disabled={selectedOrder.status === status}
                        className={`px-3 py-1 text-sm rounded ${
                          selectedOrder.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Mark as {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
