'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface PasteFormProps {
    onSuccess: (url: string) => void;
}

export function PasteForm({ onSuccess }: PasteFormProps) {
    const [content, setContent] = useState('');
    const [ttlSeconds, setTtlSeconds] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const body: {
                content: string;
                ttl_seconds?: number;
                max_views?: number;
            } = { content };

            if (ttlSeconds) {
                const ttl = parseInt(ttlSeconds, 10);
                if (isNaN(ttl) || ttl < 1) {
                    setError('TTL must be a positive integer');
                    setLoading(false);
                    return;
                }
                body.ttl_seconds = ttl;
            }

            if (maxViews) {
                const views = parseInt(maxViews, 10);
                if (isNaN(views) || views < 1) {
                    setError('Max views must be a positive integer');
                    setLoading(false);
                    return;
                }
                body.max_views = views;
            }

            const response = await fetch('/api/pastes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create paste');
                setLoading(false);
                return;
            }

            onSuccess(data.url);
            setContent('');
            setTtlSeconds('');
            setMaxViews('');
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Input */}
            <div className="border-2 border-zinc-900 bg-white transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-b border-zinc-200 px-6 py-3">
                    <label htmlFor="content" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                        Content
                    </label>
                </div>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full h-64 px-6 py-4 bg-white font-mono text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none resize-none"
                    required
                />
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-2 gap-6">
                {/* TTL */}
                <div className="border border-zinc-300 bg-white transition-all duration-300 hover:border-zinc-900">
                    <div className="border-b border-zinc-200 px-4 py-2">
                        <label htmlFor="ttl" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            TTL (seconds)
                        </label>
                    </div>
                    <input
                        id="ttl"
                        type="number"
                        value={ttlSeconds}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTtlSeconds(e.target.value)}
                        placeholder="Optional"
                        min="1"
                        className="w-full px-4 py-3 bg-white font-mono text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                    />
                </div>

                {/* Max Views */}
                <div className="border border-zinc-300 bg-white transition-all duration-300 hover:border-zinc-900">
                    <div className="border-b border-zinc-200 px-4 py-2">
                        <label htmlFor="maxViews" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            Max Views
                        </label>
                    </div>
                    <input
                        id="maxViews"
                        type="number"
                        value={maxViews}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxViews(e.target.value)}
                        placeholder="Optional"
                        min="1"
                        className="w-full px-4 py-3 bg-white font-mono text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="border border-red-900 bg-red-50 px-6 py-4">
                    <p className="text-xs font-mono text-red-900 uppercase tracking-wider">
                        {error}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full border-2 border-zinc-900 bg-zinc-900 px-6 py-4 text-white font-mono text-sm uppercase tracking-wider hover:bg-white hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-900 disabled:hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                    </span>
                ) : (
                    'Create Paste'
                )}
            </button>
        </form>
    );
}
