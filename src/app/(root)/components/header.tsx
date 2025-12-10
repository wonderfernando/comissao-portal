import React from 'react';
import { DropdownMenuProfile } from './profile-dropdown';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import BreadcrumbComp from '@/components/comp-450';
import { getCurrentUser } from '../auth';
export async function Header() {
    const user = await getCurrentUser();
    console.log("dado do current ",user)
     return (
    <header className='w-full h-20
    bg-white shadow flex
        items-center px-4
        rounded-lg
        mt-2
        '>
        <div className='m-0 text-xl flex items-center'>
          <BreadcrumbComp />
        </div>
        
       <div className='flex ml-auto items-center gap-2'>
         {/*    <DropdownMenuNotify>
                <Button className=" bg-zinc-50 hover:bg-gray-100 w-10 h-10 rounded-full "><Settings2 className='text-zinc-700'/></Button>
            </DropdownMenuNotify>
            <DropdownMenuNotify>
                <Button className=" bg-zinc-50 hover:bg-gray-100  w-10 h-10 rounded-full "><BellIcon className='text-zinc-700'/></Button>
            </DropdownMenuNotify>
 */}
             <DropdownMenuProfile>
             <Avatar className='w-10 h-10 cursor-pointer'>
                <AvatarFallback className='font-semibold text-zinc-700'>{user?.nome?.charAt(0).toUpperCase()}{user?.nome?.charAt(1).toUpperCase()}</AvatarFallback>
            </Avatar>
            </DropdownMenuProfile>
       </div>
    </header>
    )
}
