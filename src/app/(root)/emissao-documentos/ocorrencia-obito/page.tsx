import { OcorrenciaObitoContentPage } from "./content-page";
import { Suspense } from "react";
import { Loader } from "../../components/loader";

export default async function Page() {
    return (
        <div className="w-full">
            <Suspense fallback={<Loader />}>
                <OcorrenciaObitoContentPage />
            </Suspense>
        </div>
    )
}
