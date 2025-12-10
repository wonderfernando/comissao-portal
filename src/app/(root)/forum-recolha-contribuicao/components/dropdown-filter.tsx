import { ListFilter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function DropDownFilterEntity() {
    return (
        <Popover>
            <PopoverTrigger asChild>
              <Button className="mr-2" variant="outline" size={"sm"}>
                Filtros
                <ListFilter /> 
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filtros
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Checkbox />
                         <Label
                            
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Activos
                        <span className="text-muted-foreground ms-2 text-xs">
                          12
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox />
                         <Label
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Inactivos
                        <span className="text-muted-foreground ms-2 text-xs">
                          98
                        </span>
                      </Label>
                    </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
    )
}