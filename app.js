class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    //Como dito anteriormente, o for in serve para armazenar na variável percorrendo todos os valores
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false
      }

      //Como é um exemplo de classe, podemos acessar o valor através da notação this[i]
      //console.log(i, this[i])
    }
    return true
  }
}

class Bd {

  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem('id') //null
    return parseInt(proximoId) + 1
  }

  gravar(d) {
    //No Set item é preciso colocar primeiro o identificador do item e em seguida uma notação em JSON com o atributo stringify passando o dado que se deseja armazenar 

    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros() {

    //Array de despesas
    let despesas = []

    let id = localStorage.getItem('id')

    // Recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {

      // Recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i))

      //Existe a possibilidade de haver um indice que foram pulados
      //nesses casos nós vamos pular esses indices
      if (despesa === null) {
        //o continue serve para pular o código
        continue
      }

      despesa.id = i
      despesas.push(despesa)
    }

    return despesas
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array()

    despesasFiltradas = this.recuperarTodosRegistros()

    //ano
    if (despesa.ano != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //mes
    if (despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //dia
    if (despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }
    //tipo
    if (despesa.tipo != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descrição
    if (despesa.descricao != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if (despesa.valor != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }

    return despesasFiltradas

  }

  remover(id){
    localStorage.removeItem(id)
  }
}


let bd = new Bd()

function cadastrarDespesa() {
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  //console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if (despesa.validarDados()) {
    bd.gravar(despesa)

    document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modal_titulo_div').className = 'modal-header text-success'
    document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('modal_btn').innerHTML = 'Voltar'
    document.getElementById('modal_btn').className = 'btn btn-success'

    //dialog de sucesso
    $('#modalRegistrarDespesa').modal('show')

    ano.value = ""
    mes.value = ""
    dia.value = ""
    tipo.value = ""
    descricao.value = ""
    valor.value = ""

  } else {

    document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
    document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
    document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, repita o processo'
    document.getElementById('modal_btn').innerHTML = 'Tentar Novamente'
    document.getElementById('modal_btn').className = 'btn btn-danger'

    $('#modalRegistrarDespesa').modal('show')
  }

}

function carregaListaDespesas(despesas = [], filter = false) {

  if (despesas.length == 0 && filter == false) {
    despesas = bd.recuperarTodosRegistros()
  }


  //capturando o id de tbody
  let listaDespesas = document.getElementById('lista_despesas')
  listaDespesas.innerHTML = ''

  /*
  <tr>
    <td>15/03/2018</td>
    <td>Alimentação</td>
    <td>Compras do Mês</td>
    <td>300,00</td>
  </tr>
   */

  //percorrer o array de despesas para tordar a catura dinâmica
  //forEach percorre todos os valores do array
  despesas.forEach(function (d) {

    //criando a linha (tr)
    let linha = listaDespesas.insertRow()

    //criando a coluna (td)
    linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`

    //Colocar a descrição do tipo, que está com valor string
    switch (d.tipo) {
      case "1": d.tipo = 'Alimentação'
        break
      case "2": d.tipo = 'Educação'
        break
      case "3": d.tipo = 'Lazer'
        break
      case "4": d.tipo = 'Saúde'
        break
      case "5": d.tipo = 'Transporte'
        break

    }

    linha.insertCell(1).innerHTML = `${d.tipo}`

    linha.insertCell(2).innerHTML = `${d.descricao}`
    linha.insertCell(3).innerHTML = `${d.valor}`

    //criar botão de exclusão
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class= "fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function (){
      //remover descrição do id para que o js recupere o elemento correto
      let id = this.id.replace('id_despesa_', '')
      
      //Removendo o item
      bd.remover(id)

      window.location.reload()
    }
    linha.insertCell(4).append(btn)

    console.log(d)
  })
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)
}