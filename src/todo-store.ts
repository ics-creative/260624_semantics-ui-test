export type TodoSection = 'today' | 'tomorrow';

export type TodoItem = {
  text: string;
  completed: boolean;
};

export type TodoState = Record<TodoSection, TodoItem[]>;

export type PendingDelete = {
  section: TodoSection;
  index: number;
};

export const initialTodoState: TodoState = {
  today: [{text: '牛乳を買う', completed: false}],
  tomorrow: [
    {text: '牛乳を買う', completed: false},
    {text: '会議の準備', completed: false},
  ],
};

export function createTodoStore(
  initial: TodoState,
  onUpdate: (state: TodoState) => void,
) {
  let state: TodoState = {
    today: initial.today.map((item) => ({...item})),
    tomorrow: initial.tomorrow.map((item) => ({...item})),
  };
  let pendingDelete: PendingDelete | null = null;

  const notify = () => onUpdate(state);

  return {
    getState: () => state,
    getPendingDelete: () => pendingDelete,
    addTodo(text: string, section: TodoSection = 'today') {
      const trimmed = text.trim();
      if (!trimmed) return;
      state = {
        ...state,
        [section]: [...state[section], {text: trimmed, completed: false}],
      };
      notify();
    },
    toggleComplete(section: TodoSection, index: number, completed: boolean) {
      const items = state[section];
      if (index < 0 || index >= items.length) return;
      state = {
        ...state,
        [section]: items.map((item, i) =>
          i === index ? {...item, completed} : item,
        ),
      };
      notify();
    },
    requestDelete(section: TodoSection, index: number) {
      pendingDelete = {section, index};
    },
    confirmDelete() {
      if (!pendingDelete) return;
      const {section, index} = pendingDelete;
      state = {
        ...state,
        [section]: state[section].filter((_, i) => i !== index),
      };
      pendingDelete = null;
      notify();
    },
    cancelDelete() {
      pendingDelete = null;
    },
  };
}
