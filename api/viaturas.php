<?php
// API para gerenciar Viaturas
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

try {
    if ($method === 'GET') {
        // Obter todas as viaturas ou uma específica
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if ($id) {
            $sql = 'SELECT * FROM viaturas WHERE id = ?';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$id]);
        } else {
            $sql = 'SELECT * FROM viaturas ORDER BY numero';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
        }
        
        $viaturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $viaturas]);
    }
    
    elseif ($method === 'POST') {
        // Adicionar nova viatura
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $sql = 'INSERT INTO viaturas (numero, placa, modelo, ano, quilometragem, unidade_responsavel, status, data_ultima_revisao, data_proxima_revisao) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['numero'],
            $dados['placa'],
            $dados['modelo'],
            $dados['ano'],
            $dados['quilometragem'] ?? 0,
            $dados['unidade_responsavel'] ?? null,
            $dados['status'] ?? 'operacao',
            $dados['data_ultima_revisao'] ?? null,
            $dados['data_proxima_revisao'] ?? null
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Viatura adicionada com sucesso!', 'id' => $conexao->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar viatura']);
        }
    }
    
    elseif ($method === 'PUT') {
        // Atualizar viatura
        $dados = json_decode(file_get_contents('php://input'), true);
        $id = $dados['id'];
        
        $sql = 'UPDATE viaturas SET numero = ?, placa = ?, modelo = ?, ano = ?, quilometragem = ?, unidade_responsavel = ?, status = ?, data_ultima_revisao = ?, data_proxima_revisao = ? WHERE id = ?';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['numero'],
            $dados['placa'],
            $dados['modelo'],
            $dados['ano'],
            $dados['quilometragem'],
            $dados['unidade_responsavel'],
            $dados['status'],
            $dados['data_ultima_revisao'],
            $dados['data_proxima_revisao'],
            $id
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Viatura atualizada com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar viatura']);
        }
    }
    
    elseif ($method === 'DELETE') {
        // Deletar viatura
        $dados = json_decode(file_get_contents('php://input'), true);
        $id = $dados['id'];
        
        $sql = 'DELETE FROM viaturas WHERE id = ?';
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([$id]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'Viatura deletada com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao deletar viatura']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
