# FrotaPM - Gestão de Frota da Polícia Militar de Blumenau

## Instalação e Configuração

### Pré-requisitos
- PHP 7.4+
- MySQL 5.7+
- Servidor Web (Apache, Nginx, etc.)
- Google Maps API Key

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/saracunha1629-hub/FrotaPM.git
   cd FrotaPM
   ```

2. **Configure o banco de dados**
   - Abra `database/schema.sql` no MySQL
   - Execute o script para criar o banco de dados e tabelas

3. **Configure as variáveis de ambiente**
   - Edite `config/config.php`
   - Atualize as credenciais do banco de dados
   - Insira sua Google Maps API Key

4. **Permissões de pasta**
   ```bash
   chmod 755 uploads/
   chmod 755 logs/
   ```

5. **Acesse o sistema**
   - Abra `http://localhost/FrotaPM` no navegador
   - Use as credenciais padrão:
     - Email: admin@frotapm.com
     - Senha: admin123

## Estrutura do Projeto

```
FrotaPM/
├└ index.html                 # Página principal
├└ css/
│  ├└ style.css               # Estilos gerais
│  └└ dashboard.css           # Estilos do dashboard
├└ js/
│  ├└ main.js                # Lógica principal
│  └└ maps.js                # Integração Google Maps
├└ api/
│  ├└ viaturas.php           # CRUD de Viaturas
│  ├└ ordens_servico.php     # CRUD de Ordens de Serviço
│  ├└ rastreamento.php       # API de Rastreamento
│  ├└ kpis.php               # Cálculo de KPIs
│  ├└ relatorios.php         # Geração de Relatórios
│  └└ authentication.php      # Login e Autenticação
├└ config/
│  └└ config.php             # Configurações do sistema
├└ database/
│  └└ schema.sql             # Schema do banco de dados
├└ uploads/                # Pasta para uploads
└└ README.md                # Este arquivo
```

## Funcionalidades Principais

### 1. Dashboard
- Visão geral da frota
- Indicadores em tempo real
- Alertas de manutenção
- Gráficos de desempenho

### 2. Cadastro de Viaturas
- CRUD completo de viaturas
- Controle de status (Operação, Manutenção, Indisponível)
- Rastreamento de revisesões
- Editar, deletar e confirmar ações

### 3. Plano de Manutenção Preventiva
- Agendamento de manutenções
- Alertas por cores (🟢 🟡 🔴)
- Histórico de frequências
- Gerenciamento de status

### 4. Ordens de Serviço
- Criação e acompanhamento de OS
- Registro de problemas e soluções
- Controle de custos
- Impressão de relatórios
- Botões: Abrir, Finalizar, Deletar, Editar

### 5. Histórico de Manutenção
- Registro completo de serviços realizados
- Custos acumulados
- Peças substituidas
- Tempo de indisponibilidade
- Opções de visualizar detalhes e deletar

### 6. Rastreamento em Tempo Real
- Mapa interativo com Google Maps
- Localização GPS das viaturas
- Filtro por status
- Velocidade e quilometragem em tempo real
- Histórico de rotas

### 7. Indicadores de Desempenho (KPIs)
- Disponibilidade da Frota
- Tempo Médio de Reparo (MTTR)
- Tempo Médio Entre Falhas (MTBF)
- Custo por Viatura

### 8. Relatórios
- Viaturas em manutenção
- Custos mensais
- Histórico por viatura
- Manutenções vencidas
- Disponibilidade da frota
- Exportação em PDF e Excel

## Controle de Acesso

### Administrador
- Cadastro de usuários
- Configurações do sistema
- Acesso total

### Gestor
- Aprovação de manutenções
- Emissão de relatórios
- Visualização de rastreamento

### Mecânico
- Atualização de ordens de serviço
- Registro de manutenções

### Policial
- Consulta de informações da viatura
- Solicitação de manutenção

## APIs

### Viaturas
- `GET /api/viaturas.php` - Listar todas as viaturas
- `GET /api/viaturas.php?id=1` - Obter viatura específica
- `POST /api/viaturas.php` - Criar nova viatura
- `PUT /api/viaturas.php` - Atualizar viatura
- `DELETE /api/viaturas.php` - Deletar viatura

### Ordens de Serviço
- `GET /api/ordens_servico.php` - Listar ordens
- `POST /api/ordens_servico.php` - Criar ordem
- `PUT /api/ordens_servico.php` - Atualizar ordem
- `DELETE /api/ordens_servico.php` - Deletar ordem

### Rastreamento
- `GET /api/rastreamento.php` - Obter posições
- `POST /api/rastreamento.php` - Atualizar posição

### KPIs
- `GET /api/kpis.php` - Obter KPIs do período
- `POST /api/kpis.php` - Salvar KPIs

### Relatórios
- `GET /api/relatorios.php?tipo=manutencao&formato=pdf` - Relatório em PDF
- `GET /api/relatorios.php?tipo=custos&formato=excel` - Relatório em Excel

### Autenticação
- `POST /api/authentication.php?acao=login` - Fazer login
- `POST /api/authentication.php?acao=logout` - Fazer logout
- `POST /api/authentication.php?acao=registrar` - Registrar novo usuário

## Tecnologias Utilizadas

- **Front-end**: HTML5, CSS3, JavaScript
- **Back-end**: PHP 7.4+
- **Banco de Dados**: MySQL
- **APIs**: Google Maps
- **Bibliotecas**: Chart.js (gráficos), Font Awesome (ícones)

## Contribuindo

Para contribuir com o projeto, por favor:
1. Faça um Fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte, abra uma issue no repositório ou entre em contato com o time de desenvolvimento.

## Autor

**Sara Cunha**
- GitHub: [@saracunha1629-hub](https://github.com/saracunha1629-hub)
- Email: saracunha1629@gmail.com

---

**FrotaPM v1.0.0** - Sistema de Gestão de Frota da Polícia Militar de Blumenau
