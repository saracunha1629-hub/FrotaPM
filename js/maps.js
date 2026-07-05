// Google Maps Integration para Rastreamento em Tempo Real

let map;
let markers = [];
let infoWindows = [];

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

// Inicializar o mapa
function inicializarMapa() {
    // Coordenadas centrais de Blumenau
    const blumenau = { lat: -26.8200, lng: -49.0650 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: blumenau,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#f5f5f5"}]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#bdbdbd"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#dadada"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#c9c9c9"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            }
        ]
    });

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
    let cor = 'red';
    if (viatura.status === 'operacao') {
        cor = 'green';
    } else if (viatura.status === 'manutencao') {
        cor = 'orange';
    } else if (viatura.status === 'indisponivel') {
        cor = 'red';
    }

    // Criar ícone customizado
    const icon = `
        <div style="
            background-color: ${cor};
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 0 0;
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
            🚓
        </div>
    `;

    const marker = new google.maps.Marker({
        position: { lat: viatura.latitude, lng: viatura.longitude },
        map: map,
        title: `${viatura.id} - ${viatura.placa}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: cor,
            fillOpacity: 0.7,
            strokeColor: 'white',
            strokeWeight: 2
        }
    });

    // Criar conteúdo da info window
    const conteudo = `
        <div style="font-family: Arial, sans-serif; min-width: 250px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${viatura.id} - ${viatura.placa}</h4>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${cor}; font-weight: bold;">${getStatusLabel(viatura.status)}</span></p>
            <p style="margin: 5px 0;"><strong>Localização:</strong> ${viatura.latitude.toFixed(4)}, ${viatura.longitude.toFixed(4)}</p>
            <p style="margin: 5px 0;"><strong>Velocidade:</strong> ${viatura.velocidade} km/h</p>
            <p style="margin: 5px 0;"><strong>Quilometragem:</strong> ${viatura.quilometragem.toLocaleString('pt-BR')} km</p>
            <p style="margin: 5px 0;"><strong>Última atualização:</strong> ${viatura.ultima_atualizacao}</p>
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <a href="#" onclick="abrirDetalhesViatura('${viatura.id}'); return false;" style="color: #3498db; text-decoration: none; margin-right: 10px;">Ver Detalhes</a>
                <a href="#" onclick="abrirHistoricoViatura('${viatura.id}'); return false;" style="color: #3498db; text-decoration: none;">Histórico</a>
            </div>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: conteudo
    });

    marker.addListener('click', function() {
        // Fechar todas as info windows abertas
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
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
    alert(`Abrindo detalhes da viatura ${viaturaId}`);
    // Aqui você pode implementar a lógica para abrir um modal com detalhes
}

function abrirHistoricoViatura(viaturaId) {
    alert(`Abrindo histórico da viatura ${viaturaId}`);
    // Aqui você pode implementar a lógica para abrir um modal com histórico
}

// Função para filtrar viaturas no mapa
function filtrarViaturasNoMapa(status) {
    markers.forEach((marker, index) => {
        if (status === '' || viaturasPosicoes[index].status === status) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
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
            }
            
            // Atualizar marcador
            if (markers[index]) {
                markers[index].setPosition({
                    lat: viatura.latitude,
                    lng: viatura.longitude
                });
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
