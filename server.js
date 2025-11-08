const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔗 Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "app"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } else {
    console.log("✅ Conectado ao banco de dados MySQL!");
  }
});

// ===============================
// 🧍 ROTAS DE USUÁRIOS
// ===============================

// Registrar usuário
app.post("/usuarios", (req, res) => {
  const { nome_usuario, senha } = req.body;

  if (!nome_usuario || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  const sql = "INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)";
  db.query(sql, [nome_usuario, senha], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao registrar usuário" });
    }
    res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
  });
});

// Login simples
app.post("/login", (req, res) => {
  const { nome_usuario, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE nome_usuario = ? AND senha = ?";
  db.query(sql, [nome_usuario, senha], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao fazer login" });
    }
    if (results.length === 0) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos" });
    }

    res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: results[0]
    });
  });
});

// ===============================
// 🏃 ROTAS DE ATIVIDADES
// ===============================

// Listar todas as atividades
app.get("/atividades", (req, res) => {
  const sql = "SELECT * FROM atividades";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar atividades" });
    }
    res.json(results);
  });
});

// Listar atividades de um usuário
app.get("/atividades/usuario/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;
  const sql = "SELECT * FROM atividades WHERE usuario_id = ?";
  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar atividades do usuário" });
    }
    res.json(results);
  });
});

// Criar nova atividade
app.post("/atividades", (req, res) => {
  const { usuario_id, tipo, distancia, duracao, calorias } = req.body;
  const sql = `
    INSERT INTO atividades (usuario_id, tipo, distancia, duracao, calorias)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [usuario_id, tipo, distancia, duracao, calorias], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao adicionar atividade" });
    }
    res.status(201).json({ mensagem: "Atividade adicionada com sucesso!" });
  });
});

// Atualizar atividade
app.put("/atividades/:id", (req, res) => {
  const { id } = req.params;
  const { tipo, distancia, duracao, calorias } = req.body;
  const sql = `
    UPDATE atividades
    SET tipo=?, distancia=?, duracao=?, calorias=?
    WHERE id=?
  `;
  db.query(sql, [tipo, distancia, duracao, calorias, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar atividade" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Atividade não encontrada" });
    }
    res.json({ mensagem: "Atividade atualizada com sucesso!" });
  });
});

// Deletar atividade
app.delete("/atividades/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM atividades WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao deletar atividade" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Atividade não encontrada" });
    }
    res.json({ mensagem: "Atividade deletada com sucesso!" });
  });
});

// ===============================
// 🚀 INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
