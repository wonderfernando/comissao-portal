import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

// Define interfaces based on the provided JSON structure
interface Cidadao {
    nome_completo: string;
    numero_bi: string;
    nacionalidade: string;
    data_emissao: string;
    tipo_documento: string;
    data_nascimento: string;
    nome_pai: string;
    nome_mae: string;
    tipo_documento_id: number;
    estado_civil: string;
    ambito_territorial: string;
    bairro_id: number;
}

interface Comissao {
    id: number;
    codigo: string;
    email: string;
    nome: string;
    localizacao: string;
    delimitacao_geografica: string;
    contacto: string;
    status: string;
    bairro_id: number;
    bairro: {
        id: number;
        nome: string;
        comuna: {
            id: number;
            nome: string;
            municipio: {
                id: number;
                nome: string;
                provincia: {
                    id: number;
                    nome: string;
                }
            }
        }
    }
}

interface RequestBody {
    success: boolean;
    dados: {
        cidadao: Cidadao;
        comissao: Comissao;
        hash_qr: string;
    };
}
function getTypeDoc(type: string) {
       if (type === "bilhete")
            return "Bilhete de Identidade"
        if (type === "cartao_eleitor")
            return "Cartão de Eleitor"
        if (type === "cartao_residente")
            return "Cartão de Residente"
        if (type === "passaporte")
            return "Passaporte"
}

function getAmbito(ambito: string) {
      if (ambito === "rua")
            return "Rua"
        if (ambito === "predio")
            return "Prédio"
        if (ambito === "quarteirao")
            return "Quarteirão"
        if (ambito === "aldeia")
            return "Aldeia"
        if (ambito === "outro")
            return "Não definido"
}
export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { cidadao, comissao, hash_qr } = body.dados;

        if (!cidadao || !comissao) {
            return new NextResponse(
                JSON.stringify({ error: "Dados inválidos: Cidadão ou Comissão não encontrados" }),
                { status: 400 }
            );
        }

        // Generate QR Code
        // In a real scenario, this URL would point to a verification page
        const qrDataURL = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP}/check/${hash_qr}` || `https://teusite.gov/validar/${cidadao.numero_bi}`);

        // Font path
        const FONT_PATH = path.join(process.cwd(), "public", "font.ttf");

        // Create PDF
        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        // Register font if exists
        if (fs.existsSync(FONT_PATH)) {
            doc.registerFont("regular", FONT_PATH);
            doc.font("regular");
        }

        const chunks: Uint8Array[] = [];
        const pdfPromise = new Promise<Buffer>((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        // Image paths
        const publicDir = path.join(process.cwd(), "public");
        const backImagePath = path.join(publicDir, "back.png");
        const insigniaImagePath = path.join(publicDir, "insignia.png");
        // Using root public for assinatura as per discovery
        const assinaturaImagePath = path.join(publicDir, "assinatura.png");

        // Watermark
        if (fs.existsSync(backImagePath)) {
            doc.opacity(0.1).image(backImagePath, 100, 150, { width: 400 }).opacity(1);
        }

        // Insignia/Brasão
        if (fs.existsSync(insigniaImagePath)) {
            doc.image(insigniaImagePath, 250, 40, { width: 100 }).moveDown(8);
        } else {
            doc.moveDown(8); // Ensure spacing even if image missing
        }

        // Helper to draw checkbox
        const drawCheckbox = (label: string, isChecked: boolean, x: number, y: number) => {
            doc.rect(x, y, 12, 12).stroke();
            if (isChecked) {
                doc.fontSize(10).text("X", x + 2, y + 1);
            }
            doc.fontSize(12).text(label, x + 20, y);
        };

        // Header - CM Number
        doc.fontSize(12).text(`CM n.º ${comissao.codigo}`, { align: "right" });

        doc.moveDown(2);

        // Title
        doc.fontSize(14).font("Helvetica-Bold").text("DECLARAÇÃO DE MORADOR PARA MENOR", {
            align: "center",
            underline: true
        });
        doc.font("regular"); // Reset font

        doc.moveDown(3);

        // Date formatting helper
        const formatDate = (dateStr: string) => {
            try {
                if (!dateStr) return "___/___/___";
                return new Date(dateStr).toLocaleDateString('pt-AO');
            } catch {
                return dateStr;
            }
        };

        // Body Text Part 1
        const startX = 50;
        let currentY = doc.y;

        doc.fontSize(12).text(
            `Certifico que ${cidadao.nome_completo || '...........................................'}, ` +
            `de nacionalidade ${cidadao.nacionalidade || '....................'}, ` +
            `filho de ${cidadao.nome_pai || '.......................................'} e de ${cidadao.nome_mae || '.......................................'}, ` +
            `nascido aos ${formatDate(cidadao.data_nascimento)}, em Luanda, titular do ${getTypeDoc(cidadao.tipo_documento?.toLowerCase())} ` +
            `N.º ${cidadao.numero_bi || '....................'}, Emitido em ${formatDate(cidadao.data_emissao)}, é residente no(a) ${getAmbito(cidadao.ambito_territorial?.toLowerCase())}
            `,
            { align: "justify", lineGap: 10 }
        );
      
 
        doc.moveDown(1);

    

      

        /*       drawCheckbox("Rua", ambito === 'rua', checkX, checkY);
              checkX += 80;
              drawCheckbox("Prédio", ambito === 'predio' || ambito === 'edificio', checkX, checkY);
              checkX += 90;
              drawCheckbox("Quarteirão", ambito === 'quarteirao', checkX, checkY);
              checkX += 110;
              drawCheckbox("Aldeia", ambito === 'aldeia', checkX, checkY);
              checkX += 90;
              drawCheckbox("Outro", ambito === 'outro', checkX, checkY);
       */
        doc.moveDown(3);

        // Closing
        doc.text("Por ser verdade, passei a presente Declaração de Morador, por mim assinada.");

        doc.moveDown(2);

        // Date
        const today = new Date();
        const month = today.toLocaleString('pt-AO', { month: 'long' });
        doc.text(`Luanda, aos ${today.getDate()} de ${month} de ${today.getFullYear()}`);

        doc.moveDown(4);

        // Signature Line
        doc.text("O PRESIDENTE DA COMISSÃO DE MORADORES", { align: "center", width: 500 });
     doc.moveDown(2);
        // Line for signature
        doc.moveTo(150, doc.y).lineTo(450, doc.y).stroke();

        doc.moveDown(6);

        // Footer Footnote
        doc.fontSize(8).text(
            "1 Esta Declaração tem efeito exclusivo para certificação da residência junto dos órgãos competente para emissão do cartão do munícipe.",
            { align: "left" }
        );

        // QR Code (kept discreetly at bottom left as useful meta-data)
        doc.image(qrDataURL, 50, 700, { width: 80 });

        doc.end();

        const pdfBuffer = await pdfPromise;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=declaracao-${cidadao.numero_bi}.pdf`
            }
        });

    } catch (error: unknown) {
        console.error("Error generating PDF:", error);
        return new NextResponse(
            JSON.stringify({
                error: "Failed to generate PDF",
                details: error instanceof Error ? error.message : "Unknown error"
            }),
            { status: 500 }
        );
    }
}
