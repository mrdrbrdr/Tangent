/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `apiKey` on the `User` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Message";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversationId" INTEGER NOT NULL,
    "parentNodeId" INTEGER,
    "userInput" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "summaryShort" TEXT NOT NULL,
    "summaryLong" TEXT NOT NULL,
    "branchType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Node_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "updatedAt") SELECT "createdAt", "email", "id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
