"use strict";

const todos = document.querySelector("#btn-add");
const input = document.querySelector("#newTodo");
const toDoList = document.querySelector("#to-do-list");
const allFilter = document.querySelector("#all");
const openFilter = document.querySelector("#open");
const doneFilter = document.querySelector("#done");
const removeDoneButton = document.querySelector("#btn-remove");
const apiUrl = "http://localhost:4730/todos";
let newArray = [];
getDatafromApi();

//Daten von der API laden
function getDatafromApi() {
  fetch(apiUrl)
    .then((request) => request.json())
    .then((datas) => {
      console.log("API load", datas);
      newArray = datas;

      showNewArray();
    });
}

//ist ein Todo schon vorhanden?
function isDuplicate(description) {
  return newArray.some(function (todo) {
    return todo.description.toLowerCase() === description.toLowerCase();
  });
}

/*
function isDuplicate(description) {
  for (let i = 0; i < newArray.length; i++) {
    return newArray.some(function (todo) {
      return (
        todo.description.toLowerCase() === newArray[i].description.toLowerCase()
      );
    });
  }
}*/

function buttonClick() {
  const inputtext = input.value.trim();
  if (inputtext !== "" && !isDuplicate(inputtext)) {
    input.value = "";

    // Daten an die API senden, um eine neue Aufgabe zu erstellen
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: inputtext,
        done: false,
        checkbox: false,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (newTodo) {
        newArray.push(newTodo);

        showNewArray();
      });
  }
}

/*
function updateTodoToAPI(todo) {
  const todoID = todo.id;
  fetch("http://localhost:4730/todos/" + todoID, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then((datas) => {
      console.log(datas);
      showNewArray();
    });
}*/

function updateTodo(todo) {
  //const todoID = todo.id;
  fetch(
    apiUrl,

    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  )
    .then((response) => response.json())
    .then((updateTodo) => {
      console.log("update", updateTodo);
    });

  showNewArray();
}

function removeDoneTodos() {
  const filteredArray = filterTodos(newArray);
  newArray = filteredArray.filter((todo) => !todo.done);
  showNewArray();
}

function showNewArray() {
  toDoList.innerHTML = "";

  const filteredArray = filterTodos(newArray);
  for (const objects of filteredArray) {
    //codeschnipsel herangezogen aus google, ggf. nochmal recherchieren:
    //Überprüft ob es ein object gibt mit der Eigenschaft description und ob der String befüllt ist
    if (objects?.description?.trim() !== "") {
      const toDoElement = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = objects.done;
      checkbox.addEventListener("change", function () {
        objects.done = checkbox.checked;
        //updateTodo(objects);

        showNewArray();
      });

      const description = document.createElement("label");
      description.textContent = objects.description;
      description.appendChild(checkbox);

      if (objects.done) {
        description.classList.add("done");
      }

      toDoElement.appendChild(description);
      toDoList.appendChild(toDoElement);
    }
  }
}

function filterTodos(todos) {
  if (openFilter.checked) {
    return todos.filter((todo) => !todo.done);
  } else if (doneFilter.checked) {
    return todos.filter((todo) => todo.done);
  } else {
    return todos;
  }
}

todos.addEventListener("click", buttonClick);
allFilter.addEventListener("change", showNewArray);
openFilter.addEventListener("change", showNewArray);
doneFilter.addEventListener("change", showNewArray);
removeDoneButton.addEventListener("click", removeDoneTodos);
