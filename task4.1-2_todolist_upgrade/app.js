"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;

var ENTER_KEYCODE = 13;
var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// сформируем задачки
/**
 * @typedef {Object} TodoItem
 * @property {string} name - имя тудушки
 * @property {string} status - статус
 */

/**
 * @type {Array.<TodoItem>}
 */
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

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

// todoList
//     .map(addTodoFromTemplate)
//     .forEach(insertTodoElement);

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

/*==================================
 =            СТАТИСТИКА            =
 ==================================*/

function Statistic(elemClass, doneElemClass, todoElemClass, totalElemClass) {
    this.done = 0;
    this.todo = 0;
    this.element = document.querySelector(elemClass);
    this.donelElement = this.element.querySelector(doneElemClass);
    this.todoElement = this.element.querySelector(todoElemClass);
    this.totalElement = this.element.querySelector(totalElemClass);
}

Statistic.prototype.renderStats = renderStats;
Statistic.prototype.addToStats = addToStats;
Statistic.prototype.changeStats = changeStats;
Statistic.prototype.deleteFromStats = deleteFromStats;

var stats = new Statistic('.statistic', '.statistic__done', '.statistic__left', '.statistic__total');

// создадим функции работы со статистикой
/**
 * отрисовывает статистику в DOM
 */
function renderStats() {
    this.donelElement.textContent = this.done;
    this.todoElement.textContent = this.todo;
    this.totalElement.textContent = this.done + this.todo;
}

// теперь на каждое из действий — обновление статистики
/**
 * добавляет значение к статистике и обновляет DOM
 * @param {boolean} isTodo — статус новой тудушки
 */
function addToStats(isTodo) {
    if (isTodo) {
        this.todo++;
    } else {
        this.done++;
    }
    this.renderStats();
}

/**
 * измененяет статус тудушки и обновляет DOM
 * @param {boolean} isTodo статус после изменения
 */
function changeStats(isTodo) {
    if (isTodo) {
        this.todo++;
        this.done--;
    } else {
        this.todo--;
        this.done++;
    }
    this.renderStats();
}

/**
 * отрабатывает удаление тудушки и обновляет DOM
 * @param {boolean} isTodo статус удаленной тудушки
 */
function deleteFromStats(isTodo) {
    if (isTodo) {
        this.todo--;
    } else {
        this.done--;
    }
    this.renderStats();
}


/*==================================
 =            ФИЛЬТРАЦИЯ            =
 ==================================*/

// изменим парадигму — теперь все изменения на тудушках сначала будут отражаться на todoList
// и лишь потом отображаться в DOM

// создадим enum с возможными вариантами фильтров
var filterValues = {
    ALL: 'all',
    DONE: 'done',
    TODO: 'todo'
};

// currentFilter — текущий выбранный фильтр
var currentFilter = filterValues.ALL;

// найдем дом-элемент фильтров
var filtersElement = document.querySelector('.filters');
filtersElement.addEventListener('click', onFiltersClick);

/**
 * обработчик клика по контейнеру с фильтрами
 * @param {MouseEvent} event
 */
function onFiltersClick(event) {

    // проверим, что кликнули по кнопке фильтра, а не куда-нибудь еще
    var target = event.target;
    if (!target.classList.contains('filters__item')) {
        return;
    }

    // считаем значение data-filter у соответствующей кнопки
    var value = target.dataset.filter;

    // если кликнули по текущему фильтру — ничего не делаем
    if (value === currentFilter) {
        return;
    }

    // если мы дошли до этой строчки, значит надо поменять фильтр

    // уберем класс у прежней кнопки(выбранного фильтра)
    filtersElement.querySelector('.filters__item_selected').classList.remove('filters__item_selected');
    // и установим класс той, по которой кликнули
    target.classList.add('filters__item_selected');
    // изменим значение текущего выбранного фильтра
    currentFilter = value;
    // перерисуем список
    renderFilteredList();
}

/**
 * отрисовывает список в соответствии с currentFilter
 */
function renderFilteredList() {
    var filteredList;

    // в зависимости от значения currentFilter
    // отфильтруем список todo
    switch (currentFilter) {
        case filterValues.DONE:
            filteredList = todoList.filter(function (task) {
                return task.status === 'done';
            });
            break;

        case filterValues.TODO:
            filteredList = todoList.filter(function (task) {
                return task.status === 'todo';
            });
            break;

        default:
            filteredList = todoList;
            break;
    }

    // а теперь отрисуем filteredList в качестве списка тудушек
    listElement.innerHTML = '';
    filteredList.forEach(insertTodoElement);
}

// теперь надо изменить все функции по работе с тудушками – они должны сохранять актуальным todoList
// и учитывать значение фильтров

// при вводе в текстовое поле мы добавляли новую тудушку
// 1. переработаем checkIfTodoAlreadyExists — если раньше проверку проводили на DOM элементах,
//    подразумевая, что все элементы отображены, то теперь это может быть неверно —  надо проверять в todoList
// 2. вынесем логику добавления в отдельную функцию
/**
 * отслеживает нажатие ENTER пользователем и создает новую тудушку, если такой нет
 * @param {KeyboardEvent} event
 */
function onInputKeydown(event) {

    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkTodo(todoName)) {
        return;
    }

    addTodo(todoName);
    inputElement.value = '';
}

// 1. переработаем checkIfTodoAlreadyExists — если раньше проверку проводили на DOM элементах,
//    подразумевая, что все элементы отображены, то теперь это может быть неверно —  надо проверять в todoList
/**
 * проверяет, существует ли тудушка с таким именем
 * @param {string} name
 * @returns {boolean}
 */
function checkTodo(name) {
    return !!getTodo(name);
}

/**
 * вспомогательная функция, ищет в todoList тудушку по имени и возвращает её
 * @param todoName
 * @returns {(TodoItem|null)}
 */
function getTodo(todoName) {
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].name === todoName) {
            return todoList[i];
        }
    }
    return null;
}

// 2. вынесем логику добавления в отдельную функцию
/**
 * создает новую тудушку, добавляет в общий список, отрисовывает при необходимости
 * @param {string} name
 */
function addTodo(name) {
    var newTask = createNewTodo(name);
    todoList.push(newTask);
    if (currentFilter !== filterValues.DONE) {
        insertTodoElement(newTask);
    }
    stats.addToStats(true);
}

// обновление статистики теперь не зависит от того, вставляется ли тудушка в DOM или нет
/**
 * вставляет тудушку и обновляет статистику
 * @param {TodoItem} todo
 */
function insertTodoElement(todo) {
    var elem = addTodoFromTemplate(todo);
    listElement.insertBefore(elem, listElement.firstElementChild);

    // ставим дату
    renderDate(elem);
}

// обновим функцию смены статуса тудушки
// раньше было не важно, по какой тудушке кликнули. теперь надо найти эту тудушку в todoList
// и изменить ее статус
/**
 * измененяет статус тудушки и обновляет DOM
 * @param {boolean} isTodo статус после изменения
 */
function changeTodoStatus(element) {
    // извлекаем имя тудушки и находим через вспомогательную функцию
    var task = getTodo(element.querySelector('.task__name').textContent);
    var isTodo = task.status === 'todo';
    // меняем статус в todoList
    task.status = isTodo ? 'done' : 'todo';
    console.log(task);
    // при фильтре "все" нужно поменять класс у тудушки, иначе удалить
    if (currentFilter === filterValues.ALL) {
        setTodoStatusClassName(element, !isTodo);
    } else {
        listElement.removeChild(element);
    }

    // ставим дату
    renderDate(element);
    // и поменять статистику
    stats.changeStats(!isTodo);
}

// аналогично при удалении — нужно удалять из todoList
/**
 * удаляет тудушку, обновляет статистику
 * @param {Element} element
 */
function deleteTodo(element) {
    var task = getTodo(element.querySelector('.task__name').textContent);
    var isTodo = task.status === 'todo';
    todoList.splice(todoList.indexOf(task), 1);
    listElement.removeChild(element);
    stats.deleteFromStats(isTodo);
}

// отрендерим первоначальный список тудушек
todoList.forEach(insertTodoElement);

// поскольку выпилили статистику из insertTodoElement,
// нужно посчитать первоначальные значения
var tasksDone = todoList.filter(function (item) {
    return item.status === 'done';
}).length;

stats.done = tasksDone;
stats.todo = todoList.length - tasksDone;
stats.renderStats();



function renderDate(elem){
    var now = new Date();
    elem.querySelector('.task__time').textContent = getCurrentTime(now);
    elem.querySelector('.task__date').textContent = getCurrentDate(now);
}

function getCurrentTime(now) {
    var hours = now.getHours(); if (hours < 10) hours = '0' + hours;
    var minutes = now.getMinutes(); if (minutes < 10) minutes = '0' + minutes;
    var seconds = now.getSeconds(); if (seconds < 10) seconds = '0' + seconds;
    return hours + ':' + minutes + ":" + seconds;
}

function getCurrentDate(now) {
    var date = now.getDate(); if (date < 10) date = '0' + date;
    var month = now.getMonth() + 1; if (month < 10) month = '0' + month;
    var year = now.getFullYear().toString().slice(2);
    return date + '/' + month + '/' + year;
}
