CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de nós/mensagens
CREATE TABLE IF NOT EXISTS messages_bot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logical_key VARCHAR(100) UNIQUE NOT NULL,
    message TEXT NOT NULL,
    node_type VARCHAR(20) DEFAULT 'TEXT' CHECK (node_type IN ('TEXT', 'ACTION', 'INPUT')),
    initial_node BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabela de ações
CREATE TABLE IF NOT EXISTS messages_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('MARK_UNREAD', 'SCHEDULE_GCAL', 'WEBHOOK', 'VALIDATE', 'CALCULATE')),
    bot_message_id UUID NOT NULL REFERENCES messages_bot(id) ON DELETE CASCADE,
    execution_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabela de transições
CREATE TABLE IF NOT EXISTS messages_transitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_message_id UUID NOT NULL REFERENCES messages_bot(id) ON DELETE CASCADE,
    target_message_id UUID NOT NULL REFERENCES messages_bot(id) ON DELETE CASCADE,
    trigger_pattern VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE product_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_code VARCHAR(50) NOT NULL,
  quantity_code VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
)

CREATE INDEX idx_product_prices_code ON product_prices(product_code, quantity_code);