import React from "react";
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor,within,act, } from '@testing-library/react';
import AddTaskModal from "../../../../views/pages/board/AddTaskModal"; 
import TasksService from "../../../../services/task-service";
import LocalStorageAdaptor from "../../../../services/adaptors/local-storage-adaptor";

jest.mock('../../../../services/task-service', () => {
    const mockCreateTask = jest.fn();
    return jest.fn().mockImplementation(() => ({
      createTask: mockCreateTask,
    }));
});

const taskService = new TasksService(new LocalStorageAdaptor())

const mockOnClose = jest.fn();


describe("AddTaskModal Component", () => {
 const renderComponent = (isOpen = true, item = null) => {
    return render(
      <AddTaskModal isOpen={isOpen} onClose={mockOnClose} item={item} />
    );
  };
    
 afterEach(() => {
    jest.clearAllMocks();
  });     
    
  it("renders the modal and displays create task title", () => {
     renderComponent();
    
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it("renders the modal and displays update task title and values", () => {
   
    const mockItem = {
      id: "1",
      title: "Test Task",
      description: "Test Description",
      deadLine: "2023-10-01",
      priority: "medium",
      assignedTo: "User1",
    };
    renderComponent(true, mockItem);

    expect(screen.getByText("Update Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Title").value).toBe(mockItem.title);
    expect(screen.getByLabelText("Description").value).toBe(mockItem.description);
    expect(screen.getByLabelText("Due Date").value).toBe(mockItem.deadLine);
    expect(screen.getByDisplayValue("medium")).toBeInTheDocument();
    expect(screen.getByLabelText("Assigned To").value).toBe(mockItem.assignedTo);
  });

  it("displays validation errors", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(await screen.findByText("Description is required")).toBeInTheDocument();
    expect(await screen.findByText("Due Date is required")).toBeInTheDocument();
    expect(await screen.findByText("Priority is required")).toBeInTheDocument();
    expect(await screen.findByText("Assigned To is required")).toBeInTheDocument();
  });

  test("closes the modal when close button is clicked", () => {
   renderComponent();
    
    fireEvent.click(screen.getByText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });


  it('submits the form with correct values', async () => {
  const { getByLabelText, getByText } = render(
    <AddTaskModal isOpen={true} onClose={mockOnClose} item={null} />
  );
  
  fireEvent.change(getByLabelText(/title/i), { target: { value: 'Test Task' } });
  fireEvent.change(getByLabelText(/description/i), { target: { value: 'Task description' } });
  fireEvent.change(getByLabelText(/due date/i), { target: { value: '2024-09-30' } });
  fireEvent.mouseDown(getByLabelText(/priority/i));
  const priorityOption = await waitFor(() => getByText(/medium/i)); 
  fireEvent.click(priorityOption);

  fireEvent.change(getByLabelText(/assigned to/i), { target: { value: 'User Name' } });

  fireEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>{
    expect(taskService.createTask).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Task description',
      deadLine: '2024-09-30',
      priority: 'medium',
      assignedTo: 'User Name',
      id: expect.any(String),
      state: 'defined',
    });
  })
    expect(mockOnClose).toHaveBeenCalledWith(true);
  });
  
});
