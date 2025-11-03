'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getUserOrders } from '@/lib/firestore-utils';
import type { Order } from '@/types/firestore';

export default function MypagePage() {
  const { userProfile } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentOrders = async () => {
      if (!userProfile) return;

      try {
        console.log('📦 최근 주문내역 로딩 중...');
        const orders = await getUserOrders(userProfile.id);
        setRecentOrders(orders.slice(0, 3)); // 최근 3개만
        console.log('✅ 주문내역 로딩 완료:', orders.length, '건');
      } catch (error) {
        console.error('❌ 주문내역 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentOrders();
  }, [userProfile]);

  return (
    <div className="space-y-6">
      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">메뉴</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/mypage/profile" className="p-3 bg-gray-50 rounded-md text-center hover:bg-gray-100 transition-colors no-underline text-gray-700">
            내 정보
          </Link>
          <Link href="/mypage/orders" className="p-3 bg-gray-50 rounded-md text-center hover:bg-gray-100 transition-colors no-underline text-gray-700">
            주문내역
          </Link>
          <Link href="/mypage/settings" className="p-3 bg-gray-50 rounded-md text-center hover:bg-gray-100 transition-colors no-underline text-gray-700">
            설정
          </Link>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          {userProfile?.profileImageUrl ? (
            <img
              src={userProfile.profileImageUrl}
              alt={userProfile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl">
              {userProfile?.name?.[0] || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userProfile?.name || '사용자'}</h2>
            <p className="text-gray-600">{userProfile?.email || 'user@example.com'}</p>
            <p className="text-sm text-gray-500 mt-1">
              회원 등급: {userProfile?.role === 'admin' ? '관리자' : '일반'}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">최근 주문</h3>
          {loading ? (
            <div className="text-center py-6 text-gray-500">로딩 중...</div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="pb-3 border-b border-gray-200 last:border-0">
                  <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.createdAt?.toDate().toLocaleDateString('ko-KR')} - {
                      order.status === 'completed' ? '결제완료' :
                      order.status === 'pending' ? '결제대기' :
                      order.status === 'cancelled' ? '취소됨' : '환불완료'
                    }
                  </p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    {order.amount.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">주문 내역이 없습니다</div>
          )}
          <Link href="/mypage/orders" className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium no-underline">
            전체 주문내역 보기 →
          </Link>
        </div>

        {/* Points */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">포인트</h3>
          <div className="text-center py-6">
            <p className="text-3xl font-bold text-blue-600">15,000</p>
            <p className="text-sm text-gray-600 mt-2">사용 가능 포인트</p>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">적립 예정</span>
              <span className="font-medium text-gray-900">2,000 P</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">소멸 예정</span>
              <span className="font-medium text-red-600">500 P</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">알림</h3>
          <div className="space-y-3">
            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">신규 강의 업데이트</p>
              <p className="text-xs text-gray-500 mt-1">2024.11.02</p>
            </div>
            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">포인트 적립 완료</p>
              <p className="text-xs text-gray-500 mt-1">2024.11.01</p>
            </div>
            <div className="pb-3">
              <p className="text-sm font-medium text-gray-900">배송 완료 안내</p>
              <p className="text-xs text-gray-500 mt-1">2024.10.30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          href="/mypage/profile"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center hover:border-blue-600 transition-colors no-underline"
        >
          <svg className="w-8 h-8 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">내 정보 관리</p>
        </Link>

        <Link
          href="/mypage/orders"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center hover:border-blue-600 transition-colors no-underline"
        >
          <svg className="w-8 h-8 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">주문/배송 조회</p>
        </Link>

        <Link
          href="/mypage/orders"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center hover:border-blue-600 transition-colors no-underline"
        >
          <svg className="w-8 h-8 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">포인트 내역</p>
        </Link>

        <Link
          href="/mypage/settings"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center hover:border-blue-600 transition-colors no-underline"
        >
          <svg className="w-8 h-8 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">고객센터</p>
        </Link>
      </div>
    </div>
  );
}
