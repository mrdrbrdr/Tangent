const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: { email: "test@example.com" },
  });
  console.log("Created user:", user);

  // Create a conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: "My First Tangent Conversation",
      ownerId: user.id,
    },
  });
  console.log("Created conversation:", conversation);

  // Create a node (main branch)
  const node = await prisma.node.create({
    data: {
      content: "Hello, this is my first prompt!",
      branchType: "MAIN",
      conversationId: conversation.id,
    },
  });
  console.log("Created node:", node);

  // Read them back
  const allConversations = await prisma.conversation.findMany({
    include: { nodes: true },
  });
  console.log("All conversations with nodes:", allConversations);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });