"use strict";

var ENTER_KEYCODE = 13;

var listElement = document.querySelector('.list');

//============================================================
//======================== MY CODE ===========================
//============================================================
document.getElementById("statistic__all__value").innerHTML = 0;
document.getElementById("statistic__done__value").innerHTML = 0;
document.getElementById("statistic__left__value").innerHTML = 0;
//============================================================
//=================== END OF MY CODE =========================
//============================================================


var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

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

//============================================================
//======================== MY CODE ===========================
//============================================================
    /*
        if (isTodo) {
            doneTasksCounter(1);
            leftTasksCounter(-1);
        }
        else {
            doneTasksCounter(-1);
            leftTasksCounter(1);
        }
    */
    // isTodo == True -- done
    doneTasksCounter(2 * isTodo - 1);
    leftTasksCounter(1 - 2 * isTodo);
//============================================================
//=================== END OF MY CODE =========================
//============================================================

}

function deleteTodo(element) {
    listElement.removeChild(element);
    var isTodo = element.classList.contains('task_todo');
//============================================================
//======================== MY CODE ===========================
//============================================================
    doneTasksCounter(-!isTodo);
    leftTasksCounter(-isTodo);
    allTaskCounter(-1);
//============================================================
//=================== END OF MY CODE =========================
//============================================================

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
//============================================================
//======================== MY CODE ===========================
//============================================================
    leftTasksCounter(1);
    allTaskCounter(1);
//============================================================
//=================== END OF MY CODE =========================
//============================================================
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

//============================================================
//======================== MY CODE ===========================
//============================================================

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
//============================================================
//=================== END OF MY CODE =========================
//============================================================




//============================================================
//======================== MY CODE ===========================
//======================== FILTERS ===========================
//============================================================

var filters = document.querySelector('.filters');
filters.addEventListener('click', onFilterClick);

function onFilterClick(event) {
    var target = event.target;


    var tasksToHide = [];
    var tasksToShow = [];


    if (isAllBtn(target)) {
        tasksToShow = document.querySelectorAll('.task_todo, .task_done');
    }

    if (isDoneBtn(target)) {
        tasksToShow = document.querySelectorAll('.task_done');
        tasksToHide = document.querySelectorAll('.task_todo');
    }

    if (isTodoBtn(target)) {
        tasksToShow = document.querySelectorAll('.task_todo');
        tasksToHide = document.querySelectorAll('.task_done');
    }


    for (var i = 0; i < tasksToShow.length; i++) {
        tasksToShow[i].style.display = 'list-item';
    }

    for (var i = 0; i < tasksToHide.length; i++) {
        tasksToHide[i].style.display = 'none';
    }
}

function isAllBtn(target) {
    document.querySelector('.filters__item_selected').classList.remove("filters__item_selected");
    target.classList.add('filters__item_selected');
    return target.attributes['data-filter']['nodeValue'] === 'all';
}

function isDoneBtn(target) {
    // Почему код работает без этого участка?
/*
    document.querySelector('.filters__item_selected').classList.remove("filters__item_selected")
    target.classList.add('filters__item_selected')
*/
    return target.attributes['data-filter']['nodeValue'] === 'done';
}

function isTodoBtn(target) {
    // Почему код работает без этого участка?
/*
    document.querySelector('.filters__item_selected').classList.remove("filters__item_selected")
    target.classList.add('filters__item_selected')
*/
    return target.attributes['data-filter']['nodeValue'] === 'todo';
}

//============================================================
//===================== END OF MY CODE =======================
//======================== FILTERS ===========================
//============================================================
