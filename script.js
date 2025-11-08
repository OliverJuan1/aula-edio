const API = "http://localhost:3000";

let usuarioLogado = null;

// ========== REGISTRO ==========
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome_usuario = document.getElementById("registroNome").value;
  const senha = document.getElementById("registroSenha").value;

  const res = await fetch(`${API}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_usuario, senha })
  });

  const data = await res.json();
  alert(data.mensagem || data.erro);
});

// ========== LOGIN ==========
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome_usuario = document.getElementById("loginNome").value;
  const senha = document.getElementById("loginSenha").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_usuario, senha })
  });

  const data = await res.json();

  if (data.usuario) {
    usuarioLogado = data.usuario;
    alert("Login realizado com sucesso!");

    document.getElementById("formAtividade").style.display = "block";
    document.getElementById("atividades").style.display = "block";

    carregarAtividades();
  } else {
    alert(data.erro || "Erro ao fazer login");
  }
});

// ========== CADASTRAR ATIVIDADE ==========
document.getElementById("formAtividade").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const distancia = document.getElementById("distancia").value;
  const duracao = document.getElementById("duracao").value;
  const calorias = document.getElementById("calorias").value;

  const res = await fetch(`${API}/atividades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id: usuarioLogado.id,
      tipo,
      distancia,
      duracao,
      calorias
    })
  });

  const data = await res.json();
  alert(data.mensagem || data.erro);

  carregarAtividades();
});

// ========== CARREGAR ATIVIDADES ==========
async function carregarAtividades() {
  if (!usuarioLogado) return;

  const res = await fetch(`${API}/atividades/usuario/${usuarioLogado.id}`);
  const atividades = await res.json();

  const lista = document.getElementById("listaAtividades");
  lista.innerHTML = "";

  if (atividades.length === 0) {
    lista.innerHTML = "<p>Nenhuma atividade registrada ainda.</p>";
    return;
  }

  atividades.forEach((a) => {
    const div = document.createElement("div");
    div.classList.add("atividade");
    div.innerHTML = `
      <strong>${a.tipo}</strong><br>
      Distância: ${a.distancia} km<br>
      Duração: ${a.duracao} min<br>
      Calorias: ${a.calorias}
    `;
    lista.appendChild(div);
  });
}
