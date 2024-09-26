import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskDetail from "../../../../views/pages/task-detail";
import TasksService from "../../../../services/task-service";
import LocalStorageAdaptor from "../../../../services/adaptors/local-storage-adaptor";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn().mockImplementation(() => ({
    id: 1,
  })),
}));

jest.mock("../../../../services/task-service", () => {
  const mockGetTask = jest.fn();
  const mockUpdateTask = jest.fn();
  return jest.fn().mockImplementation(() => ({
    getTask: mockGetTask,
    updateTask: mockUpdateTask,
  }));
});

const taskService = new TasksService(new LocalStorageAdaptor());

describe("TaskDetail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const task = {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task description",
    deadLine: "2024-09-30",
    priority: "high",
    assignedTo: "John Doe",
    attachment: null,
  };

  const renderComponent = () => render(<TaskDetail />);

  it("should render task details when a task is fetched successfully", async () => {
    taskService.getTask.mockImplementation(() => task);

    renderComponent();

    await waitFor(() => {
      const h1 = screen.getByRole("heading", { level: 1 });
      const paragraphs = screen.getAllByRole("paragraph");

      expect(paragraphs[0].innerHTML).toEqual(task.description);
      expect(paragraphs[1].innerHTML).toEqual(task.deadLine);
      expect(paragraphs[2].innerHTML).toEqual(task.assignedTo);
      expect(h1.innerHTML).toEqual(task.title);
      expect(h1).toBeInTheDocument();
    });
  });

  it("should call getTask with the correct ID from useParams", async () => {
    taskService.getTask.mockImplementation(() => task);

    renderComponent();

    await waitFor(() => {
      expect(taskService.getTask).toHaveBeenCalledWith(1);
    });
  });

  it("should render null when no task is found", () => {
    taskService.getTask.mockImplementation(() => null);

    const { container } = renderComponent();

    expect(container.firstChild).toBeNull();
  });

  it("should call updateTask with the correct model when an image is uploaded", async () => {
    const file = new File(["test"], "test-image.png", { type: "image/png" });

    taskService.getTask.mockImplementation(() => task);

    renderComponent();

    const input = screen.getByLabelText("Upload Image");
    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      const payload = {
        ...task,
        attachment: expect.any(String),
      };
      expect(taskService.updateTask).toHaveBeenCalledWith(payload);
    });
  });

  it("should display the uploaded image when a task has an attachment", async () => {
    const taskWithAttachment = {
      ...task,
      attachment: "data:image/png;base64,some-base64-image",
    };

    taskService.getTask.mockImplementation(() => taskWithAttachment);

    renderComponent();

    await waitFor(() => {
      const img = screen.getByAltText("Uploaded");
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(taskWithAttachment.attachment);
    });
  });
});
