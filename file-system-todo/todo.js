// Import required modules
const fs = require("fs");
const crypto = require("crypto");

// Path to the JSON file where tasks will be stored
const filePath = "./todo.json";

// Get command and argument from command line input
// Example: `node app.js add "Buy milk"`
const command = process.argv[2]; // 'add' | 'list' | 'remove'
const argument = process.argv[3]; // user input (task text or index)

// Generate a unique ID for each task using random bytes
const generateId = () => {
  return crypto.randomBytes(6).toString("hex");
};

// Get current date & time in a readable format (YYYY-MM-DD HH:MM:SS)
const getCurrentDate = () => {
  const now = new Date();
  const formatted = now.toISOString().replace("T", " ").split(".")[0];
  return formatted;
};

// Load tasks from todo.json, return [] if file does not exist or error occurs
const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

// Save tasks to todo.json file
const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2)); // formatted JSON
};

// Add a new task
const addTask = (task) => {
  if (!task) {
    console.log("⚠️ Please provide a task to add!");
    return;
  }

  const tasks = loadTasks();
  tasks.push({
    id: generateId(),
    task: task,
    createdAt: getCurrentDate(),
  });

  saveTasks(tasks);
  console.log(`✅ Task added: "${task}"`);
};

// List all tasks
const listTasks = () => {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log("📂 No tasks found.");
    return;
  }

  console.log("\n📝 Your To-Do List:");
  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. [${task.id}] ${task.task} (Created: ${task.createdAt})`
    );
  });
};

// Remove a task by its index number
const removeTask = (indexNo) => {
  const tasks = loadTasks();

  if (!indexNo || isNaN(indexNo) || indexNo < 1 || indexNo > tasks.length) {
    console.log("⚠️ Please provide a valid task number to remove.");
    return;
  }

  const removed = tasks.splice(indexNo - 1, 1);
  saveTasks(tasks);

  console.log(`🗑️ Task removed: "${removed[0].task}"`);
};

// Handle user commands
if (command === "add") {
  addTask(argument);
} else if (command === "list") {
  listTasks();
} else if (command === "remove") {
  removeTask(Number(argument));
} else {
  console.log("⚠️ Command is not valid. Use one of these:");
  console.log("   node app.js add 'task description'");
  console.log("   node app.js list");
  console.log("   node app.js remove <task_number>");
}
