import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import processUploadedJSON from '../../lib/utils/processJSON';

export default async function processUpload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body as FormData;
      const file: File | null = data.get('file') as unknown as File;

      if (!file) {
        throw new Error('No file uploaded');
      }

      const filePath = path.join(process.cwd(), 'uploads', file.name);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      // Process JSON data and create new JSON
      const processedData = JSON.parse(fileData);
      processUploadedJSON(JSON.parse(fileData))
      const newDataJson = JSON.stringify(processedData, null, 2);

      // Save new JSON file
      fs.writeFileSync(filePath, newDataJson, 'utf-8');

      res.status(200).json({ success: true, message: 'JSON file uploaded and processed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
