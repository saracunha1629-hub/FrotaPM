<?php
// API para gerenciar Manutenção Preventiva
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

try {
    if ($method === 'GET') {
        // Obter todas as manutenções ou uma específica
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $viatura_id = isset($_GET['viatura_id']) ? $_GET['viatura_id'] : null;
        
        if ($id) {
            $sql = 'SELECT mp.*, v.numero FROM manutencao_preventiva mp LEFT JOIN viaturas v ON mp.viatura_id = v.id WHERE mp.id = ?';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$id]);
        } elseif ($viatura_id) {
            $sql = 'SELECT mp.*, v.numero FROM manutencao_preventiva mp LEFT JOIN viaturas v ON mp.viatura_id = v.id WHERE mp.viatura_id = ? ORDER BY mp.data_agendada DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$viatura_id]);
        } else {
            $sql = 'SELECT mp.*, v.numero FROM manutencao_preventiva mp LEFT JOIN viaturas v ON mp.viatura_id = v.id ORDER BY mp.data_agendada DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
        }
        
        $manutencoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $manutencoes]);
    }
    
    elseif ($method === 'POST') {
        // Adicionar nova manutenção
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $sql = 'INSERT INTO manutencao_preventiva (viatura_id, tipo_manutencao, frequencia, data_agendada, status) 
                VALUES (?, ?, ?, ?, ?)';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['viatura_id'],
            $dados['tipo_manutencao'] ?? null,
            $dados['frequencia'] ?? null,
            $dados['data_agendada'] ?? date('Y-m-d'),
            $dados['status'] ?? 'pendente'
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Manutenção adicionada com sucesso!', 'id' => $conexao->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar manutenção']);
        }
    }
    
    elseif ($method === 'PUT') {
        // Atualizar manutenção
        $dados = json_decode(file_get_contents('php://input'), true);
        $id = $dados['id'];
        
        $sql = 'UPDATE manutencao_preventiva SET tipo_manutencao = ?, frequencia = ?, data_agendada = ?, status = ? WHERE id = ?';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['tipo_manutencao'],
            $dados['frequencia'],
            $dados['data_agendada'],
            $dados['status'],
            $id
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Manutenção atualizada com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar manutenção']);
        }
    }
    
    elseif ($method === 'DELETE') {
        // Deletar manutenção
        $dados = json_decode(file_get_contents('php://input'), true);
        $id = $dados['id'];
        
        $sql = 'DELETE FROM manutencao_preventiva WHERE id = ?';
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([$id]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Manutenção deletada com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao deletar manutenção']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
