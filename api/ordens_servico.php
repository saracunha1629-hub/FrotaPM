<?php
// API para gerenciar Ordens de Serviço
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $viatura_id = isset($_GET['viatura_id']) ? $_GET['viatura_id'] : null;
        
        if ($id) {
            $sql = 'SELECT * FROM ordens_servico WHERE id = ?';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$id]);
        } elseif ($viatura_id) {
            $sql = 'SELECT * FROM ordens_servico WHERE viatura_id = ? ORDER BY data_abertura DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$viatura_id]);
        } else {
            $sql = 'SELECT os.*, v.numero, v.placa FROM ordens_servico os LEFT JOIN viaturas v ON os.viatura_id = v.id ORDER BY os.data_abertura DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
        }
        
        $ordens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $ordens]);
    }
    
    elseif ($method === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        // Gerar número da OS
        $sql_numero = 'SELECT COUNT(*) as total FROM ordens_servico';
        $stmt_numero = $conexao->prepare($sql_numero);
        $stmt_numero->execute();
        $resultado_numero = $stmt_numero->fetch(PDO::FETCH_ASSOC);
        $numero_os = 'OS-' . str_pad($resultado_numero['total'] + 1, 4, '0', STR_PAD_LEFT);
        
        $sql = 'INSERT INTO ordens_servico (numero_os, viatura_id, data_abertura, problema_identificado, servico_executado, responsavel_manutencao, pecas_utilizadas, custo, tempo_parada, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $numero_os,
            $dados['viatura_id'],
            $dados['data_abertura'] ?? date('Y-m-d'),
            $dados['problema_identificado'] ?? null,
            $dados['servico_executado'] ?? null,
            $dados['responsavel_manutencao'] ?? null,
            $dados['pecas_utilizadas'] ?? null,
            $dados['custo'] ?? 0,
            $dados['tempo_parada'] ?? 0,
            'aberta'
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Ordem de serviço criada!', 'numero_os' => $numero_os]);
        }
    }
    
    elseif ($method === 'PUT') {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $sql = 'UPDATE ordens_servico SET problema_identificado = ?, servico_executado = ?, responsavel_manutencao = ?, pecas_utilizadas = ?, custo = ?, tempo_parada = ?, status = ? WHERE id = ?';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['problema_identificado'],
            $dados['servico_executado'],
            $dados['responsavel_manutencao'],
            $dados['pecas_utilizadas'],
            $dados['custo'],
            $dados['tempo_parada'],
            $dados['status'],
            $dados['id']
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Ordem de serviço atualizada!']);
        }
    }
    
    elseif ($method === 'DELETE') {
        $dados = json_decode(file_get_contents('php://input'), true);
        $sql = 'DELETE FROM ordens_servico WHERE id = ?';
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([$dados['id']]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Ordem de serviço deletada!']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
