import { getAuth } from "@/app/(root)/auth";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

// Carregar PDFKit manualmente
const PDFDocument = require("pdfkit");

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const id = params.id;

        const comissaoResposnse = await fetch(`http://localhost:8001/api/comissao/morador/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(await getAuth())
            }
        }).then(r => r.json());
        const comissao = comissaoResposnse.dados;
        const qrDataURL = await QRCode.toDataURL(`https://teusite.gov/comissao/${id}`);

        // Caminho da tua fonte personalizada
        const FONT_PATH = path.join(process.cwd(), "public", "font.ttf");

        // Criar PDF SEM usar fonts internas
        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        // Registrar tua única fonte
        doc.registerFont("regular", FONT_PATH);
        doc.font("regular");

        const chunks: Uint8Array[] = [];
        const pdfPromise = new Promise<Buffer>((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        // Caminhos de imagens
        const publicDir = path.join(process.cwd(), "public");
        const backImagePath = path.join(publicDir, "back.png");
        const insigniaImagePath = path.join(publicDir, "insignia.png");
        const assinaturaImagePath = path.join(publicDir, "certificado", "assinatura.png");

        // Marca d'água
        if (fs.existsSync(backImagePath)) {
            doc.opacity(0.1).image(backImagePath, 100, 150, { width: 400 }).opacity(1);
        }

        // Brasão
        if (fs.existsSync(insigniaImagePath)) {
            doc.image(insigniaImagePath, 250, 40, { width: 100 }).moveDown(8);
        }

        // Cabeçalho
        doc.fontSize(12).text("REPÚBLICA DE ANGOLA", { align: "center" })
        doc.text("GOVERNO PROVINCIAL DE LUANDA", { align: "center" })
        doc.text("ADMINISTRAÇÃO MUNICIPAL DE TALATONA", { align: "center" })

        doc.moveDown(2);
        doc.fontSize(16).text("CERTIFICADO DE REGISTO", { align: "center" });
        doc.moveDown(2);

        const texto = `
Certifico que a Comissão de Moradores do(a) ${comissao.nome}, do Bairro ${comissao.bairro?.nome},
localizada na Comuna de ${comissao.bairro?.comuna?.nome}, Município de ${comissao.bairro?.comuna?.municipio?.nome},
Província de ${comissao.bairro?.comuna?.municipio?.provincia?.nome},
está registada junto da Administração Municipal de Talatona sob o código ${comissao.codigo}.
        `;

        doc.fontSize(12).text(texto, { align: "justify" });

        doc.moveDown(4);
        doc.text("ADMINISTRAÇÃO MUNICIPAL DE TALATONA");
        doc.text("O ADMINISTRADOR");

        // Assinatura
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
