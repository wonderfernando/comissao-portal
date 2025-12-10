"use client"

import { useEffect, useId, useState } from "react"
import { CheckIcon, ChevronDownIcon, Loader2, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  
  CommandItem,
  CommandList,
} from "@/components/ui/command" 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export default function SelectWithSearch({ onChange,data: src, resource, isLoading}: {data: {id: number, name: string}[], resource: string, isLoading: boolean, onChange?: (value: string) => void}) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")

  const [data,setData] = useState<{id: number, name: string}[]>()

  useEffect(() => {
    setData(src)
  }, [src])
 
  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? data?.find((framework) => framework.id.toString() === value)
                    ?.name
                : `Selecione a ${resource}`}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
                <div
                  className="border-input flex items-center border-b px-5"
                  cmdk-input-wrapper=""
                >
                <SearchIcon size={20} className="text-muted-foreground/80 me-3" />
                <Input placeholder="Pesquisar"
                onChange={(e) => {
                  const query = e.target.value.toLowerCase()
                  setData(
                    src.filter((framework) =>
                      framework.name.toLowerCase().includes(query)
                    )
                  )
                }}
                  className="placeholder:text-muted-foreground/70 outline-0 border-0 ring-0 flex focus-visible:ring-0 focus:ring-0 w-full rounded-md bg-transparent py-2 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                />
             </div>
            <CommandList>
              <CommandEmpty>Nenhum(a) {resource} selecionado(a).</CommandEmpty>
              <CommandGroup>
                {isLoading && <CommandItem value="0" 
                disabled>
                  <Loader2 size={14} className="animate-spin"/>
                  Carregando...
                </CommandItem>  
              }
                {data?.map((framework) => (
                  <CommandItem
                    key={framework.id}
                    value={framework.id.toString()}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      onChange?.(currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.name}
                    {value === framework.id.toString() && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
