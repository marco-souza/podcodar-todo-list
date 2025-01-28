type Todo = {
  id: number;
  text: string;
};

const todoCollection = new Map<number, Todo>();

let idCounter = 0;

const addTodo = (text: string) => {
  const id = idCounter++;
  todoCollection.set(id, { id, text });
};

const getTodo = (id: number) => {
  return todoCollection.get(id);
};

const getTodos = () => {
  return Array.from(todoCollection.values());
};

const deleteTodo = (id: number) => {
  todoCollection.delete(id);
};

export { addTodo, getTodo, getTodos, deleteTodo };
