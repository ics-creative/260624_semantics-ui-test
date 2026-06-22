import {
  createTodoStore,
  initialTodoState,
  type PendingDelete,
  type TodoItem,
  type TodoSection,
  type TodoState,
} from './todo-store.js';

const sectionLabels: Record<TodoSection, string> = {
  today: '今日',
  tomorrow: '明日',
};

export type TodoAppClassNames = {
  form: string;
  section: string;
  item: string;
  danger: string;
  dialog: string;
};

export const defaultClassNames: TodoAppClassNames = {
  form: 'todo-form',
  section: 'todo-section',
  item: 'todo-item',
  danger: 'danger',
  dialog: 'confirm-dialog',
};

function renderTodoList(
  section: TodoSection,
  items: TodoItem[],
  classNames: TodoAppClassNames,
) {
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

function renderApp(state: TodoState, classNames: TodoAppClassNames) {
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

function bindEvents(
  root: HTMLElement,
  store: ReturnType<typeof createTodoStore>,
  getDialog: () => HTMLDialogElement,
): () => void {
  const openDialog = (pending: PendingDelete) => {
    store.requestDelete(pending.section, pending.index);
    getDialog().showModal();
  };

  const onSubmit = (event: Event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const input = form.querySelector<HTMLInputElement>('#todo-input');
    if (!input) return;
    store.addTodo(input.value);
    input.value = '';
    input.focus();
  };

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.dataset.action !== 'toggle') return;
    const section = target.dataset.section as TodoSection;
    const index = Number(target.dataset.index);
    store.toggleComplete(section, index, target.checked);
  };

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    if (action === 'delete') {
      const section = button.dataset.section as TodoSection;
      const index = Number(button.dataset.index);
      openDialog({section, index});
      return;
    }
    if (action === 'confirm-delete') {
      store.confirmDelete();
      getDialog().close();
      return;
    }
    if (action === 'cancel-delete') {
      store.cancelDelete();
      getDialog().close();
    }
  };

  const form = root.querySelector('#add-form');
  form?.addEventListener('submit', onSubmit);
  root.addEventListener('change', onChange);
  root.addEventListener('click', onClick);

  return () => {
    form?.removeEventListener('submit', onSubmit);
    root.removeEventListener('change', onChange);
    root.removeEventListener('click', onClick);
  };
}

export function mountTodoApp(
  container: HTMLElement,
  classNames: TodoAppClassNames = defaultClassNames,
) {
  let cleanup: (() => void) | undefined;
  let store: ReturnType<typeof createTodoStore>;

  const render = (state: TodoState) => {
    cleanup?.();
    container.innerHTML = renderApp(state, classNames);
    cleanup = bindEvents(container, store, () =>
      container.querySelector<HTMLDialogElement>('#confirm-dialog')!,
    );
  };

  store = createTodoStore(initialTodoState, render);
  render(store.getState());
}
