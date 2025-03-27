## **High-Level Roadmap**

### **[1. Initial Project Setup](1._Initial_Project_Setup.md)**
1. **Verify Environment**:
    - Check/install Node, npm, Git, and confirm you can run them on your Windows machine.
    - Create a new GitHub repo for Tangent, clone it locally.

2. **Add `.gitignore`**:
    - Ensure `node_modules`, `.env`, and other sensitive files are ignored.
### **[2. Basic Folder Structure & Tooling](2._Basic_Folder_Structure_&_Tooling.md)**
1. **Create Directories**:
    - `src/client` (for Vue)
    - `src/server` (for Express)
    - `config`, `tests`, `docs`, etc. as needed

2. **Initialize `package.json`**:
    - `npm init -y` (or Yarn equivalent)

3. **Install Core Packages**:
    - Express, Vue (and Vite or Vue CLI), Prisma, etc.

### **[3. Database Setup (SQLite + Prisma)](3._Database_Setup_(SQLite_+_Prisma).md)**
1. **Install & Configure Prisma**:
    - `npx prisma init`
    - Update `DATABASE_URL` in `.env` to point to a local SQLite file, e.g. `file:./dev.db`

2. **Define Schema**:
    - Add `users`, `conversations`, `nodes` tables with the relevant fields (including `summaryShort`, `summaryLong`).

3. **Run Migrations**:
    - `npx prisma migrate dev --name init_db`

4. **Test DB Connection**:
    - Simple script/route to confirm you can read/write data.

### **[4. Basic Express Server & API Routes](4._Basic_Express_Server_&_API_Routes.md)**
1. **Set Up Server**:
    - Create `server.js` (or `index.js`) in `src/server`.

2. **Implement a Test Route** (e.g. `GET /api/health`):
    - Returns `{ status: 'OK' }`.

3. **Create Chat Routes**:
    - `POST /api/chat`: to accept user input, store messages, etc.
    - `GET /api/conversation/:id`: to fetch conversation data.

### **[5. LLM Integration (OpenAI)](5._LLM_Integration_(OpenAI).md)**
1. **Obtain & Secure API Key**:
    - Store in `.env` (`OPENAI_API_KEY`)

2. **Install OpenAI Client**:
    - `npm install openai`

3. **Add a Utility Function** (e.g. `getLLMResponse`) in `src/server/controllers`:
    - Calls `openai.createChatCompletion`
    - Returns the model’s response

4. **Test the Route**:
    - Send a prompt, log the LLM’s answer in the console or store it in DB.

### **6. Summaries & Conversation Flow**
1. **Generate Summaries**:
    - From the user input & LLM response, create short (~40–80 chars) and long (~350 chars) summaries.
    - Store these in the `nodes` table alongside `content`.

2. **Integrate Summaries**:
    - Whenever a new node is created (user prompt + LLM response), fetch & store the summary data.

### **7. Vue Front-End (Basic Chat UI)**
1. **Initialize Vue**:
    - Use Vite, Vue CLI, or a basic bundler.
    - “Hello World” page to confirm it’s working.

2. **Build a Simple Chat Page**:
    - A text input for user prompts.
    - A display area for conversation nodes (prompt + LLM response).

3. **Connect to API**:
    - `POST /api/chat` to send user prompts.
    - Show the returned LLM responses on the page.

### **8. Branching Logic**
1. **DB & API Updates**:
    - Add `branchType` (`'main'`, `'tangent'`) in the `nodes` table and `parentId`.

2. **New Tangent Creation**:
    - At each existing LLM response, provide a “Fork” button.
    - On click, create a **new** child node with the `parentId` of the clicked node.

3. **Front-End Flow**:
    - Show tangents in your conversation display.
    - Possibly nest them or show them inline (for MVP).

### **9. 2D Overview**
1. **API for Node Structure**:
    - `GET /api/conversation/:id` to return all nodes in a structured format (e.g., a tree or list).

2. **Basic 2D Rendering**:
    - Could be plain HTML/CSS: each node in a box, lines drawn with CSS or `<svg>`.
    - Or a minimal library (e.g. D3) for a simple force/layout graph.

3. **Zoom Out / Toggle**:
    - SHIFT + mousewheel or a button to display the overview.
    - Clicking on a node jumps back into the main chat interface at that node.

### **10. Selective Deletion & Editing**
1. **Implement Delete API**:
    - `DELETE /api/nodes/:id` to remove a node and its descendants.
    - Provide an “Undo” mechanism if feasible (store soft-deletes for 15s).

2. **Editing Old Prompts**:
    - A route to `PATCH /api/nodes/:id` that changes the prompt content & removes child branches.
    - Confirm front-end handles warnings for the user.

### **11. Polish & Refinement**
1. **Styling**:
    - Basic CSS or a UI framework (Vuetify, Tailwind, etc.) to make the chat UI friendlier.

2. **Validation & Error Handling**:
    - Check for empty prompts, handle OpenAI errors gracefully, etc.

3. **Testing**:
    - Write some basic tests (optional at first) to ensure DB logic, branching, summarization still works.

### **12. Post-MVP Enhancements**
1. **Transition to 3D** (or partial 3D):
    - Gradually replace the 2D map with a Three.js or 3D force-graph environment.

2. **Database Migration**:
    - Switch from SQLite to PostgreSQL if you want a more robust production environment.

3. **Authentication** & **Publishing**:
    - Add user accounts, sharing features, fancy visual transitions, etc.