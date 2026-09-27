const API_URL = "http://127.0.0.1:5000/tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// Fetch and display all tasks
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  list.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }
  emptyMessage.style.display = "none";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
      <span>${task.text}</span>
      <button class="delete-btn" data-id="${task.id}">✕</button>
    `;

    list.appendChild(li);
  });
}

// Add a new task
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  input.value = "";
  loadTasks();
});

// Handle checkbox toggle and delete (event delegation)
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.matches("input[type='checkbox']")) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: e.target.checked ? 1 : 0 })
    });
    loadTasks();
  }

  if (e.target.classList.contains("delete-btn")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTasks();
  }
});

// Initial load
loadTasks();