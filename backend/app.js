const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(express.json());

app.use(logger);

// Swagger/OpenAPI
const openapiPath = path.join(__dirname, "docs", "openapi.yaml");
const openapiDocument = YAML.load(openapiPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// (опционально) отдаём сырой YAML для удобных скринов/проверки
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(openapiPath);
});

app.get("/", (req, res) => {
  res.send("Express API is running. Try /api/products");
});

app.use("/api/products", productsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
