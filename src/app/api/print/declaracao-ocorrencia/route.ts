import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

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
    // Ocorrencia specific fields that might be passed
    descricao_ocorrencia?: string;
    tipo_declaracao?: string; // Denuncio or Participo
    nome_declarante?: string;
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
        descricao_ocorrencia?: string;
        tipo_declaracao?: string;
        nome_declarante?: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { cidadao, comissao, hash_qr } = body.dados;
        const descricao = body.dados.descricao_ocorrencia || cidadao.descricao_ocorrencia || "";
        const tipoDeclaracao = body.dados.tipo_declaracao || cidadao.tipo_declaracao || "Participo";
        const nomeDeclarante = body.dados.nome_declarante || cidadao.nome_declarante || cidadao.nome_completo; // Fallback to main name if not separate

        if (!cidadao || !comissao) {
            return new NextResponse(
                JSON.stringify({ error: "Dados inválidos: Cidadão ou Comissão não encontrados" }),
                { status: 400 }
            );
        }

        // Generate QR Code
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

        // Watermark
        if (fs.existsSync(backImagePath)) {
            doc.opacity(0.1).image(backImagePath, 100, 150, { width: 400 }).opacity(1);
        }

        // Insignia/Brasão
    /*     if (fs.existsSync(insigniaImagePath)) {
            doc.image(insigniaImagePath, 250, 40, { width: 100 }).moveDown(8);
        } else {
            doc.moveDown(8);
        }
 */
        // Header - CM Number
        doc.fontSize(12).text(`CM n.º ${comissao.codigo}`, { align: "right" });

        doc.moveDown(2);

        // Title
        doc.fontSize(14).font("Helvetica-Bold").text("DECLARAÇÃO DE OCORRÊNCIA", {
            align: "center",
            underline: true
        });
        doc.font("regular");

        doc.moveDown(3);

        // Body Text
        // "Para os devidos efeitos, (Denuncio, Participo) que,"
        doc.fontSize(12).text(
            `Para os devidos efeitos, ${tipoDeclaracao} que, ${descricao}`,
            { align: "left" }
        );

        //doc.moveDown(1);

        // Description lines
        const descriptionLines = doc.heightOfString(descricao, { width: 450 });
    /*     if (descricao) {
            doc.text(descricao, { align: "justify", lineGap: 5 });
        } else {
            // Draw dotted lines if empty (for manual filling, though usually digital)
            for (let i = 0; i < 5; i++) {
                doc.text(".........................................................................................................................................................");
                doc.moveDown(0.5);
            }
        } */

        doc.moveDown(3);

        // Name of declarant
        doc.text(
            `${nomeDeclarante}`,
            { align: "left" }
        );

        doc.moveDown(2);

        // Closing
        doc.text(
            "Por ser verdade, passei a presente Declaração de Ocorrência, por mim assinada.",
            { align: "justify", lineGap: 10 }
        );

        doc.moveDown(6);

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
                "Content-Disposition": `inline; filename=ocorrencia-${Date.now()}.pdf`
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
