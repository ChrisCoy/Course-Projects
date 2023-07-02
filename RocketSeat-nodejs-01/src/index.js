const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const foundUser = users.find((user) => user.username === username);

  if (!foundUser) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  request.user = foundUser;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const isUserExist = users.some((user) => user.username === username);

  if (isUserExist) {
    return response.status(400).json({ error: "Mensagem do erro" });
  }

  const userToAdd = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };

  users.push(userToAdd);

  return response.status(201).json(userToAdd);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  return response.json(request.user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const todoToAdd = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  request.user.todos.push(todoToAdd);

  return response.status(201).json(todoToAdd);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;

  const filteredTodo = request.user.todos.find((todo) => todo.id === id);

  if (!filteredTodo) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  filteredTodo.title = title;
  filteredTodo.deadline = new Date(deadline);

  return response.status(201).json(filteredTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;

  const filteredTodo = request.user.todos.find((todo) => todo.id === id);

  if (!filteredTodo) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  filteredTodo.done = true;
  return response.status(201).json(filteredTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  try {
    const { id } = request.params;

    const todo = request.user.todos.findIndex((todo) => todo.id === id);

    if (todo === -1) {
      return response.status(404).json({ error: "Mensagem do erro" });
    }

    request.user.todos.splice(todo, 1);
  } catch (error) {
    console.log(error);
  }

  return response.status(204).json();
});

module.exports = app;
