# Integração com QR Code

## Como Adicionar QR Code aos Documentos

Para que os documentos emitidos tenham QR Codes que redirecionem para a página de verificação, você precisa:

### 1. Backend - Gerar Hash Único

No momento da emissão do documento, o backend deve:

```typescript
// Exemplo de como gerar o hash (pseudocódigo)
const hash = generateUniqueHash(documentData);
// Salvar o hash no banco de dados associado ao documento
await saveDocumentHash(documentId, hash);
```

### 2. Backend - Gerar QR Code

Adicione uma biblioteca de QR Code no backend:

```bash
npm install qrcode
```

```typescript
import QRCode from 'qrcode';

async function generateQRCodeForDocument(hash: string) {
  const verificationUrl = `${process.env.FRONTEND_URL}/check/${hash}`;
  
  // Gerar QR Code como Data URL
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 200,
    margin: 1,
  });
  
  return qrCodeDataUrl;
}
```

### 3. Incluir QR Code no PDF

Ao gerar o PDF do documento, inclua o QR Code:

```typescript
// Exemplo com PDFKit ou similar
doc.image(qrCodeDataUrl, x, y, { width: 100, height: 100 });
doc.fontSize(8).text('Escaneie para verificar autenticidade', x, y + 105);
```

### 4. Frontend - Exibir QR Code (Opcional)

Se quiser exibir o QR Code na interface web antes de imprimir:

```bash
npm install qrcode.react
```

```tsx
import QRCode from 'qrcode.react';

function DocumentPreview({ hash }: { hash: string }) {
  const verificationUrl = `${window.location.origin}/check/${hash}`;
  
  return (
    <div>
      <h3>QR Code de Verificação</h3>
      <QRCode 
        value={verificationUrl}
        size={200}
        level="H"
        includeMargin={true}
      />
      <p>Escaneie para verificar a autenticidade</p>
    </div>
  );
}
```

## Fluxo Completo

```
1. Usuário preenche formulário de documento
   ↓
2. Backend recebe dados e cria documento
   ↓
3. Backend gera hash único (ex: SHA256 do ID + timestamp)
   ↓
4. Backend salva hash no banco de dados
   ↓
5. Backend gera QR Code com URL: /check/{hash}
   ↓
6. Backend gera PDF com dados + QR Code
   ↓
7. Usuário recebe/imprime documento com QR Code
   ↓
8. Qualquer pessoa escaneia QR Code
   ↓
9. Navegador abre /check/{hash}
   ↓
10. Frontend faz requisição GET /verificar-documento/{hash}
    ↓
11. Backend valida hash e retorna dados
    ↓
12. Frontend exibe dados formatados
```

## Exemplo de Implementação no Backend

### Endpoint para Gerar Documento com QR Code

```typescript
// routes/documento.ts
router.post('/pessoa', async (req, res) => {
  try {
    // 1. Salvar dados do documento
    const documento = await salvarDocumento(req.body);
    
    // 2. Gerar hash único
    const hash = crypto
      .createHash('sha256')
      .update(`${documento.id}-${Date.now()}`)
      .digest('hex');
    
    // 3. Salvar hash
    await salvarHashDocumento(documento.id, hash);
    
    // 4. Gerar QR Code
    const qrCodeUrl = `${process.env.FRONTEND_URL}/check/${hash}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);
    
    // 5. Gerar PDF com QR Code
    const pdfBuffer = await gerarPDFComQRCode(documento, qrCodeImage);
    
    // 6. Retornar resposta
    res.json({
      success: true,
      dados: documento,
      hash: hash,
      qrCode: qrCodeImage,
    });
  } catch (error) {
    res.status(500).json({ success: false, mensagem: error.message });
  }
});
```

### Endpoint de Verificação

```typescript
// routes/verificar-documento.ts
router.get('/verificar-documento/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Buscar documento pelo hash
    const documento = await buscarDocumentoPorHash(hash);
    
    if (!documento) {
      return res.status(404).json({
        success: false,
        mensagem: 'Documento não encontrado ou hash inválido',
      });
    }
    
    // Retornar dados do documento
    res.json({
      success: true,
      dados: {
        nome_completo: documento.dados.nome_completo,
        numero_bi: documento.dados.numero_bi,
        data_emissao: documento.created_at,
        local_emissao: documento.dados.local_emissao,
        data_nascimento: documento.dados.data_nascimento,
        nome_pai: documento.dados.nome_pai,
        nome_mae: documento.dados.nome_mae,
        criado_por: documento.usuario.nome,
        estado_civil: documento.dados.estado_civil,
        nacionalidade: documento.dados.nacionalidade,
        ambito_territorial: documento.dados.ambito_territorial,
        tipo_documento: documento.tipo.nome,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensagem: 'Erro ao verificar documento',
    });
  }
});
```

## Banco de Dados

Adicione uma coluna para armazenar o hash:

```sql
ALTER TABLE emitir_documento 
ADD COLUMN verification_hash VARCHAR(64) UNIQUE;

CREATE INDEX idx_verification_hash ON emitir_documento(verification_hash);
```

## Segurança

### Boas Práticas:

1. **Hash Único e Imprevisível**
   - Use SHA256 ou similar
   - Inclua timestamp e ID do documento
   - Adicione um salt aleatório

2. **Rate Limiting**
   - Limite tentativas de verificação por IP
   - Previne ataques de força bruta

3. **Logs de Acesso**
   - Registre todas as verificações
   - Monitore padrões suspeitos

4. **Expiração (Opcional)**
   - Considere adicionar data de validade ao hash
   - Útil para documentos temporários

## Exemplo de Hash Seguro

```typescript
function generateSecureHash(documentId: number): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const data = `${documentId}-${timestamp}-${salt}`;
  
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}
```

## Testando a Integração

1. Emita um documento através do sistema
2. Verifique se o hash foi gerado e salvo
3. Verifique se o QR Code foi incluído no PDF
4. Escaneie o QR Code com um smartphone
5. Confirme que a página de verificação abre corretamente
6. Valide que os dados exibidos estão corretos
