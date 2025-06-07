// src/utils/getPetImageUrl.ts
export const getPetImageUrl = (petId: number, imagePath?: string, thumbnailPath?: string): string => {
    if (!imagePath && !thumbnailPath) {
      return '/assets/images/pet/dog-1.jpg'; // 기본 이미지
    }
  
    // 백엔드에서 제공하는 펫 이미지 경로의 파일 이름만 추출
    const filename = thumbnailPath ? thumbnailPath.split('/').pop() : imagePath?.split('/').pop();
  
    if (petId && filename) {
      return `/api/pets/image/${petId}/${filename}`;
    }
    
    // petId나 filename이 없을 경우를 대비 (오류 방지)
    return '/assets/images/pet/dog-1.jpg'; // 예비 기본 이미지
  };