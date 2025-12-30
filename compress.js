import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs';

const targetDir = 'public/img/**/*.+(png|jpg|jpeg)';

async function compressImages() {
  try {
    const files = await glob(targetDir);

    if (files.length === 0) {
      console.log('압축할 이미지가 없습니다.');
      return;
    }

    console.log(`총 ${files.length}개의 이미지를 발견했습니다. 압축 시작...`);

    for (const file of files) {
      try {
        const image = sharp(file);
        const metadata = await image.metadata();

         if (metadata.size && metadata.size < 500000) continue; 

        const buffer = await image
          .resize({ width: 1200, withoutEnlargement: true }) // 가로 1200px 제한
          .jpeg({ quality: 80, mozjpeg: true }) 
          .png({ quality: 80, compressionLevel: 8 }) 
          .toBuffer();

        fs.writeFileSync(file, buffer);
        console.log(`✅ 압축 완료: ${file}`);
      } catch (e) {
        console.error(`❌ 에러 발생 (${file}):`, e);
      }
    }
    console.log('🎉 모든 작업이 끝났습니다!');
    
  } catch (err) {
    console.error('파일 찾기 실패:', err);
  }
}

compressImages();