// Nestjs imports
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  HttpArgumentsHost,
  WsArgumentsHost,
  RpcArgumentsHost,
  ContextType,
  Scope as NestScope,
} from '@nestjs/common/interfaces';
// Rxjs imports
import { catchError, finalize, Observable, throwError } from 'rxjs';
// Sentry imports
import { Handlers, Scope } from '@sentry/node';

import { SentryService } from './sentry.service';
import {
  SentryInterceptorOptions,
  SentryInterceptorOptionsFilter,
} from './sentry.interfaces';
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
        this.client.instance().withScope((scope) => {
          captureException(error, this.sentryService.span?.getTraceContext());
        });
        return throwError(() => error);
      }),
      finalize(() => {
        span?.finish();
        this.sentryService.span?.finish();
      }),
    );
  }
}
