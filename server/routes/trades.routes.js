const { requireAddress } = require("../middleware/auth");
const tradesService = require("../services/trades.service");

async function tradesRoutes(app) {
  app.get("/trades", async (request) => {
    const address = requireAddress(request);
    const role = request.query && request.query.role;
    return {
      trades: tradesService.listMyTrades(
        address,
        role === "buyer" || role === "seller" ? role : undefined,
      ),
    };
  });

  app.get("/trades/:id", async (request) => {
    const address = requireAddress(request);
    return {
      trade: tradesService.getTradeForParty(request.params.id, address),
    };
  });

  app.post("/trades", async (request, reply) => {
    const buyer = requireAddress(request);
    const trade = tradesService.openTrade(buyer, request.body || {});
    return reply.code(201).send({ trade });
  });

  app.post("/trades/:id/funded", async (request) => {
    const seller = requireAddress(request);
    const createTxHash = request.body && request.body.createTxHash;
    const trade = await tradesService.markFunded(
      seller,
      request.params.id,
      createTxHash,
    );
    return { trade };
  });

  app.post("/trades/:id/paid", async (request) => {
    const buyer = requireAddress(request);
    const trade = tradesService.markPaid(buyer, request.params.id);
    return { trade };
  });
}

module.exports = tradesRoutes;
