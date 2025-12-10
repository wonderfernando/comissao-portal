import { AlertCircle, Plus } from "lucide-react";
import { DeclaracaoOcorrenciaContentPage } from "./content-page";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Loader } from "../../components/loader";

export default async function Page() {
    return (
        <div className="w-full">
            <Suspense fallback={<Loader />}>
                <DeclaracaoOcorrenciaContentPage />
            </Suspense>
        </div>
    )
}
