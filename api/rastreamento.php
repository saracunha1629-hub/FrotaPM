<?php
// API para gerenciar Rastreamento em Tempo Real
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

try {
    if ($method === 'GET') {
        $viatura_id = isset($_GET['viatura_id']) ? $_GET['viatura_id'] : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        
        $sql = 'SELECT rtr.*, v.numero, v.placa, v.modelo FROM rastreamento_tempo_real rtr 
                LEFT JOIN viaturas v ON rtr.viatura_id = v.id WHERE 1=1';
        
        if ($viatura_id) {
            $sql .= ' AND rtr.viatura_id = ' . intval($viatura_id);
        }
        
        if ($status) {
            $sql .= ' AND rtr.status = ' . $conexao->quote($status);
        }
        
        $sql .= ' ORDER BY rtr.data_atualizacao DESC';
        
        $stmt = $conexao->prepare($sql);
        $stmt->execute();
        
        $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $dados]);
    }
    
    elseif ($method === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        // Verificar se já existe registro para esta viatura
        $sql_check = 'SELECT id FROM rastreamento_tempo_real WHERE viatura_id = ?';
        $stmt_check = $conexao->prepare($sql_check);
        $stmt_check->execute([$dados['viatura_id']]);
        $existe = $stmt_check->fetch();
        
        if ($existe) {
            // Atualizar
            $sql = 'UPDATE rastreamento_tempo_real SET latitude = ?, longitude = ?, velocidade = ?, quilometragem = ?, status = ? 
                    WHERE viatura_id = ?';
            $stmt = $conexao->prepare($sql);
            $resultado = $stmt->execute([
                $dados['latitude'],
                $dados['longitude'],
                $dados['velocidade'] ?? 0,
                $dados['quilometragem'] ?? 0,
                $dados['status'],
                $dados['viatura_id']
            ]);
        } else {
            // Inserir
            $sql = 'INSERT INTO rastreamento_tempo_real (viatura_id, latitude, longitude, velocidade, quilometragem, status) 
                    VALUES (?, ?, ?, ?, ?, ?)';
            $stmt = $conexao->prepare($sql);
            $resultado = $stmt->execute([
                $dados['viatura_id'],
                $dados['latitude'],
                $dados['longitude'],
                $dados['velocidade'] ?? 0,
                $dados['quilometragem'] ?? 0,
                $dados['status']
            ]);
        }
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Posição atualizada!']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
