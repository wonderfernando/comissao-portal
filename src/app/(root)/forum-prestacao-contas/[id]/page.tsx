import { getCtgomAction, getForumById } from "../actions";
import {  ForumViewProfile } from "./vew-forum";

export default async function Page({params}: { params: Promise<{ id: string }>}) {
  const {id} = await params;
  const forum = await getForumById(Number(id));
  console.log(forum);
  return (
    <div className="w-full rounded-md">   
        <ForumViewProfile forum={forum.dados} />
    </div>
  )
}