// ============================================
// FROTAPM - Sistema de Gestão de Frota
// Script Principal com Atualização em Tempo Real
// ============================================

// Variáveis globais
let currentTab = 'dashboard';
let viaturas = [];
let manutencoes = [];
let ordens = [];
let historico = [];
let rastreamento = [];

// Intervalo de atualização (em ms)
const REFRESH_INTERVAL = 5000; // 5 segundos

// URLs das APIs
const API_BASE = 'api/';
const ENDPOINTS = {
    viaturas: 'viaturas.php',
    ordens: 'ordens_servico.php',
    manutencao: 'manutencao.php',
    historico: 'historico.php',
    rastreamento: 'rastreamento.php',
    kpis: 'kpis.php'
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema FrotaPM iniciando...');
    inicializarSistema();
    inicializarGraficos();
    inicializarEventos();
    carregarDados();
    
    // Atualizar dados em tempo real
    setInterval(carregarDados, REFRESH_INTERVAL);
});

function inicializarSistema() {
    console.log('✅ Sistema inicializado');
}

// ============================================
// CARREGAR DADOS DO SERVIDOR
// ============================================

function carregarDados() {
    console.log('📡 Sincronizando dados com servidor...');
    
    // Carregar dados em paralelo
    Promise.all([
        buscarViaturas(),
        buscarOrdensServico(),
        buscarManutencoes(),
        buscarHistorico(),
        buscarRastreamento(),
        buscarKPIs()
    ]).then(() => {
        console.log('✅ Todos os dados carregados com sucesso');
        atualizarDashboard();
    }).catch(error => {
        console.error('❌ Erro ao carregar dados:', error);
        mostrarNotificacao('Erro ao atualizar dados do servidor', 'erro');
    });
}

// Buscar Viaturas
function buscarViaturas() {
    return fetch(API_BASE + ENDPOINTS.viaturas)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar viaturas');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                viaturas = data.data || [];
                atualizarTabelaViaturas();
                console.log(`📦 ${viaturas.length} viaturas carregadas`);
            }
        })
        .catch(error => console.error('Erro ao buscar viaturas:', error));
}

// Buscar Ordens de Serviço
function buscarOrdensServico() {
    return fetch(API_BASE + ENDPOINTS.ordens)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar ordens');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                ordens = data.data || [];
                atualizarTabelaOrdensServico();
                console.log(`📋 ${ordens.length} ordens de serviço carregadas`);
            }
        })
        .catch(error => console.error('Erro ao buscar ordens:', error));
}

// Buscar Manutenções
function buscarManutencoes() {
    return fetch(API_BASE + ENDPOINTS.manutencao)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar manutenções');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                manutencoes = data.data || [];
                atualizarTabelaManutenacao();
                console.log(`🔧 ${manutencoes.length} manutenções carregadas`);
            }
        })
        .catch(error => console.error('Erro ao buscar manutenções:', error));
}

// Buscar Histórico
function buscarHistorico() {
    return fetch(API_BASE + ENDPOINTS.historico)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar histórico');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                historico = data.data || [];
                atualizarTabelaHistorico();
                console.log(`📜 ${historico.length} registros de histórico carregados`);
            }
        })
        .catch(error => console.error('Erro ao buscar histórico:', error));
}

// Buscar Rastreamento
function buscarRastreamento() {
    return fetch(API_BASE + ENDPOINTS.rastreamento)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar rastreamento');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                rastreamento = data.data || [];
                atualizarMarcadoresNoMapa();
                console.log(`🗺️ Rastreamento atualizado`);
            }
        })
        .catch(error => console.error('Erro ao buscar rastreamento:', error));
}

// Buscar KPIs
function buscarKPIs() {
    return fetch(API_BASE + ENDPOINTS.kpis)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar KPIs');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                atualizarKPIs(data.data);
                console.log('📊 KPIs atualizados');
            }
        })
        .catch(error => console.error('Erro ao buscar KPIs:', error));
}

// ============================================
// ATUALIZAR TABELAS DINAMICAMENTE
// ============================================

function atualizarTabelaViaturas() {
    const tbody = document.getElementById('tabelaViaturas');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (viaturas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Nenhuma viatura registrada</td></tr>';
        return;
    }
    
    viaturas.forEach(viatura => {
        const statusClass = `status-${viatura.status}`;
        const statusLabel = getStatusLabel(viatura.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${viatura.numero || 'N/A'}</td>
            <td>${viatura.placa || 'N/A'}</td>
            <td>${viatura.modelo || 'N/A'}</td>
            <td>${viatura.ano || 'N/A'}</td>
            <td>${(viatura.quilometragem || 0).toLocaleString('pt-BR')} km</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
            <td>${viatura.data_ultima_revisao || 'N/A'}</td>
            <td>${viatura.data_proxima_revisao || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editarViatura(${viatura.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" onclick="deletarViaturaConfirm(${viatura.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarTabelaOrdensServico() {
    const tbody = document.querySelector('#ordens tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (ordens.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhuma ordem de serviço registrada</td></tr>';
        return;
    }
    
    ordens.forEach(ordem => {
        const statusClass = `status-${ordem.status}`;
        const statusLabel = getStatusLabel(ordem.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ordem.numero_os || 'N/A'}</td>
            <td>${ordem.numero || 'N/A'}</td>
            <td>${ordem.data_abertura || 'N/A'}</td>
            <td>${ordem.problema_identificado || 'N/A'}</td>
            <td>${ordem.responsavel_manutencao || 'N/A'}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
            <td>R$ ${(ordem.custo || 0).toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editarOS(${ordem.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="finalizarOSConfirm(${ordem.id})" title="Finalizar">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-delete" onclick="deletarOSConfirm(${ordem.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarTabelaManutenacao() {
    const tbody = document.querySelector('#manutencao tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (manutencoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhuma manutenção agendada</td></tr>';
        return;
    }
    
    manutencoes.forEach(manut => {
        let statusBadge = '';
        const hoje = new Date().toISOString().split('T')[0];
        
        if (manut.status === 'realizada') {
            statusBadge = '🟢 Realizada';
        } else if (manut.data_agendada < hoje) {
            statusBadge = '🔴 Vencida';
        } else if ((new Date(manut.data_agendada) - new Date()) / (1000 * 60 * 60 * 24) <= 7) {
            statusBadge = '🟡 Próxima';
        } else {
            statusBadge = '🟢 No Prazo';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${manut.numero || 'N/A'}</td>
            <td>${manut.tipo_manutencao || 'N/A'}</td>
            <td>${manut.frequencia || 'N/A'}</td>
            <td>${manut.data_agendada || 'N/A'}</td>
            <td><span class="status-badge">${statusBadge}</span></td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editarManutencao(${manut.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" onclick="deletarManutencaoConfirm(${manut.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarTabelaHistorico() {
    const tbody = document.querySelector('#historico tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (historico.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhum registro de histórico</td></tr>';
        return;
    }
    
    historico.forEach(hist => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hist.numero || 'N/A'}</td>
            <td>${hist.tipo_manutencao || 'N/A'}</td>
            <td>${hist.data_realizacao || 'N/A'}</td>
            <td>${hist.responsavel || 'N/A'}</td>
            <td>${hist.pecas_substituidas || 'N/A'}</td>
            <td>R$ ${(hist.custo || 0).toFixed(2).replace('.', ',')}</td>
            <td>${hist.tempo_parada || 0}h</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verDetalhesHistorico(${hist.id})" title="Detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-delete" onclick="deletarHistoricoConfirm(${hist.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ============================================
// ATUALIZAR DASHBOARD
// ============================================

function atualizarDashboard() {
    // Calcular estatísticas
    const totalViaturas = viaturas.length;
    const emOperacao = viaturas.filter(v => v.status === 'operacao').length;
    const emManutencao = viaturas.filter(v => v.status === 'manutencao').length;
    const indisponivel = viaturas.filter(v => v.status === 'indisponivel').length;
    
    // Atualizar cards
    const cards = document.querySelectorAll('.stat-card');
    if (cards.length >= 4) {
        cards[0].querySelector('h3').textContent = totalViaturas;
        cards[1].querySelector('h3').textContent = emOperacao;
        cards[2].querySelector('h3').textContent = emManutencao;
        cards[3].querySelector('h3').textContent = indisponivel;
    }
    
    // Atualizar gráficos
    atualizarGraficoDisponibilidade(emOperacao, emManutencao, indisponivel);
}

function atualizarMarcadoresNoMapa() {
    if (typeof atualizarPosicoes !== 'undefined') {
        atualizarPosicoes();
    }
}

function atualizarKPIs(data) {
    if (!data) return;
    
    // Atualizar valores dos KPIs na tela
    const kpiCards = document.querySelectorAll('.kpi-card');
    if (kpiCards.length > 0) {
        if (data.disponibilidade_frota !== undefined) {
            kpiCards[0].querySelector('.kpi-value').textContent = data.disponibilidade_frota + '%';
        }
        if (data.tempo_medio_reparo !== undefined) {
            kpiCards[1].querySelector('.kpi-value').textContent = data.tempo_medio_reparo + 'h';
        }
        if (data.tempo_medio_entre_falhas !== undefined) {
            kpiCards[2].querySelector('.kpi-value').textContent = data.tempo_medio_entre_falhas + 'h';
        }
        if (data.custo_por_viatura !== undefined) {
            kpiCards[3].querySelector('.kpi-value').textContent = 'R$ ' + data.custo_por_viatura.toFixed(2).replace('.', ',');
        }
    }
}

// ============================================
// OPERAÇÕES CRUD - VIATURAS
// ============================================

function editarViatura(id) {
    const viatura = viaturas.find(v => v.id === id);
    if (!viatura) return;
    
    // Preencher modal com dados
    document.querySelector('#formViatura input[placeholder="Ex: PM-001"]').value = viatura.numero || '';
    document.querySelector('#formViatura input[placeholder="Ex: ABC-1234"]').value = viatura.placa || '';
    document.querySelector('#formViatura input[placeholder="Ex: Chevrolet S10"]').value = viatura.modelo || '';
    document.querySelector('#formViatura input[placeholder="2024"]').value = viatura.ano || '';
    document.querySelector('#formViatura input[placeholder="52340"]').value = viatura.quilometragem || 0;
    
    // Salvar ID para atualização
    document.getElementById('formViatura').dataset.action = 'update';
    document.getElementById('formViatura').dataset.id = id;
    
    document.querySelector('#modalViatura h2').textContent = 'Editar Viatura';
    abrirModal('modalViatura');
}

function deletarViaturaConfirm(id) {
    if (confirm('Tem certeza que deseja deletar esta viatura?')) {
        deletarViatura(id);
    }
}

function deletarViatura(id) {
    fetch(API_BASE + ENDPOINTS.viaturas, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Viatura deletada com sucesso!', 'sucesso');
            buscarViaturas();
        } else {
            mostrarNotificacao(data.message || 'Erro ao deletar viatura', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao deletar viatura', 'erro');
    });
}

function confirmarViatura() {
    const form = document.getElementById('formViatura');
    const isUpdate = form.dataset.action === 'update';
    
    const dados = {
        numero: form.querySelector('input[placeholder="Ex: PM-001"]').value,
        placa: form.querySelector('input[placeholder="Ex: ABC-1234"]').value,
        modelo: form.querySelector('input[placeholder="Ex: Chevrolet S10"]').value,
        ano: form.querySelector('input[placeholder="2024"]').value,
        quilometragem: form.querySelector('input[placeholder="52340"]').value
    };
    
    if (!dados.numero || !dados.placa) {
        mostrarNotificacao('Preencha todos os campos obrigatórios', 'aviso');
        return;
    }
    
    const method = isUpdate ? 'PUT' : 'POST';
    if (isUpdate) dados.id = form.dataset.id;
    
    fetch(API_BASE + ENDPOINTS.viaturas, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao(data.message || 'Viatura salva com sucesso!', 'sucesso');
            closeModal('modalViatura');
            form.reset();
            form.dataset.action = 'create';
            buscarViaturas();
        } else {
            mostrarNotificacao(data.message || 'Erro ao salvar viatura', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao salvar viatura', 'erro');
    });
}

// ============================================
// OPERAÇÕES CRUD - ORDENS DE SERVIÇO
// ============================================

function editarOS(id) {
    const os = ordens.find(o => o.id === id);
    if (!os) return;
    
    // Implementar modal para OS
    alert(`Editar OS ${os.numero_os}`);
}

function finalizarOSConfirm(id) {
    if (confirm('Finalizar esta ordem de serviço?')) {
        finalizarOS(id);
    }
}

function finalizarOS(id) {
    const os = ordens.find(o => o.id === id);
    if (!os) return;
    
    const dados = { ...os, status: 'finalizada', id: id };
    
    fetch(API_BASE + ENDPOINTS.ordens, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Ordem de serviço finalizada!', 'sucesso');
            buscarOrdensServico();
        } else {
            mostrarNotificacao(data.message || 'Erro ao finalizar OS', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao finalizar OS', 'erro');
    });
}

function deletarOSConfirm(id) {
    if (confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
        deletarOS(id);
    }
}

function deletarOS(id) {
    fetch(API_BASE + ENDPOINTS.ordens, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Ordem de serviço deletada com sucesso!', 'sucesso');
            buscarOrdensServico();
        } else {
            mostrarNotificacao(data.message || 'Erro ao deletar OS', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao deletar OS', 'erro');
    });
}

function imprimirOS(id) {
    const os = ordens.find(o => o.id === id);
    if (!os) return;
    
    alert(`Imprimindo OS ${os.numero_os}`);
    window.print();
}

// ============================================
// OPERAÇÕES CRUD - MANUTENÇÃO
// ============================================

function editarManutencao(id) {
    const manut = manutencoes.find(m => m.id === id);
    if (!manut) return;
    alert(`Editar manutenção ${manut.tipo_manutencao}`);
}

function deletarManutencaoConfirm(id) {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
        deletarManutencao(id);
    }
}

function deletarManutencao(id) {
    fetch(API_BASE + ENDPOINTS.manutencao, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Manutenção deletada com sucesso!', 'sucesso');
            buscarManutencoes();
        } else {
            mostrarNotificacao(data.message || 'Erro ao deletar manutenção', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao deletar manutenção', 'erro');
    });
}

// ============================================
// OPERAÇÕES CRUD - HISTÓRICO
// ============================================

function verDetalhesHistorico(id) {
    const hist = historico.find(h => h.id === id);
    if (!hist) return;
    alert(`Detalhes: ${hist.tipo_manutencao}\nData: ${hist.data_realizacao}\nCusto: R$ ${hist.custo}`);
}

function deletarHistoricoConfirm(id) {
    if (confirm('Tem certeza que deseja deletar este registro?')) {
        deletarHistorico(id);
    }
}

function deletarHistorico(id) {
    fetch(API_BASE + ENDPOINTS.historico, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Registro deletado com sucesso!', 'sucesso');
            buscarHistorico();
        } else {
            mostrarNotificacao(data.message || 'Erro ao deletar', 'erro');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao deletar', 'erro');
    });
}

// ============================================
// NAVEGAÇÃO E MODAIS
// ============================================

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
            document.getElementById('formViatura').dataset.action = 'create';
            document.querySelector('#modalViatura h2').textContent = 'Nova Viatura';
            document.getElementById('formViatura').reset();
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

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// GRÁFICOS
// ============================================

let chartDisponibilidade = null;

function inicializarGraficos() {
    // Gráfico de Disponibilidade
    const ctxDisponibilidade = document.getElementById('chartDisponibilidade');
    if (ctxDisponibilidade) {
        chartDisponibilidade = new Chart(ctxDisponibilidade, {
            type: 'doughnut',
            data: {
                labels: ['Disponível', 'Em Manutenção', 'Indisponível'],
                datasets: [{
                    data: [0, 0, 0],
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

function atualizarGraficoDisponibilidade(disponivel, manutencao, indisponivel) {
    if (chartDisponibilidade) {
        chartDisponibilidade.data.datasets[0].data = [disponivel, manutencao, indisponivel];
        chartDisponibilidade.update();
    }
}

// ============================================
// UTILITÁRIOS
// ============================================

function getStatusLabel(status) {
    const labels = {
        'operacao': '✓ Em Operação',
        'manutencao': '🔧 Em Manutenção',
        'indisponivel': '✕ Indisponível',
        'aberta': '📋 Aberta',
        'finalizada': '✅ Finalizada',
        'cancelada': '❌ Cancelada',
        'pendente': '⏳ Pendente',
        'realizada': '✅ Realizada',
        'vencida': '⏰ Vencida'
    };
    return labels[status] || status;
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'sucesso' ? '#27ae60' : tipo === 'erro' ? '#e74c3c' : tipo === 'aviso' ? '#f39c12' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
    `;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notificacao {
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        font-weight: 500;
    }
`;
document.head.appendChild(style);
