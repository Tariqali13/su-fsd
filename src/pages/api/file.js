// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const file = await fs.readFile(process.cwd() + '/src/data.csv', 'utf8');
  res.status(200).json({ data: file.split('\n') });
}
