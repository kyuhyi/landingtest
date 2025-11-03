'use client';

import { useState } from 'react';
import { X, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createReview } from '@/lib/firestore-utils';
import { uploadReviewImages } from '@/lib/storage-utils';

interface ReviewWriteModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewWriteModal({ productId, productName, onClose, onSuccess }: ReviewWriteModalProps) {
  const { userProfile } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 최대 4개까지만
    if (selectedFiles.length + files.length > 4) {
      alert('이미지는 최대 4개까지 업로드할 수 있습니다.');
      return;
    }

    // 각 파일이 5MB 이하인지 확인
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('각 이미지는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일인지 확인
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // 미리보기 URL 해제
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!userProfile) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (content.trim().length < 10) {
      alert('리뷰 내용을 10자 이상 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      console.log('✍️ 리뷰 작성 시작:', { productId, rating, contentLength: content.length, images: selectedFiles.length });

      // 리뷰 ID 생성 (타임스탬프 기반)
      const reviewId = `review_${Date.now()}_${userProfile.id}`;

      // 이미지 업로드 (있는 경우)
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log('📤 이미지 업로드 중...');
        imageUrls = await uploadReviewImages(reviewId, selectedFiles);
        console.log('✅ 이미지 업로드 완료:', imageUrls.length);
      }

      // Firestore에 리뷰 저장
      console.log('💾 Firestore에 리뷰 저장 중...');
      await createReview({
        productId,
        productName,
        userId: userProfile.id,
        userName: userProfile.name || '익명',
        userProfileImage: userProfile.profileImageUrl,
        rating,
        content: content.trim(),
        images: imageUrls,
      });

      console.log('✅ 리뷰 작성 완료!');
      alert('리뷰가 등록되었습니다. 감사합니다!');

      // 미리보기 URL 정리
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ 리뷰 작성 실패:', error);
      alert('리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-gray-900)] border-b border-[var(--color-gray-800)] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">수강 리뷰 작성</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-gray-800)] rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6 text-[var(--color-gray-400)]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
              강의명
            </label>
            <p className="text-white font-medium">{productName}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
              별점 *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={loading}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-[var(--color-gray-600)]'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-xl font-bold text-white">{rating}.0</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
              리뷰 내용 * (최소 10자)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="강의에 대한 솔직한 리뷰를 작성해주세요.&#10;&#10;- 강의 내용의 전문성과 이해도&#10;- 강사님의 강의 스타일&#10;- 강의를 통해 얻은 점&#10;- 다른 수강생들에게 도움이 될 내용"
              disabled={loading}
              className="w-full h-40 px-4 py-3 bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg text-white placeholder-[var(--color-gray-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-600)] disabled:opacity-50 resize-none"
              maxLength={1000}
            />
            <div className="mt-1 text-sm text-[var(--color-gray-500)] text-right">
              {content.length} / 1000
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-400)] mb-2">
              사진 첨부 (선택, 최대 4장)
            </label>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-gray-800)]">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length < 4 && (
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[var(--color-gray-700)] rounded-lg hover:border-[var(--color-blue-600)] transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-[var(--color-gray-400)]" />
                <span className="text-[var(--color-gray-400)]">
                  이미지 선택 ({selectedFiles.length}/4)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            )}
            <p className="mt-2 text-xs text-[var(--color-gray-500)">
              • JPG, PNG, GIF 형식 지원 • 각 이미지 최대 5MB
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || content.trim().length < 10}
              className="flex-1 px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '작성 중...' : '리뷰 등록'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-[var(--color-gray-700)] text-white rounded-lg font-medium hover:bg-[var(--color-gray-600)] transition-colors disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
