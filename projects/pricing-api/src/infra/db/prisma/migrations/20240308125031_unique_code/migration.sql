/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `occupation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "occupation_code_key" ON "occupation"("code");
