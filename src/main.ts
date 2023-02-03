import './style.css';

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
}

class TodoApp {
  filterStatus: string;
  todoList: Todo[];

  constructor() {
    this.todoList = [];
    this.filterStatus = 'all';

    this.initEvent();
  }

  initEvent() {
    const inputEl = document.querySelector('#todo-input');
    const controlButtonElements = document.querySelectorAll('.control > .btn');

    controlButtonElements.forEach((button) => {
      const [, buttonClass] = button.classList.value.split(' ');

      button.addEventListener('click', (event: MouseEventInit) => {
        this.filterStatus = buttonClass;

        this.toggleFilterStatus(event);
        this.render();
      });
    });

    inputEl?.addEventListener('keydown', this.addTodo.bind(this));
  }

  toggleFilterStatus(event: MouseEventInit) {
    const controlButtonElements = document.querySelectorAll('.control > .btn');

    controlButtonElements.forEach((button) => button.classList.remove('active'));

    const targetElement = (event as MouseEvent).target as HTMLButtonElement;
    if (targetElement) {
      targetElement.classList.add('active');
    }
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

    this.render();
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
  getTodoListByFilter(filterType: string) {
    if (filterType === 'all') {
      return this.todoList;
    }
    if (filterType === 'complete') {
      return this.todoList.filter((todo) => todo.isDone);
    }
    if (filterType === 'not-complete') {
      return this.todoList.filter((todo) => !todo.isDone);
    }
  }

  /**
   * 할 일의 내용과 상태를 수정할 수 있다.
   *
   * @param {Object} todo 수정될 할 일
   * @param {string} [todo.text] 수정될 내용
   * @param {string} [todo.status] 수정될 상태
   */
  updateTodoContent(event: MouseEventInit, selectedId: Todo['id']) {
    const inputText = (event as MouseEvent).target && ((event as MouseEvent).target as HTMLInputElement).innerText;

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
    this.render();
  }

  updateTodoStatus(selectedId: Todo['id']) {
    const selectedIndex = this.todoList.findIndex((todo) => todo.id === selectedId);
    const selectedTodo = this.todoList[selectedIndex];
    const newTodo = {
      ...selectedTodo,
      isDone: !selectedTodo.isDone,
    };

    this.todoList.splice(selectedIndex, 1, newTodo);
    this.render();
  }

  /**
   * 특정 할 일을 제거할 수 있다.
   *
   * @param {number} id
   */
  removeTodo(selectedId: Todo['id']) {
    this.todoList = this.todoList.filter((todo) => todo.id !== selectedId);

    this.render();
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
    const checkboxEl = containerEl.querySelector('input[type=checkbox]');
    const deleteButtonEl = containerEl.querySelector('button');

    contentEl?.addEventListener('blur', (event) => this.updateTodoContent(event, todo.id));
    checkboxEl?.addEventListener('change', () => this.updateTodoStatus(todo.id));
    deleteButtonEl?.addEventListener('click', () => this.removeTodo(todo.id));

    return containerEl;
  }

  render() {
    const todoListEl = document.querySelector('.todo-items');
    const todoCountEl = <HTMLSpanElement>document.querySelector('#todo-count');

    // 리스트 비우기
    todoListEl?.replaceChildren();

    const currentTodoList = this.getTodoListByFilter(this.filterStatus);

    const fragment = document.createDocumentFragment();
    const todoListComponent = currentTodoList?.map((todo) => this.generateTodoList(todo));

    if (todoListComponent) {
      fragment.append(...todoListComponent);
      todoListEl?.appendChild(fragment);
    }

    if (todoCountEl && currentTodoList) {
      todoCountEl.innerText = String(currentTodoList.length);
    }
  }
}

const todoApp = new TodoApp();
todoApp.render();
