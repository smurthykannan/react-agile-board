class AppSettingService {
  constructor(adaptor) {
    this.adaptor = adaptor;
  }

  getColumns(params) {
    return this.adaptor.get("/settings/column", params);
  }

  createColumn(payload) {
    this.adaptor.post("/settings/column", payload);
  }

  initializeDefaultColumns() {
    const defaultColumns = [
      { name: "Defined", id: "defined",description:"" },
      { name: "In Progress", id: "in_progress",description:"" },
      { name: "Done", id: "done",description:"" },
      { name: "Backlog", id: "backlog",description:"" },
      
    ];

    defaultColumns.forEach((column) => this.createColumn(column));
  }
}

export default AppSettingService;
