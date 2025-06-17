import { Component } from '@angular/core';

interface Task {
  title: string;
  dueDate?: string;
}

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent {
  tasks: Task[] = [];
  newTask = '';

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ title: this.newTask, dueDate: new Date().toISOString() });
      this.newTask = '';
    }
  }
}
