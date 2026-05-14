const express = require("express");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const herbsRoutes = require("./routes/herbs.routes");
const plansRoutes = require("./routes/plans.routes");
const batchesRoutes = require("./routes/batches.routes");
const tasksRoutes = require("./routes/tasks.routes");
const measurementsRoutes = require("./routes/measurements.routes");
const alertsRoutes = require("./routes/alerts.routes");
const automationRoutes = require("./routes/automation.routes");
const reportsRoutes = require("./routes/reports.routes");
const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "GREENHERB API",
    version: "1.0.0",
    sprint: "Sprint 1",
    endpoints: [
      "/auth",
      "/users",
      "/herbs",
      "/plans",
      "/batches",
      "/tasks",
      "/measurements",
      "/alerts",
      "/automation",
      "/reports",
      "/audit"
    ]
  });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/herbs", herbsRoutes);
app.use("/plans", plansRoutes);
app.use("/batches", batchesRoutes);
app.use("/tasks", tasksRoutes);
app.use("/measurements", measurementsRoutes);
app.use("/alerts", alertsRoutes);
app.use("/automation", automationRoutes);
app.use("/reports", reportsRoutes);
app.use("/audit", auditRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota nao encontrada." });
});

module.exports = app;
