import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST" && !req.body.id) {
    req.body.id = Date.now().toString();
  }
  next();
});

server.post("/DataWarehouse_graphics_DowntimePareto", (req, res) => {
  const response = {
    Success: true,
    Result: {
      ChartData: [
        {
          AssetNumber: "Machine-1",
          DowntimeInMinutes: 234,
          InstancesOfDowntime: 3,
        },
        {
          AssetNumber: "Machine-2",
          DowntimeInMinutes: 220,
          InstancesOfDowntime: 8,
        },
      ],
      TableData: {
        Result: [
          {
            AssetNumber: "Machine-1",
            DowntimeInMinutes: 189,
            InstancesOfDowntime: 8,
          },
          {
            AssetNumber: "Machine-2",
            DowntimeInMinutes: 145,
            InstancesOfDowntime: 8,
          },
        ],
        Total: 2,
      },
    },
    GeneratedAt: new Date().toISOString(),
    Message: "Filtered data response.",
  };

  res.json(response);
});

router.render = (req, res) => {
  const body = res.locals.data;

  const response = {
    Success: true,
    Result: body,
    GeneratedAt: new Date().toISOString(),
    Message: "This is test data.",
  };

  res.json(response);
};

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
