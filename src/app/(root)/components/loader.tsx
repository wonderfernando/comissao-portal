import { Settings } from "lucide-react";

export function Loader() {
    return (
        <div className="flex items-center justify-center h-64">
            <Settings className="animate-spin text-gray-500 w-10 h-10" />
        </div>
    )
}