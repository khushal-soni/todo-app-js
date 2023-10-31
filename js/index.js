// * --------------------------------------
// * TASKS
// * --------------------------------------
// * Render Todos on Page load, and when user adds or removes a todo - Done
// * On Toggling theme button, change the theme - Pending
// * On submit, add the todo to an array - Done
// * On Clicking checkbox, change status of todo and show checked accordingly - Done
// * On Clicking Delete, delete the item - Done
// * On Clicking Clear All Tasks, clear the todos - Done
// * On Clicking Clear Completed Tasks, clear those todos - Pending
// * Show Error if something goes wrong - Pending

// * --------------------------------------
// * CONSTANTS
// * --------------------------------------
const localStorage = window.localStorage;
const TODO_STATUS = ['pending', 'complete'];
const THEMES = ['light', 'dark'];

// * --------------------------------------
// * ELEMENTS
// * --------------------------------------
const htmlElement = document.documentElement;
const heroImg = document.querySelector('.hero');
const themeToggleBtn = document.querySelector('.btn-theme-toggle');
const themeToggleIcon = themeToggleBtn.firstElementChild;
const todoForm = document.querySelector('.todo-form');
const todoItems = document.querySelector('.todo-items');
const todoListContainer = document.querySelector('.todo-list-container');

// Templates
const todoTemplate = document.getElementById('todo-template');
const noTodoTemplate = document.getElementById('no-todo-template');
const todoClearTemplate = document.getElementById('todo-clear-template');

// * --------------------------------------
// * SCRIPT
// * --------------------------------------

// * Default Theming - Light
const theme = localStorage.getItem('theme');
if (!theme) {
    localStorage.setItem('theme', THEMES[0]);
}

window.addEventListener('DOMContentLoaded', (event) => {
    loadTheme();
    loadAndRenderTodo();
});

function loadTheme() {
    const theme = localStorage.getItem('theme');

    if (!theme) {
        // * Throw an error
    }

    if (theme === THEMES[0]) {
        htmlElement.removeAttribute('data-theme', THEMES[1]);
        heroImg.classList.remove('hero-dark');
        heroImg.classList.add('hero-light');

        themeToggleIcon.src = 'images/icon-moon.svg';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        heroImg.classList.remove('hero-light');
        heroImg.classList.add('hero-dark');

        themeToggleIcon.src = 'images/icon-sun.svg';
    }
}

function toggleTheme (toggleBtn) {
    const theme = localStorage.getItem('theme');

    if (theme === THEMES[0]) {
        htmlElement.setAttribute('data-theme', THEMES[1]);
        heroImg.classList.remove('hero-light');
        heroImg.classList.add('hero-dark');

        themeToggleIcon.src = 'images/icon-sun.svg';
        localStorage.setItem('theme', THEMES[1]);
    } else {
        htmlElement.removeAttribute('data-theme');
        heroImg.classList.remove('hero-dark');
        heroImg.classList.add('hero-light');

        themeToggleIcon.src = 'images/icon-moon.svg';
        localStorage.setItem('theme', THEMES[0]);
    }
}

// * Add Todo
todoForm.addEventListener('submit', addTodo);
function addTodo (event) {
    event.preventDefault();

    const todoInput = event.currentTarget.querySelector('#todo-form__input');

    const id = "id" + Math.random().toString(16).slice(2);
    const todo = {
        id,
        text: todoInput.value,
        status: 'pending'
    };
    todoInput.value = ''

    // * Fetch Todos from local storage
    let todos = JSON.parse(localStorage.getItem('todos'));
    if (!todos) todos = [];

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));

    // renderTodo(todo);
    loadAndRenderTodo();
}

function loadAndRenderTodo () {
    todoItems.innerHTML = '';

    const todos = JSON.parse(localStorage.getItem('todos'));

    if (todos && todos.length) {
        todos.forEach((todo) => {
            renderTodo(todo);
        })

        const todoClearExists = todoListContainer.querySelector('.todo-clear');
        if (!todoClearExists) {
            const todoClearClone = document.importNode(todoClearTemplate.content, true);
            todoListContainer.appendChild(todoClearClone);
        }
    } else {
        const todoClearExists = todoListContainer.querySelector('.todo-clear');
        if (todoClearExists) {
            todoClearExists.remove();
        }

        const clone = document.importNode(noTodoTemplate.content, true);
        todoItems.appendChild(clone);
    }
}

// * Render Single Todo
function renderTodo (todo) {
    const clone = document.importNode(todoTemplate.content, true);

    clone.querySelector('.todo-item').setAttribute('uniqueId', todo.id);
    
    const todoText = clone.querySelector('.todo-item__text');
    const todoCheckDiv = clone.querySelector('.todo-item__check');
    const deleteTodoBtn = clone.querySelector('.todo-item__delete-btn');
    const todoCheckbox = todoCheckDiv.querySelector('.todo-item__checkbox');
    const todoCheckboxImg = todoCheckDiv.querySelector('.todo-item__check-img');
    
    todoText.textContent = todo.text;
    todoCheckbox.addEventListener('click', toggleCheckButton);
    deleteTodoBtn.addEventListener('click', deleteTodo);

    if (todo.status === TODO_STATUS[1]) {
        todoText.classList.add('todo-text__completed');
        todoCheckDiv.classList.add('todo-item__checked-div');
        todoCheckboxImg.classList.add('todo-item__checked-span');

        todoCheckbox.checked = true;
    } else {
        todoCheckbox.checked = false;
    }

    todoItems.appendChild(clone);
}

function toggleCheckButton (event) {
    const checkbox = event.target;

    let uniqueId;
    const parentElement = event.currentTarget.parentElement.parentElement;
    if (parentElement) uniqueId = parentElement.getAttribute('uniqueId');

    const todos = JSON.parse(localStorage.getItem('todos'));
    if (!todos || (todos && !todos.length)) {
        loadAndRenderTodo();
        return;
    }

    const todo = todos.find((todo) => todo.id === uniqueId);

    if (checkbox.checked) {
        todo.status = TODO_STATUS[1];
    } else if (!checkbox.checked) {
        todo.status = TODO_STATUS[0];
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    loadAndRenderTodo();
}

function clearAllTodos () {
    localStorage.removeItem('todos');
    loadAndRenderTodo();

    // * Show up a toaster
}

function deleteTodo (event) {
    const deleteBtnDiv = event.target.closest('.todo-item__delete-btn');
    
    if (deleteBtnDiv) {
        const todoItem = event.target.closest('.todo-item');
        const uniqueId = todoItem.getAttribute('uniqueid');

        const todos = JSON.parse(localStorage.getItem('todos'));
        const updatedTodos = todos.filter((todo) => todo.id !== uniqueId);

        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        loadAndRenderTodo();
    }
}
