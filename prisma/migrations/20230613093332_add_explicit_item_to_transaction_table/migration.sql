/*
  Warnings:

  - You are about to drop the `_ItemToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ItemToTransaction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ItemToTransaction" (
    "itemId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,

    PRIMARY KEY ("itemId", "transactionId"),
    CONSTRAINT "ItemToTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemToTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
