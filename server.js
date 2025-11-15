import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import cors from "cors";

const app = express();
app.use(express.json());

// =======================
// 🔥 CORS CONFIGURADO
// =======================
app.use(
  cors({
    origin: "*", // Puedes poner aquí tu dominio: "https://tusitio.com"
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configuración directa SIN .env
const openRouter = new OpenRouter({
  apiKey: "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", // <--- pega tu API KEY aquí
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",  
    "X-Title": "IA MRV JS", 
  },
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openRouter.chat.send({
      model: "openai/gpt-oss-20b:free", // <--- tu modelo elegido
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      stream: false,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Error en /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
});
