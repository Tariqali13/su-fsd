// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'data.csv');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json({ data: data.split('\n') });
  } catch (error) {
    res.status(500).json({ error: 'File not found or unable to read file.' });
  }
}
