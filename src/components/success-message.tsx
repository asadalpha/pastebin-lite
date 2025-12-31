'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SuccessMessageProps {
    url: string;
}

export function SuccessMessage({ url }: SuccessMessageProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-zinc-900 bg-white p-8 transition-all duration-300">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                        Paste Created
                    </span>
                    <Link
                        href="/"
                        className="text-xs font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        Create New
                    </Link>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            readOnly
                            className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 font-mono text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="px-6 py-3 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-4"
                    >
                        Open in new tab →
                    </a>
                </div>
            </div>
        </div>
    );
}
