<?php
// API para gerar KPIs
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

try {
    if ($method === 'GET') {
        $mes = isset($_GET['mes']) ? $_GET['mes'] : date('m');
        $ano = isset($_GET['ano']) ? $_GET['ano'] : date('Y');
        
        // Disponibilidade da Frota
        $sql_disponibilidade = 'SELECT COUNT(*) as total, SUM(CASE WHEN status = "operacao" THEN 1 ELSE 0 END) as operacao FROM viaturas';
        $stmt = $conexao->prepare($sql_disponibilidade);
        $stmt->execute();
        $resultado_disponibilidade = $stmt->fetch(PDO::FETCH_ASSOC);
        $disponibilidade = ($resultado_disponibilidade['total'] > 0) ? ($resultado_disponibilidade['operacao'] / $resultado_disponibilidade['total']) * 100 : 0;
        
        // Tempo Médio de Reparo (MTTR)
        $sql_mttr = 'SELECT AVG(tempo_parada) as media_tempo FROM historico_manutencao';
        $stmt = $conexao->prepare($sql_mttr);
        $stmt->execute();
        $resultado_mttr = $stmt->fetch(PDO::FETCH_ASSOC);
        $mttr = $resultado_mttr['media_tempo'] ?? 0;
        
        // Tempo Médio Entre Falhas (MTBF)
        $sql_mtbf = 'SELECT AVG(hm.tempo_parada) as media_intervalo FROM historico_manutencao hm';
        $stmt = $conexao->prepare($sql_mtbf);
        $stmt->execute();
        $resultado_mtbf = $stmt->fetch(PDO::FETCH_ASSOC);
        $mtbf = $resultado_mtbf['media_intervalo'] ?? 0;
        
        // Custo por Viatura
        $sql_custo = 'SELECT SUM(custo) as total_custo FROM historico_manutencao WHERE MONTH(data_realizacao) = ? AND YEAR(data_realizacao) = ?';
        $stmt = $conexao->prepare($sql_custo);
        $stmt->execute([$mes, $ano]);
        $resultado_custo = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_custo = $resultado_custo['total_custo'] ?? 0;
        $custo_por_viatura = ($resultado_disponibilidade['total'] > 0) ? $total_custo / $resultado_disponibilidade['total'] : 0;
        
        echo json_encode([
            'success' => true,
            'data' => [
                'disponibilidade_frota' => round($disponibilidade, 2),
                'tempo_medio_reparo' => round($mttr, 2),
                'tempo_medio_entre_falhas' => round($mtbf, 2),
                'custo_por_viatura' => round($custo_por_viatura, 2),
                'mes' => $mes,
                'ano' => $ano
            ]
        ]);
    }
    
    elseif ($method === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $sql = 'INSERT INTO kpis (mes, ano, disponibilidade_frota, tempo_medio_reparo, tempo_medio_entre_falhas, custo_por_viatura) 
                VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
                disponibilidade_frota = ?, tempo_medio_reparo = ?, tempo_medio_entre_falhas = ?, custo_por_viatura = ?';
        
        $stmt = $conexao->prepare($sql);
        $resultado = $stmt->execute([
            $dados['mes'],
            $dados['ano'],
            $dados['disponibilidade_frota'],
            $dados['tempo_medio_reparo'],
            $dados['tempo_medio_entre_falhas'],
            $dados['custo_por_viatura'],
            $dados['disponibilidade_frota'],
            $dados['tempo_medio_reparo'],
            $dados['tempo_medio_entre_falhas'],
            $dados['custo_por_viatura']
        ]);
        
        if ($resultado) {
            echo json_encode(['success' => true, 'message' => 'KPI salvo com sucesso!']);
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
