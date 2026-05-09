"use client";

import React from 'react';
import { Save, Share2, Settings, User, LogOut } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { signOut } from '@/app/(auth)/actions';

export const TopNav: React.FC = () => {
  const user = useSessionStore((state) => state.user);

  return (
    <nav className="h-[56px] w-full bg-bg-surface-primary border-b border-border-primary flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-primary rounded-md flex items-center justify-center font-bold text-text-inverse">
            U
          </div>
          <span className="font-semibold text-text-primary">UML Architect</span>
        </div>
        <div className="h-4 w-[1px] bg-border-primary mx-2" />
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <span>Untitled Diagram</span>
          <div className="w-2 h-2 bg-status-warning rounded-full" title="Unsaved changes" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <Save size={18} />
        </button>
        <button className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <Share2 size={18} />
        </button>
        <div className="h-4 w-[1px] bg-border-primary mx-1" />
        <button className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <Settings size={18} />
        </button>
        
        {user ? (
          <div className="flex items-center gap-2 ml-2">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-text-tertiary leading-none">Logged in as</span>
              <span className="text-sm text-text-secondary leading-tight">{user.email}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-status-error transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="w-8 h-8 bg-bg-surface-tertiary rounded-full flex items-center justify-center text-text-tertiary border border-border-primary">
            <User size={16} />
          </div>
        )}
      </div>
    </nav>
  );
};
