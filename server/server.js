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

server.get("/Machine-State", (req, res) => {
  res.json({
    Success: true,
    Result: [
      {
        Id: 101,
        Name: "CNC Machine 1",
        Image: "https://placehold.co/600x400?text=CNC+Machine+1",
        Options: [
          { value: 1, name: "In Production", selected: true },
          { value: 2, name: "Not Scheduled", selected: false },
        ],
      },
      {
        Id: 102,
        Name: "Laser Cutter",
        Image: "https://placehold.co/600x400?text=Laser+Cutter",
        Options: [
          { value: 1, name: "In Production", selected: false },
          { value: 3, name: "Unplanned Downtime", selected: true },
        ],
      },
    ],
    GeneratedAt: new Date().toISOString(),
    Message: "Mock machine state data.",
  });
});

server.put("/Machine-State", (req, res) => {
  res.json({
    Success: true,
    Result: req.body,
    GeneratedAt: new Date().toISOString(),
    Message: "Mock machine state updated.",
  });
});

server.get("/Messaging", (req, res) => {
  res.json({
    Success: true,
    Result: [
      {
        Id: 1,
        DowntimeName: "Tool Change",
        Duration: 20,
        StartTime: "2018-11-08T06:00:00",
        EndTime: "2018-11-08T06:20:00",
        Options: [
          { value: 1, name: "Acknowledged", selected: true },
          { value: 2, name: "Needs review", selected: false },
        ],
      },
      {
        Id: 2,
        DowntimeName: "No reason given",
        Duration: 100,
        StartTime: "2018-11-08T12:20:00",
        EndTime: "2018-11-08T14:00:00",
        Options: [
          { value: 1, name: "Acknowledged", selected: false },
          { value: 2, name: "Needs review", selected: true },
        ],
      },
    ],
    GeneratedAt: new Date().toISOString(),
    Message: "Mock messaging data.",
  });
});

server.put("/Messaging", (req, res) => {
  res.json({
    Success: true,
    Result: req.body,
    GeneratedAt: new Date().toISOString(),
    Message: "Mock messaging data updated.",
  });
});

server.post("/DataWarehouse/graphics/Oee", (req, res) => {
  res.json({
    Success: true,
    Result: {
      ChartData: [
        {
          Name: "Series",
          Series: [
            { Name: "Value One", Value: 1.5 },
            { Name: "Value two", Value: 3 },
            { Name: "Value three", Value: 5 },
          ],
        },
        {
          Name: "Series 2",
          Series: [
            { Name: "Value One", Value: 1 },
            { Name: "Value two", Value: 4 },
            { Name: "Value three", Value: 2 },
          ],
        },
      ],
      TableData: {
        Result: [
          { Name: "Value One", Availability: 1, Production: 1, Quality: 1 },
          { Name: "Value Two", Availability: 2, Production: 2, Quality: 2 },
        ],
        Total: 2,
      },
    },
    GeneratedAt: new Date().toISOString(),
    Message: "Mock OEE chart and table data.",
  });
});

server.post("/Process-Detail", (req, res) => {
  res.json({
    Success: true,
    Result: [
      {
        Id: null,
        MachineState: "Not Scheduled",
        Reason: "",
        Duration: 60,
        StartTime: "2018-11-08T00:00:00",
        EndTime: "2018-11-08T01:00:00",
      },
      {
        Id: null,
        MachineState: "In Production",
        Reason: "",
        Duration: 300,
        StartTime: "2018-11-08T01:00:00",
        EndTime: "2018-11-08T06:00:00",
      },
      {
        Id: null,
        MachineState: "Unplanned Downtime",
        Reason: "Tool Change",
        Duration: 20,
        StartTime: "2018-11-08T06:00:00",
        EndTime: "2018-11-08T06:20:00",
      },
      {
        Id: null,
        MachineState: "In Production",
        Reason: "",
        Duration: 360,
        StartTime: "2018-11-08T06:20:00",
        EndTime: "2018-11-08T12:20:00",
      },
      {
        Id: null,
        MachineState: "Unplanned Downtime",
        Reason: "No reason given",
        Duration: 100,
        StartTime: "2018-11-08T12:20:00",
        EndTime: "2018-11-08T14:00:00",
      },
      {
        Id: null,
        MachineState: "In Production",
        Reason: "",
        Duration: 20,
        StartTime: "2018-11-08T14:00:00",
        EndTime: "2018-11-08T14:20:00",
      },
      {
        Id: null,
        MachineState: "Not Scheduled",
        Reason: "",
        Duration: 360,
        StartTime: "2018-11-08T14:20:00",
        EndTime: "2018-11-08T20:00:00",
      },
    ],
    GeneratedAt: new Date().toISOString(),
    Message: "Mock process detail data.",
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

server.post("/DataWarehouse/graphics/DowntimePareto", (req, res) => {
  const data = {
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
      {
        AssetNumber: "Machine-3",
        DowntimeInMinutes: 367,
        InstancesOfDowntime: 6,
      },
      {
        AssetNumber: "Machine-4",
        DowntimeInMinutes: 60,
        InstancesOfDowntime: 9,
      },
      {
        AssetNumber: "Machine-5",
        DowntimeInMinutes: 333,
        InstancesOfDowntime: 6,
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
        {
          AssetNumber: "Machine-3",
          DowntimeInMinutes: 472,
          InstancesOfDowntime: 8,
        },
        {
          AssetNumber: "Machine-4",
          DowntimeInMinutes: 199,
          InstancesOfDowntime: 1,
        },
        {
          AssetNumber: "Machine-5",
          DowntimeInMinutes: 183,
          InstancesOfDowntime: 4,
        },
      ],
      Total: 5,
    },
  };

  res.json({
    Success: true,
    Result: data,
    GeneratedAt: new Date().toISOString(),
    Message: "Mock data for DowntimePareto chart and table",
  });
});

server.post("/auth/login", (req, res) => {
  const mockLoginSession = {
    RefreshToken: "mock-refresh-token-123",
    AccessToken: "mock-access-token-abc",
    User: {
      Id: 1,
      Name: "John Doe",
      Position: "Engineer",
      Email: "john.doe@example.com",
      Login: "johndoe",
      Password: undefined,
      AccessLevel: {
        Id: 1,
        Name: 5,
      },
      AccountStatus: 1,
      ProfileName: "Admin",
    },
  };

  res.json({
    Success: true,
    Result: mockLoginSession,
    GeneratedAt: new Date().toISOString(),
    Message: "User authenticated successfully",
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
