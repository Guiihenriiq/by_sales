# 🚀 By Sales - Instruções de Execução

## 📋 Pré-requisitos

- Node.js >= 18.0.0 (testado com 18.20.8)
- npm >= 6.13.4
- PostgreSQL >= 14.0

**Nota**: O projeto foi ajustado para funcionar perfeitamente com Node.js 18.x

## 🗄️ Configuração do Banco de Dados

1. **Instale o PostgreSQL** e crie um banco de dados:
```sql
CREATE DATABASE ecommerce_db;
```

2. **Configure as variáveis de ambiente** no backend:
```bash
cd backend
cp .env.example .env
```

3. **Edite o arquivo .env** com suas configurações:
```env
# Server Configuration
PORT=3333
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=ecommerce_db

# JWT Configuration
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui

# Upload Configuration
UPLOAD_PATH=./uploads
```

## 🔧 Instalação e Execução

### 1. Backend (API)

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Executar migrações do banco de dados
npm run migration:run

# Iniciar o servidor de desenvolvimento
npm run dev
```

O backend estará rodando em: **http://localhost:3333**

### 2. Frontend Administrativo (Quasar/Vue.js)

```bash
# Navegar para o diretório do frontend administrativo
cd front-end

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O painel administrativo estará rodando em: **http://localhost:9000**

### 3. E-commerce (React)

```bash
# Navegar para o diretório do e-commerce
cd by-sales-ecomerce

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O e-commerce estará rodando em: **http://localhost:5173**

## 🎯 Funcionalidades Implementadas

### 🔧 Backend (Node.js + Express + TypeORM)
- ✅ Autenticação JWT
- ✅ CRUD de Usuários
- ✅ CRUD de Produtos
- ✅ CRUD de Categorias
- ✅ Sistema de Carrinho
- ✅ Gestão de Pedidos
- ✅ Middleware de autenticação
- ✅ Validação de dados
- ✅ Estrutura Clean Architecture

### 🖥️ Frontend Administrativo (Vue.js + Quasar)
- ✅ Dashboard com gráficos (Chart.js)
- ✅ Gestão de produtos com upload de imagens
- ✅ Gestão de categorias
- ✅ Sistema de autenticação
- ✅ Interface responsiva
- ✅ Animações com GSAP
- ✅ Estado global com Pinia

### 🛒 E-commerce (React + TypeScript)
- ✅ Homepage com carrossel interativo
- ✅ Catálogo de produtos
- ✅ Carrinho de compras funcional
- ✅ Sistema de autenticação
- ✅ Design responsivo com Tailwind CSS
- ✅ Animações avançadas com GSAP
- ✅ Componentes reutilizáveis
- ✅ Context API para estado global

## 🎨 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Zod** - Validação de schemas
- **Multer** - Upload de arquivos

### Frontend Administrativo
- **Vue.js 3** - Framework progressivo
- **Quasar** - UI Framework
- **TypeScript** - Tipagem estática
- **Pinia** - Gerenciamento de estado
- **Chart.js** - Gráficos e dashboards
- **GSAP** - Animações avançadas
- **Axios** - Cliente HTTP

### E-commerce
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **GSAP** - Animações
- **Swiper** - Carrossel
- **Framer Motion** - Animações React
- **Heroicons** - Ícones

## 🔐 Usuários de Teste

Para testar o sistema, você pode criar usuários através da API ou usar o frontend:

### Admin (Painel Administrativo)
```json
{
  "name": "Admin",
  "email": "admin@bysales.com",
  "password": "123456",
  "role": "admin"
}
```

### Cliente (E-commerce)
```json
{
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "password": "123456",
  "role": "customer"
}
```

## 📱 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar produto (Admin)
- `GET /api/products/category/:categoryId` - Produtos por categoria

### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Buscar categoria por ID
- `POST /api/categories` - Criar categoria (Admin)

### Carrinho
- `GET /api/cart` - Buscar carrinho do usuário
- `POST /api/cart` - Adicionar item ao carrinho
- `DELETE /api/cart/:id` - Remover item do carrinho

## 🎯 Próximos Passos

1. **Implementar sistema de pagamento** (Stripe/PayPal)
2. **Adicionar sistema de avaliações** de produtos
3. **Implementar chat de suporte** em tempo real
4. **Adicionar sistema de cupons** e descontos
5. **Criar app mobile** com React Native
6. **Implementar PWA** para o e-commerce
7. **Adicionar testes automatizados**
8. **Deploy em produção** (AWS/Vercel)

## 🐛 Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Execute as migrações: `npm run migration:run`

### Erro de CORS
- Verifique se as URLs estão corretas no backend
- Confirme se o CORS está configurado para as portas corretas

### Dependências não instaladas
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: henri3985@gmail.com
- 🐙 GitHub: https://github.com/Guiihenriiq

---

**Feito com ❤️ por Guilherme Henrique**