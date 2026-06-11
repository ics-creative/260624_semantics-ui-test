export const initialTodoState = {
    today: [{ text: '牛乳を買う', completed: false }],
    tomorrow: [
        { text: '牛乳を買う', completed: false },
        { text: '会議の準備', completed: false },
    ],
};
export function createTodoStore(initial, onUpdate) {
    let state = {
        today: initial.today.map((item) => ({ ...item })),
        tomorrow: initial.tomorrow.map((item) => ({ ...item })),
    };
    let pendingDelete = null;
    const notify = () => onUpdate(state);
    return {
        getState: () => state,
        getPendingDelete: () => pendingDelete,
        addTodo(text, section = 'today') {
            const trimmed = text.trim();
            if (!trimmed)
                return;
            state = {
                ...state,
                [section]: [...state[section], { text: trimmed, completed: false }],
            };
            notify();
        },
        toggleComplete(section, index, completed) {
            const items = state[section];
            if (index < 0 || index >= items.length)
                return;
            state = {
                ...state,
                [section]: items.map((item, i) => i === index ? { ...item, completed } : item),
            };
            notify();
        },
        requestDelete(section, index) {
            pendingDelete = { section, index };
        },
        confirmDelete() {
            if (!pendingDelete)
                return;
            const { section, index } = pendingDelete;
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
