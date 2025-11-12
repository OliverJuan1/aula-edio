const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "app"
});


app.post("/registro", async (req, res) => {
  const { nome_usuario, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  db.query("INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)",
    [nome_usuario, hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Usuário registrado com sucesso!" });
    }
  );
});


app.post("/login", (req, res) => {
  const { nome_usuario, senha } = req.body;
  db.query("SELECT * FROM usuarios WHERE nome_usuario = ?", [nome_usuario], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ message: "Senha incorreta" });

    res.json({ id: usuario.id, nome_usuario: usuario.nome_usuario });
  });
});


app.post("/atividade", (req, res) => {
  const { usuario_id, tipo, distancia, duracao, calorias } = req.body;
  db.query(
    "INSERT INTO atividades (usuario_id, tipo, distancia, duracao, calorias) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, tipo, distancia, duracao, calorias],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Atividade adicionada!" });
    }
  );
});

app.get("/atividades/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;
  db.query("SELECT * FROM atividades WHERE usuario_id = ?", [usuario_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
