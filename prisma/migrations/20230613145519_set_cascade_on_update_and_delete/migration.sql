-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemToTransaction" (
    "itemId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,

    PRIMARY KEY ("itemId", "transactionId"),
    CONSTRAINT "ItemToTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemToTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ItemToTransaction" ("itemId", "quantity", "transactionId") SELECT "itemId", "quantity", "transactionId" FROM "ItemToTransaction";
DROP TABLE "ItemToTransaction";
ALTER TABLE "new_ItemToTransaction" RENAME TO "ItemToTransaction";
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "customerId" INTEGER NOT NULL,
    CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("code", "customerId", "id", "time") SELECT "code", "customerId", "id", "time" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_code_key" ON "Transaction"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
