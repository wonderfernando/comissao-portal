import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

// Load PDFKit manually
const PDFDocument = require("pdfkit");

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Expecting body to be the result of saveDocumentAction which contains { dados: { comissao: ... } }
        // Or if the body is just the payload, we need to adjust.
        // Based on declaracao-morador-form, it sends 'result' which is the response from saveDocumentAction.
        // saveDocumentAction returns { success, dados, mensagem }.
        // So we look for body.dados.comissao

        const comissao = body.dados?.comissao;

        if (!comissao) {
            return new NextResponse(
                JSON.stringify({
                    error: "Dados da comissão não encontrados",
                }),
                { status: 400 }
            );
        }

        const id = comissao.id;
        const qrDataURL = await QRCode.toDataURL(`https://teusite.gov/comissao/${id}`);

        // Font path
        const FONT_PATH = path.join(process.cwd(), "public", "font.ttf");

        // Create PDF
        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        if (fs.existsSync(FONT_PATH)) {
            doc.registerFont("regular", FONT_PATH);
            doc.font("regular");
        }

        const chunks: Uint8Array[] = [];
        const pdfPromise = new Promise<Buffer>((resolve, reject) => {
            doc.on("data", (chunk: any) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        // Image paths
        const publicDir = path.join(process.cwd(), "public");
        const backImagePath = path.join(publicDir, "back.png");
        const insigniaImagePath = path.join(publicDir, "insignia.png");
        const assinaturaImagePath = path.join(publicDir, "certificado", "assinatura.png");

        // Watermark
        if (fs.existsSync(backImagePath)) {
            doc.opacity(0.1).image(backImagePath, 100, 150, { width: 400 }).opacity(1);
        }

        // Coat of Arms
        if (fs.existsSync(insigniaImagePath)) {
            doc.image(insigniaImagePath, 250, 40, { width: 100 }).moveDown(8);
        }

        // Header
        doc.fontSize(12).text("REPÚBLICA DE ANGOLA", { align: "center" })
        doc.text("GOVERNO PROVINCIAL DE LUANDA", { align: "center" })
        doc.text("ADMINISTRAÇÃO MUNICIPAL DE TALATONA", { align: "center" })

        doc.moveDown(2);
        doc.fontSize(16).text("CERTIFICADO DE REGISTO", { align: "center" });
        doc.moveDown(2);

        // Text Content
        // Using optional chaining just in case
        const nome = comissao.nome || "_________________";
        const bairro = comissao.bairro?.nome || "_________________";
        const comuna = comissao.bairro?.comuna?.nome || "_________________";
        const municipio = comissao.bairro?.comuna?.municipio?.nome || "_________________";
        const provincia = comissao.bairro?.comuna?.municipio?.provincia?.nome || "_________________";
        const codigo = comissao.codigo || "PENDENTE";

        const texto = `
Certifico que a Comissão de Moradores do(a) ${nome}, do Bairro ${bairro},
localizada na Comuna de ${comuna}, Município de ${municipio},
Província de ${provincia},
está registada junto da Administração Municipal de Talatona sob o código ${codigo}.
        `;

        doc.fontSize(12).text(texto, { align: "justify" });

        doc.moveDown(4);
        doc.text("ADMINISTRAÇÃO MUNICIPAL DE TALATONA");
        doc.text("O ADMINISTRADOR");

        // Signature
        if (fs.existsSync(assinaturaImagePath)) {
            doc.image(assinaturaImagePath, 60, doc.y + 10, { width: 120 });
        }

        // QR CODE
        doc.image(qrDataURL, 450, 700, { width: 100 });

        doc.end();

        const pdfBuffer = await pdfPromise;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=certificado-${id}.pdf`
            }
        });

    } catch (error: any) {
        console.error("Error generating PDF:", error);
        return new NextResponse(
            JSON.stringify({
                error: "Failed to generate PDF",
                details: error?.message
            }),
            { status: 500 }
        );
    }
}
