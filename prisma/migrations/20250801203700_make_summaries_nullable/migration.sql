-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversationId" INTEGER NOT NULL,
    "parentNodeId" INTEGER,
    "userInput" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "summaryShort" TEXT,
    "summaryLong" TEXT,
    "branchType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Node_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Node" ("aiResponse", "branchType", "conversationId", "createdAt", "id", "parentNodeId", "summaryLong", "summaryShort", "updatedAt", "userInput") SELECT "aiResponse", "branchType", "conversationId", "createdAt", "id", "parentNodeId", "summaryLong", "summaryShort", "updatedAt", "userInput" FROM "Node";
DROP TABLE "Node";
ALTER TABLE "new_Node" RENAME TO "Node";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
