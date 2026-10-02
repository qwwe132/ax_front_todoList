// =========================================
// 1. 상태와 DOM 요소
// =========================================
const STORAGE_KEY = "todos";

let todos = loadTodos(); // [{ id, date, title, content }]
let editingId = null;    // 수정 중인 할 일의 id (없으면 null)

const form = document.getElementById("todoForm");
const formTitle = document.getElementById("formTitle");
const dateInput = document.getElementById("dateInput");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const todoList = document.getElementById("todoList");
const emptyMessage = document.getElementById("emptyMessage");

// =========================================
// 2. localStorage 저장 / 불러오기 (새로고침해도 유지)
// =========================================
function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("불러오기 실패:", err);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// =========================================
// 3. CRUD 기능
// =========================================

// 추가 (Create)
function addTodo(date, title, content) {
  todos.push({ id: Date.now(), date, title, content });
  saveTodos();
  render();
}

// 수정 (Update)
function updateTodo(id, date, title, content) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, date, title, content } : todo
  );
  saveTodos();
  render();
}

// 삭제 (Delete)
function deleteTodo(id) {
  if (!confirm("정말 삭제할까요?")) return;

  todos = todos.filter((todo) => todo.id !== id);
  if (editingId === id) resetForm(); // 수정 중이던 항목을 지웠다면 폼 초기화
  saveTodos();
  render();
}

// =========================================
// 4. 조회 (Read) - 카드 그리기
// =========================================
function render() {
  todoList.innerHTML = "";

  // 날짜 빠른 순으로 정렬 (원본 배열은 그대로 두고 복사본을 정렬)
  const sorted = [...todos].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((todo) => {
    todoList.appendChild(createCard(todo));
  });

  emptyMessage.hidden = todos.length > 0;
}

function createCard(todo) {
  const li = document.createElement("li");
  li.className = todo.id === editingId ? "todo-card editing" : "todo-card";

  // [날짜] 제목  (textContent를 써서 입력값의 HTML 코드가 실행되지 않게 함)
  const titleEl = document.createElement("p");
  titleEl.className = "todo-card-title";
  titleEl.textContent = `[${todo.date}] ${todo.title}`;

  // 내용
  const contentEl = document.createElement("div");
  contentEl.className = "todo-card-content";
  contentEl.textContent = todo.content;

  // 버튼
  const buttons = document.createElement("div");
  buttons.className = "todo-card-buttons";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-delete";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-edit";
  editBtn.textContent = "수정";
  editBtn.addEventListener("click", () => startEdit(todo));

  buttons.append(deleteBtn, editBtn);
  li.append(titleEl, contentEl, buttons);
  return li;
}

// =========================================
// 5. 수정 모드 전환
// =========================================

// 수정 버튼 → 위쪽 폼에 기존 값을 채우고 "수정하기" 모드로
function startEdit(todo) {
  editingId = todo.id;
  dateInput.value = todo.date;
  titleInput.value = todo.title;
  contentInput.value = todo.content;

  formTitle.textContent = "할일 수정";
  submitBtn.textContent = "수정하기";
  cancelBtn.hidden = false;

  render(); // 수정 중인 카드 테두리 표시
  window.scrollTo({ top: 0, behavior: "smooth" });
  titleInput.focus();
}

// 폼을 처음 "등록" 상태로 되돌리기
function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "할일 등록";
  submitBtn.textContent = "등록하기";
  cancelBtn.hidden = true;
}

// =========================================
// 6. 이벤트 연결
// =========================================
form.addEventListener("submit", (e) => {
  e.preventDefault(); // 폼 제출 시 새로고침 막기

  const date = dateInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // 빈 값 검사
  if (!date) {
    alert("날짜를 선택해 주세요.");
    dateInput.focus();
    return;
  }
  if (!title) {
    alert("제목을 입력해 주세요.");
    titleInput.focus();
    return;
  }
  if (!content) {
    alert("내용을 입력해 주세요.");
    contentInput.focus();
    return;
  }

  if (editingId === null) {
    addTodo(date, title, content);
  } else {
    updateTodo(editingId, date, title, content);
  }

  resetForm();
  render();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  render();
});

// 처음 화면 그리기
render();
