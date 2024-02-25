/** @format */

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const handlebars = require("handlebars");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: "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",
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    console.log("Received message:", message);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo-0125",
    });
    const reply = completion.choices[0].message.content.trim();
    console.log("BOT RESPONSE:", reply);
    res.send(reply);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para servir la plantilla HTML
app.get("/", (req, res) => {
  fs.readFile("index.hbs", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading template file");
      return;
    }

    // Compilar la plantilla Handlebars
    const template = handlebars.compile(data);

    // Datos para pasar a la plantilla (puedes personalizar esto según tus necesidades)
    const context = {
      messages: [
        { author: "User", content: "Hello" },
        { author: "Bot", content: "Hi there" },
      ],
    };

    // Renderizar la plantilla con los datos
    const html = template(context);

    // Enviar la respuesta al cliente
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
