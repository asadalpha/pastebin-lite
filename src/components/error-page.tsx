interface ErrorPageProps {
    title: string;
    message: string;
}

export function ErrorPage({ title, message }: ErrorPageProps) {
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white border-2 border-zinc-900 p-12">
                <h1 className="text-2xl font-light text-zinc-900 mb-2 tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-zinc-500 mb-8">
                    {message}
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-zinc-900 border-2 border-zinc-900 transition-all duration-200"
                >
                    Create New Paste
                </a>
            </div>
        </div>
    );
}
