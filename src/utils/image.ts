/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function fileFilter(
  req: any,
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  },
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new Error('Apenas arquivos JPG, JPEG e PNG são permitidos!'),
      false,
    );
  }
  callback(null, true);
}

export function saveImage(image: Express.Multer.File, domain: string) {
  try {
    const uploadDir = path.join(process.cwd(), `uploads/${domain}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${uuidv4()}${path.extname(image.originalname)}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, image.buffer);

    return filename;
  } catch (error) {
    console.error('Erro ao salvar a imagem:', error);
    throw new Error('Erro ao salvar a imagem');
  }
}
