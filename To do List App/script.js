class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoTasks';

        this.initializeElements();
        this.loadTasks();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.clearBtn = document.getElementById('clearBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.filterButtons = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    addTask() {
        const taskText = this.taskInput.value.trim();

        if (!taskText) {
            this.taskInput.focus();
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(t => t.completed);
        
        if (completedTasks.length === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Clear ${completedTasks.length} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
        }
    }

    deleteAll() {
        if (this.tasks.length === 0) {
            alert('No tasks to delete!');
            return;
        }

        if (confirm(`Delete all ${this.tasks.length} task(s)? This cannot be undone.`)) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    updateStats() {
        const completed = this.tasks.filter(t => t.completed).length;
        this.totalCount.textContent = this.tasks.length;
        this.completedCount.textContent = completed;
    }

    render() {
        this.updateStats();
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => this.toggleTask(task.id));

                const span = document.createElement('span');
                span.className = 'task-text';
                span.textContent = task.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                this.taskList.appendChild(li);
            });
        }
    }

    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    loadTasks() {
        const stored = localStorage.getItem(this.storageKey);
        this.tasks = stored ? JSON.parse(stored) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
