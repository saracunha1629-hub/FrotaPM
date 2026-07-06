// Leaflet Map Integration para Rastreamento em Tempo Real
// Usando OpenStreetMap - Sem necessidade de chave de API

let map;
let markers = [];
let markerLayers = {};

// Dados simulados de viaturas com coordenadas
const viaturasPosicoes = [
    {
        id: 'PM-001',
        placa: 'ABC-1234',
        latitude: -26.8241,
        longitude: -49.0681,
        status: 'operacao',
        velocidade: 65,
        quilometragem: 52340,
        ultima_atualizacao: 'Agora'
    },
    {
        id: 'PM-008',
        placa: 'DEF-5678',
        latitude: -26.9124,
        longitude: -49.0521,
        status: 'operacao',
        velocidade: 45,
        quilometragem: 61200,
        ultima_atualizacao: '2 min atrás'
    },
    {
        id: 'PM-015',
        placa: 'GHI-9012',
        latitude: -26.8150,
        longitude: -49.0810,
        status: 'manutencao',
        velocidade: 0,
        quilometragem: 58500,
        ultima_atualizacao: '5 min atrás'
    },
    {
        id: 'PM-022',
        placa: 'JKL-3456',
        latitude: -26.8300,
        longitude: -49.0600,
        status: 'operacao',
        velocidade: 55,
        quilometragem: 45300,
        ultima_atualizacao: '1 min atrás'
    }
];

// Inicializar o mapa com Leaflet
function inicializarMapa() {
    // Coordenadas centrais de Blumenau
    const blumenau = [-26.8200, -49.0650];

    // Criar mapa
    map = L.map('map').setView(blumenau, 14);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Adicionar marcadores das viaturas
    adicionarMarcadores();
}

function adicionarMarcadores() {
    viaturasPosicoes.forEach(viatura => {
        adicionarMarcador(viatura);
    });
}

function adicionarMarcador(viatura) {
    // Determinar cor do marcador baseado no status
    let cor = '#EF4444'; // vermelho
    let icone = '🚓';
    
    if (viatura.status === 'operacao') {
        cor = '#22C55E'; // verde
    } else if (viatura.status === 'manutencao') {
        cor = '#F97316'; // laranja
    } else if (viatura.status === 'indisponivel') {
        cor = '#EF4444'; // vermelho
    }

    // Criar ícone customizado usando Leaflet Awesome Markers ou SVG
    const html = `
        <div style="
            background-color: ${cor};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-size: 20px;
        ">
            ${icone}
        </div>
    `;

    const customIcon = L.divIcon({
        html: html,
        iconSize: [40, 40],
        className: 'custom-marker'
    });

    // Criar marcador
    const marker = L.marker([viatura.latitude, viatura.longitude], {
        icon: customIcon,
        title: `${viatura.id} - ${viatura.placa}`
    }).addTo(map);

    // Criar popup com informações
    const popupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 250px;">
            <h4 style="margin: 0 0 10px 0; color: #1F2937;">
                ${viatura.id} - ${viatura.placa}
            </h4>
            <p style="margin: 5px 0;"><strong>Status:</strong> 
                <span style="color: ${cor}; font-weight: bold;">
                    ${getStatusLabel(viatura.status)}
                </span>
            </p>
            <p style="margin: 5px 0;"><strong>Localização:</strong> 
                ${viatura.latitude.toFixed(4)}, ${viatura.longitude.toFixed(4)}
            </p>
            <p style="margin: 5px 0;"><strong>Velocidade:</strong> 
                ${viatura.velocidade} km/h
            </p>
            <p style="margin: 5px 0;"><strong>Quilometragem:</strong> 
                ${viatura.quilometragem.toLocaleString('pt-BR')} km
            </p>
            <p style="margin: 5px 0;"><strong>Última atualização:</strong> 
                ${viatura.ultima_atualizacao}
            </p>
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <button onclick="abrirDetalhesViatura('${viatura.id}')" 
                    style="background: #3B82F6; color: white; border: none; padding: 5px 10px; 
                           border-radius: 3px; cursor: pointer; margin-right: 5px;">
                    Ver Detalhes
                </button>
                <button onclick="abrirHistoricoViatura('${viatura.id}')" 
                    style="background: #8B5CF6; color: white; border: none; padding: 5px 10px; 
                           border-radius: 3px; cursor: pointer;">
                    Histórico
                </button>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent);
    
    // Armazenar marcador para futura atualização
    markerLayers[viatura.id] = marker;
    markers.push(marker);
}

function getStatusLabel(status) {
    const labels = {
        'operacao': '✓ Em Operação',
        'manutencao': '🔧 Em Manutenção',
        'indisponivel': '✕ Indisponível'
    };
    return labels[status] || status;
}

function abrirDetalhesViatura(viaturaId) {
    const viatura = viaturasPosicoes.find(v => v.id === viaturaId);
    if (viatura) {
        alert(`Detalhes da Viatura ${viaturaId}\n\nPlaca: ${viatura.placa}\nQuilometragem: ${viatura.quilometragem} km\nVelocidade: ${viatura.velocidade} km/h`);
    }
}

function abrirHistoricoViatura(viaturaId) {
    alert(`Histórico da Viatura ${viaturaId}\n\nClique para ver mais detalhes no sistema.`);
}

// Função para filtrar viaturas no mapa
function filtrarViaturasNoMapa(status) {
    viaturasPosicoes.forEach(viatura => {
        const marker = markerLayers[viatura.id];
        if (marker) {
            if (status === '' || viatura.status === status) {
                marker.setOpacity(1);
            } else {
                marker.setOpacity(0.3);
            }
        }
    });
}

// Event listener para o filtro
const filterStatus = document.getElementById('filterStatus');
if (filterStatus) {
    filterStatus.addEventListener('change', function() {
        filtrarViaturasNoMapa(this.value);
    });
}

// Atualizar posições das viaturas em tempo real (simular)
function atualizarPosicoes() {
    setInterval(() => {
        viaturasPosicoes.forEach((viatura, index) => {
            if (viatura.status === 'operacao') {
                // Simular movimento pequeno
                viatura.latitude += (Math.random() - 0.5) * 0.001;
                viatura.longitude += (Math.random() - 0.5) * 0.001;
                viatura.velocidade = Math.floor(Math.random() * 80) + 20;
                
                // Atualizar marcador
                const marker = markerLayers[viatura.id];
                if (marker) {
                    marker.setLatLng([viatura.latitude, viatura.longitude]);
                }
            }
        });
    }, 5000); // Atualizar a cada 5 segundos
}

// Inicializar mapa quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o elemento do mapa existe
    if (document.getElementById('map')) {
        inicializarMapa();
        atualizarPosicoes();
    }
});
