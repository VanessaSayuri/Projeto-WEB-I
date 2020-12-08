//Arrays para gerar a data quando o usuário abre a página
var el = document.getElementById("data-hoje")
var hoje = new Date();
dayName = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado")
monName = new Array("janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro")
el.innerText = `Olá!! Hoje é ${dayName[hoje.getDay()]}, ${hoje.getDate()} de ${monName[hoje.getMonth()]} de ${hoje.getFullYear()}. `


const inputElement = document.getElementById("atividade");

const iElement = document.getElementById("tbl-id");
const tblElement = document.getElementById("tbl-atividade");

const prazoElement = document.getElementById("tbl-prazo");
const prioridadeElement = document.getElementById("tbl-prioridade");
const statusElement = document.getElementById("tbl-status");
const botaoElement = document.getElementById("tbl-botao");

function inserirAtividade(todo) {

    //criação do elemento DIV para o id
    var idElement = document.createElement("div");
    idElement.classList.add("id"); //classList metodo para adicionar class no elemento dinamico
    idElement.innerHTML = todo.id;

    iElement.appendChild(idElement);

    //criação do Elemento DIV
    var textElement = document.createElement("div");
    textElement.innerHTML = todo.atividade;

    //criação do elemento DIV com o texto do formulário
    var atividadeElement = document.createElement("div");
    atividadeElement.classList.add('atividade');
    atividadeElement.appendChild(textElement);

    //criação do elemento dentro do id = "tbl-atividade"
    tblElement.appendChild(atividadeElement);

    var prazo = document.createElement("div");
    var prazoElementTBL = document.createElement("button");
    prazoElementTBL.classList.add("btnPrazo")
    prazoElementTBL.innerHTML = '<input type="date" value="' + todo.prazo + '" placeholder = "Selecione a data" class="effect"/>';
    var prazoDate = prazoElementTBL.firstChild; //firstChild é <input type="date" value="' + todo.prazo + '" placeholder = "Selecione a data" class="effect"/>';

    prazoDate.onchange = function (event) {
        const id = idElement.innerHTML;
        const { value } = event.target; //value do estado presente (valor q foi trocado)

        atualizar(id, 'prazo', value);
    };
    //criando a div do prazo
    prazo.appendChild(prazoElementTBL);
    prazoElement.appendChild(prazo);



    var prioridade = document.createElement("div");
    prioridade.classList.add('prioridade')
    var prioridadeSelect = document.createElement("select");
    prioridadeSelect.onchange = function (event) {
        const id = idElement.innerHTML;
        const { value } = event.target;

        atualizar(id, 'prioridade', value);
    };
    prioridadeSelect.innerHTML = `<option value="alta" ${todo.prioridade === "alta" ? "selected" : ""}>Alta</option><option ${todo.prioridade === "media" ? "selected" : ""} value="media">Média</option><option ${todo.prioridade === "baixa" ? "selected" : ""} value="baixa" >Baixa</option>`;
    //criando a div prioridade
    prioridade.appendChild(prioridadeSelect);
    prioridadeElement.appendChild(prioridade);



    var status = document.createElement("div");
    status.classList.add('status')
    var statusSelect = document.createElement("select");
    statusSelect.onchange = function (event) {
        const id = idElement.innerHTML;
        const { value } = event.target;

        atualizar(id, 'status', value);
    };
    statusSelect.innerHTML = `<option value="andamento" ${todo.status === "andamento" ? "selected" : ""}>Em Andamento</option><option ${todo.status === "concluida" ? "selected" : ""} value="concluida">Concluída</option><option ${todo.status === "iniciar" ? "selected" : ""} value="iniciar" >A fazer</option>`;


    status.appendChild(statusSelect);
    statusElement.appendChild(status);



    var botaoRemove = document.createElement("div");
    botaoRemove.classList.add('botao')
    var botaoRemoveTBL = document.createElement("button");
    botaoRemoveTBL.classList.add("btnExcluir")
    botaoRemoveTBL.innerHTML = "Excluir";
    botaoRemove.appendChild(botaoRemoveTBL);
    botaoElement.appendChild(botaoRemove);

    //função para remover o elemento quando clicar no botão "Excluir" na lista
    botaoRemoveTBL.onclick = function () {
        //só funciona quando recebe a confirmação do server que foi deletado no server
        deletar(idElement.innerHTML).then(() => {
            iElement.removeChild(idElement);
            tblElement.removeChild(atividadeElement);
            prazoElement.removeChild(prazo);
            prioridadeElement.removeChild(prioridade);
            statusElement.removeChild(status);
            botaoElement.removeChild(botaoRemove);

        }).catch(e => {
            console.log(e);
            alert("houve um erro");
        });

    }


    //esvaziar o form quando clicar em adicionar
    inputElement.value = "";

}



// Inicializar
//requisicao inicial quando abre a tela do cliente
fetch("http://localhost:8080/todos") //rota do get todos
    .then((res) => res.json())
    .then(({ todos }) => {

        todos.forEach((todo) => {
            inserirAtividade(todo);
        });
    })
    .catch((e) => console.log("json error", e));

function deletar(id) {
    return fetch("http://localhost:8080/todos", {
        method: "DELETE",
        body: JSON.stringify({
            id
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())

}


function atualizar(id, campo, valor) {
    fetch(
        `http://localhost:8080/todos/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                campo: campo,
                valor: valor
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

// adicionar

const task = document.getElementById("adicionarAtividade");

task.addEventListener("click", (event) => {
    event.preventDefault();

    const new_todo = document.getElementById("atividade");
    //se não adicionar nenhuma atividade cancelar a função
    if (new_todo.value === "") return;


    console.log(new_todo.value);
    //enviando dados para o server
    fetch("http://localhost:8080/todos", {
        method: "POST",
        body: JSON.stringify({ todo: new_todo.value }), //todo do server linha 24
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json()) //res do servidor retorna uma promise, nesse caso é o resp da linha debaixo
        .then((resp) => { //resp parseado do cliente

            if (!resp.success) return;

            inserirAtividade(resp.todo);

        });
});




