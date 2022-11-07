import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SentryService } from './sentry.service';
import { SentryTransactionService } from './sentry-transaction.service';
export declare class SentryInterceptor implements NestInterceptor {
    private sentryService;
    protected readonly client: SentryService;
    constructor(sentryService: SentryTransactionService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
