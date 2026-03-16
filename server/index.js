require("dotenv").config();

const { loadConfig } = require("./config");
const { buildApp } = require("./app");
const { isChainEnabled } = require("./services/escrow.service");

async function main() {
  const { port } = loadConfig();
  const app = await buildApp();

  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`API listening on :${port} (chainEnabled=${isChainEnabled()})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
