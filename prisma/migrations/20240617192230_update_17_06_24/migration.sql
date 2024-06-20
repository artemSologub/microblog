/*
  Warnings:

  - Added the required column `password_hash` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorname" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL
);
INSERT INTO "new_Author" ("authorname", "id") SELECT "authorname", "id" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_authorname_key" ON "Author"("authorname");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
