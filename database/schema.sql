-- Banco de Dados FrotaPM - Gestão de Frota da Polícia Militar de Blumenau

CREATE DATABASE IF NOT EXISTS frotapm;
USE frotapm;

-- Tabela de Viaturas
CREATE TABLE viaturas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(20) UNIQUE NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    quilometragem INT DEFAULT 0,
    unidade_responsavel VARCHAR(100),
    status ENUM('operacao', 'manutencao', 'indisponivel') DEFAULT 'operacao',
    data_ultima_revisao DATE,
    data_proxima_revisao DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Plano de Manutenção Preventiva
CREATE TABLE manutencao_preventiva (
    id INT PRIMARY KEY AUTO_INCREMENT,
    viatura_id INT NOT NULL,
    tipo_manutencao VARCHAR(100) NOT NULL,
    frequencia VARCHAR(100) NOT NULL,
    data_agendada DATE NOT NULL,
    status ENUM('pendente', 'realizada', 'vencida') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ordens de Serviço
CREATE TABLE ordens_servico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_os VARCHAR(20) UNIQUE NOT NULL,
    viatura_id INT NOT NULL,
    data_abertura DATE NOT NULL,
    problema_identificado TEXT,
    servico_executado TEXT,
    responsavel_manutencao VARCHAR(100),
    pecas_utilizadas TEXT,
    custo DECIMAL(10, 2) DEFAULT 0,
    tempo_parada INT DEFAULT 0,
    status ENUM('aberta', 'finalizada', 'cancelada') DEFAULT 'aberta',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Manutenção
CREATE TABLE historico_manutencao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    viatura_id INT NOT NULL,
    tipo_manutencao VARCHAR(100) NOT NULL,
    data_realizacao DATE NOT NULL,
    responsavel VARCHAR(100),
    pecas_substituidas TEXT,
    custo DECIMAL(10, 2) DEFAULT 0,
    tempo_parada INT DEFAULT 0,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Rastreamento em Tempo Real
CREATE TABLE rastreamento_tempo_real (
    id INT PRIMARY KEY AUTO_INCREMENT,
    viatura_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    velocidade INT DEFAULT 0,
    quilometragem INT DEFAULT 0,
    status ENUM('operacao', 'manutencao', 'indisponivel', 'parada') DEFAULT 'operacao',
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE,
    INDEX (viatura_id),
    INDEX (data_atualizacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    funcao ENUM('administrador', 'gestor', 'mecanico', 'policial') DEFAULT 'policial',
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de KPIs (Indicadores)
CREATE TABLE kpis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mes INT NOT NULL,
    ano INT NOT NULL,
    disponibilidade_frota DECIMAL(5, 2),
    tempo_medio_reparo DECIMAL(10, 2),
    tempo_medio_entre_falhas DECIMAL(10, 2),
    custo_por_viatura DECIMAL(10, 2),
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (mes, ano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Auditoria
CREATE TABLE logs_auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    acao VARCHAR(255) NOT NULL,
    tabela_afetada VARCHAR(100),
    registro_id INT,
    dados_antigos JSON,
    dados_novos JSON,
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados de exemplo
INSERT INTO viaturas (numero, placa, modelo, ano, quilometragem, unidade_responsavel, status, data_ultima_revisao, data_proxima_revisao) VALUES
('PM-001', 'ABC-1234', 'Chevrolet S10', 2020, 52340, 'Patrulha Centro', 'operacao', '2024-06-15', '2024-09-15'),
('PM-002', 'XYZ-5678', 'Ford Ranger', 2021, 38210, 'Patrulha Norte', 'manutencao', '2024-06-10', '2024-09-10'),
('PM-008', 'DEF-5678', 'Volkswagen Kombi', 2019, 61200, 'Transporte', 'operacao', '2024-05-20', '2024-08-20'),
('PM-015', 'GHI-9012', 'Fiat Uno', 2018, 58500, 'Investigação', 'operacao', '2024-06-01', '2024-09-01'),
('PM-022', 'JKL-3456', 'Hyundai HB20', 2022, 45300, 'Patrulha Sul', 'operacao', '2024-06-25', '2024-09-25');

INSERT INTO ordens_servico (numero_os, viatura_id, data_abertura, problema_identificado, servico_executado, responsavel_manutencao, custo, status) VALUES
('OS-001', 1, '2024-07-18', 'Troca de óleo', 'Óleo 10W-30 (5L)', 'João Silva', 150.00, 'aberta'),
('OS-002', 2, '2024-07-17', 'Revisão dos freios', 'Pastilhas e discos', 'Maria Santos', 280.00, 'finalizada');

INSERT INTO historico_manutencao (viatura_id, tipo_manutencao, data_realizacao, responsavel, pecas_substituidas, custo, tempo_parada) VALUES
(1, 'Troca de óleo', '2024-06-15', 'João Silva', 'Óleo 10W-30 (5L)', 150.00, 150),
(1, 'Alinhamento e balanceamento', '2024-06-01', 'Maria Santos', 'Rolamentos, Discos', 320.00, 195);

INSERT INTO usuarios (nome, email, senha, funcao, status) VALUES
('Admin User', 'admin@frotapm.com', SHA2('admin123', 256), 'administrador', 'ativo'),
('João Silva', 'joao@frotapm.com', SHA2('joao123', 256), 'mecanico', 'ativo'),
('Maria Santos', 'maria@frotapm.com', SHA2('maria123', 256), 'gestor', 'ativo'),
('Pedro Oliveira', 'pedro@frotapm.com', SHA2('pedro123', 256), 'policial', 'ativo');

-- Criar índices para melhor performance
CREATE INDEX idx_viatura_status ON viaturas(status);
CREATE INDEX idx_os_viatura ON ordens_servico(viatura_id);
CREATE INDEX idx_os_status ON ordens_servico(status);
CREATE INDEX idx_manutencao_viatura ON manutencao_preventiva(viatura_id);
CREATE INDEX idx_manutencao_status ON manutencao_preventiva(status);
CREATE INDEX idx_historico_viatura ON historico_manutencao(viatura_id);
CREATE INDEX idx_usuario_funcao ON usuarios(funcao);
