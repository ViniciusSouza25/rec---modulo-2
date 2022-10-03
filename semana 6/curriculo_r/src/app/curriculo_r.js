const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const sqlite3 = require("sqlite3").verbose();
const DBPATH = "../db/curriculo_r.db";
const hostname = "127.0.0.1";
const port = 8080;
const app = express();

/* Servidor aplicação */

app.use(express.static(path.resolve(__dirname, "../html"), { extensions: ["html"] }));
app.use("/css", express.static(path.resolve(__dirname, "../css")));
app.use("/assets", express.static(path.resolve(__dirname, "../assets")));


/* Definição dos endpoints */

/******** CRUD ************/

app.use(express.json());
app.get("/", (req, res) => {
  res.send("ok").status(200);
});
// Retorna todos registros (é o R do CRUD - Read)
app.get("/textos", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*"); // Isso é importante para evitar o erro de CORS

  var db = new sqlite3.Database(path.resolve(__dirname, DBPATH)); // Abre o banco
  var sql = "SELECT * FROM itens ORDER BY texto COLLATE NOCASE";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if (!rows || !rows.length) res.status(404);
    res.json(rows);
  });
  db.close(); // Fecha o banco
});

// Insere um registro (é o C do CRUD - Create)
app.post("/userinsert", urlencodedParser, (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Isso é importante para evitar o erro de CORS
  const title = req.body.title;
  const text = req.body.text;
  if (!title || !text) return res.sendStatus(400);
  sql = `INSERT INTO itens (titulo, texto) VALUES ("${title}", "${text}")`;
  var db = new sqlite3.Database(path.resolve(__dirname, DBPATH)); // Abre o banco
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
  });
  db.close(); // Fecha o banco
  res.sendStatus(201);
});

// Atualiza um registro (é o U do CRUD - Update)
app.post("/userupdate", urlencodedParser, (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*"); // Isso é importante para evitar o erro de CORS
  const title = req.body.title;
  const text = req.body.text;
  const id = req.body.id;
  if (!title || !text || !id) return res.sendStatus(400);
  sql = `UPDATE itens SET titulo = "${title}", texto = "${text}"  WHERE id = ${id}`;
  var db = new sqlite3.Database(path.resolve(__dirname, DBPATH)); // Abre o banco
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    res.end();
  });
  db.close(); // Fecha o banco
});

// Exclui um registro (é o D do CRUD - Delete)
app.post("/userdelete", urlencodedParser, (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*"); // Isso é importante para evitar o erro de CORS
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  sql = `DELETE FROM itens WHERE id = ${id}`;
  var db = new sqlite3.Database(path.resolve(__dirname, DBPATH)); // Abre o banco
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    res.end();
  });
  db.close(); // Fecha o banco
});

app.listen(port, hostname, () => {
  console.log(`Page server running at http://${hostname}:${port}/`);
  console.log(`Create section at http://${hostname}:${port}/criar`);
  console.log(`Update section at http://${hostname}:${port}/atualizar`);
  console.log(`Delete section at http://${hostname}:${port}/remover`);
});
