'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getUserOrders } from '@/lib/firestore-utils';
import { Order as FirestoreOrder } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
}

const STATUS_TEXT = {
  pending: '주문확인중',
  paid: '결제완료',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소'
};

const STATUS_COLOR = {
  pending: 'text-gray-600 bg-gray-100',
  paid: 'text-blue-600 bg-blue-100',
  shipping: 'text-green-600 bg-green-100',
  delivered: 'text-gray-900 bg-gray-200',
  cancelled: 'text-red-600 bg-red-100'
};

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    orderDate: '2024-11-01',
    status: 'paid',
    totalAmount: 2400000,
    items: [
      {
        productId: 'fullstack-web',
        productName: '풀스택 웹 개발 종합반',
        productImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
        quantity: 1,
        price: 2400000
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    orderDate: '2024-10-15',
    status: 'delivered',
    totalAmount: 1800000,
    items: [
      {
        productId: 'frontend',
        productName: '프론트엔드 집중 과정',
        productImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop',
        quantity: 1,
        price: 1800000
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    orderDate: '2024-09-20',
    status: 'delivered',
    totalAmount: 1600000,
    items: [
      {
        productId: 'data-analysis',
        productName: 'Python 데이터 분석',
        productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        quantity: 1,
        price: 1600000
      }
    ]
  }
];

export default function OrdersPage() {
  const { userProfile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userProfile) {
        setLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders(userProfile.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('주문 내역 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile]);

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">주문내역</h1>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">주문내역</h1>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기간
            </label>
            <div className="flex gap-2 flex-wrap">
              {['all', '1month', '3month', '6month', '1year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'all' && '전체'}
                  {period === '1month' && '1개월'}
                  {period === '3month' && '3개월'}
                  {period === '6month' && '6개월'}
                  {period === '1year' && '1년'}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주문상태
            </label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'paid', 'shipping', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' && '전체'}
                  {status !== 'all' && STATUS_TEXT[status as keyof typeof STATUS_TEXT]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">주문 내역이 없습니다.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{order.orderId}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${STATUS_COLOR[order.status]}`}>
                      {STATUS_TEXT[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">주문일: {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">총 결제금액</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(order.amount)}</p>
                </div>
              </div>

              {/* Order Item */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{order.productName}</h4>
                    <p className="text-sm text-gray-600">결제키: {order.paymentKey}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(order.amount)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <Link
                  href={`/products/${order.productId}`}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center no-underline"
                >
                  상품 상세보기
                </Link>
                {order.status === 'completed' && (
                  <Link
                    href={`/reviews/write?orderId=${order.id}&productId=${order.productId}`}
                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center no-underline"
                  >
                    리뷰 작성
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            이전
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
            1
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            다음
          </button>
        </div>
      )}
    </div>
  );
}
