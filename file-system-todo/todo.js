const fs = require("fs");
const crypto = require("crypto");
const filePath = "./todo.json";

const command = process.argv[2];
const argument = process.argv[3];

const generateId = () => {
  return crypto.randomBytes(6).toString("hex");
};

const getCurrentDate = () => {
  const now = new Date();
  const formatted = now.toISOString().replace("T", " ").split(".")[0];
  return formatted;
};

const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

const addTask = (task) => {
  const tasks = loadTasks();
  tasks.push({
    id: generateId(),
    task: task,
    createdAt: getCurrentDate(),
  });
  fs.writeFileSync(filePath, JSON.stringify(tasks));
};

const listTasks = () => {
  const tasks = loadTasks();

  tasks.forEach((task, index) => {
    console.log(`${index + 1} : ${task.task}`);
  });
};

const removeTask = (indexNo) => {
  const tasks = loadTasks();
  tasks.splice(indexNo - 1, 1);
  fs.writeFileSync(filePath, JSON.stringify(tasks));
};

if (command === "add") {
  addTask(argument);
} else if (command === "list") {
  listTasks();
} else if (command === "remove") {
  removeTask(argument);
} else {
  console.log("command is not valid");
}
