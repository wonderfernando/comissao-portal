# Verificação de Documentos via QR Code

## Descrição

Esta funcionalidade permite verificar a autenticidade de documentos emitidos pelo sistema através da leitura de QR Codes.

## Rota

```
/check/[hash]
```

Onde `[hash]` é o código único de verificação do documento.

## Como Funciona

1. **Escaneamento do QR Code**: O QR Code no documento contém um hash único
2. **Acesso à URL**: O hash é usado como parâmetro na URL `/check/{hash}`
3. **Verificação no Backend**: O sistema faz uma requisição para `/verificar-documento/{hash}`
4. **Exibição dos Dados**: Os dados do documento são exibidos de forma clara e organizada

## Dados Retornados

A API retorna os seguintes campos:

- `nome_completo` - Nome completo da pessoa
- `numero_bi` - Número do Bilhete de Identidade
- `data_emissao` - Data de emissão do documento
- `local_emissao` - Local onde o documento foi emitido
- `data_nascimento` - Data de nascimento
- `nome_pai` - Nome do pai
- `nome_mae` - Nome da mãe
- `criado_por` - Usuário que criou o documento
- `estado_civil` - Estado civil
- `nacionalidade` - Nacionalidade
- `ambito_territorial` - Âmbito territorial
- `tipo_documento` - Tipo do documento

## Interface

A página de verificação apresenta:

### Documento Válido
- ✅ Badge verde de verificação
- Código de verificação (hash)
- Tipo de documento destacado
- Dados pessoais organizados em cards
- Informações de filiação
- Detalhes do documento (emissão, local, responsável)

### Documento Inválido
- ❌ Indicador vermelho de erro
- Mensagem explicativa
- Hash fornecido para referência

## Design

A interface foi desenvolvida com:
- **Gradientes modernos** para um visual premium
- **Ícones intuitivos** (Lucide React)
- **Animações suaves** para melhor UX
- **Layout responsivo** (mobile-first)
- **Cores semânticas** (verde para válido, vermelho para inválido)

## Exemplo de Uso

```
https://seudominio.com/check/abc123def456
```

## Segurança

- A rota é pública (não requer autenticação)
- Cada hash é único e não pode ser adivinhado
- A página tem `noindex, nofollow` para evitar indexação por motores de busca
- Apenas documentos válidos retornam dados sensíveis

## Tecnologias

- **Next.js 14+** (App Router)
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Server Actions** para chamadas ao backend
