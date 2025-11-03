import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getStorage } from 'firebase/storage'
import { app } from './firebase'

const storage = getStorage(app)

export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const fileExtension = file.name.split('.').pop()
  const fileName = `${userId}_${Date.now()}.${fileExtension}`
  const storageRef = ref(storage, `profiles/${fileName}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

export async function uploadReviewImage(
  reviewId: string,
  file: File,
  index: number
): Promise<string> {
  try {
    console.log('📤 리뷰 이미지 업로드 시작:', { reviewId, fileName: file.name, size: file.size, index })

    const fileExtension = file.name.split('.').pop()
    const fileName = `${reviewId}_${index}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `reviews/${fileName}`)

    await uploadBytes(storageRef, file)
    console.log('✅ 이미지 업로드 완료:', fileName)

    const downloadURL = await getDownloadURL(storageRef)
    console.log('🔗 다운로드 URL 생성:', downloadURL)

    return downloadURL
  } catch (error) {
    console.error('❌ 리뷰 이미지 업로드 실패:', error)
    throw error
  }
}

/**
 * 여러 리뷰 이미지를 한 번에 업로드
 */
export async function uploadReviewImages(
  reviewId: string,
  files: File[]
): Promise<string[]> {
  try {
    console.log('📤 다중 이미지 업로드 시작:', { reviewId, count: files.length })

    const uploadPromises = files.map((file, index) =>
      uploadReviewImage(reviewId, file, index)
    )

    const urls = await Promise.all(uploadPromises)
    console.log('✅ 모든 이미지 업로드 완료:', urls.length)

    return urls
  } catch (error) {
    console.error('❌ 다중 이미지 업로드 실패:', error)
    throw error
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('이미지 삭제 실패:', error)
    throw error
  }
}
