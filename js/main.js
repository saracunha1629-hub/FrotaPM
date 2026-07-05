// Variáveis globais
let currentTab = 'dashboard';
const viaturas = [];
const manutencoes = [];
const ordens = [];
const historico = [];

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    inicializarGraficos();
    inicializarEventos();
});

function inicializarSistema() {
    console.log('Sistema inicializado');
    carregarDados();
}

function inicializarEventos() {
    // Menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            mudarAba(tabName);
        });
    });

    // Botões de nova viatura, manutenção, etc
    const btnNovaViatura = document.getElementById('btnNovaViatura');
    if (btnNovaViatura) {
        btnNovaViatura.addEventListener('click', function() {
            abrirModal('modalViatura');
        });
    }

    // Menu toggle mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

function mudarAba(tabName) {
    // Remover aba ativa
    const tabsAtivas = document.querySelectorAll('.tab-content.active');
    tabsAtivas.forEach(tab => tab.classList.remove('active'));

    // Remover menu item ativo
    const menuAtivos = document.querySelectorAll('.menu-item.active');
    menuAtivos.forEach(item => item.classList.remove('active'));

    // Ativar nova aba
    const novaAba = document.getElementById(tabName);
    if (novaAba) {
        novaAba.classList.add('active');
    }

    // Ativar novo item do menu
    const novoMenuItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (novoMenuItem) {
        novoMenuItem.classList.add('active');
    }

    // Atualizar título da página
    atualizarTituloPagina(tabName);
    currentTab = tabName;

    // Fechar sidebar no mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

function atualizarTituloPagina(tabName) {
    const titulos = {
        'dashboard': 'Dashboard',
        'viaturas': 'Cadastro de Viaturas',
        'manutencao': 'Plano de Manutenção Preventiva',
        'ordens': 'Ordens de Serviço',
        'historico': 'Histórico de Manutenção',
        'rastreamento': 'Rastreamento em Tempo Real',
        'kpis': 'Indicadores de Desempenho (KPIs)',
        'relatorios': 'Relatórios'
    };
    document.getElementById('page-title').textContent = titulos[tabName] || 'Dashboard';
}

function inicializarGraficos() {
    // Gráfico de Disponibilidade
    const ctxDisponibilidade = document.getElementById('chartDisponibilidade');
    if (ctxDisponibilidade) {
        new Chart(ctxDisponibilidade, {
            type: 'doughnut',
            data: {
                labels: ['Disponível', 'Em Manutenção', 'Indisponível'],
                datasets: [{
                    data: [38, 5, 2],
                    backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico de Manutenções por Mês
    const ctxManutencoes = document.getElementById('chartManutencoes');
    if (ctxManutencoes) {
        new Chart(ctxManutencoes, {
            type: 'bar',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
                datasets: [{
                    label: 'Manutenções',
                    data: [12, 19, 8, 15, 10, 18],
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Funções de Modal
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmarViatura() {
    const form = document.getElementById('formViatura');
    if (form) {
        alert('Viatura adicionada com sucesso!');
        fecharModal('modalViatura');
        form.reset();
    }
}

// Funções de Viaturas
function editarViatura(id) {
    alert(`Editar viatura ${id}`);
    abrirModal('modalViatura');
}

function deletarViatura(id) {
    if (confirm('Tem certeza que deseja deletar esta viatura?')) {
        alert(`Viatura ${id} deletada com sucesso!`);
    }
}

// Funções de Manutenção
function editarManutencao(id) {
    alert(`Editar manutenção ${id}`);
}

function deletarManutencao(id) {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
        alert(`Manutenção ${id} deletada com sucesso!`);
    }
}

// Funções de Ordens de Serviço
function editarOS(id) {
    alert(`Editar OS ${id}`);
}

function finalizarOS(id) {
    if (confirm('Tem certeza que deseja finalizar esta OS?')) {
        alert(`OS ${id} finalizada com sucesso!`);
    }
}

function deletarOS(id) {
    if (confirm('Tem certeza que deseja deletar esta OS?')) {
        alert(`OS ${id} deletada com sucesso!`);
    }
}

function imprimirOS(id) {
    alert(`Imprimindo OS ${id}`);
    window.print();
}

// Funções de Histórico
function verDetalhes(id) {
    alert(`Detalhes do histórico ${id}`);
}

function deletarHistorico(id) {
    if (confirm('Tem certeza que deseja deletar este registro?')) {
        alert(`Registro ${id} deletado com sucesso!`);
    }
}

// Funções de Relatórios
function gerarRelatorio(tipo, formato = 'pdf') {
    alert(`Gerando relatório de ${tipo} em ${formato.toUpperCase()}`);
    // Aqui você integraria com a API para gerar os relatórios
}

// Função para carregar dados (simular carregamento do servidor)
function carregarDados() {
    console.log('Carregando dados do servidor...');
    // Aqui você faria chamadas AJAX para buscar dados do backend
}

// Função para salvar dados
function salvarDados(endpoint, dados) {
    fetch(`api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados salvos:', data);
    })
    .catch(error => {
        console.error('Erro ao salvar dados:', error);
    });
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});
