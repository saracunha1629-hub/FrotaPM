<?php
// API de Autenticação
require_once '../config/config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conexao = conectarBancoDados();

if ($method === 'POST') {
    $acao = $_POST['acao'] ?? $_GET['acao'] ?? null;
    
    try {
        if ($acao === 'login') {
            $email = $_POST['email'] ?? null;
            $senha = $_POST['senha'] ?? null;
            
            if (!$email || !$senha) {
                echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
                exit;
            }
            
            $sql = 'SELECT * FROM usuarios WHERE email = ? AND status = "ativo"';
            $stmt = $conexao->prepare($sql);
            $stmt->execute([$email]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($usuario && hash_equals($usuario['senha'], hash('sha256', $senha))) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_funcao'] = $usuario['funcao'];
                $_SESSION['usuario_email'] = $usuario['email'];
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Login realizado com sucesso!',
                    'usuario' => [
                        'id' => $usuario['id'],
                        'nome' => $usuario['nome'],
                        'email' => $usuario['email'],
                        'funcao' => $usuario['funcao']
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Email ou senha inválidos']);
            }
        }
        
        elseif ($acao === 'logout') {
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso!']);
        }
        
        elseif ($acao === 'registrar') {
            $nome = $_POST['nome'] ?? null;
            $email = $_POST['email'] ?? null;
            $senha = $_POST['senha'] ?? null;
            $funcao = $_POST['funcao'] ?? 'policial';
            
            if (!$nome || !$email || !$senha) {
                echo json_encode(['success' => false, 'message' => 'Nome, email e senha são obrigatórios']);
                exit;
            }
            
            if (strlen($senha) < PASSWORD_MIN_LENGTH) {
                echo json_encode(['success' => false, 'message' => 'Senha deve ter no mínimo ' . PASSWORD_MIN_LENGTH . ' caracteres']);
                exit;
            }
            
            $sql = 'INSERT INTO usuarios (nome, email, senha, funcao, status) VALUES (?, ?, ?, ?, "ativo")';
            $stmt = $conexao->prepare($sql);
            
            try {
                $resultado = $stmt->execute([
                    $nome,
                    $email,
                    hash('sha256', $senha),
                    $funcao
                ]);
                
                if ($resultado) {
                    echo json_encode(['success' => true, 'message' => 'Usuário registrado com sucesso!']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Erro ao registrar usuário']);
                }
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate') !== false) {
                    echo json_encode(['success' => false, 'message' => 'Email já está registrado']);
                } else {
                    throw $e;
                }
            }
        }
        
        else {
            echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
