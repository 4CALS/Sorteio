let dados = []

// Buscar dados do banco (dados.php)
fetch('dados.php')
    .then(res => res.json())
    .then(res => dados = res)

let intervalo
let tempoTotal = 1600 // Tempo total da "roleta girando" (ms)

const botaoSortear = document.querySelector('button[onclick="sortear()"]')
const botaoLimpar = document.querySelector('button[onclick="limpar()"]')
const checkboxEstudante = document.getElementById('checkbox-estudante')
const checkboxFuncionario = document.getElementById('checkbox-funcionario')
const checkboxConvidado = document.getElementById('checkbox-convidado')

// Desativa o botão limpar na tela inicial
botaoLimpar.disabled = true

function getCorAleatoria() {
    const cores = ['#a5d8ff', '#ffadad', '#caffbf', '#fdffb6', '#ffd6a5', '#dab6fc', '#d8b4a0', '#ffc6ff', '#b5f4f0']
    return cores[Math.floor(Math.random() * cores.length)]
}

function sortear() {
    if (dados.length === 0) {
        document.getElementById('resultado').innerText = "Nenhum dado encontrado."
        return
    }

    // Filtrar os dados com base nos checkboxes selecionados
    const filtros = []
    if (checkboxEstudante.checked) filtros.push('estudante')
    if (checkboxFuncionario.checked) filtros.push('funcionario')
    if (checkboxConvidado.checked) filtros.push('convidado')

    const dadosFiltrados = dados.filter(item => filtros.includes(item.funcao))

    if (dadosFiltrados.length === 0) {
        document.getElementById('resultado').innerText = "Nenhum dado disponível com os filtros selecionados."
        return
    }

    // Desativa os botões durante o sorteio
    botaoSortear.disabled = true

    let resultado = document.getElementById('resultado')

    intervalo = setInterval(() => {
        const aleatorio = dadosFiltrados[Math.floor(Math.random() * dadosFiltrados.length)]
        const cor = getCorAleatoria()
        resultado.innerHTML = `<div class="circulo" style="background-color: ${cor}">
            ${aleatorio.nome} <br> ${aleatorio.funcao}
        </div>`
    }, 100)

    setTimeout(() => {
        clearInterval(intervalo)
        const sorteado = dadosFiltrados[Math.floor(Math.random() * dadosFiltrados.length)]
        const cor = getCorAleatoria()
        resultado.innerHTML = `<div class="circulo" style="background-color: ${cor}">
            ${sorteado.nome} <br> ${sorteado.funcao}
        </div>`

        // Adiciona o efeito de confete no nome sorteado
        lancarConfetes()

        // Reativa os botões após sorteio
        botaoSortear.disabled = false
        botaoLimpar.disabled = false
    }, tempoTotal)
}

function limpar() {
    clearInterval(intervalo)
    document.getElementById('resultado').innerText = "Clique o botão sortear para começar!"

    // Reseta botões
    botaoSortear.disabled = false
    botaoLimpar.disabled = true
}

// Função para disparar os confetes
function lancarConfetes() {
    const confetti = window.confetti

    confetti({
        particleCount: 200,
        spread: 70,
        origin: { x: 0.5, y: 0.3 }, // Posição de origem (centralizado no topo)
        colors: ['#ffadad', '#ff61a6', '#ff9a8b', '#f8c8dc'],
    })
}

// Adiciona eventos de mudança para os checkboxes
checkboxEstudante.addEventListener('change', () => atualizarFiltro())
checkboxFuncionario.addEventListener('change', () => atualizarFiltro())
checkboxConvidado.addEventListener('change', () => atualizarFiltro())

// Função para atualizar os filtros e fazer a requisição dinâmica
function atualizarFiltro() {
    const filtros = {
        estudante: checkboxEstudante.checked,
        funcionario: checkboxFuncionario.checked,
        convidado: checkboxConvidado.checked
    }

    const url = new URL('dados.php')
    Object.keys(filtros).forEach(key => url.searchParams.append(key, filtros[key]))

    fetch(url)
        .then(res => res.json())
        .then(res => {
            dados = res
            // Chama a lógica de sorteio após os dados estarem prontos
            // Atualiza a interface para refletir a alteração dos dados
            document.getElementById('resultado').innerText = "Clique o botão sortear para começar!"
        })
}
