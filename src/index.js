const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());

const projects = [];

function logRequests(req, res, next) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  console.log("1");
  console.time(logLabel);
  next();
  console.log("2");
  console.timeEnd(logLabel);
}
function vaidateProjectId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }
  return next();
}

app.use(logRequests);
app.get("/projects", (request, response) => {
  return response.send("Hello word");
});

app.get("/project", (req, res) => {
  console.log("3");

  /* const { user, nome } = req.query;
  console.log(user);
  console.log(nome);*/
  const { title } = req.query;
  const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return res.json(result);
});

app.post("/project", (req, res) => {
  const { title, owner } = req.body;
  console.log(title);
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return res.json(project);
});
app.put("/project/:id", vaidateProjectId, (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;
  const projectIndex = projects.findIndex(project => project.id == id);
  console.log(id);
  if (projectIndex < 0) {
    return res.status(400).json({ erro: "Project not found!" });
  }
  const project = [id, title, owner];
  projects[projectIndex] = project;
  return res.json(project);
});
app.delete("/project/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const projectIndex = projects.findIndex(project => project.id == id);
  console.log(id);
  if (projectIndex < 0) {
    return res.status(400).json({ erro: "Project not found!" });
  }
  projects.splice(projectIndex, 1);

  return res.status(404).send();
});

app.listen(3333, () => {
  console.log("Back-end started!");
});
