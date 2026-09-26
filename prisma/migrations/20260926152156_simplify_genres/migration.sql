/*
  Warnings:

  - You are about to drop the `book_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "book_genres" DROP CONSTRAINT "book_genres_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_genres" DROP CONSTRAINT "book_genres_genre_id_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "book_genres";

-- DropTable
DROP TABLE "genres";
