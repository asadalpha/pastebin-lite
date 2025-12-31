'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PasteViewProps {
    id: string;
    content: string;
    remainingViews: number | null;
    expiresAt: Date | null;
}

export function PasteView({ id, content, remainingViews, expiresAt }: PasteViewProps) {
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2000);
    };

    const copyContent = () => {
        navigator.clipboard.writeText(content).then(() => {
            showToast('Content copied');
        });
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('URL copied');
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">
                        Pastebin
                    </h1>
                    <p className="text-sm text-zinc-500 font-mono uppercase tracking-wider">
                        Paste ID: {id}
                    </p>
                </div>

                {/* Meta Information */}
                {(remainingViews !== null || expiresAt) && (
                    <div className="flex gap-8 flex-wrap p-6 bg-white border border-zinc-300 mb-6">
                        {remainingViews !== null && (
                            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                                Remaining Views
                                <span className="ml-2 text-zinc-900 font-semibold">
                                    {remainingViews}
                                </span>
                            </div>
                        )}
                        {expiresAt && (
                            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                                Expires
                                <span className="ml-2 text-zinc-900 font-semibold">
                                    {new Date(expiresAt).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Content Box */}
                <div className="border-2 border-zinc-900 bg-white transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="border-b border-zinc-200 px-6 py-3">
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            Content
                        </span>
                    </div>
                    <pre className="px-6 py-8 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-zinc-900 bg-white">
                        {content}
                    </pre>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 flex-wrap">
                    <button
                        onClick={copyContent}
                        className="px-6 py-3 border-2 border-zinc-900 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-zinc-900 transition-all duration-200 active:scale-95"
                    >
                        Copy Content
                    </button>
                    <button
                        onClick={copyUrl}
                        className="px-6 py-3 border-2 border-zinc-900 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-zinc-900 transition-all duration-200 active:scale-95"
                    >
                        Copy URL
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border-2 border-zinc-900 bg-white text-zinc-900 font-mono text-xs uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-all duration-200 active:scale-95 inline-block"
                    >
                        Create New
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-200">
                    <p className="text-xs font-mono text-zinc-400 text-center">
                        Pastebin Lite
                    </p>
                </div>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-8 right-8 px-6 py-4 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
