# 🛒 By Sales - E-commerce Platform

<div align="center">

![By Sales Logo](https://img.shields.io/badge/By%20Sales-E--commerce-blue?style=for-the-badge&logo=shopping-cart)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Uma plataforma de e-commerce moderna e completa construída com as melhores tecnologias**

[🚀 Demo](#demo) • [📖 Documentação](#documentação) • [🛠️ Instalação](#instalação) • [🤝 Contribuir](#contribuindo)

</div>

---

## ✨ Características

### 🎯 **Funcionalidades Principais**
- 🛍️ **Catálogo de Produtos** - Gestão completa de produtos com categorias
- 👥 **Gestão de Clientes** - Sistema completo de cadastro e perfis
- 📊 **Dashboard Analytics** - Relatórios e métricas em tempo real
- 💰 **Sistema de Vendas** - Processamento completo de pedidos
- ⚙️ **Configurações** - Painel administrativo personalizável

### 🏗️ **Arquitetura**
- 🎨 **Clean Architecture** - Separação clara de responsabilidades
- 🔄 **Domain-Driven Design** - Modelagem focada no domínio
- 📦 **Microserviços** - Arquitetura escalável e modular
- 🛡️ **Type Safety** - TypeScript em todo o projeto

---

## 🛠️ Stack Tecnológica

### 🖥️ **Frontend**
<div align="center">

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white) | 3.4+ | Framework progressivo |
| ![Quasar](https://img.shields.io/badge/Quasar-1976D2?style=flat&logo=quasar&logoColor=white) | 2.16+ | UI Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 5.5+ | Tipagem estática |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | 1.2+ | Cliente HTTP |

</div>

### ⚙️ **Backend**
<div align="center">

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | 18+ | Runtime JavaScript |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | 4.21+ | Framework web |
| ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white) | 0.3+ | ORM TypeScript |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) | 14+ | Banco de dados |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white) | 4.1+ | Validação de schemas |

</div>

---

## 🚀 Instalação

### 📋 **Pré-requisitos**

```bash
Node.js >= 18.0.0
npm >= 6.13.4
PostgreSQL >= 14.0
```

### 🔧 **Configuração do Ambiente**

1. **Clone o repositório**
```bash
git clone https://github.com/Guiihenriiq/by_sales.git
cd by_sales
```

2. **Instale as dependências**
```bash
# Dependências globais
npm install

# Backend
cd backend
npm install

# Frontend
cd ../front-end
npm install
```

3. **Configure o banco de dados**
```bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Configure suas variáveis no arquivo .env
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=sua_senha
# DB_DATABASE=ecommerce_db
```

4. **Execute as migrações**
```bash
cd backend
npm run migration:run
```

### 🏃‍♂️ **Executando o Projeto**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd front-end
npm run dev
```

🎉 **Pronto!** Acesse:
- 🖥️ **Frontend**: http://localhost:9000
- ⚙️ **Backend**: http://localhost:3333

---

## 📁 Estrutura do Projeto

```
by_sales/
├── 🖥️ front-end/                 # Aplicação Vue.js + Quasar
│   ├── 📄 src/
│   │   ├── 🎨 components/        # Componentes reutilizáveis
│   │   ├── 📱 pages/             # Páginas da aplicação
│   │   ├── 🛣️ router/            # Configuração de rotas
│   │   └── 🎯 layouts/           # Layouts base
│   └── 📦 package.json
│
├── ⚙️ backend/                   # API Node.js + Express
│   ├── 📄 src/
│   │   ├── 🏛️ domain/            # Entidades e regras de negócio
│   │   ├── 🔧 application/       # Casos de uso
│   │   ├── 🌐 http/              # Controllers e rotas
│   │   ├── 🗄️ infra/             # Banco de dados e infraestrutura
│   │   └── 🚀 main/              # Configuração do servidor
│   └── 📦 package.json
│
├── 📜 LICENSE                    # Licença MIT
└── 📖 README.md                  # Este arquivo
```

---

## 🎯 Funcionalidades Detalhadas

### 📊 **Dashboard**
- 📈 Analytics em tempo real
- 📋 Métricas de vendas
- 👥 Estatísticas de clientes
- 💰 Relatórios financeiros

### 🛍️ **Gestão de Produtos**
- ➕ Cadastro de produtos
- 🏷️ Categorização
- 💰 Controle de preços
- 📸 Upload de imagens

### 👥 **Gestão de Clientes**
- 📝 Cadastro completo
- 📊 Histórico de compras
- 🎯 Segmentação
- 📧 Comunicação

### 💳 **Sistema de Vendas**
- 🛒 Carrinho de compras
- 💰 Processamento de pagamentos
- 📦 Controle de estoque
- 🚚 Gestão de entregas

---

## 🔧 Scripts Disponíveis

### 🖥️ **Frontend**
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run test     # Executar testes
```

### ⚙️ **Backend**
```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Compilar TypeScript
npm run start            # Executar em produção
npm run migration:create # Criar nova migração
npm run migration:run    # Executar migrações
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! 🎉

### 📝 **Como Contribuir**

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 🐛 **Reportando Bugs**

Encontrou um bug? [Abra uma issue](https://github.com/Guiihenriiq/by_sales/issues) com:
- 📝 Descrição detalhada
- 🔄 Passos para reproduzir
- 💻 Ambiente (OS, Node.js, etc.)
- 📸 Screenshots (se aplicável)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 🔓 **Resumo da Licença**
- ✅ Uso comercial
- ✅ Modificação
- ✅ Distribuição
- ✅ Uso privado
- ❌ Responsabilidade
- ❌ Garantia

---

## 👨‍💻 Autor

<div align="center">

**Guilherme Henrique**<br>
**Hamabily Alves**<br>
**Leonardo Bueno**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Guiihenriiq)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:henri3985@gmail.com)

</div>

---

## 🙏 Agradecimentos

- 💙 **Vue.js Community** - Framework incrível
- 🎨 **Quasar Team** - UI components fantásticos
- 🚀 **Node.js** - Runtime poderoso
- 🐘 **PostgreSQL** - Banco de dados confiável

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

![Stars](https://img.shields.io/github/stars/Guiihenriiq/by_sales?style=social)
![Forks](https://img.shields.io/github/forks/Guiihenriiq/by_sales?style=social)

**Feito com ❤️ e muito ☕**

</div>