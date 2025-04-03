# **Product Requirement Document (PRD)**

## **1\. Project Overview**

### **1.1 High-Level Description**

#### 1.1.1 **Project Name**: Tangent

#### 1.1.2 **Purpose**  

 Tangent is a web application that provides a **non-linear conversational interface** for interacting with Large Language Models (LLMs). Instead of navigating a single, linear chat thread, users can create "branching" tangents whenever a new subtopic arises. Each node (prompt-response pair) gets automatically summarized for quick scanning in an overview. Our early focus is on **solidifying the core logic** for branching conversations, while leaving room to add advanced 3D visuals later.


#### 1.1.3 **Who Uses It**

* Students (for research, homework, or study groups)
* Researchers (for exploring multiple angles on complex topics)
* Creative writers (for brainstorming or story-building without losing context)
* Anyone who wants to maintain clarity in long, evolving conversations

  

#### 1.1.4 **Tech Stack (Planned)**
* **Frontend**: Vue.js for the main interface
	* An initially **simplified 2D layout** for the "overview" (using either basic HTML/CSS or a lightweight 2D library such as D3.js)
	* Potential future swap to Three.js for a rich 3D interface and enhanced transitions
* **Backend**: Node.js \+ Express
* **Database (MVP)**: **SQLite** (via Prisma ORM)
	* We'll later consider migrating to PostgreSQL once the MVP is solid
* **LLM Integration**: Calls to the OpenAI API
* **Authentication**: Out of scope for the MVP (likely single-user or ephemeral)

  

---

  

### **1.2 Scope & Goals**
#### 1.2.1 **MVP Scope**
* **Branching Conversations**: Ability to create subthreads (“tangents”) branching from any existing prompt/response
* **Automatic Summaries**: For each user prompt and response, generate two summaries—short (\~40–80 chars) and long (\~350 chars)
* **Selective Deletion**: Remove individual nodes (and their descendants) with proper warnings and optional undo
* **Simplified 2D Overview**:
	* Display conversation nodes in a minimal 2D format (e.g., cards, a basic graph, or a tree).
	* Support zooming out (or toggling) to see the entire conversation structure.

  

#### 1.2.2 **Future Features (Beyond MVP)**
* **Migration to PostgreSQL** (for a robust production setup)
* **Advanced 3D Visuals** using Three.js (smooth transitions, frosted-glass orbs, animations)
* **User Authentication** (e.g., Google OAuth)
* **Monetization** (Mellowtel integration, affiliate links)
* **Publishing & Sharing**: Ability to share entire conversations or partial tangents
* **“Reintegration”**: Optionally conclude a tangent and push a summary back to the parent thread

---

### **1.3 Project Folder/Structure Guidelines**

#### 1.3.1 **Suggested Layout**

```
tangent/
  ├─ src/
  │   ├─ client/         # Vue.js front-end code
  │   ├─ server/         # Node.js + Express backend
  │   │   ├─ controllers/
  │   │   ├─ models/     # Prisma schema & DB models
  │   │   └─ routes/
  ├─ tests/              # (Optional) Unit/E2E tests
  ├─ config/             # Env vars & DB config
  ├─ docs/               # Additional documentation, references
  ├─ instructions.md
  └─ package.json
```

#### 1.3.2 **Key Notes**
* Environment variables (like API keys) live in a `.env` file (uncommitted)
* `src/client` for Vue.js components, including a 2D conversation overview
* `src/server` for Express routes/controllers handling chat, branching logic, and DB operations

---

## **2\. Core Functionalities**

### **2.1 Wireframes (ASCII Reference)**
We keep the original wireframes for reference; implementation details will differ slightly because we’re starting with a 2D MVP and may later move to 3D.

#### **2.1.1 Main Chat View (Vertical Chat)**
(A scrollable list of user prompts and LLM responses, with optional branching/fork buttons.)

#### **2.1.2 Zoomed-Out Orb/Branch Map**
(For MVP, we might use a simple 2D tree or graph. In future versions, these orbs could become fully 3D.)

---

### **2.2 Feature List (Detailed)**

#### 2.2.1 **Main Chat View**
* **Sidebar**:
	* collapse/expand
	* search
	* new conversation
	* settings
* **Chat Thread Panel**: Chronological list of (prompt \+ LLM response) nodes
* **Tangent/Fork Buttons**:
	* Appear on hover or as a button near each LLM response
* **Chat Input & Toolbar**:
	* Typical options like attach file, submit prompt, etc.
* **Editing Old Prompts**:
	* If the user edits an old prompt, subsequent branching nodes are removed.

#### 2.2.2 **Branching/Tangent Creation**
* **Hover** over LLM response → “Fork” icons appear
* **Fork Action**: Creates a new tangent subthread
* **Database**: Each tangent node references its parent via `parentId` and uses a `branchType` field

#### 2.2.3 **LLM Integration & Summaries**
* **OpenAI API**:
	* Each user prompt is sent to OpenAI’s `createChatCompletion`
* **Automatic Summaries**:
	* Also request a short (\~40–80 chars) and long (\~350 chars) summary from the LLM

#### 2.2.4 **Selective Deletion**
* **Delete Latest Node**: Immediate removal, no warning
* **Delete a Middle Node**:
	* Warn user that descendants will also be removed
	* Provide a short “undo” option (15s)

#### 2.2.5 **Zoomed-Out 2D Overview (MVP)**
* **Toggle or “Zoom Out”**: SHIFT \+ mousewheel or a button
* **Nodes**: Display short summary on each node, maybe with lines connecting parent/child
* **Navigation**: Clicking a node re-focuses the main chat on that node

#### 2.2.6 **Edge Cases**
* **Deleting the Root Node**: Removes the entire conversation
* **Accessing Deleted Nodes**: Show an error or “node not found”

---

### **2.3 Step-by-Step User Flows**

#### 2.3.1 **Creating a Tangent**
1. User hovers over a response in the main chat
2. Tangent/fork icon appears
3. User clicks it → main chat “slides” aside or simply shows a new empty input area for the tangent
4. A new node is created with `parentId` referencing the node from which we forked
5. Overview highlights the newly created branch

  

#### 2.3.2 **Editing a Prompt in the Middle**
1. User scrolls up to find an older prompt
2. User edits that prompt (inline or in a modal)
3. Children of that prompt are removed from the DB (after a warning)
4. Conversation timeline forks off from the new prompt text

#### 2.3.3 **Selective Deletion**
1. **Latest Node**: Removed immediately
2. **Middle Node**:
	 * Show a modal warning that all its child nodes will be removed
	 * On confirmation, remove them with a 15-second undo window
#### 2.3.4 **Zooming Out/In**
1. SHIFT \+ mousewheel (or a “View Overview” button)
2. Transition to a **2D** node map (MVP)
3. Each node labeled with `summaryShort`, hover to see more info (or click to re-enter the chat at that node)

---

## **3\. Documentation**

### **3.1 Libraries & Tools**
* **Vue.js** for front-end user interface
* **Node.js \+ Express** for back-end API routes
* **Prisma** for database interactions
* **SQLite** (MVP database)
* **OpenAI API** for LLM text generation and summaries
* **Optionally, D3.js** for a 2D node graph in the MVP overview (or plain HTML/CSS if simpler)
* **(Future) Three.js** for advanced 3D orbs and animations

---

### **3.2 Database Schema (Draft)**
For the MVP, **SQLite** will serve as the underlying database. We’ll keep the schema flexible so we can migrate to Postgres easily.

* **Table: users**
	* `id` (PK)
	* `email` (unique, optional)
	* `apiKey` (encrypted, optional)
	* `createdAt`, `updatedAt`
* **Table: conversations**
	* `id` (PK)
	* `title`
	* `ownerId` (FK → users.id)
	* `createdAt`, `updatedAt`

* **Table: nodes**
	* `id` (PK)
	* `conversationId` (FK → conversations.id)
	* `parentId` (nullable FK → nodes.id)
	* `content` (full text of user prompt \+ LLM response)
	* `summaryShort` (\~40–80 chars)
	* `summaryLong` (\~350 chars)
	* `branchType` (enum: 'main', 'tangent')
	* `createdAt`, `updatedAt`

**Root Node**: The first user prompt in a conversation, `parentId = null`.

---

### **3.3 Environment Variables**
Example `.env` (not committed to version control):
```
OPENAI_API_KEY=your-openai-key
DATABASE_URL=file:./dev.db   # Example for local SQLite
```

Within the Node server:
```
require('dotenv').config();
const openAiKey = process.env.OPENAI_API_KEY;
const databaseUrl = process.env.DATABASE_URL;
```

---

### **3.4 Code Examples**

#### **3.4.1 Basic Server Setup (Express)**
```
const express = require('express');
const app = express();
app.use(express.json());

// Simple route
app.post('/api/chat', async (req, res) => {
  // 1) Extract user message from req.body
  // 2) Send to LLM (OpenAI)
  // 3) Store prompt + response in DB (SQLite via Prisma)
  // 4) Return response
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### **3.4.2 Using OpenAI API (Pseudo-code)**
```
const { Configuration, OpenAIApi } = require('openai');
async function getLLMResponse(userInput) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: userInput }],
  });
  return response.data.choices[0].message.content;
}
  
async function getSummaries(userInput) {
  // Additional prompt logic to generate
  // short (~40–80 chars) and long (~350 chars) summaries
}
```

#### **3.4.3 Vue.js Client (Minimal Skeleton)**
```
import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

#### **3.4.4 Orb/Node Rendering (Future Three.js)**

```
<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import * as THREE from 'three';

export default {
  mounted() {
    this.initScene();
  },
  methods: {
    initScene() {
      const canvas = this.$refs.canvas;
      const renderer = new THREE.WebGLRenderer({ canvas });
      // ... basic scene setup, camera, simple spheres for each node
    },
  },
};
</script>
```

    
For the **MVP** 2D overview, you could do something as simple as:

```
    <template>
    <div v-for="node in conversationNodes" :key="node.id" class="node-card">
      <strong>{{ node.summaryShort }}</strong>
      <p>{{ node.content }}</p>
      <!-- Use lines or arrows to show child links, or a small tree layout -->
     </div>
    </template>
```

And later replace this with a more advanced 2D/3D approach.

---

## **4\. Additional/Advanced Features**

#### 4.1 **User Authentication (OAuth)**
* Out of scope for MVP but possible with Passport.js or similar

#### 4.2 **Fancy 3D Visual Effects**
* Glass-like orb design, swirling gradients
* Smooth transitions from chat to orb view

#### 4.3 **Monetization**
* Integrations (Mellowtel) or affiliate links

#### 4.4 **Publishing & Forking**
* Share entire conversations or partial tangents
* Let others fork from a public node

#### 4.5 **Performance & Scalability**
* Lazy-load older conversation nodes
* Summarize or collapse lengthy tangents

**Note**: A “reintegration” feature (where tangent findings get appended into the main branch as a final summary) is also a candidate for post-MVP exploration.

---

## **5\. File Structure**

### **5.1 Current File Structure**

```
Tangent       
├── .dist     
├── .env      
├── README.md 
├── config    
├── docs      
│   ├── PRD.md
│   ├── ideas
│   │   └── LLM _service_architecture.md
│   ├── mockups
│   │   ├── main chat collapse.png
│   │   ├── main chat.png
│   │   ├── overview tooltip.png
│   │   └── overview.png
│   ├── roadmap
│   │   ├── 1._Initial_Project_Setup.md
│   │   ├── 2._Basic_Folder_Structure_&_Tooling.md
│   │   ├── 3._Database_Setup_(SQLite_+_Prisma).md
│   │   ├── 4._Basic_Express_Server_&_API_Routes.md
│   │   ├── 5._LLM_Integration_(OpenAI).md
│   │   ├── 6._Summaries_&_Conversation_Flow.md
│   │   ├── 7._Vue_Front-End_(Basic_Chat_UI).md
│   │   └── HIGH-Level_Roadmap_(Tangent).md
│   └── tangent_pitch.md
├── package-lock.json
├── package.json
├── prisma
│   ├── dev.db
│   ├── migrations
│   │   ├── 20250326235527_initial_schema_setup
│   │   │   └── migration.sql
│   │   ├── 20250401220405_separate_user_ai_messages
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src
│   ├── client
│   │   └── tangent-frontend
│   │       ├── .vscode
│   │       ├── README.md
│   │       ├── index.html
│   │       ├── package-lock.json
│   │       ├── package.json
│   │       ├── public
│   │       ├── src
│   │       └── vite.config.js
│   └── server
│       ├── controllers
│       │   └── llm.js
│       ├── db.js
│       └── index.js
└── tests
```

### **5.2 Updating File Structure**
1. **Install tree-node-cli** (recommended for cross-platform compatibility)
	* Run: `npm install -g tree-node-cli`
	* This provides the `treee` command (note the three e's)

2. **Generate the Tree Output**
* From project root, run:
```
treee -L 4 -I "node_modules|.git|instruction docs" -a
```
	* `-L 2` limits depth to 2 levels
	* `-I "node_modules"` ignores the node_modules directory
	* -a includes the files in the folders

3. **Replace Section 5.1** with the new output
   * Keep your documentation up to date whenever you add or restructure folders