"use client";

import { VerificarDocumentoResponse } from "./actions";
import { CheckCircle, XCircle, FileCheck, AlertCircle } from "lucide-react";

interface DocumentoVerificadoCardProps {
    resultado: VerificarDocumentoResponse;
    hash: string;
}

export default function DocumentoVerificadoCard({ resultado, hash }: DocumentoVerificadoCardProps) {
   console.log(resultado)
    if (!resultado.success) {
        return (
            <div className="bg-white shadow-lg border-l-4 border-red-600">
                <div className="px-8 py-6 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center space-x-3">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verificação de Documento</h1>
                            <p className="text-sm text-red-700 mt-1">Status: Não Autenticado</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">Documento Não Autêntico</h3>
                                <p className="text-sm text-red-800">
                                    {resultado.mensagem || "O código de verificação fornecido não corresponde a nenhum documento válido no sistema."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Código de Verificação</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{hash}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { dados } = resultado;

    if (!dados) {
        return (
            <div className="bg-white shadow-lg border-l-4 border-gray-400">
                <div className="px-8 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar Dados</h1>
                    <p className="text-gray-600">Não foi possível carregar as informações do documento.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const DataField = ({ label, value }: { label: string; value: string }) => (
        <div className="border-b border-gray-200 py-3">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</dt>
            <dd className="text-sm text-gray-900 font-medium">{value || "N/A"}</dd>
        </div>
    );

    return (
        <div className="bg-white shadow-lg border-l-4 border-green-600">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-green-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verificação de Documento</h1>
                            <p className="text-sm text-green-700 mt-1">Status: Autenticado</p>
                        </div>
                    </div>
                    <FileCheck className="w-12 h-12 text-green-600 opacity-20" />
                </div>
            </div>

            {/* Success Message */}
            <div className="px-8 py-4 bg-green-50 border-b border-green-100">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-sm font-medium text-green-800">
                        {resultado.mensagem || "Documento autêntico e válido"}
                    </p>
                </div>
            </div>

            {/* Document Type */}
        
            {/* Main Content */}
            <div className="px-8 py-6">
                {/* Dados Pessoais */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-900">
                        Dados Pessoais
                    </h2>
                    <dl className="space-y-0">
                        <DataField label="Nome Completo" value={dados.nome_completo} />
                        <DataField label="Número do Documento de indentificacao" value={dados.numero_bi} />
                        <DataField label="Tipo de documento de indentificação" value={dados.tipo_documento || "N/A"} />
                        <DataField label="Data de Nascimento" value={formatDate(dados.data_nascimento)} />
                        <DataField label="Nacionalidade" value={dados.nacionalidade} />
                        <DataField label="Estado Civil" value={dados.estado_civil} />
                        <DataField label="Âmbito Territorial" value={dados.ambito_territorial} />
                    </dl>
                </div>

                {/* Filiação */}
           {/*      <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-900">
                        Filiação
                    </h2>
                    <dl className="space-y-0">
                        <DataField label="Nome do Pai" value={dados.nome_pai} />
                        <DataField label="Nome da Mãe" value={dados.nome_mae} />
                    </dl>
                </div> */}

                {/* Informações do Documento */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-900">
                        Informações do Documento
                    </h2>
                  {/*   <dl className="space-y-0">
                        <DataField label="Data de Emissão" value={formatDate(dados.data_emissao)} />
                        <DataField label="Local de Emissão" value={dados.local_emissao} />
                        <DataField label="Emitido Por" value={dados.criado_por} />
                    </dl> */}
                </div>

                {/* Verification Hash */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Código de Verificação</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{hash}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Este documento foi verificado eletronicamente. A autenticidade pode ser confirmada através do código de verificação acima.
                </p>
            </div>
        </div>
    );
}
