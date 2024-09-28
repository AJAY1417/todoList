import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./App.css";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const TASKS_KEY = "tasks";

function App() {
  const [data, setData] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(data));
  }, [data]);
  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.trim() === "") {
      setErrorMessage("Please enter a task");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    const newTask = { id: Date.now(), name: task, completed: false };

    if (editId) {
      const updatedTasks = data.map((t) =>
        t.id === editId ? { ...t, name: task, completed: false } : t
      );
      setData(updatedTasks);
      setEditId(null);
    } else {
      setData([newTask, ...data]); // Prepend new task to the data array
    }
    setTask("");
    setErrorMessage("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTask = e.target.value.substring(0, 20);
    setTask(newTask);
    setErrorMessage("");
  };

  const deleteTask = (id: number) => {
    if (confirmDelete === id) {
      const filtered = data.filter((task) => task.id !== id);
      setData(filtered);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const editTask = (id: number) => {
    const taskToEdit = data.find((task) => task.id === id);
    if (taskToEdit) {
      setTask(taskToEdit.name);
      setEditId(id);
    }
  };

  const toggleComplete = (id: number) => {
    const updatedTasks = data.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setData(updatedTasks);
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <div className="form-container">
        <form onSubmit={addTask} className="input-wrapper">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="Enter a task"
          />
          <button type="submit">{editId ? "Update" : "Add"}</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <ul>
        {data.map((task) => (
          <li
            key={task.id}
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            <span
              onClick={() => toggleComplete(task.id)}
              style={{ cursor: "pointer" }}
            >
              {task.name}
            </span>
            <div className="manage-btns">
              <button
                className="edit-button"
                onClick={() => editTask(task.id)}
                style={{ marginLeft: "10px" }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {confirmDelete !== null && (
        <div>
          <h3>Are you sure you want to delete this task?</h3>
          <button
            onClick={() => deleteTask(confirmDelete)}
            style={{ marginRight: "10px" }}
          >
            Yes
          </button>
          <button onClick={() => setConfirmDelete(null)}>No</button>
        </div>
      )}
    </div>
  );
}

export default App;
