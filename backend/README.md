# THêGADü — Backend (Node.js + MongoDB)

Sistema de controle de estoque com backend Node.js e banco de dados MongoDB Atlas.

---

## Como Configurar o MongoDB Atlas (Passo a Passo)

### 1. Criar Conta no MongoDB Atlas

1. Acesse [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Clique em **"Try Free"** (Experimentar Grátis)
3. Crie sua conta com email ou entre com Google
4. Preencha o formulário de boas-vindas e clique em **"Finish"**

### 2. Criar um Cluster (Servidor de Banco de Dados)

1. Após o login, você será direcionado para a tela de criação de cluster
2. Selecione **"M0 FREE"** (o plano gratuito — perfeito para começar)
3. Escolha o provedor de nuvem (pode deixar **AWS** que é o padrão)
4. Escolha a região mais próxima de você (ex: **São Paulo** se disponível, ou **Virginia**)
5. Dê um nome ao cluster (ex: `Cluster0`)
6. Clique em **"Create Deployment"**

### 3. Criar Usuário do Banco de Dados

Logo após criar o cluster, ele vai pedir para criar um usuário:

1. Em **"How would you like to authenticate?"**, selecione **"Username and Password"**
2. Crie um **Username** (ex: `admin`)
3. Crie uma **Password** segura (ex: `MinhaSenh@123`)
   - **IMPORTANTE**: Anote essa senha! Você vai precisar dela
   - Evite caracteres especiais como `@`, `#`, `%` na senha para evitar problemas de URL
4. Clique em **"Create Database User"**

### 4. Configurar Acesso à Rede (IP)

1. Na mesma tela (ou vá em **Network Access** no menu lateral)
2. Clique em **"Add My Current IP Address"** para adicionar seu IP
3. **OU** para permitir acesso de qualquer lugar (útil para testes):
   - Clique em **"Add IP Address"**
   - Digite `0.0.0.0/0` no campo
   - Clique em **"Confirm"**

### 5. Obter a String de Conexão

1. Vá em **"Database"** no menu lateral esquerdo
2. No seu cluster, clique em **"Connect"**
3. Selecione **"Drivers"**
4. Copie a string de conexão que vai parecer com:

```
mongodb+srv://admin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

5. **Substitua** `<password>` pela senha que você criou no passo 3
6. **Adicione** o nome do banco de dados `thegadu` antes do `?`:

```
mongodb+srv://admin:MinhaSenh@123@cluster0.abc123.mongodb.net/thegadu?retryWrites=true&w=majority
```

### 6. Configurar o Arquivo .env

1. Abra o arquivo `backend/.env`
2. Cole sua string de conexão no campo `MONGODB_URI`:

```
MONGODB_URI=mongodb+srv://admin:MinhaSenh@123@cluster0.abc123.mongodb.net/thegadu?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

3. Salve o arquivo

---

## Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- Conta no MongoDB Atlas configurada (passos acima)

### Instalação

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências (se ainda não instalou)
npm install
```

### Iniciar o Servidor

```bash
# Modo produção
npm start

# Modo desenvolvimento (reinicia automaticamente ao salvar)
npm run dev
```

### Acessar o Sistema

Após iniciar, abra no navegador:

- **Frontend**: [http://localhost:3000/entrada.html](http://localhost:3000/entrada.html)
- **API Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Endpoints da API

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/produtos` | Lista todos os produtos |
| `GET` | `/api/produtos?busca=termo` | Busca produtos por código, descrição ou fornecedor |
| `GET` | `/api/produtos/resumo` | Retorna total de peças, valor total e total de produtos |
| `GET` | `/api/produtos/:codigo` | Busca um produto pelo código |
| `POST` | `/api/produtos` | Adiciona produto (ou soma ao estoque se código já existe) |
| `PUT` | `/api/produtos/:codigo` | Atualiza dados de um produto |
| `DELETE` | `/api/produtos/:codigo` | Remove um produto do estoque |

**Exemplo — Adicionar produto (POST /api/produtos):**

```json
{
  "codigo": "TG-0001",
  "descricao": "Camiseta Oversized Preta",
  "fornecedor": "Distribuidora ABC",
  "quantidade": 10,
  "valor": 49.90
}
```

### Saídas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/saidas` | Lista todas as saídas |
| `GET` | `/api/saidas?busca=termo` | Busca saídas por código, descrição ou fornecedor |
| `POST` | `/api/saidas` | Registra uma saída de estoque |
| `DELETE` | `/api/saidas/:id` | Remove um registro de saída |

**Exemplo — Registrar saída (POST /api/saidas):**

```json
{
  "codigo": "TG-0001",
  "quantidade": 3,
  "motivo": "Venda"
}
```

**Motivos aceitos:** `Venda`, `Devolução ao Fornecedor`, `Perda/Avaria`, `Uso Interno`, `Outro`

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Verifica se a API está funcionando |

---

## Estrutura do Backend

```
backend/
├── server.js                  # Servidor Express principal
├── package.json               # Dependências do projeto
├── .env                       # Variáveis de ambiente (NÃO commitar!)
├── .env.example               # Exemplo do .env
├── .gitignore                 # Arquivos ignorados pelo Git
├── config/
│   └── database.js            # Conexão com MongoDB
├── models/
│   ├── Produto.js             # Modelo de dados do Produto
│   └── Saida.js               # Modelo de dados da Saída
├── controllers/
│   ├── produtoController.js   # Lógica de negócio dos Produtos
│   └── saidaController.js     # Lógica de negócio das Saídas
├── routes/
│   ├── produtos.js            # Rotas da API de Produtos
│   └── saidas.js              # Rotas da API de Saídas
├── middlewares/
│   └── errorHandler.js        # Tratamento centralizado de erros
└── validators/
    ├── produtoValidator.js    # Validação de dados de Produto
    └── saidaValidator.js      # Validação de dados de Saída
```

---

## Regras de Negócio Implementadas

1. **Upsert de Produtos**: Ao adicionar um produto com código já existente, a quantidade é somada e os demais dados atualizados
2. **Decremento Automático**: Ao registrar uma saída, a quantidade do produto é decrementada
3. **Remoção Automática**: Se a quantidade do produto chegar a zero após uma saída, ele é removido do estoque
4. **Validação de Estoque**: Não é possível registrar saída com quantidade maior que a disponível
5. **Código Único**: Cada produto tem um código único (case-insensitive, salvo em maiúsculas)
6. **Validação de Dados**: Todos os campos obrigatórios são validados no backend
7. **Motivos Predefinidos**: Saídas só aceitam motivos da lista: Venda, Devolução ao Fornecedor, Perda/Avaria, Uso Interno, Outro

---

## Resolução de Problemas

### "MONGODB_URI não definida"
- Verifique se o arquivo `.env` existe na pasta `backend/`
- Verifique se a variável `MONGODB_URI` está preenchida corretamente

### "Falha ao conectar ao MongoDB"
- Verifique se a senha no `.env` está correta
- Verifique se seu IP está liberado no MongoDB Atlas (Network Access)
- Verifique se o cluster está ativo (pode demorar alguns minutos após criar)

### "ECONNREFUSED" ou "Timeout"
- Verifique sua conexão com a internet
- Verifique se não há firewall bloqueando a porta 27017

### Porta 3000 já em uso
- Altere a porta no `.env`: `PORT=3001`
- Ou encerre o processo que está usando a porta
