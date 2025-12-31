import { PasteService } from '@/lib/paste.service';
import { PasteView } from '@/components/paste-view';
import { ErrorPage } from '@/components/error-page';
import {
    NotFoundError,
    PasteExpiredError,
    ViewLimitExceededError
} from '@/lib/errors';
import { headers } from 'next/headers';

export default async function PastePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    try {
        const { id } = await params;
        const headersList = await headers();

        // Consume paste (increments view count)
        const pasteData = await PasteService.consumePaste(id, headersList);

        // Render the paste view component
        return (
            <PasteView
                id={id}
                content={pasteData.content}
                expiresAt={pasteData.expires_at ? new Date(pasteData.expires_at) : null}
                remainingViews={pasteData.remaining_views}
            />
        );
    } catch (error) {
        console.error('Error viewing paste:', error);

        // Handle specific errors with appropriate messages
        if (error instanceof NotFoundError) {
            return (
                <ErrorPage
                    title="404"
                    message="This paste does not exist or has been removed."
                />
            );
        }

        if (error instanceof PasteExpiredError) {
            return (
                <ErrorPage
                    title="Expired"
                    message="This paste has expired and is no longer available."
                />
            );
        }

        if (error instanceof ViewLimitExceededError) {
            return (
                <ErrorPage
                    title="View Limit Exceeded"
                    message="This paste has reached its maximum view count."
                />
            );
        }

        // Handle unexpected errors
        return (
            <ErrorPage
                title="500"
                message="An error occurred while loading this paste."
            />
        );
    }
}
