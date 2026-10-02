document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('.summit');
    const dateInput = document.querySelector('.date1');
    const titleInput = document.querySelector('.todonameinput');
    const contentInput = document.querySelector('.todolist1');
    const todoListContainer = document.querySelector('.todoworkinglist');

    // [등록하기] 버튼 클릭 이벤트
    submitBtn.addEventListener('click', () => {
        const dateValue = dateInput.value;
        const titleValue = titleInput.value;
        const contentValue = contentInput.value;

        // 유효성 검사
        if (!dateValue || !titleValue || !contentValue) {
            alert('날짜, 제목, 내용을 모두 입력해주세요!');
            return;
        }

        // 새로운 카드 생성
        const card = document.createElement('div');
        card.className = 'border border-gray-200 rounded-sm p-4 bg-white flex flex-col justify-between shadow-sm min-h-[100px]';

        card.innerHTML = `
            <div>
                <div class="text-emerald-600 font-bold text-sm mb-2">[${dateValue}] ${titleValue}</div>
                <div class="text-gray-700 text-sm whitespace-pre-wrap mb-4">${contentValue}</div>
            </div>
            <div class="flex gap-2">
                <button type="button" class="btn-edit flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 rounded transition-colors">수정</button>
                <button type="button" class="btn-delete flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded transition-colors">삭제</button>
            </div>
        `;

        // 카드 데이터 저장 (나중에 수정할 때 사용)
        card.dataset.date = dateValue;
        card.dataset.title = titleValue;
        card.dataset.content = contentValue;

        // 삭제 버튼 기능
        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            card.remove();
        });

        // 수정 버튼 기능
        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', () => {
            // 입력창에 기존 값 채우기
            dateInput.value = card.dataset.date;
            titleInput.value = card.dataset.title;
            contentInput.value = card.dataset.content;

            // 기존 카드 삭제
            card.remove();

            // 입력창에 포커스
            dateInput.focus();
        });

        // 하단 리스트 영역에 카드 추가
        todoListContainer.appendChild(card);

        // 입력창 초기화
        dateInput.value = '';
        titleInput.value = '';
        contentInput.value = '';
    });
});