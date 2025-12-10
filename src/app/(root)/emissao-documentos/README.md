# Emissão de Documentos - Feature Implementation

## Overview
Sistema completo de emissão de documentos com navegação por rotas, onde cada tipo de documento tem sua própria página.

## Fluxo de Navegação

### 1. Estrutura de Rotas
O sistema está organizado com as seguintes rotas:
- `/emissao-documentos` - Página inicial com informações gerais
- `/emissao-documentos/declaracao-morador` - 📄 Declaração de Morador (azul)
- `/emissao-documentos/declaracao-morador-menor` - 👶 Declaração de Morador Menor de Idade (verde)
- `/emissao-documentos/ocorrencia-obito` - ⚰️ Ocorrência de Óbito (cinza)
- `/emissao-documentos/declaracao-ocorrencia` - ⚠️ Declaração de Ocorrência (laranja)

### 2. Menu de Navegação
- Menu horizontal similar ao de "Comissão de Moradores"
- Navegação entre os diferentes tipos de documentos
- Indicador visual da página ativa

### 3. Página de Tipo de Documento
Cada página de tipo de documento exibe:
- Contador de documentos daquele tipo
- Título e descrição do tipo de documento
- Botão **"Emitir Novo"** específico para aquele tipo
- **Tabela** com documentos emitidos daquele tipo
- Cada linha da tabela tem botão de **"Imprimir"** (visível ao hover)
- Estado vazio amigável quando não há documentos de um tipo

### 4. Formulário de Emissão
- Ao clicar em "Emitir Novo"
- Abre o formulário específico para aquele tipo de documento (na mesma página)
- Validação com react-hook-form + zod
- Botão "Confirmar e Imprimir"
- Após salvar, retorna automaticamente para a lista de documentos
- Botão "Voltar" retorna à lista

## Tipos de Documentos

### 1. Declaração de Morador
**Campos:**
- Nome completo
- Número do BI
- Data de nascimento
- Endereço completo
- Bairro
- Município
- Motivo da solicitação

### 2. Declaração de Morador Menor de Idade
**Seções:**
- **Dados do Menor:** nome, data de nascimento
- **Dados do Responsável:** nome, BI, parentesco
- **Endereço:** endereço completo, bairro, município
- Motivo da solicitação

### 3. Ocorrência de Óbito
**Seções:**
- **Dados do Falecido:** nome, BI, data de nascimento
- **Informações do Óbito:** data, hora, local, causa da morte
- **Dados do Declarante:** nome, BI, telefone, parentesco

### 4. Declaração de Ocorrência
**Campos:**
- Tipo de ocorrência (furto, roubo, vandalismo, etc.)
- Data e hora da ocorrência
- Local da ocorrência
- Descrição detalhada
- Dados do declarante (nome, BI, telefone, endereço)

## Funcionalidades

✅ **Gerenciamento Completo**
- Visualizar todos os documentos emitidos
- Imprimir documentos diretamente da tabela
- Emitir novos documentos
- Navegação intuitiva entre as telas

✅ **UI/UX Moderna**
- Design responsivo e profissional
- Tabela com hover effects
- Cards coloridos por tipo de documento
- Loading states e empty states
- Animações suaves

✅ **Validação de Formulários**
- Validação em tempo real
- Mensagens de erro claras
- Todos os campos obrigatórios
- Tipos específicos (data, hora, telefone)

✅ **Toast Notifications**
- Feedback de sucesso/erro
- Mensagens informativas
- Estados de loading

## Estrutura de Arquivos

```
emissao-documentos/
├── page.tsx                          # Página inicial
├── layout.tsx                        # Layout com menu de navegação
├── interface.ts                      # TypeScript interfaces
├── actions.ts                        # Server actions (API)
├── README.md                         # Documentação
├── components/
│   ├── documents-table.tsx          # Tabela de documentos (compartilhada)
│   ├── declaracao-morador-form.tsx  # Formulário de declaração de morador
│   ├── declaracao-morador-menor-form.tsx
│   ├── ocorrencia-obito-form.tsx
│   └── declaracao-ocorrencia-form.tsx
├── declaracao-morador/
│   └── page.tsx                     # Página de declaração de morador
├── declaracao-morador-menor/
│   └── page.tsx                     # Página de morador menor
├── ocorrencia-obito/
│   └── page.tsx                     # Página de ocorrência de óbito
└── declaracao-ocorrencia/
    └── page.tsx                     # Página de declaração de ocorrência
```

## Endpoints da API

### Listar Documentos
- **GET** `/documento`
- Response: 
```json
{
  "success": true,
  "documents": [
    {
      "id": 1,
      "tipo": "declaracao-morador",
      "nome_solicitante": "João Silva",
      "bi_solicitante": "123456789XX00",
      "data_emissao": "2024-12-04T22:00:00.000Z"
    }
  ]
}
```

### Salvar Documento
- **POST** `/documento/{type}`
- Body: Dados do documento (varia por tipo)
- Response: 
```json
{
  "success": true,
  "message": "Documento salvo com sucesso",
  "id": 123
}
```

### Imprimir Documento
- **GET** `/documento/{type}/{id}/print`
- Response: PDF blob

**Tipos aceitos:** `declaracao-morador`, `declaracao-morador-menor`, `ocorrencia-obito`, `declaracao-ocorrencia`

## Estados de View

A aplicação gerencia 2 estados de visualização:
1. **tabs** - Visualização organizada por abas com documentos por tipo (padrão)
2. **form** - Formulário de emissão de novo documento

## Tecnologias

- **Next.js 14+** com App Router e Server Actions
- **React Hook Form** + **Zod** para formulários
- **Shadcn/ui** (Table, Badge, Card, Button, etc.)
- **Lucide React** para ícones
- **Sonner** para notificações
- **TypeScript** para type safety

## Como Usar

1. Acesse `/emissao-documentos`
2. Use o menu de navegação para escolher um tipo de documento
3. Veja os documentos daquele tipo na tabela
4. Clique em "Emitir Novo" para criar um novo documento daquele tipo
5. Preencha o formulário
6. Clique em "Confirmar e Imprimir"
7. Documento é salvo e PDF abre automaticamente
8. Retorna à lista de documentos daquele tipo

## Notas Técnicas

- Formulários resetam após submissão bem-sucedida
- Documentos são recarregados ao retornar à lista
- Botão de imprimir na tabela reabre o PDF sem criar novo documento
- Cada tipo de documento tem cor e ícone único
- Validação completa em todos os campos obrigatórios
- Estados de loading durante requisições
- Tratamento de erros com mensagens amigáveis
- **Navegação por rotas**: cada tipo de documento tem sua própria URL
- **Filtro automático**: documentos são filtrados por tipo em cada página
- **Botão "Emitir Novo" contextual**: cada página tem seu próprio botão que já sabe qual tipo de documento criar
- **Menu de navegação consistente**: similar ao padrão usado em "Comissão de Moradores"

