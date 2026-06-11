import { createTodoStore, initialTodoState, } from './todo-store.js';
const sectionLabels = {
    today: '今日',
    tomorrow: '明日',
};
export const defaultBadClassNames = {
    search: 'todo-search',
    input: 'todo-input',
    addButton: 'btn-add',
    deleteButton: 'btn-delete',
    todoText: 'todo-text',
};
function renderTodoPanel(section, items, classNames) {
    return `
    <div class="todo-panel" data-testid="panel-${section}">
      <p class="todo-panel__title">${sectionLabels[section]}</p>
      <ul class="todo-list todo-list--bad">
        ${items
        .map((item, index) => `
          <li class="todo-row" data-testid="todo-row">
            <span class="check" data-action="toggle-fake"></span>
            <span class="${classNames.todoText}" data-testid="todo-text">${item.text}</span>
            <button
              type="button"
              class="${classNames.deleteButton}"
              data-testid="delete-button"
              data-section="${section}"
              data-index="${index}"
            >削除する</button>
          </li>
        `)
        .join('')}
      </ul>
    </div>
  `;
}
function renderApp(state, classNames) {
    return `
    <div class="app" data-testid="app">
      <h1 class="app-title">TODO リスト</h1>
      <div class="todo-form">
        <span class="todo-label">やること</span>
        <input
          class="${classNames.search}"
          data-testid="search-input"
          type="text"
          placeholder="検索"
        />
        <input
          class="${classNames.input}"
          data-testid="todo-input"
          type="text"
        />
        <button type="button" class="${classNames.addButton}" data-testid="add-button">追加</button>
      </div>
      ${renderTodoPanel('today', state.today, classNames)}
      ${renderTodoPanel('tomorrow', state.tomorrow, classNames)}
      <div class="modal-overlay" id="modal-overlay" data-testid="modal-overlay">
        <div class="modal-box" data-testid="modal">
          <h2>削除の確認</h2>
          <p>このTODOを削除しますか？</p>
          <div class="modal-box__actions">
            <button type="button" data-testid="cancel-button">キャンセル</button>
            <button type="button" class="${classNames.deleteButton}" data-testid="confirm-delete-button">削除する</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function bindEvents(root, store, overlay) {
    const openModal = (pending) => {
        store.requestDelete(pending.section, pending.index);
        overlay.classList.add('is-open');
    };
    const closeModal = () => {
        overlay.classList.remove('is-open');
    };
    root.querySelector('[data-testid="add-button"]')?.addEventListener('click', () => {
        const input = root.querySelector('[data-testid="todo-input"]');
        if (!input)
            return;
        store.addTodo(input.value);
        input.value = '';
    });
    root.addEventListener('click', (event) => {
        const target = event.target;
        const deleteButton = target.closest('button[data-section][data-index]');
        if (deleteButton?.dataset.section) {
            const section = deleteButton.dataset.section;
            const index = Number(deleteButton.dataset.index);
            openModal({ section, index });
            return;
        }
        if (target.closest('[data-testid="confirm-delete-button"]')) {
            store.confirmDelete();
            closeModal();
            return;
        }
        if (target.closest('[data-testid="cancel-button"]')) {
            store.cancelDelete();
            closeModal();
        }
    });
}
export function mountTodoAppBad(container, classNames = defaultBadClassNames) {
    const store = createTodoStore(initialTodoState, (state) => {
        container.innerHTML = renderApp(state, classNames);
        const overlay = container.querySelector('#modal-overlay');
        bindEvents(container, store, overlay);
    });
    container.innerHTML = renderApp(store.getState(), classNames);
    const overlay = container.querySelector('#modal-overlay');
    bindEvents(container, store, overlay);
}
