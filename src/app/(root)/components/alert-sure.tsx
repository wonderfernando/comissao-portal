import { CircleAlertIcon, Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import { retStatusComissao } from "../comissao-moradores/utils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  description?: string;
  title?: string;
  config: UseMutationOptions<any, Error, { state: string; id: string }>;
  comissaoId?: string;
}

export default function AlertComponent({ open, config, onOpenChange, status, description, title, comissaoId }: Props) {
  const { mutate, isPending } = useMutation(config)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description} Para: {retStatusComissao(status)}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            e.preventDefault(); // Prevent default close behavior of AlertDialogAction
            mutate({ state: status, id: comissaoId || '' });
          }} disabled={isPending} >Confirmar {isPending && <Loader2 className="animate-spin"/>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
