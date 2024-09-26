import React, { useEffect, useState } from "react";
import { Button, Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import AddColumnModal from "./AddColumnModal";
import { LocalStorageAdaptor } from "../../../services/adaptors";
import AppSettingService from "../../../services/app-settings-service";
import TasksService from "../../../services/task-service";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import { DroppableContainer, DraggableItem } from "./DndHelper";

const service = new AppSettingService(new LocalStorageAdaptor());
const taskService = new TasksService(new LocalStorageAdaptor());

const Board = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [task, setTask] = useState(null)

  // Fetch columns and tasks from services
  const fetchColumns = () => {
    const items = service.getColumns();
    if (items.length === 0) {
      service.initializeDefaultColumns();
    }
    setColumns(items);
  };

  const fetchTasks = () => {
    const items = taskService.getTasks();
    if (items.length === 0) {
      taskService.initializeDefaultTasks();
    }
    setTasks(items);
  };

  // Modal handlers for adding column and task
  const onAddStateClick = () => {
    setIsOpen(true);
  };

  const onStateModalClose = (confirmed) => {
    setIsOpen(false);
    if (confirmed) {
      fetchColumns();
    }
  };

  const onAddTaskClick = () => {
    setIsTaskOpen(true);
  };

  const onTaskModalClose = (confirmed) => {
    setIsTaskOpen(false);
    setTask(null);
    if (confirmed) {
      fetchTasks();
    }
  };

  const onEditModalOpen = (item) => {
    setTask(item)
    setIsTaskOpen(true);

  }

  // Handling Drag End to update task state (column)
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const task = tasks.find((t) => t.id === active.id);
      const model = {
        ...task,
        state: over.id
      }
      try {
        taskService.updateTask(model);
        fetchTasks();
      } catch (err) {
        console.log("err:", err.message)
      }

    }
  };

  useEffect(() => {
    fetchColumns();
    fetchTasks();
  }, []);

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={onAddStateClick}>
          Add State
        </Button>
      </Grid>

      {columns.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <div className="column-section">
            <div className="list-container">
              {columns.map((column) => {
                let listTasks = tasks.filter((t) => t.state === column.id);
                listTasks = listTasks.sort((a, b) => a.title.localeCompare(b.title));
                return (
                  <SortableContext
                    key={column.id}
                    items={listTasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="card-list">
                      <DroppableContainer id={column.id}>
                        <Box>
                          <div className="card-header">
                            <Grid container rowSpacing={1} justifyContent={"space-between"}>

                              <Grid item xs={10} alignSelf={"center"}>
                                <span className="title">{column.name}</span>
                              </Grid>

                              <Grid item xs={2} display="flex" justifyContent="flex-end">
                                {column.id === "defined" && (
                                  <span className="icon" onClick={onAddTaskClick}>
                                    <AddIcon />
                                  </span>
                                )}
                              </Grid>

                            </Grid>
                          </div>
                          <Divider />
                          {listTasks.map((task, index) => (
                            <DraggableItem key={task.id} id={task.id}>
                              <TaskCard key={task.id} item={task} fetchTask={fetchTasks} onEditModalOpen={onEditModalOpen} />
                            </DraggableItem>
                          ))}
                        </Box>
                      </DroppableContainer>
                    </div>
                  </SortableContext>
                );
              })}
            </div>
          </div>
        </DndContext>
      )}

      {isOpen && <AddColumnModal isOpen={isOpen} onClose={onStateModalClose} />}
      {isTaskOpen && <AddTaskModal isOpen={isTaskOpen} onClose={onTaskModalClose} item={task} />}
    </>
  );
};

export default Board;
