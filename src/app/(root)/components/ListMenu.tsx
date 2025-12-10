"use client"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function ListMenuItem({ menu }: { menu: { label: string, link: string, key: number }[] }) {
    const pathname = usePathname(); // Pega a rota atual
 
    console.log("Params:", pathname.split("/")[1]);
      return (
        <div className="flex flex-wrap gap-2 text-sm text-zinc-600">
            {
                menu?.map((item) => (<Link
                    key={item?.key?.toString()}
                    href={`/${pathname.split("/")[1]}/${item.link}`}
                    className={`relative hover:bg-zinc-200 hover:rounded px-4 py-2 text-sm font-medium transition-all 
                    ${pathname.split("/")[2] === item.link || (item.link === "/" && !pathname.split("/")[2])
                            ? "text-zinc-900 after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-zinc-900 after:rounded-md after:transition-all"
                            : "text-zinc-500 hover:text-black"
                        }`}
                >
                    {<span className={` ${pathname.split("/")[2] === item.link ? "font-extrabold" : ""}`}>{item.label}</span>}
                </Link>))
            }
        </div>
    )
}