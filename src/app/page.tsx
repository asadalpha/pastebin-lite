'use client';

import { useState } from 'react';
import { PasteForm } from '@/components/paste-form';
import { SuccessMessage } from '@/components/success-message';

export default function Home() {
  const [pasteUrl, setPasteUrl] = useState('');

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">
            Pastebin
          </h1>
          <p className="text-sm text-zinc-500 font-mono">
            Share text with optional constraints
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Success Message */}
          {pasteUrl && <SuccessMessage url={pasteUrl} />}

          {/* Paste Form */}
          <PasteForm onSuccess={setPasteUrl} />
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-200">
          <p className="text-xs font-mono text-zinc-400 text-center">
            Pastebin Lite 
          </p>
        </footer>
      </div>
    </div>
  );
}
