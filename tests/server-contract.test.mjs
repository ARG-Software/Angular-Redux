import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import test from "node:test";

test("serves the HTTP contracts used by the migrated effects", async () => {
  const port = 3100;
  const baseUrl = `http://localhost:${port}`;
  const server = spawn(process.execPath, ["server/server.js"], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await Promise.race([
      new Promise((resolve, reject) => {
        server.stdout.on("data", (data) => {
          if (data.toString().includes("JSON Server is running")) resolve();
        });
        server.once("error", reject);
        server.once("exit", (code) => reject(new Error(`Fixture server exited with code ${code}.`)));
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Fixture server did not start in time.")), 10_000),
      ),
    ]);

    const requests = [
      fetch(`${baseUrl}/Machine-State`),
      fetch(`${baseUrl}/Messaging`),
      fetch(`${baseUrl}/DataWarehouse/graphics/Oee`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
      fetch(`${baseUrl}/Process-Detail`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
    ];

    for (const response of await Promise.all(requests)) {
      assert.equal(response.ok, true);
      const body = await response.json();
      assert.equal(body.Success, true);
      assert.notEqual(body.Result, undefined);
    }
  } finally {
    if (server.exitCode === null) {
      server.kill();
      await once(server, "exit");
    }
  }
});
