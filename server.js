const express = require("express");

let app = express();

const fs = require("fs");
const cors = require('cors');

//entender que a string é json
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Inicializar
//servidor recebendo os dados do cliente
app.get("/todos", (req, res) => {
  const file = fs.readFileSync("todos.json");
  const parsed = JSON.parse(file);
  return res.json(parsed);
});

// Adicionar
app.post("/todos", (req, res) => {
  try {
    const new_todo = req.body.todo; //todo do metodo POST do cliente

    const todosArquivo = JSON.parse(fs.readFileSync("todos.json"));

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;

    console.log("todos", todosArquivo);

    const todo = {
      //todosArquivo.todos é um array
      id: todosArquivo.todos[todosArquivo.todos.length - 1].id + 1,
      atividade: new_todo,
      prazo: today,
      prioridade: "baixa",
      status: "andamento",
    };

    //novo json quando salvar uma nova atividade
    const new_todos = { todos: todosArquivo.todos.concat(todo) };

    fs.writeFileSync("todos.json", JSON.stringify(new_todos));

    //enviar a nova todo criada para o cliente
    res.json({ success: true, todo: todo });
  } catch (e) {
    console.log("error adding to list ", e);
    res.json({ success: false });
  }
});

// // Deletar
app.delete('/todos', (req, res) => {
  try {
    const id = req.body.id; //.id é o id que vem no body que vai ser excluido

    const todos = JSON.parse(fs.readFileSync('todos.json'));

    //retorna um novo array com os elementos filtrados
    //filtrar no array todos.todos, o que for diferente mantem no arquivo, o que for igual ao que o usuario qr excluir ele exclui
    const filtered_todos = todos.todos.filter(todo =>
      todo.id != id
    );

    //filtered_todos = array
    //todos: filtered_todos = objeto
    fs.writeFileSync('todos.json', JSON.stringify({ todos: filtered_todos })); // gravando a string no arquivo json

    //enviando o objeto json para o cliente
    res.json({ todos: filtered_todos });
  } catch (e) {
    console.log(e);
  }
});

// Atualizar
//.patch é um método http para atualizar

app.patch('/todos/:id', (req, res) => {

  //armazena a primeira chave do objeto req.body
  const { id } = req.params;
  const { campo, valor } = req.body;

  const todos = JSON.parse(fs.readFileSync('todos.json'));

  const new_todos = todos.todos.map(todo =>
    //se o id for igual ao que o usuario qr atualizar substitui o campo e o valor, se for diferente não faz nada, retorna o proprio objeto
    todo.id == id ? ({ ...todo, [campo]: valor }) : todo
  );

  fs.writeFileSync('todos.json', JSON.stringify({ todos: new_todos }));

  res.json({ todos: new_todos });
})

app.listen(8080, () => {
  console.log("escutando na porta 8080");
});
