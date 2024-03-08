import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as csvParser from 'csv-parser';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const filePath = `${process.cwd()}/occupations.csv`;

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

export async function main() {
  await prisma.occupation.deleteMany();
  readCSV(filePath)
    .then(async (occupations) => {
      const groupedOccupations = {};
      occupations.forEach((occupation) => {
        if (!groupedOccupations[occupation.code]) {
          groupedOccupations[occupation.code] = {
            name: [occupation.name],
            active: occupation.active,
            totalFactor: occupation.factor,
            count: 1,
          };
        } else {
          if (
            !groupedOccupations[occupation.code].name.includes(occupation.name)
          ) {
            groupedOccupations[occupation.code].name.push(occupation.name);
          }
          groupedOccupations[occupation.code].totalFactor += occupation.factor;
          groupedOccupations[occupation.code].count++;
        }
      });
      const treatedOccupations = [];
      for (const code of Object.keys(groupedOccupations)) {
        treatedOccupations.push({
          id: crypto.randomUUID(),
          code,
          name: groupedOccupations[code].name
            .join(',')
            .split(',')
            .map(
              (item) =>
                item.trim().charAt(0).toUpperCase() + item.trim().slice(1),
            )
            .join(', '),
          active: groupedOccupations[code].active,
          factor: parseFloat(
            (
              groupedOccupations[code].totalFactor /
              groupedOccupations[code].count
            ).toFixed(2),
          ),

          createdAt: new Date(),
        });
      }
      await prisma.occupation.createMany({ data: treatedOccupations });
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
