# Testes da Funcionalidade de Verificação de Documentos

## URLs de Teste

### Documento Válido
Para testar com um documento válido, você precisará de um hash real do seu backend.

Exemplo de URL:
```
http://localhost:3000/check/abc123def456ghi789
```

### Documento Inválido
Para testar a exibição de erro, use um hash que não existe:
```
http://localhost:3000/check/hash-invalido-teste
```

## Cenários de Teste

### 1. Documento Válido ✅
**Entrada**: Hash válido de um documento existente
**Resultado Esperado**:
- Banner verde com "Documento Verificado"
- Código de verificação exibido
- Tipo de documento destacado
- Todos os campos preenchidos corretamente
- Animação suave ao carregar

### 2. Documento Inválido ❌
**Entrada**: Hash inexistente ou inválido
**Resultado Esperado**:
- Ícone vermelho de erro
- Mensagem "Documento Inválido"
- Hash exibido para referência
- Mensagem explicativa clara

### 3. Erro de Conexão 🔌
**Entrada**: Backend offline ou erro de rede
**Resultado Esperado**:
- Mensagem de erro de conexão
- Sugestão para verificar a conexão

### 4. Loading State ⏳
**Entrada**: Durante o carregamento da página
**Resultado Esperado**:
- Skeleton screen com animação pulse
- Layout similar ao resultado final
- Transição suave para o conteúdo

## Checklist de Validação

- [ ] A página carrega corretamente
- [ ] O hash é capturado da URL
- [ ] A requisição ao backend é feita corretamente
- [ ] Documentos válidos exibem todos os campos
- [ ] Documentos inválidos mostram erro apropriado
- [ ] O design é responsivo (mobile, tablet, desktop)
- [ ] As animações funcionam suavemente
- [ ] Os ícones são exibidos corretamente
- [ ] As datas são formatadas em português
- [ ] O SEO está configurado (noindex, nofollow)

## Dados de Exemplo

Aqui está um exemplo de resposta da API para um documento válido:

```json
{
  "success": true,
  "dados": {
    "nome_completo": "João Manuel da Silva",
    "numero_bi": "123456789LA001",
    "data_emissao": "2024-01-15",
    "local_emissao": "Luanda",
    "data_nascimento": "1990-05-20",
    "nome_pai": "Manuel António da Silva",
    "nome_mae": "Maria José da Silva",
    "criado_por": "Admin Sistema",
    "estado_civil": "Solteiro",
    "nacionalidade": "Angolana",
    "ambito_territorial": "Luanda",
    "tipo_documento": "Declaração de Morador"
  }
}
```

## Como Testar Manualmente

1. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

2. **Acesse a URL de teste**:
   - Abra o navegador
   - Digite: `http://localhost:3000/check/[seu-hash-aqui]`

3. **Verifique o comportamento**:
   - Observe o loading state
   - Confirme que os dados são exibidos corretamente
   - Teste em diferentes tamanhos de tela
   - Verifique a formatação de datas

4. **Teste casos de erro**:
   - Use um hash inválido
   - Desligue o backend temporariamente

## Integração com QR Code

Para integrar com QR Codes:

1. O QR Code deve conter a URL completa:
   ```
   https://seudominio.com/check/[hash-do-documento]
   ```

2. Ao escanear o QR Code, o usuário será redirecionado automaticamente para a página de verificação

3. A página carregará e exibirá os dados do documento

## Próximos Passos

- [ ] Adicionar botão para imprimir/salvar PDF
- [ ] Implementar histórico de verificações
- [ ] Adicionar analytics para rastrear verificações
- [ ] Criar versão offline com cache
- [ ] Adicionar suporte a múltiplos idiomas
