# 📊 DATABASE - By Sales E-commerce

## 🗄️ Estrutura Completa do Banco de Dados

### 📋 **Tabelas Principais**

#### 👥 **users** - Usuários do Sistema
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    banned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 🏷️ **categories** - Categorias de Produtos
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 📦 **products** - Produtos
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id UUID REFERENCES categories(id),
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 💰 **sales** - Vendas (NOVA)
```sql
CREATE TYPE sales_payment_method_enum AS ENUM ('credit_card', 'debit_card', 'pix', 'boleto', 'cash');
CREATE TYPE sales_status_enum AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    installments_count INT NOT NULL DEFAULT 1,
    payment_method sales_payment_method_enum NOT NULL,
    status sales_status_enum NOT NULL DEFAULT 'pending',
    billing_code VARCHAR(50) NOT NULL UNIQUE,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 📅 **installments** - Parcelas (NOVA)
```sql
CREATE TYPE installments_status_enum AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    paid_amount DECIMAL(10,2),
    status installments_status_enum NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 🛒 **cart** - Carrinho de Compras
```sql
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 📋 **orders** - Pedidos (Sistema Legado)
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 📦 **order_items** - Itens do Pedido
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 **Relacionamentos**

### 🎯 **Sistema de Vendas e Parcelas**
```
users (1) ──────── (N) sales
sales (1) ──────── (N) installments
```

### 🛍️ **Sistema de E-commerce**
```
users (1) ──────── (N) cart
users (1) ──────── (N) orders
orders (1) ─────── (N) order_items
products (1) ───── (N) order_items
products (1) ───── (N) cart
categories (1) ─── (N) products
```

---

## 💡 **Fluxo de Vendas com Parcelas**

### 📊 **1. Criação de Venda**
```sql
-- Exemplo de venda parcelada
INSERT INTO sales (user_id, total_amount, installments_count, payment_method, billing_code, shipping_address)
VALUES ('user-uuid', 1200.00, 3, 'credit_card', 'BS123456ABC', 'Rua das Flores, 123');
```

### 💳 **2. Geração Automática de Parcelas**
```sql
-- Parcela 1 (vencimento: +1 mês)
INSERT INTO installments (sale_id, installment_number, amount, due_date)
VALUES ('sale-uuid', 1, 400.00, '2024-02-15');

-- Parcela 2 (vencimento: +2 meses)
INSERT INTO installments (sale_id, installment_number, amount, due_date)
VALUES ('sale-uuid', 2, 400.00, '2024-03-15');

-- Parcela 3 (vencimento: +3 meses)
INSERT INTO installments (sale_id, installment_number, amount, due_date)
VALUES ('sale-uuid', 3, 400.00, '2024-04-15');
```

### ✅ **3. Pagamento de Parcela**
```sql
-- Marcar parcela como paga
UPDATE installments 
SET status = 'paid', 
    paid_date = CURRENT_DATE, 
    paid_amount = 400.00,
    payment_method = 'credit_card',
    transaction_id = 'TXN123456789'
WHERE id = 'installment-uuid';
```

---

## 📈 **Consultas Úteis**

### 💰 **Vendas por Período**
```sql
SELECT 
    DATE_TRUNC('month', created_at) as mes,
    COUNT(*) as total_vendas,
    SUM(total_amount) as receita_total
FROM sales 
WHERE created_at >= '2024-01-01'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes;
```

### 📅 **Parcelas Vencidas**
```sql
SELECT 
    i.id,
    s.billing_code,
    u.name as cliente,
    i.installment_number,
    i.amount,
    i.due_date,
    CURRENT_DATE - i.due_date as dias_atraso
FROM installments i
JOIN sales s ON i.sale_id = s.id
JOIN users u ON s.user_id = u.id
WHERE i.status = 'pending' 
  AND i.due_date < CURRENT_DATE
ORDER BY i.due_date;
```

### 📊 **Relatório de Vendas por Cliente**
```sql
SELECT 
    u.name,
    u.email,
    COUNT(s.id) as total_vendas,
    SUM(s.total_amount) as valor_total,
    AVG(s.total_amount) as ticket_medio
FROM users u
JOIN sales s ON u.id = s.user_id
WHERE s.status != 'cancelled'
GROUP BY u.id, u.name, u.email
ORDER BY valor_total DESC;
```

### 💳 **Status de Pagamentos**
```sql
SELECT 
    s.billing_code,
    s.total_amount,
    s.installments_count,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as parcelas_pagas,
    COUNT(CASE WHEN i.status = 'pending' THEN 1 END) as parcelas_pendentes,
    COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as parcelas_vencidas,
    SUM(CASE WHEN i.status = 'paid' THEN i.paid_amount ELSE 0 END) as valor_pago
FROM sales s
LEFT JOIN installments i ON s.id = i.sale_id
GROUP BY s.id, s.billing_code, s.total_amount, s.installments_count
ORDER BY s.created_at DESC;
```

---

## 🔧 **Índices Recomendados**

```sql
-- Performance para consultas de vendas
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_billing_code ON sales(billing_code);

-- Performance para consultas de parcelas
CREATE INDEX idx_installments_sale_id ON installments(sale_id);
CREATE INDEX idx_installments_due_date ON installments(due_date);
CREATE INDEX idx_installments_status ON installments(status);
CREATE INDEX idx_installments_paid_date ON installments(paid_date);

-- Performance para sistema legado
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_products_category_id ON products(category_id);
```

---

## 🚀 **Comandos de Manutenção**

### 📊 **Backup**
```bash
pg_dump -h localhost -U postgres -d ecommerce_db > backup_$(date +%Y%m%d).sql
```

### 🔄 **Restore**
```bash
psql -h localhost -U postgres -d ecommerce_db < backup_20240119.sql
```

### 🧹 **Limpeza de Dados Antigos**
```sql
-- Remover carrinho abandonado (>30 dias)
DELETE FROM cart WHERE created_at < NOW() - INTERVAL '30 days';

-- Arquivar vendas canceladas antigas (>1 ano)
UPDATE sales SET status = 'archived' 
WHERE status = 'cancelled' AND created_at < NOW() - INTERVAL '1 year';
```

---

## 📋 **Resumo das Tabelas**

| Tabela | Registros | Função |
|--------|-----------|---------|
| **users** | Usuários | Clientes e administradores |
| **categories** | Categorias | Organização de produtos |
| **products** | Produtos | Catálogo do e-commerce |
| **sales** | Vendas | Sistema principal de vendas |
| **installments** | Parcelas | Controle de pagamentos |
| **cart** | Carrinho | Itens temporários |
| **orders** | Pedidos | Sistema legado |
| **order_items** | Itens | Detalhes dos pedidos |

---

**🎯 O sistema de vendas com parcelas oferece controle completo sobre o fluxo financeiro, desde a criação da venda até o pagamento da última parcela!**