import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example: Return room data (could also be fetched from Firestore on server)
  app.get("/api/rooms", (req, res) => {
    res.json([
      {
        id: 'celestial-dome',
        name: 'Celestial Luxury Dome',
        description: 'Our flagship experience featuring 360-degree views of the Tiger Falls valley and the Himalayan range.',
        price: 14000,
        image: '/src/assets/images/dome_interior_luxury_1779192676982.png',
        amenities: ['King Size Bed', 'Private Deck', 'Heated Interiors', 'Fiber Wi-Fi'],
        size: '450 sq.ft',
        capacity: 2
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
