const container = document.querySelector('.items-todo');
const form = document.querySelector('.form-todo');
let todo = localStorage.getItem('todo');
let parseTodo = [];
initData();


function initData() {
    //если нет ключа todo в локалстор ничего не делать
    if(!todo) return
    //из строки JSON в массив с обьектами
    parseTodo = JSON.parse(todo);
    let todoItem = '';
    // перебираем и добавляем из локалстор в хтмл
    parseTodo.forEach(function (item) {
        todoItem = `<li class="add-item-wrapp">
        ${item.checked ? `<input class="input-item" type="checkbox" id="todo-${item.id}" value="${item.id}" checked>` : `<input class="input-item" type="checkbox" id="todo-${item.id}" value="${item.id}">`}
        <label class="item-descr" for="todo-${item.id}">${item.name}</label>
        <div class="edit-item" data-id="${item.id}"></div>
        <div class="remove-item" data-id="${item.id}"></div>
    </li>`
        //добавляет без перезатирания
        container.insertAdjacentHTML('beforeend', todoItem);
    })

}

// информация об отсутствие дел
let mainWrapp = document.querySelector(".main-wrapp");
let hiddenImg = document.querySelector('.hidden-img');
parseTodo = JSON.parse(todo);

if(!parseTodo || !parseTodo.length){
    hiddenImg.classList.toggle('emptyList');
} 
 
//при заполнении поля нового дела.
form.addEventListener('submit', function (event) {
    // console.log(parseTodo)
    event.preventDefault();
    if(!parseTodo || !parseTodo.length){
        hiddenImg.classList.toggle('emptyList');
    }
    //отменяем действия формы по умолчанию (отправка формы)

    //перезаписывает переменную todo
    todo = localStorage.getItem('todo');
    const valueInput = document.getElementById('add-todo');
    let newTodoItem = '';
    let storageTodo = {};
    //используем проверку перезаписаной todo
    if (!todo){
        newTodoItem = `<li class="add-item-wrapp">
        <input class="input-item" type="checkbox" id="todo-1" value="1">
        <label class="item-descr" for="todo-1">${valueInput.value}</label>
        <div class="edit-item" data-id="1"></div>
        <div class="remove-item" data-id="1"></div>
    </li>`
        storageTodo = {
            id: 1,
            name: valueInput.value,
            checked: false
        }
        //записываем данные в json
        localStorage.setItem('todo', JSON.stringify([storageTodo]));
    } else {
        //преобраз из строки json в код js
        parseTodo = JSON.parse(localStorage.getItem('todo'));
        // переменная с вставкой блока дела
        newTodoItem = `<li class="add-item-wrapp">
        <input class="input-item" type="checkbox" id="todo-${parseTodo.length + 1}" value="${parseTodo.length + 1}">
        <label class="item-descr" for="todo-${parseTodo.length + 1}">${valueInput.value}</label>
        <div class="edit-item" data-id="${parseTodo.length + 1}"></div>
        <div class="remove-item" data-id="${parseTodo.length + 1}"></div>
    </li>`
        // шаблон дела
        storageTodo = {
            id: parseTodo.length + 1,
            name: valueInput.value,
            checked: false
        };
       
        localStorage.setItem('todo', JSON.stringify([...parseTodo, storageTodo]));
    }

    container.insertAdjacentHTML('beforeend', newTodoItem);
    valueInput.value = ""; //очистка поля заполнения
})

// изменение в локал чекед на тру
document.addEventListener('click',function(e){
    todo = localStorage.getItem('todo');
    parseTodo = JSON.parse(todo);
    if(e.target.classList.contains('input-item')){
        const value = e.target.value; // или e.target.value = this

        const changeTodo = parseTodo.map(function(todo) {
            if (todo.id === Number(value)) {
                todo.checked = e.target.checked;
            }
            return todo;
        })
        localStorage.setItem('todo', JSON.stringify(changeTodo))
    } else if (e.target.classList.contains('remove-item')) {
        const removeTodo = e.target.parentNode;
        const elementId = e.target.getAttribute('data-id');
        const updateTodo = parseTodo.filter(function (item) {
            return item.id !== Number(elementId)
        });
        removeTodo.remove()
        
        localStorage.setItem('todo', JSON.stringify(updateTodo))
        console.log(updateTodo)
        if(!updateTodo.length){
           hiddenImg.classList.toggle('emptyList');
        }
    } else if (e.target.classList.contains('edit-item')) {
        const elementId = e.target.getAttribute('data-id');
        const parentTodo = e.target.parentNode;
        const editTodoIdx = parseTodo.findIndex(function (item) {
            return item.id === Number(elementId)
        });
        const editTpl = `
        <div class="show-edit">
            <span class="waiting-todo"></span>
            <textarea required
                type="text"
                class="edit-todo"
                id="edit-todo-${parseTodo[editTodoIdx].id}"
            >${parseTodo[editTodoIdx].name}</textarea>
            <span data-id="${parseTodo[editTodoIdx].id}" class="edit-save"></span>
            <span class="edit-close"></span>
        </div>
        `;

        parentTodo.insertAdjacentHTML('beforeend', editTpl);
    } else if (e.target.classList.contains('edit-save')){
        const elementId = e.target.getAttribute('data-id');
        const saveBtn = e.target;
        const parentSaveBtn = saveBtn.parentNode;
        const parentLi = saveBtn.parentNode.parentNode;
        const labelName = parentLi.children[1];
        const editValue = parentSaveBtn.children[1].value;
        const changeTodo = parseTodo.map(function(todo) {
            if (todo.id === Number(elementId)) {
                todo.name = editValue;
            }
            return todo;
        });
        parentSaveBtn.remove();
        labelName.innerHTML = editValue;
        localStorage.setItem('todo', JSON.stringify(changeTodo))
    } else if (e.target.classList.contains('edit-close')) {
        const parentCloseBtn = e.target.parentNode;
        parentCloseBtn.remove();
    }
});


