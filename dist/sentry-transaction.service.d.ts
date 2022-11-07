import { Request } from 'express';
import * as Sentry from '@sentry/node';
import { Span, SpanContext } from '@sentry/types';
export declare class SentryTransactionService {
    private request;
    get span(): Span | undefined;
    constructor(request: Request);
    startChild(spanContext: SpanContext): Sentry.Span | undefined;
}
