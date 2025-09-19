# 🚀 By Sales - Backend API

API REST para plataforma de e-commerce construída com Node.js, TypeScript e PostgreSQL.

## 📋 Índice

- [🛠️ Tecnologias](#️-tecnologias)
- [🏗️ Arquitetura](#️-arquitetura)
- [📊 Banco de Dados](#-banco-de-dados)
- [🚀 Instalação](#-instalação)
- [📡 Endpoints](#-endpoints)
- [🔒 Autenticação](#-autenticação)
- [🛡️ Segurança](#️-segurança)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.5+ | Tipagem estática |
| **Express** | 4.21+ | Framework web |
| **TypeORM** | 0.3+ | ORM para TypeScript |
| **PostgreSQL** | 14+ | Banco de dados |
| **JWT** | 9.0+ | Autenticação |
| **Bcrypt** | 2.4+ | Hash de senhas |
| **Zod** | 4.1+ | Validação de schemas |
| **Helmet** | - | Segurança HTTP |

---

## 🏗️ Arquitetura

### **Clean Architecture**
```
src/
├── 🏛️ domain/           # Entidades e regras de negócio
│   ├── entities/        # Entidades do domínio
│   └── repositories/    # Interfaces dos repositórios
├── 🔧 application/      # Casos de uso
│   └── useCases/        # Lógica de aplicação
├── 🌐 http/             # Camada de apresentação
│   ├── controllers/     # Controladores REST
│   ├── middlewares/     # Middlewares HTTP
│   └── routes/          # Definição de rotas
├── 🗄️ infra/            # Infraestrutura
│   └── database/        # Configuração do banco
└── 🚀 main/             # Configuração do servidor
```

### **Princípios Aplicados**
- **Dependency Inversion**: Interfaces definem contratos
- **Single Responsibility**: Cada classe tem uma responsabilidade
- **Open/Closed**: Extensível sem modificação
- **Domain-Driven Design**: Modelagem focada no domínio

---

## 📊 Banco de Dados

### **Estrutura Principal**
- 👥 **users** - Usuários do sistema
- 🏷️ **categories** - Categorias de produtos  
- 🛍️ **products** - Catálogo de produtos
- 🛒 **cart** - Carrinho de compras
- 📦 **orders** - Pedidos realizados
- 📋 **order_items** - Itens dos pedidos

> 📖 **Documentação Completa**: [DATABASE.md](../DATABASE.md)

---

## 🚀 Instalação

### **1. Pré-requisitos**
```bash
Node.js >= 18.0.0
PostgreSQL >= 14.0
npm >= 6.13.4
```

### **2. Configuração**
```bash
# Clone e instale dependências
git clone <repository>
cd backend
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### **3. Banco de Dados**
```bash
# Execute as migrations
npm run migration:run

# Verificar status
npm run typeorm -- migration:show
```

### **4. Execução**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

**🌐 Servidor**: http://localhost:3334

---

## 📡 Endpoints

### **🔐 Autenticação**
```http
POST   /api/auth/register     # Cadastro de usuário
POST   /api/auth/login        # Login
GET    /api/auth/verify-email # Verificação de email
```

### **🛍️ Produtos**
```http
GET    /api/products          # Listar produtos
GET    /api/products/:id      # Buscar produto
GET    /api/products/category/:categoryId # Produtos por categoria
POST   /api/products          # Criar produto (admin)
```

### **🛒 Carrinho**
```http
GET    /api/cart              # Obter carrinho
POST   /api/cart              # Adicionar item
PUT    /api/cart/:id          # Atualizar quantidade
DELETE /api/cart/:id          # Remover item
```

### **🏷️ Categorias**
```http
GET    /api/categories        # Listar categorias
POST   /api/categories        # Criar categoria (admin)
```

---

## 🔒 Autenticação

### **JWT Token**
```typescript
// Header Authorization
Authorization: Bearer <jwt_token>

// Payload do Token
{
  userId: string;
  role: 'admin' | 'customer';
  iat: number;
  exp: number;
}
```

### **Middlewares**
- `authMiddleware` - Validação de token JWT
- `adminMiddleware` - Verificação de permissão admin

---

## 🛡️ Segurança

### **Implementações**
- ✅ **Rate Limiting** - Proteção contra ataques de força bruta
- ✅ **Input Sanitization** - Prevenção de XSS
- ✅ **Helmet** - Headers de segurança HTTP
- ✅ **CORS** - Controle de origem cruzada
- ✅ **Password Hashing** - Bcrypt com salt 12
- ✅ **JWT Validation** - Verificação rigorosa de tokens
- ✅ **Input Validation** - Zod schemas para validação

### **Rate Limits**
```typescript
// Autenticação: 5 tentativas por 15 minutos
authRateLimiter: 5 requests / 15min

// Geral: 100 requests por 15 minutos  
generalRateLimiter: 100 requests / 15min
```

### **Validação de Entrada**
```typescript
// Exemplo: Login Schema
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor com hot reload

# Build
npm run build            # Compilar TypeScript
npm start               # Executar versão compilada

# Banco de Dados
npm run migration:create # Criar nova migration
npm run migration:run    # Executar migrations
npm run migration:revert # Reverter última migration
npm run typeorm         # CLI do TypeORM
```

---

## 📝 Variáveis de Ambiente

```bash
# Servidor
PORT=3334
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=meuusuario
DB_PASSWORD=minhasenha
DB_DATABASE=by__sales

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (N8N Integration)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/email-verification
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Coverage
npm run test:coverage
```

---

## 📈 Performance

### **Otimizações**
- Índices automáticos em foreign keys
- Conexão pool do PostgreSQL
- Middleware de compressão
- Cache de consultas frequentes (futuro)

### **Monitoramento**
- Logs estruturados
- Métricas de performance (futuro)
- Health checks (futuro)

---

## 🚀 Deploy

### **Docker** (Futuro)
```dockerfile
# Dockerfile exemplo
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3334
CMD ["npm", "start"]
```

### **Variáveis de Produção**
```bash
NODE_ENV=production
JWT_SECRET=<strong_secret>
DB_SSL=true
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

---

*Documentação atualizada em: Janeiro 2025*