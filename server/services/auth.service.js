const { SiweMessage } = require("siwe");
const { loadConfig } = require("../config");
const sessions = require("../db/sessions.repository");
const { httpError } = require("../utils/http-error");

function normalizeAddress(address) {
  if (!address || typeof address !== "string") return null;
  const addr = address.trim().toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(addr)) return null;
  return addr;
}

function getNonce(address) {
  const addr = normalizeAddress(address);
  if (!addr) throw httpError(400, "Valid address required");
  return {
    address: addr,
    nonce: sessions.issueNonce(addr),
  };
}

async function verifySiwe({ message, signature }) {
  if (!message || !signature) {
    throw httpError(400, "message and signature required");
  }

  const { siweDomain, siweUri, chainId } = loadConfig();
  let siweMessage;
  try {
    siweMessage = new SiweMessage(message);
  } catch {
    throw httpError(400, "Invalid SIWE message");
  }

  const address = normalizeAddress(siweMessage.address);
  if (!address) throw httpError(400, "Invalid address in SIWE message");

  if (siweMessage.domain !== siweDomain) {
    throw httpError(401, `SIWE domain must be ${siweDomain}`);
  }
  if (siweMessage.uri !== siweUri) {
    throw httpError(401, `SIWE uri must be ${siweUri}`);
  }
  if (Number(siweMessage.chainId) !== chainId) {
    throw httpError(401, `SIWE chainId must be ${chainId}`);
  }

  let fields;
  try {
    const result = await siweMessage.verify({ signature });
    fields = result.data;
  } catch (err) {
    throw httpError(
      401,
      err instanceof Error ? err.message : "SIWE verification failed",
    );
  }

  if (!sessions.consumeNonce(address, fields.nonce)) {
    throw httpError(401, "Invalid or expired nonce");
  }

  return sessions.createSession(address);
}

function logout(token) {
  sessions.revokeSession(token);
  return { ok: true };
}

function me(token) {
  const session = sessions.getSession(token);
  if (!session) throw httpError(401, "Not authenticated");
  return {
    address: session.address,
    expiresAt: session.expiresAt,
  };
}

module.exports = {
  normalizeAddress,
  getNonce,
  verifySiwe,
  logout,
  me,
};
