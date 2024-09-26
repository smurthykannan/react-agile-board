import { v4 as uuidv4 } from 'uuid';

class TasksService {
  constructor(adaptor) {
    this.adaptor = adaptor;
  }

  getTasks(params) {
    return this.adaptor.get("/board/tasks", params);
  }

  createTask(payload) {
    this.adaptor.post("/board/tasks", payload);
  }

  updateTask(payload) {
    this.adaptor.put("/board/tasks", payload);
  }

  deleteTask(id) {
    this.adaptor.delete("/board/tasks", id);
  }

  getTask(taskId) {
    return this.adaptor.get("/board/tasks", { id: taskId });
  }


  initializeDefaultTasks() {
    const defaultTasks = [
      { title: "Login page need to be amended", id: uuidv4(), description:"Login page need to be amended", deadLine:"17/10/2024",priority:"medium" ,assignedTo:"Ajith Ellappan",state:"defined"},
      { title: "Horizondal space for need to be modified", id: uuidv4(), description:"Horizondal space for need to be modified", deadLine:"15/10/2024",priority:"high" ,assignedTo:"Aruljothi",state:"defined"},
     
    ];
    defaultTasks.forEach((column) => this.createTask(column));
  }
}

export default TasksService;
