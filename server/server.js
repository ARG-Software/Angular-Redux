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

server.get("/Buffer/product/:productId", (req, res) => {
  const { productId } = req.params;

  const mockBufferData = [
    {
      Id: 1,
      PreviousOperationId: 101,
      NextOperationId: 102,
      ProductId: parseInt(productId, 10),
      Name: "Buffer A",
      Count: 50,
      LowAlertLowerBound: 0,
      LowAlertLowWarning: 10,
      LowWarningTarget: 20,
      TargetHighWarning: 70,
      HighWarningHighAlert: 90,
      HighAlertUpperBound: 100,
    },
    {
      Id: 2,
      PreviousOperationId: 102,
      NextOperationId: 103,
      ProductId: parseInt(productId, 10),
      Name: "Buffer B",
      Count: 85,
      LowAlertLowerBound: 5,
      LowAlertLowWarning: 15,
      LowWarningTarget: 30,
      TargetHighWarning: 60,
      HighWarningHighAlert: 80,
      HighAlertUpperBound: 95,
    },
  ];

  res.json({
    Success: true,
    Result: mockBufferData,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock buffer data for product ${productId}`,
  });
});

server.get("/Product/getSingleProductDto", (req, res) => {
  const { productId } = req.query;

  const mockProduct = {
    Id: parseInt(productId, 10),
    Name: "Product Alpha",
    TargetHoursPerWeek: 40,
    TargetEfficiency: 85,
    OEE: 88.5,
    Increase: true,
    SDEs: 3,
  };

  res.json({
    Success: true,
    Result: mockProduct,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock product data for productId ${productId}`,
  });
});

server.put("/Buffer/updateBufferCount", (req, res) => {
  res.json({
    Success: true,
    Result: true,
    GeneratedAt: new Date().toISOString(),
    Message: "WIP buffer count updated successfully.",
  });
});

server.put("/Buffer/updateBufferKanBan", (req, res) => {
  res.json({
    Success: true,
    Result: true,
    GeneratedAt: new Date().toISOString(),
    Message: "Kanban buffer updated successfully.",
  });
});

server.put("/Product", (req, res) => {
  res.json({
    Success: true,
    Result: true,
    GeneratedAt: new Date().toISOString(),
    Message: "Product updated successfully.",
  });
});

server.get("/Operations/productId/:productId", (req, res) => {
  const { productId } = req.params;

  const mockOperations = [
    {
      Id: 1,
      Number: 100,
      OrderIndex: 1,
      BatchSize: 50,
      Subcontractor: {
        Id: 1,
        Name: "Subcontractor A",
        Location: "Zone 1",
        Address: "123 Industrial Park",
        Address2: "Unit B",
        City: "Factory City",
        PostCode: "12345",
        State: "CA",
      },
      Product: {
        Id: parseInt(productId, 10),
        Name: "Product Alpha",
        TargetHoursPerWeek: 40,
        TargetEfficiency: 85,
        OEE: 88.5,
        Increase: true,
        SDEs: 3,
      },
    },
    {
      Id: 2,
      Number: 200,
      OrderIndex: 2,
      BatchSize: 100,
      Subcontractor: {
        Id: 2,
        Name: "Subcontractor B",
        Location: "Zone 2",
        Address: "456 Manufacturing Way",
        Address2: "",
        City: "Industrial Town",
        PostCode: "67890",
        State: "TX",
      },
      Product: {
        Id: parseInt(productId, 10),
        Name: "Product Alpha",
        TargetHoursPerWeek: 40,
        TargetEfficiency: 85,
        OEE: 88.5,
        Increase: true,
        SDEs: 3,
      },
    },
  ];

  res.json({
    Success: true,
    Result: mockOperations,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock operations for productId ${productId}`,
  });
});

server.get("/Mote/productId/:productId", (req, res) => {
  const { productId } = req.params;

  const mockMotes = [
    {
      Manufacturer: "MoteTech",
      Model: "MT-200",
      Serial: "SN-MOTE-001",
      MACAdress: "00:1A:2B:3C:4D:5E",
      IpAddress: "192.168.1.101",
      TransitId: 301,
      MachineId: 101,
      IsOnline: true,
    },
    {
      Manufacturer: "SensorPro",
      Model: "SP-X1",
      Serial: "SN-MOTE-002",
      MACAdress: "00:1A:2B:3C:4D:5F",
      IpAddress: "192.168.1.102",
      TransitId: 302,
      MachineId: 102,
      IsOnline: false,
    },
  ];

  res.json({
    Success: true,
    Result: mockMotes,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock mote data for product ${productId}`,
  });
});

server.get("/ElectricalContact/productId/:productId", (req, res) => {
  const { productId } = req.params;

  const mockElectricalContacts = [
    {
      Id: 1,
      MachineMCode: "M123",
      MachineOutput: "Output A",
      NumberOnMote: 1,
      MoteId: 301,
      MachineId: 101,
      OperationId: 201,
      MessageId: 501,
    },
    {
      Id: 2,
      MachineMCode: "M456",
      MachineOutput: "Output B",
      NumberOnMote: 2,
      MoteId: 302,
      MachineId: 102,
      OperationId: 202,
      MessageId: 502,
    },
  ];

  res.json({
    Success: true,
    Result: mockElectricalContacts,
    GeneratedAt: new Date().toISOString(),
    Message: `Mock electrical contact data for productId ${productId}`,
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
