// Nestjs imports
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Scope as NestScope } from '@nestjs/common/interfaces';
import { catchError, finalize, Observable, throwError } from 'rxjs';

import { SentryService } from './sentry.service';
import { SentryTransactionService } from './sentry-transaction.service';
import { captureException } from '@sentry/node';

@Injectable({ scope: NestScope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  protected readonly client: SentryService =
    SentryService.SentryServiceInstance();
  constructor(private sentryService: SentryTransactionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // start a child span for performance tracing
    const span = this.sentryService.startChild({ op: `route handler` });

    return next.handle().pipe(
      catchError((error) => {
        if (this.shouldReport(error)) {
          this.client.instance().withScope((scope) => {
            captureException(error, this.sentryService.span?.getTraceContext());
          });
        }
        return throwError(() => error);
      }),
      finalize(() => {
        span?.finish();
        this.sentryService.span?.finish();
      }),
    );
  }

  private shouldReport(exception: any) {
    const isHttpException =
      'response' in exception &&
      typeof exception['response'] === 'object' &&
      'statusCode' in exception['response'];

    if (!isHttpException) {
      return true;
    }

    const isServerError = exception['response']['statusCode'] >= 500;
    return isServerError;
  }
}
