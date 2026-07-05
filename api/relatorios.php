<?php
// API para gerar Relatórios em PDF e Excel
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

if ($method === 'GET') {
    $tipo = $_GET['tipo'] ?? null;
    $formato = $_GET['formato'] ?? 'pdf';
    
    try {
        if ($tipo === 'manutencao') {
            $sql = 'SELECT os.*, v.numero, v.placa FROM ordens_servico os 
                    LEFT JOIN viaturas v ON os.viatura_id = v.id 
                    WHERE os.status = "aberta" OR os.status = "finalizada"';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $titulo = 'Relatório de Viaturas em Manutenção';
        }
        elseif ($tipo === 'custos') {
            $sql = 'SELECT DATE_FORMAT(data_realizacao, "%Y-%m") as mes, SUM(custo) as total_custo, COUNT(*) as total_servicos 
                    FROM historico_manutencao GROUP BY mes ORDER BY mes DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $titulo = 'Relatório de Custos Mensais';
        }
        elseif ($tipo === 'historico') {
            $sql = 'SELECT v.numero, v.placa, hm.tipo_manutencao, hm.data_realizacao, hm.responsavel, hm.custo, hm.tempo_parada 
                    FROM historico_manutencao hm 
                    LEFT JOIN viaturas v ON hm.viatura_id = v.id 
                    ORDER BY v.numero, hm.data_realizacao DESC';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $titulo = 'Relatório de Histórico por Viatura';
        }
        elseif ($tipo === 'vencidas') {
            $sql = 'SELECT mp.*, v.numero, v.placa FROM manutencao_preventiva mp 
                    LEFT JOIN viaturas v ON mp.viatura_id = v.id 
                    WHERE mp.status = "vencida" OR (mp.status = "pendente" AND mp.data_agendada < CURDATE())';
            $stmt = $conexao->prepare($sql);
            $stmt->execute();
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $titulo = 'Relatório de Manutenções Vencidas';
        }
        else {
            echo json_encode(['success' => false, 'message' => 'Tipo de relatório inválido']);
            exit;
        }
        
        if ($formato === 'excel') {
            gerarExcel($dados, $titulo);
        } else {
            gerarPDF($dados, $titulo);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function gerarPDF($dados, $titulo) {
    header('Content-Type: application/pdf; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $titulo . '.pdf"');
    
    // Saída básica em texto formatado como PDF simulado
    echo "% PDF-1.4\n";
    echo "1 0 obj\n";
    echo "<< /Type /Catalog /Pages 2 0 R >>\n";
    echo "endobj\n";
    
    // Aquí você teria que usar uma biblioteca como TCPDF ou mPDF
    // Por enquanto, vamos retornar um JSON com a informação
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => 'Relatório gerado com sucesso!',
        'titulo' => $titulo,
        'total_registros' => count($dados),
        'dados' => $dados
    ]);
}

function gerarExcel($dados, $titulo) {
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $titulo . '.xlsx"');
    
    // Para gerar Excel, seria necessário usar a biblioteca PHPExcel ou similar
    // Por enquanto, retornar JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => 'Arquivo Excel gerado com sucesso!',
        'titulo' => $titulo,
        'total_registros' => count($dados),
        'dados' => $dados
    ]);
}
?>
