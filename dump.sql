CREATE DATABASE app;
USE app;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_usuario VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);


CREATE TABLE atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50),
  distancia DECIMAL(5,2),
  duracao INT,
  calorias INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
