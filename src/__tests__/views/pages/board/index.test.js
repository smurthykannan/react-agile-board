import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Board from "../../../../views/pages/board";
import AppSettingService from "../../../../services/app-settings-service";
import TasksService from "../../../../services/task-service";
import LocalStorageAdaptor from "../../../../services/adaptors/local-storage-adaptor";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../../services/app-settings-service", () => {
  const mockGetColumns = jest.fn();
  return jest.fn().mockImplementation(() => ({
    getColumns: mockGetColumns,
  }));
});

jest.mock("../../../../services/task-service", () => {
  const mockGetTasks = jest.fn();
  return jest.fn().mockImplementation(() => ({
    getTasks: mockGetTasks,
  }));
});

const appSettingService = new AppSettingService(new LocalStorageAdaptor());
const taskService = new TasksService(new LocalStorageAdaptor());

describe("Board Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const states = [
    { id: "defined", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ];

  const tasks = [
    {
      id: "1",
      title: "Implement Signin screen",
      description: "Implement Signin screen using redux",
      deadLine: "2024-09-30",
      priority: "high",
      assignedTo: "John Doe",
      attachment: null,
    },
    {
      id: "2",
      title: "Implement Signup screen",
      description: "Implement Signup screen using redux",
      deadLine: "2024-09-29",
      priority: "low",
      assignedTo: "Sam Smith",
      attachment: null,
    },
  ];

  const renderComponent = () => render(<Board />);

  it("should render board when a columns and tasks are fetched successfully", async () => {
    appSettingService.getColumns.mockImplementation(() => states);
    taskService.getTasks.mockImplementation(() => tasks);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Add State")).toBeInTheDocument();
      expect(screen.getByText("To Do")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });
  });
});
