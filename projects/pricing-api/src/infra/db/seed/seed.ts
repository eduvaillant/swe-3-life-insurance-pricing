import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as csvParser from 'csv-parser';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const filePath = `${process.cwd()}/occupations.csv`;

async function main() {
  await prisma.occupation.deleteMany();
  readCSV(filePath)
    .then(async (occupations) => {
      for (const occupation of occupations) {
        await prisma.occupation.create({
          data: {
            id: crypto.randomUUID(),
            code: occupation.code,
            name: occupation.name,
            active: occupation.active,
            factor: occupation.factor,
            createdAt: new Date(),
          },
        });
      }
    })
    .catch((error) => {
      console.error('Error reading CSV file:', error);
    });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

interface Occupation {
  code: string;
  name: string;
  active: boolean;
  factor: number;
}

const readCSV = (filePath: string): Promise<Occupation[]> => {
  const occupations: Occupation[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ',' }))
      .on('data', (row) => {
        occupations.push({
          code: String(row.Code),
          name: row.Name,
          factor: parseFloat(row.Factor),
          active: row.Active === 'TRUE' ? true : false,
        });
      })
      .on('end', () => {
        resolve(occupations);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
