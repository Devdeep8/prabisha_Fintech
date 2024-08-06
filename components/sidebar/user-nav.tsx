'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { verificationByPan } from '@/utils/verifypan';
import { Button } from '@/components/ui/button';
import { VerifiedIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { verifyTokenAndReturnCookies } from '@/lib/cookie';
import { JWTPayload } from 'jose';

export const UserNav: React.FC = () => {
  const [userInfo, setUserInfo] = useState<JWTPayload | null>(null);
  const [userPanAuthWithUser, setUserPanAuthWithUser] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
        const userData = await verifyTokenAndReturnCookies();
        if (userData) {
          setUserInfo(userData);
          const userPanAuth = await verificationByPan(userData?.userId)
          if(userPanAuth.length > 0){ setUserPanAuthWithUser(true) }
        } else {
        setUserInfo(null);

      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return null; // Or render a placeholder if needed
  }

  return (
    <DropdownMenu>
      {userPanAuthWithUser && (
     
      
          <VerifiedIcon className='w-8 h-8 text-green-500' />
          
      
        
      )}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={typeof userInfo.image === 'string' ? userInfo.image : ''}
              alt={typeof userInfo.name === 'string' ? userInfo.name : ''}
            />
            <AvatarFallback>{typeof userInfo.username === 'string' ? userInfo.username[0] : ''}</AvatarFallback>
          </Avatar>
        </Button>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {typeof userInfo.username === 'string' ? userInfo.username : ''}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {typeof userInfo.email === 'string' ? userInfo.email : ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
