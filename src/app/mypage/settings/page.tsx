'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NotificationSettings {
  emailOrder: boolean;
  emailShipping: boolean;
  emailMarketing: boolean;
  smsOrder: boolean;
  smsShipping: boolean;
  pushNotification: boolean;
}

interface PrivacySettings {
  privacyPolicy: boolean;
  marketingConsent: boolean;
  thirdPartyConsent: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailOrder: true,
    emailShipping: true,
    emailMarketing: false,
    smsOrder: true,
    smsShipping: false,
    pushNotification: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    privacyPolicy: true,
    marketingConsent: false,
    thirdPartyConsent: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleSaveNotifications = () => {
    alert('알림 설정이 저장되었습니다.');
  };

  const handleSavePrivacy = () => {
    alert('개인정보 설정이 저장되었습니다.');
  };

  const handleChangePassword = () => {
    setShowPasswordModal(false);
    alert('비밀번호가 변경되었습니다.');
  };

  const handleWithdraw = () => {
    if (confirm('정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
      setShowWithdrawModal(false);
      router.push('/');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">설정</h1>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">알림 설정</h2>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">이메일 알림</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">주문 알림</span>
                <input
                  type="checkbox"
                  checked={notifications.emailOrder}
                  onChange={(e) => setNotifications({ ...notifications, emailOrder: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">배송 알림</span>
                <input
                  type="checkbox"
                  checked={notifications.emailShipping}
                  onChange={(e) => setNotifications({ ...notifications, emailShipping: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">마케팅 정보 수신</span>
                <input
                  type="checkbox"
                  checked={notifications.emailMarketing}
                  onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SMS 알림</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">주문 알림</span>
                <input
                  type="checkbox"
                  checked={notifications.smsOrder}
                  onChange={(e) => setNotifications({ ...notifications, smsOrder: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">배송 알림</span>
                <input
                  type="checkbox"
                  checked={notifications.smsShipping}
                  onChange={(e) => setNotifications({ ...notifications, smsShipping: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">푸시 알림</h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">푸시 알림 수신</span>
              <input
                type="checkbox"
                checked={notifications.pushNotification}
                onChange={(e) => setNotifications({ ...notifications, pushNotification: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveNotifications}
          className="mt-6 w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          알림 설정 저장
        </button>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">개인정보 설정</h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={privacy.privacyPolicy}
              onChange={(e) => setPrivacy({ ...privacy, privacyPolicy: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">개인정보 처리방침 동의 (필수)</span>
              <p className="text-xs text-gray-500 mt-1">
                서비스 이용을 위해 필수적으로 동의해야 합니다.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={privacy.marketingConsent}
              onChange={(e) => setPrivacy({ ...privacy, marketingConsent: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">마케팅 정보 수신 동의 (선택)</span>
              <p className="text-xs text-gray-500 mt-1">
                신규 강의, 이벤트 등의 마케팅 정보를 받아볼 수 있습니다.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={privacy.thirdPartyConsent}
              onChange={(e) => setPrivacy({ ...privacy, thirdPartyConsent: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">제3자 정보 제공 동의 (선택)</span>
              <p className="text-xs text-gray-500 mt-1">
                서비스 향상을 위한 제휴사에 정보를 제공할 수 있습니다.
              </p>
            </div>
          </label>
        </div>

        <button
          onClick={handleSavePrivacy}
          className="mt-6 w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          개인정보 설정 저장
        </button>
      </div>

      {/* Account Management */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">계정 관리</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">비밀번호 변경</h3>
              <p className="text-xs text-gray-500 mt-1">정기적인 비밀번호 변경을 권장합니다.</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              변경
            </button>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">이메일 변경</h3>
              <p className="text-xs text-gray-500 mt-1">계정 이메일 주소를 변경할 수 있습니다.</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              변경
            </button>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="text-sm font-medium text-red-600">회원탈퇴</h3>
              <p className="text-xs text-gray-500 mt-1">회원 탈퇴 시 모든 데이터가 삭제됩니다.</p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="현재 비밀번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                변경
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">회원탈퇴</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  회원 탈퇴 시 다음 정보가 모두 삭제됩니다:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                  <li>개인정보</li>
                  <li>주문내역</li>
                  <li>포인트 및 쿠폰</li>
                  <li>작성한 리뷰 및 문의</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                탈퇴 후에는 복구할 수 없습니다. 정말로 탈퇴하시겠습니까?
              </p>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                탈퇴하기
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
