import './style.css';

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
}

class TodoApp {
  todoList: Todo[];

  constructor() {
    this.todoList = [];

    this.initEvent();
  }

  initEvent() {
    const inputEl = document.querySelector('#todo-input');

    inputEl?.addEventListener('keydown', this.addTodo.bind(this));
  }

  /**
   * 할 일을 추가할 수 있다.
   *
   * @param {event} event
   */
  addTodo(event: KeyboardEventInit) {
    if (event.key !== 'Enter') {
      return;
    }

    const target = <HTMLInputElement>(event as KeyboardEvent).target;

    if (!target.value) {
      return;
    }

    this.todoList.push({
      id: this.todoList.length + 1,
      isDone: false,
      content: target.value,
    });

    target.value = '';

    this.render(this.todoList);
  }

  /**
   * 모든 할 일을 조회할 수 있다.
   *
   * @returns {Todo[]} 전체 할일
   */
  getTodoList() {
    return this.todoList;
  }

  /**
   * 모든 할 일을 필터링하여 조회할 수 있다.
   *
   * @param {string} filterType
   * @returns {Todo[]} 필터링된 할일
   */
  // getTodoListByFilter(filterType) {}

  /**
   * 할 일의 내용과 상태를 수정할 수 있다.
   *
   * @param {Object} todo 수정될 할 일
   * @param {string} [todo.text] 수정될 내용
   * @param {string} [todo.status] 수정될 상태
   */
  updateTodo({ target }: MouseEvent, selectedId: Todo['id']) {
    const inputText = target && (target as HTMLDivElement).innerText;

    if (!inputText) {
      return;
    }

    const selectedIndex = this.todoList.findIndex((todo) => todo.id === selectedId);
    const selectedTodo = this.todoList[selectedIndex];
    const newTodo = {
      ...selectedTodo,
      content: inputText,
    };

    this.todoList.splice(selectedIndex, 1, newTodo);
    this.render(this.todoList);
  }

  /**
   * 특정 할 일을 제거할 수 있다.
   *
   * @param {number} id
   */
  removeTodo(selectedId: Todo['id']) {
    this.todoList = this.todoList.filter((todo) => todo.id !== selectedId);

    this.render(this.todoList);
  }

  generateTodoList(todo: Todo) {
    const containerEl = document.createElement('div');
    const todoTemplate = `
      <div class="item__div">
        <input type="checkbox" ${todo.isDone && 'checked'} />
        <div class="content ${todo.isDone && 'checked'}" contentEditable>${todo.content}</div>
        <button>X</button>
      </div>
    `;

    containerEl.classList.add('item');
    containerEl.innerHTML = todoTemplate;

    const contentEl = containerEl.querySelector('.content');
    const deleteButtonEl = containerEl.querySelector('button');

    contentEl?.addEventListener('blur', (event) => this.updateTodo(event, todo.id));
    deleteButtonEl?.addEventListener('click', () => this.removeTodo(todo.id));

    return containerEl;
  }

  render(todoList: Todo[] = []) {
    const todoListEl = document.querySelector('.todo-items');

    // 리스트 비우기
    todoListEl?.replaceChildren();

    const fragment = document.createDocumentFragment();
    const todoListComponent = todoList.map((todo) => this.generateTodoList(todo));

    fragment.append(...todoListComponent);
    todoListEl?.appendChild(fragment);
  }
}

const todoApp = new TodoApp();
todoApp.render();
