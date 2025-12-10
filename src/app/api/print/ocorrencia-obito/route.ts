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
    data_obito?: string;
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
        nome_declarante?: string;
        bi_declarante?: string;
        data_obito?: string;
        rua?: string;
        casa_numero?: string;
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

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        // Extract data - prioritizing standard locations but falling back if needed
        const { cidadao, comissao, hash_qr } = body.dados;

        // Sometimes extra fields might be in 'cidadao' or 'body.dados' depending on how it's saved
        // We'll trust the payload structure passed from the specific print call
        const dataObito = body.dados.data_obito || cidadao.data_obito;
        const nomeDeclarante = body.dados.nome_declarante || "N/A";

        if (!cidadao || !comissao) {
            return new NextResponse(
                JSON.stringify({ error: "Dados inválidos: Cidadão ou Comissão não encontrados" }),
                { status: 400 }
            );
        }

        // Generate QR Code
        const qrDataURL = await QRCode.toDataURL(hash_qr || `https://teusite.gov/validar/${cidadao.numero_bi}`);

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

        // Watermark
        if (fs.existsSync(backImagePath)) {
            doc.opacity(0.1).image(backImagePath, 100, 150, { width: 400 }).opacity(1);
        }

        // Insignia/Brasão
        if (fs.existsSync(insigniaImagePath)) {
            doc.image(insigniaImagePath, 250, 40, { width: 100 }).moveDown(8);
        } else {
            doc.moveDown(8);
        }

        // Header - CM Number
        doc.fontSize(12).text(`CM n.º ${comissao.codigo}`, { align: "right" });

        doc.moveDown(2);

        // Title
        doc.fontSize(14).font("Helvetica-Bold").text("MODELO DE INFORMAÇÃO DE OCORRÊNCIA DE ÓBITO", {
            align: "center",
            underline: true
        });
        doc.font("regular");

        doc.moveDown(3);

        // Date formatting helper
        const formatDate = (dateStr?: string) => {
            try {
                if (!dateStr) return "___/___/___";
                return new Date(dateStr).toLocaleDateString('pt-AO');
            } catch {
                return dateStr || "___/___/___";
            }
        };

        const formatFullDate = (dateStr?: string) => {
            if (!dateStr) return "___ de ___________ de _____";
            const date = new Date(dateStr);
            return `${date.getDate()} de ${date.toLocaleString('pt-AO', { month: 'long' })} de ${date.getFullYear()}`;
        };

        // Body Text

        const rua = body.dados.rua || "................";
        const casaNumero = body.dados.casa_numero || "......";

        // Paragraph 1
        doc.fontSize(12).text(
            `Para os devidos efeitos legais declara-se que aos ${formatFullDate(dataObito)} o cidadão ${cidadao.nome_completo || '...........................................'}, ` +
            `${cidadao.estado_civil || 'solteiro/casado'}, de nacionalidade ${cidadao.nacionalidade || '....................'}, ` +
            `filho de ${cidadao.nome_pai || '.......................................'} e de ${cidadao.nome_mae || '.......................................'}, ` +
            `nascido aos ${formatDate(cidadao.data_nascimento)}, residente em ${comissao.bairro?.nome || '................'}, rua ${rua}, casa n.º ${casaNumero}, ` +
            `titular do ${getTypeDoc(cidadao.tipo_documento?.toLowerCase()) || 'Bilhete de Identidade'} n.º ${cidadao.numero_bi || '....................'}, passado pela emissão.`,
            { align: "justify", lineGap: 10 }
        );

        doc.moveDown(2);

        // Paragraph 2
        doc.text("Faleceu.", { align: "left" });

        doc.moveDown(2);

        // Paragraph 3
        // Note: The model says "tendo tomado conhecimento da ocorrência (nome ....)". We typically put the Authority name here.
        // Assuming "O Presidente" is the one who took knowledge.
        doc.text(
            `A informação foi prestada pelo ${nomeDeclarante}, tendo tomado conhecimento da ocorrência (nome O Presidente da Comissão), passei a presente Ocorrência de Óbito, por mim assinada.`,
            { align: "justify", lineGap: 10 }
        );

        doc.moveDown(4);

        // Signature Line
        doc.text("O PRESIDENTE DA COMISSÃO DE MORADORES", { align: "center", width: 500 });

        doc.moveDown(2);

        // Line for signature
        doc.moveTo(150, doc.y).lineTo(450, doc.y).stroke();

        // QR Code
        doc.image(qrDataURL, 50, 700, { width: 80 });

        doc.end();

        const pdfBuffer = await pdfPromise;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=obito-${cidadao.numero_bi}.pdf`
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
