
import Image from "next/image";
import { LoginForm } from "./components/fom-login";

export default function EntrarPage() {
  return <div className="grid grid-cols-2 min-w-full mx-auto flex-1 min-h-screen  bg-white overflow-hidden shadow-lg">
    <div className="relative h-full bg-black flex items-center justify-center">
        <Image width={600} height={600} src="/cm.png" alt="Imagem lateral" />
    </div>
     <LoginForm />
  </div>;
 
}