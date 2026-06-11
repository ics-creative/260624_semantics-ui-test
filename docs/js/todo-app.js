import { createTodoStore, initialTodoState, } from './todo-store.js';
const sectionLabels = {
    today: '今日',
    tomorrow: '明日',
};
export const defaultClassNames = {
    form: 'todo-form',
    section: 'todo-section',
    item: 'todo-item',
    danger: 'danger',
    dialog: 'confirm-dialog',
};
function renderTodoList(section, items, classNames) {
    const headingId = `${section}-heading`;
    return `
    <section class="${classNames.section}" aria-labelledby="${headingId}">
      <h2 id="${headingId}">${sectionLabels[section]}</h2>
      <ul class="todo-list">
        ${items
        .map((item, index) => {
        return `
          <li class="${classNames.item}">
            <label class="todo-item__main">
              <input
                type="checkbox"
                ${item.completed ? 'checked' : ''}
                data-action="toggle"
                data-section="${section}"
                data-index="${index}"
              />
              <span>${item.text}</span>
            </label>
            <button
              type="button"
              class="${classNames.danger}"
              aria-label="削除する: ${item.text}"
              data-action="delete"
              data-section="${section}"
              data-index="${index}"
            >削除する</button>
          </li>
        `;
    })
        .join('')}
      </ul>
    </section>
  `;
}
function renderApp(state, classNames) {
    return `
    <main>
      <h1>TODO リスト</h1>
      <form class="${classNames.form}" id="add-form">
        <div>
          <label for="todo-input" class="todo-label">やること</label>
          <input id="todo-input" name="todo" type="text" autocomplete="off" />
        </div>
        <button type="submit">追加</button>
      </form>
      ${renderTodoList('today', state.today, classNames)}
      ${renderTodoList('tomorrow', state.tomorrow, classNames)}
      <dialog class="${classNames.dialog}" id="confirm-dialog" aria-labelledby="dialog-title">
        <h2 id="dialog-title">削除の確認</h2>
        <p>このTODOを削除しますか？</p>
        <div class="${classNames.dialog}__actions">
          <button type="button" data-action="cancel-delete">キャンセル</button>
          <button type="button" class="${classNames.danger}" data-action="confirm-delete">削除する</button>
        </div>
      </dialog>
    </main>
  `;
}
function bindEvents(root, store, dialog) {
    const openDialog = (pending) => {
        store.requestDelete(pending.section, pending.index);
        dialog.showModal();
    };
    root.querySelector('#add-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.querySelector('#todo-input');
        if (!input)
            return;
        store.addTodo(input.value);
        input.value = '';
        input.focus();
    });
    root.addEventListener('change', (event) => {
        const target = event.target;
        if (target.dataset.action !== 'toggle')
            return;
        const section = target.dataset.section;
        const index = Number(target.dataset.index);
        store.toggleComplete(section, index, target.checked);
    });
    root.addEventListener('click', (event) => {
        const target = event.target;
        const button = target.closest('[data-action]');
        if (!button)
            return;
        const action = button.dataset.action;
        if (action === 'delete') {
            const section = button.dataset.section;
            const index = Number(button.dataset.index);
            openDialog({ section, index });
            return;
        }
        if (action === 'confirm-delete') {
            store.confirmDelete();
            dialog.close();
            return;
        }
        if (action === 'cancel-delete') {
            store.cancelDelete();
            dialog.close();
        }
    });
}
export function mountTodoApp(container, classNames = defaultClassNames) {
    const store = createTodoStore(initialTodoState, (state) => {
        container.innerHTML = renderApp(state, classNames);
        const dialog = container.querySelector('#confirm-dialog');
        bindEvents(container, store, dialog);
    });
    container.innerHTML = renderApp(store.getState(), classNames);
    const dialog = container.querySelector('#confirm-dialog');
    bindEvents(container, store, dialog);
}
