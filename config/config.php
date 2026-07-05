<?php
// Configurações do Sistema FrotaPM

// Informações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'frotapm');

// Configuração de Conexão
define('DB_CHARSET', 'utf8mb4');

// Informações da Aplicação
define('APP_NAME', 'FrotaPM');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/FrotaPM');

// Configurações de Segurança
define('JWT_SECRET', 'sua_chave_secreta_aqui_123456');
define('SESSION_TIMEOUT', 3600); // 1 hora em segundos
define('PASSWORD_MIN_LENGTH', 8);

// Google Maps API
define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY');

// Configurações de Email
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_USER', 'seu_email@gmail.com');
define('MAIL_PASSWORD', 'sua_senha_app');
define('MAIL_FROM', 'noreply@frotapm.com');

// Configurações de Upload
define('MAX_UPLOAD_SIZE', 5242880); // 5MB em bytes
define('UPLOAD_DIR', 'uploads/');
define('ALLOWED_EXTENSIONS', ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']);

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Modo Debug
define('DEBUG_MODE', true);

// Roles e Permissões
define('ROLES', [
    'administrador' => [
        'cadastrar_usuarios',
        'editar_usuarios',
        'deletar_usuarios',
        'configuracoes_sistema',
        'relatorios_completos',
        'auditoria',
        'cadastrar_viaturas',
        'editar_viaturas',
        'deletar_viaturas',
        'cadastrar_manutencao',
        'editar_manutencao',
        'deletar_manutencao',
        'gerar_relatorios',
        'exportar_dados'
    ],
    'gestor' => [
        'visualizar_viaturas',
        'aprovar_manutencoes',
        'emitir_relatorios',
        'visualizar_rastreamento',
        'visualizar_kpis',
        'exportar_relatorios'
    ],
    'mecanico' => [
        'atualizar_ordens_servico',
        'registrar_manutencoes',
        'visualizar_viaturas',
        'visualizar_historico'
    ],
    'policial' => [
        'consultar_viaturas',
        'solicitar_manutencao',
        'visualizar_status_viatura'
    ]
]);

// Função de Conexão com Banco de Dados
function conectarBancoDados() {
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $conexao = new PDO($dsn, DB_USER, DB_PASSWORD);
        $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexao;
    } catch (PDOException $e) {
        if (DEBUG_MODE) {
            die('Erro de Conexão: ' . $e->getMessage());
        } else {
            die('Erro na conexão com o banco de dados.');
        }
    }
}

// Headers de Segurança
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Iniciar Sessão
session_start();
?>
