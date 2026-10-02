const form = document.querySelector("#todo-form");
const todoWrap = document.querySelector(".todo-wrap");
let index = 0;
if(window.localStorage.getItem("index")){
    index = window.localStorage.getItem("index");
}

loadTodoList();
loadTrashTodoList();
setSort();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (confirm("등록하시겠습니까?")) {
        const formData = new FormData(form);
        if(validateForm(formData)){
            setTodoList(formData);
        }
    }
});

document.querySelector(".sort_regist").addEventListener("click", (e) => {
    window.localStorage.setItem("sort", "regist");
    setSort();
})

document.querySelector(".sort_date").addEventListener("click", (e) => {
    window.localStorage.setItem("sort", "date");
    setSort();
})

function loadTodoList(){
    document.querySelector(".todo-wrap").replaceChildren();

    const todoList = JSON.parse(window.localStorage.getItem("todoList"));

    for(idx in todoList){
        const todoData = todoList[idx];
        const template = document.querySelector("#template-todo");
        const clone = template.content.cloneNode(true);
        const todo = clone.querySelector(".todo")

        todo.dataset.index = todoData.index;
        todo.dataset.date = todoData.date
        todo.dataset.title = todoData.title
        todo.dataset.content = todoData.content

        clone.querySelector(".todo-title").textContent = todoData.date + " " + todoData.title;
        clone.querySelector(".todo-content").textContent = todoData.content

        document.querySelector(".todo-wrap").appendChild(clone);
    }
}

function loadTrashTodoList(){
    document.querySelector(".trash-todo").replaceChildren();

    const removeTodoList = JSON.parse(window.localStorage.getItem("removeTodoList"));

    for(idx in removeTodoList){
        const todoData = removeTodoList[idx];
        const template = document.querySelector("#template-trash");
        const clone = template.content.cloneNode(true);
        const todo = clone.querySelector(".trt_wrap")

        todo.dataset.index = todoData.index;
        todo.dataset.date = todoData.date
        todo.dataset.title = todoData.title
        todo.dataset.content = todoData.content

        clone.querySelector(".trt_date").textContent = todoData.date
        clone.querySelector(".trt_title").textContent = todoData.title;
        clone.querySelector(".trt_content").textContent = todoData.content

        document.querySelector(".trash-todo").appendChild(clone);
    }
}

function validateForm(formData){
    if(!formData.get("date")){
        alert("날짜를 입력해주세요");
        form.querySelector("[name='date']").focus();
        return false;
    }

    if(!formData.get("title")){
        alert("제목 입력해주세요");
        form.querySelector("[name='title']").focus();
        return false;
    }

    if(!formData.get("content")){
        alert("내용을 입력해주세요");
        form.querySelector("[name='content']").focus();
        return false;
    }
    
    return true;
}

function setSort(){
    let sort = window.localStorage.getItem("sort") ? 
                    window.localStorage.getItem("sort") : "regist";
    
    if(sort == "regist"){
        document.querySelector(".sort_regist").classList.add("active");
        document.querySelector(".sort_date").classList.remove("active");

        const todoList = JSON.parse(window.localStorage.getItem("todoList"));

        todoList.sort((a, b) => a.index - b.index)
        window.localStorage.setItem("todoList", JSON.stringify(todoList));

        loadTodoList();

    }else if(sort == "date"){
        document.querySelector(".sort_date").classList.add("active");
        document.querySelector(".sort_regist").classList.remove("active");

        const todoList = JSON.parse(window.localStorage.getItem("todoList"));

        todoList.sort((a, b) => new Date(a.date) - new Date(b.date))
        window.localStorage.setItem("todoList", JSON.stringify(todoList));

        loadTodoList();
    }
}

function setTodoList(formData) {
    const template = document.querySelector("#template-todo");
    // 수정
    if(formData.get("index")){
        const todo = document.querySelector(".todo[data-index='"+formData.get("index")+"']")
        
        todo.dataset.index = formData.get("index")
        todo.dataset.date = formData.get("date");
        todo.dataset.title = formData.get("title");
        todo.dataset.content = formData.get("content");

        todo.querySelector(".todo-title").textContent = formData.get("date") + " " + formData.get("title");
        todo.querySelector(".todo-content").textContent = formData.get("content");

        const todo_data = {
            index : formData.get("index"),
            date : formData.get("date"),
            title : formData.get("title"),
            content : formData.get("content")
        }

        const todoList = JSON.parse(window.localStorage.getItem("todoList"));
        const findIndex = todoList.findIndex(item => item.index == todo_data.index);

        todoList[findIndex] = todo_data;

        console.log(findIndex)
        console.log(todoList)
        console.log(todo_data);
        window.localStorage.setItem("todoList", JSON.stringify(todoList));
    }
    // 등록
    else{
        const clone = template.content.cloneNode(true);
        const todo = clone.querySelector(".todo")

        todo.dataset.index = index;
        todo.dataset.date = formData.get("date");
        todo.dataset.title = formData.get("title");
        todo.dataset.content = formData.get("content");

        clone.querySelector(".todo-title").textContent = formData.get("date") + " " + formData.get("title");
        clone.querySelector(".todo-content").textContent = formData.get("content");

        document.querySelector(".todo-wrap").appendChild(clone);

        const todo_data = {
            index : index++,
            date : formData.get("date"),
            title : formData.get("title"),
            content : formData.get("content")
        }

        let todoList = [];

        if(window.localStorage.getItem("todoList")){
            const todoListParse = JSON.parse(window.localStorage.getItem("todoList"));

            todoList = [...todoListParse, todo_data];
        }else{
            todoList = [todo_data]
        }

        window.localStorage.setItem("todoList", JSON.stringify(todoList));
        window.localStorage.setItem("index", index);

    }

    form.reset();

    const input = form.querySelector('[name="index"]');
    if(input) input.remove();
}

todoWrap.addEventListener("click", (e) => {

    const todo = e.target.closest(".todo");
    const dataset = todo.dataset;

    if (e.target.classList.contains("btn-remove")) {
        
        if (confirm("삭제하시겠습니까?")) {
            removeTodo(dataset);
        }

    }else if (e.target.classList.contains("btn-update")) {
        
        if (confirm("수정하시겠습니까?")) {
            setTodoForm(dataset);
        }

    }

});

function setTodoForm(dataset){
    let input = form.querySelector('[name="index"]');
    if(input) {
        input.remove();
    }else{
        input = document.createElement("input");
    }

    const todoList = JSON.parse(window.localStorage.getItem("todoList"));
    const todo = todoList.find(item => item.index == dataset.index);

    input.type = "hidden"
    input.name = "index"
    input.value = dataset.index

    form.appendChild(input)

    form.querySelector('[name="date"]').value = todo.date;
    form.querySelector('[name="title"]').value = todo.title;
    form.querySelector('[name="content"]').value = todo.content;
}

function removeTodo(dataset){
    const todo = document.querySelector('.todo[data-index="'+dataset.index+'"]');
    todo.remove();

    let removeTodoList = JSON.parse(window.localStorage.getItem("removeTodoList") ?
                                        window.localStorage.getItem("removeTodoList") : "[]" );

    removeTodoList.push(dataset)
    window.localStorage.setItem("removeTodoList", JSON.stringify(removeTodoList));

    const todoList = JSON.parse(window.localStorage.getItem("todoList"));
    const findIndex = todoList.findIndex(item => item.index == dataset.index);

    todoList.splice(findIndex, 1);

    window.localStorage.setItem("todoList", JSON.stringify(todoList));

    form.reset();
}

const modal = document.querySelector("#trash-modal");

document.querySelector(".trashcan").addEventListener("click", () => {
    loadTrashTodoList()
    modal.showModal();
});

document.querySelector("#btn-close").addEventListener("click", () => {
    modal.close();
});

modal.addEventListener("click", (e) =>{
    const trt = e.target.closest(".trt_wrap");
    const dataset = trt.dataset ? trt.dataset : null;
    
    if (e.target.classList.contains("btn-delete")) {
        
        if (confirm("영구 삭제하시겠습니까?")) {
            deleteTodo(dataset);
        }

    }else if (e.target.classList.contains("btn-recover")) {
        
        if (confirm("복구하시겠습니까?")) {
            recoverTodo(dataset);
        }

    }
})

function recoverTodo(dataset){

    const removeTodoList = JSON.parse(window.localStorage.getItem("removeTodoList"));
    const findIndex = removeTodoList.findIndex(item => item.index == dataset.index);

    const recoverTodo = removeTodoList[findIndex];

    const todoList = JSON.parse(window.localStorage.getItem("todoList"));

    todoList.push(recoverTodo);
    todoList.sort((a, b) => a.index - b.index)

    window.localStorage.setItem("todoList", JSON.stringify(todoList));

    removeTodoList.splice(findIndex, 1);
    window.localStorage.setItem("removeTodoList", JSON.stringify(removeTodoList));

    loadTrashTodoList();
    loadTodoList();
}

function deleteTodo(dataset){
    const removeTodoList = JSON.parse(window.localStorage.getItem("removeTodoList"));
    const findIndex = removeTodoList.findIndex(item => item.index == dataset.index);

    removeTodoList.splice(findIndex, 1);

    window.localStorage.setItem("removeTodoList", JSON.stringify(removeTodoList));

    loadTrashTodoList()
}