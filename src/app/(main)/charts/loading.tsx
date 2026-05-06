export default function Loading() {
    return (
        <div className="space-y-8">
            <div>
                <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
                <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-border bg-card p-5">
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-muted" />
                        <div className="mt-3 h-4 w-24 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 h-6 w-44 animate-pulse rounded bg-muted" />
                <div className="h-[350px] animate-pulse rounded-xl bg-muted" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="h-6 w-52 animate-pulse rounded bg-muted" />
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        </div>
    );
}
