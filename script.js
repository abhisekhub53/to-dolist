// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  const categorySelect = document.getElementById('categorySelect');
  const prioritySelect = document.getElementById('prioritySelect');
  const category = categorySelect.value;
  const priority = prioritySelect.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    category: category,
    priority: priority,
    completed: false
  };

  // Save to localStorage
  saveTaskToLocalStorage(task);

  // Add to task list
  displayTask(task);

  // Clear input
  taskInput.value = "";
}

function saveTaskToLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => displayTask(task));
}

function displayTask(task) {
  const taskList = document.getElementById('taskList');
  const taskItem = document.createElement('li');
  taskItem.classList.add(`priority-${task.priority.toLowerCase()}`);
  
  taskItem.innerHTML = `
    <span class="task-text">${task.text} - ${task.category} - ${task.priority}</span>
    <input type="checkbox" class="check" onclick="toggleComplete(this)" ${task.completed ? 'checked' : ''}>
    <button class="edit" onclick="editTask(this)">Edit</button>
    <button class="delete" onclick="deleteTask(this)">Delete</button>
  `;
  
  if (task.completed) {
    taskItem.classList.add('completed');
  }
  
  taskList.appendChild(taskItem);
}

function editTask(button) {
  const taskItem = button.parentElement;
  const taskText = taskItem.querySelector('.task-text');
  
  const newText = prompt("Edit your task:", taskText.innerText);
  if (newText !== null && newText.trim() !== "") {
    taskText.innerText = newText.trim();
    updateTaskInLocalStorage();
  }
}

function deleteTask(button) {
  const taskItem = button.parentElement;
  taskItem.remove();
  removeTaskFromLocalStorage(taskItem);
}

function removeTaskFromLocalStorage(taskItem) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.filter(task => task.text !== taskItem.querySelector('.task-text').innerText);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function toggleComplete(checkbox) {
  const taskItem = checkbox.parentElement;
  taskItem.classList.toggle('completed');
  updateTaskInLocalStorage();
}

function updateTaskInLocalStorage() {
  const tasks = [];
  const taskItems = document.querySelectorAll('#taskList li');
  
  taskItems.forEach(taskItem => {
    const taskText = taskItem.querySelector('.task-text').innerText;
    const task = {
      text: taskText,
      completed: taskItem.classList.contains('completed'),
      category: taskItem.querySelector('.task-text').innerText.split(" - ")[1],
      priority: taskItem.querySelector('.task-text').innerText.split(" - ")[2]
    };
    tasks.push(task);
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(filter) {
  const tasks = getTasksFromLocalStorage();
  const filteredTasks = tasks.filter(task => {
    return filter === 'All' || task.category === filter || task.priority === filter;
  });
  
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear current task list
  
  filteredTasks.forEach(task => displayTask(task));
}
