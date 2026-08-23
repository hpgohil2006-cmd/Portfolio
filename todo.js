"use strict";


/* =========================================================
   TODO APPLICATION
   Internship Task 3
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const todoForm =
    document.getElementById("todo-form");


const todoInput =
    document.getElementById("todo-input");


const todoList =
    document.getElementById("todo-list");


const taskCount =
    document.getElementById("task-count");


const emptyState =
    document.getElementById("empty-state");


const clearCompletedButton =
    document.getElementById("clear-completed");


const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


/* =========================================================
   APPLICATION STATE
========================================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("portfolio-tasks")
    ) || [];


let currentFilter = "all";


/* =========================================================
   SAVE STATE
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "portfolio-tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================================
   CREATE TASK
========================================================= */

todoForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const taskText =
            todoInput.value.trim();


        if (taskText === "") {

            return;

        }


        const newTask = {

            id: Date.now(),

            text: taskText,

            completed: false

        };


        tasks.push(newTask);


        saveTasks();


        todoInput.value = "";


        todoInput.focus();


        renderTasks();

    }
);


/* =========================================================
   READ / DISPLAY TASKS
========================================================= */

function renderTasks() {


    /* Clear existing DOM */

    todoList.innerHTML = "";


    /* Filter tasks */

    const filteredTasks =
        getFilteredTasks();


    /* Empty state */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    }
    else {

        emptyState.style.display = "none";

    }


    /* Create task elements dynamically */

    filteredTasks.forEach(
        function (task) {

            const taskItem =
                document.createElement("li");


            taskItem.className =
                "todo-item";


            taskItem.dataset.id =
                task.id;


            if (task.completed) {

                taskItem.classList.add(
                    "completed"
                );

            }


            taskItem.innerHTML = `

                <div class="todo-item-content">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${task.completed ? "checked" : ""}
                        aria-label="Mark ${escapeHTML(task.text)} as completed">

                    <span class="task-text">
                        ${escapeHTML(task.text)}
                    </span>

                </div>


                <div class="todo-actions">

                    <button
                        type="button"
                        class="edit-task"
                        aria-label="Edit task">

                        Edit

                    </button>


                    <button
                        type="button"
                        class="delete-task"
                        aria-label="Delete task">

                        Delete

                    </button>

                </div>

            `;


            todoList.appendChild(taskItem);

        }
    );


    updateTaskCount();

}


/* =========================================================
   FILTER TASKS
========================================================= */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            function (task) {

                return !task.completed;

            }
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            function (task) {

                return task.completed;

            }
        );

    }


    return tasks;

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {


                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


/* =========================================================
   EVENT DELEGATION
========================================================= */

todoList.addEventListener(
    "click",
    function (event) {


        const taskItem =
            event.target.closest(
                ".todo-item"
            );


        if (!taskItem) {

            return;

        }


        const taskId =
            Number(
                taskItem.dataset.id
            );


        /* Delete */

        if (
            event.target.classList.contains(
                "delete-task"
            )
        ) {

            deleteTask(taskId);

        }


        /* Edit */

        if (
            event.target.classList.contains(
                "edit-task"
            )
        ) {

            editTask(taskId);

        }

    }
);


/* =========================================================
   COMPLETE TASK
========================================================= */

todoList.addEventListener(
    "change",
    function (event) {


        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {

            return;

        }


        const taskItem =
            event.target.closest(
                ".todo-item"
            );


        const taskId =
            Number(
                taskItem.dataset.id
            );


        const task =
            tasks.find(
                function (item) {

                    return item.id === taskId;

                }
            );


        if (task) {

            task.completed =
                event.target.checked;


            saveTasks();


            renderTasks();

        }

    }
);


/* =========================================================
   UPDATE / EDIT TASK
========================================================= */

function editTask(taskId) {


    const task =
        tasks.find(
            function (item) {

                return item.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    const updatedText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        updatedText === null
    ) {

        return;

    }


    const cleanText =
        updatedText.trim();


    if (cleanText === "") {

        return;

    }


    task.text =
        cleanText;


    saveTasks();


    renderTasks();

}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(taskId) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
            function (task) {

                return task.id !== taskId;

            }
        );


    saveTasks();


    renderTasks();

}


/* =========================================================
   CLEAR COMPLETED TASKS
========================================================= */

clearCompletedButton.addEventListener(
    "click",
    function () {


        tasks =
            tasks.filter(
                function (task) {

                    return !task.completed;

                }
            );


        saveTasks();


        renderTasks();

    }
);


/* =========================================================
   TASK COUNTER
========================================================= */

function updateTaskCount() {


    const activeTasks =
        tasks.filter(
            function (task) {

                return !task.completed;

            }
        ).length;


    taskCount.textContent =
        activeTasks;

}


/* =========================================================
   BASIC HTML ESCAPING
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   INITIAL RENDER
========================================================= */

renderTasks();