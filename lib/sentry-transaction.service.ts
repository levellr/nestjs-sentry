import { Request } from 'express';
import { Scope } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { Span, SpanContext } from '@sentry/types';

@Injectable({ scope: Scope.REQUEST })
export class SentryTransactionService {
  get span(): Span | undefined {
    return Sentry.getCurrentHub().getScope()?.getSpan();
  }

  constructor(@Inject(REQUEST) private request: Request) {
    const { method, headers, url } = this.request;

    // recreate transaction based from HTTP request
    const transaction = Sentry.startTransaction({
      name: `Route: ${method} ${url}`,
      op: 'transaction',
    });

    // setup context of newly created transaction
    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);

      // customize your context here
      scope.setContext('http', {
        method,
        url,
        headers,
      });
    });
  }

  startChild(spanContext: SpanContext) {
    return this.span?.startChild(spanContext);
  }
}
