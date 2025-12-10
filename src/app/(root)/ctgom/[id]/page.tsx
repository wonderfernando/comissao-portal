import { getCtgomAction } from "../actions";
import {  CtgomViewProfile } from "./view-ctgom";

export default async function Page({params}: { params: Promise<{ id: string }>}) {
  const {id} = await params;
  const ctgom = await getCtgomAction(Number(id));
  return (
    <div className="w-full rounded-md">   
        <CtgomViewProfile ctgom={ctgom.dados} />
    </div>
  )
}