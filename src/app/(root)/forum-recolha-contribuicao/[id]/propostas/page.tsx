import { getForumById } from "../../actions";
import ForumContribuicoes from "./view-proposta";

export default async function page({ params }: { params: { id: string } }) {
   const forum = await getForumById(Number(params.id));
   if (!forum?.dados)
      return <></>
    return <ForumContribuicoes dados={forum.dados} />;
}