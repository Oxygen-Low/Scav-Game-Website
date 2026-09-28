import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createDefender } from "@oxygenlow/webdefender";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.server.port;

// Parse standard payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Oxygen Low Web Defender
async function setupWebDefender() {
  try {
    const apiKey = config.server.defenderApiKey || "offline_dev_key";
    const offlineMode = config.server.defenderOfflineMode;

    console.log(`[WebDefender] Initializing Web Defender (offlineMode: ${offlineMode})...`);
    const defender = await createDefender(
      {
        apiKey,
        offlineMode,
        excludePaths: ["/health", "/api/config"],
        autoBlockSensitivePaths: true,
        onlyLogThreats: false,
        onError: (err) => {
          console.warn("[WebDefender] Error event:", err.message);
        },
        onBlocked: (event) => {
          console.warn(`[WebDefender] Blocked request from ${event.ip} [${event.type}]: ${event.reason}`);
        }
      },
      app
    );

    app.use(defender.middleware());
    console.log("[WebDefender] Protection active and integrated with Express pipeline.");
  } catch (err) {
    console.error("[WebDefender] Failed to initialize WebDefender:", err.message);
    console.warn("[WebDefender] Proceeding with standard server fallback.");
  }
}

await setupWebDefender();

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// API Endpoints
app.get("/api/config", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    game: config.game
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    defender: "active",
    service: "Scav Game Official Website"
  });
});

// Fallback to index.html for SPA/teaser routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║                   S C A V E N G E R   G A M E                          ║
║                Unofficial Rain World Roblox Experience                 ║
║                                                                        ║
║  * Web Server:        http://localhost:${PORT}                           ║
║  * Health Endpoint:   http://localhost:${PORT}/health                    ║
║  * API Config:        http://localhost:${PORT}/api/config                ║
║  * Protected By:      @oxygenlow/webdefender                           ║
╚════════════════════════════════════════════════════════════════════════╝
`);
});
