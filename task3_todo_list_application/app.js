"use strict";

var ENTER_KEYCODE = 13;

var listElement = document.querySelector('.list');

document.getElementById('statistic__all__value').innerHTML = 0;
document.getElementById('statistic__done__value').innerHTML = 0;
document.getElementById('statistic__left__value').innerHTML = 0;

var filters = document.querySelector('.filters');
var currentFilter = 'all';

var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

    // Фильтруем визуализацию
    if (currentFilter === 'done')
        newElement.classList.add('hidden');

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
    }
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);

    // Рендерим статистику
    doneTasksCounter(2 * isTodo - 1);
    leftTasksCounter(1 - 2 * isTodo);

    // Фильтруем визуализацию
    if (currentFilter !== 'all')
        element.classList.add('hidden');

}

function deleteTodo(element) {
    listElement.removeChild(element);
    var isTodo = element.classList.contains('task_todo');

    // Рендерим статистику
    doneTasksCounter(-!isTodo);
    leftTasksCounter(-isTodo);
    allTaskCounter(-1);
}

function onInputKeydown(event) {

    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    insertTodoElement(addTodoFromTemplate(todo));

    // Рендерим статистику
    leftTasksCounter(1);
    allTaskCounter(1);

    inputElement.value = '';
}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function (element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}


listElement.addEventListener('click', onListClick);


var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

// Добавление в начало
function insertTodoElement(elem) {
    if (listElement.children) {
        listElement.insertBefore(elem, listElement.firstElementChild);
    } else {
        listElement.appendChild(elem);
    }
}


function doneTasksCounter(count) {
    var done = parseInt(document.getElementById("statistic__done__value").innerHTML)
    document.getElementById("statistic__done__value").innerHTML = done + count;
}

function leftTasksCounter(count) {
    var left = parseInt(document.getElementById("statistic__left__value").innerHTML)
    document.getElementById("statistic__left__value").innerHTML = left + count;
}

function allTaskCounter(count) {
    var all = parseInt(document.getElementById("statistic__all__value").innerHTML)
    document.getElementById("statistic__all__value").innerHTML = all + count;

}



filters.addEventListener('click', onFilterClick);

function onFilterClick(event) {
    var target = event.target;

    document.querySelector('.filters__item_selected').classList.remove('filters__item_selected');
    target.classList.add('filters__item_selected');

    var tasksToHide = [];
    var tasksToShow = [];


    if (isAllBtn(target)) {
        currentFilter = 'all';
        tasksToShow = document.querySelectorAll('.task_todo, .task_done');
    }

    if (isDoneBtn(target)) {
        currentFilter = 'done';        
        tasksToShow = document.querySelectorAll('.task_done');
        tasksToHide = document.querySelectorAll('.task_todo');
    }

    if (isTodoBtn(target)) {
        currentFilter = 'todo';
        tasksToShow = document.querySelectorAll('.task_todo');
        tasksToHide = document.querySelectorAll('.task_done');
    }


    for (var i = 0; i < tasksToShow.length; i++) {
        tasksToShow[i].classList.remove('hidden');
    }

    for (var i = 0; i < tasksToHide.length; i++) {
        tasksToHide[i].classList.add('hidden');
    }
}

function isAllBtn(target) {
    return target.attributes['data-filter']['nodeValue'] === 'all';
}

function isDoneBtn(target) {
    return target.attributes['data-filter']['nodeValue'] === 'done';
}

function isTodoBtn(target) {
    return target.attributes['data-filter']['nodeValue'] === 'todo';
}
