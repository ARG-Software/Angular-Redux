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

server.get("/Downtime/Product/Graphic/:productId/:date", (req, res) => {
  const { productId, date } = req.params;

  const mockShiftGraphic = [
    { Uptime: 180, Downtime: 60, Name: "Shift A" },
    { Uptime: 240, Downtime: 30, Name: "Shift B" },
    { Uptime: 120, Downtime: 120, Name: "Shift C" },
  ];

  res.json({
    Success: true,
    Result: mockShiftGraphic,
    GeneratedAt: new Date().toISOString(),
    Message: "Mock shift graphic data.",
  });
});

server.get("/MachineOperation/productId/:productId", (req, res) => {
  const { productId } = req.params;

  const mockMachineOperations = [
    {
      Id: 1,
      MachineId: 101,
      MachineName: "CNC Machine 1",
      OperationId: 501,
      OperationName: "Drilling",
      AssetNumber: 1001,
      OEE: 85.6,
      MDE: 92.3,
    },
    {
      Id: 2,
      MachineId: 102,
      MachineName: "Laser Cutter",
      OperationId: 502,
      OperationName: "Cutting",
      AssetNumber: 1002,
      OEE: 78.9,
      MDE: 88.5,
    },
  ];

  res.json({
    Success: true,
    Result: mockMachineOperations,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock machine operation data for product ${productId}`,
  });
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
