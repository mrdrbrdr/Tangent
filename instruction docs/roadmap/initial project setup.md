## 1. Initial Project Setup (Low-Level Roadmap)

### **1.1 Verify Environment**
1. **Open Terminal**
    - On Windows, you can use Command Prompt, PowerShell, or Git Bash.

2. **Check Node.js Installation**
    - Run:
        `node -v`
    - You should see a version number (e.g., `v16.x` or `v18.x`). If you get an error, download Node.js and install it.

3. **Check npm (Node Package Manager)**
    - Run:
        `npm -v`
    - This shows npm’s version (e.g., `8.x`). If you see an error or a blank result, reinstall Node.js.

4. **Check Git**
    - Run:
        `git --version`
    - You should see something like `git version 2.x`. If not, [install Git](https://git-scm.com/downloads) and re-run the command.

> **Tip**: If you see all three commands working (Node, npm, Git), you’re set.

---

### **1.2 Create a New GitHub Repository**

1. **Go to GitHub**
    - Sign in to your GitHub account.
    - Click the green “New” button (usually near the top-left of your repositories list).

2. **Repository Details**
    - **Repository Name**: `tangent` (or any name you prefer).
    - **Description** (optional).
    - Choose **Public** or **Private**.
    - **Initialize with a README**: optional, but recommended for convenience.
    - Click **Create Repository**.

3. **Copy the Repository URL**
    - It usually looks like `https://github.com/<your-username>/<repo-name>.git`.

---

### **1.3 Set Up a Local Project Folder**

1. **Open Terminal in Your Preferred Folder**
    - For example, navigate to where you keep your projects, e.g., `Documents\Projects`.

2. **Clone the GitHub Repo**

    - Run:
        `git clone https://github.com/<your-username>/<repo-name>.git`
    - This creates a new folder matching your repository name, e.g. `tangent/`.

3. **Move Into Your Project Folder**
    - Run:
        `cd tangent`
    - (Adjust if you used a different name.)

4. **Verify the Folder is a Git Repository**
    - Run:
        `git status`
    - If everything worked, you’ll see something like “On branch main” or “Your branch is up to date.”

---

### **1.4 Basic Housekeeping in the Repo**

1. **Initialize `package.json`**
    - Inside your project folder, run:
        `npm init -y`
    - This creates a basic `package.json` file with default values.

2. **Create a `.gitignore`**
    - In your project folder, create a file named `.gitignore`.
    - For now, just add these lines:
        `node_modules`
        `.env`
    - This ensures you won’t accidentally commit large or sensitive files.

3. **(Optional) Update Your README**
    - If GitHub created an initial README, open it in a text editor and add a brief description:
        `# Tangent - A non-linear conversation app using LLMs.`
    - Commit the changes:
        `git add .` 
        `git commit -m "Initialize project with basic README and .gitignore"` 
        `git push origin main`


---

### **1.5 Confirm Everything Works Together**

1. **Final Check**
    - Run `git status`: it should say “nothing to commit” if you already pushed changes.
    - Your GitHub repository should now show your README, `.gitignore`, and `package.json`.

2. **Next Steps**
    - You’re all set to start the next phase: creating your project’s folder structure, installing dependencies (Express, Vue, Prisma), and configuring SQLite.


---

### **Recap**
- You verified that Node, npm, and Git are installed and working.
- You created a new repository on GitHub and cloned it locally.
- You initialized `package.json`, created a `.gitignore`, and optionally updated your README.
- Your local environment is now ready for coding.

With this done, you can move on to **Step 2: Basic Folder Structure & Tooling**, where we’ll formally set up your client and server folders, install packages (Express, Vue, Prisma, etc.), and get ready to write the first lines of code!