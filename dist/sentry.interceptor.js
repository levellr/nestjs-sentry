"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryInterceptor = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("@nestjs/common/interfaces");
const rxjs_1 = require("rxjs");
const sentry_service_1 = require("./sentry.service");
const sentry_transaction_service_1 = require("./sentry-transaction.service");
const node_1 = require("@sentry/node");
let SentryInterceptor = class SentryInterceptor {
    constructor(sentryService) {
        this.sentryService = sentryService;
        this.client = sentry_service_1.SentryService.SentryServiceInstance();
    }
    intercept(context, next) {
        const span = this.sentryService.startChild({ op: `route handler` });
        return next.handle().pipe((0, rxjs_1.catchError)((error) => {
            this.client.instance().withScope((scope) => {
                var _a;
                (0, node_1.captureException)(error, (_a = this.sentryService.span) === null || _a === void 0 ? void 0 : _a.getTraceContext());
            });
            return (0, rxjs_1.throwError)(() => error);
        }), (0, rxjs_1.finalize)(() => {
            var _a;
            span === null || span === void 0 ? void 0 : span.finish();
            (_a = this.sentryService.span) === null || _a === void 0 ? void 0 : _a.finish();
        }));
    }
};
SentryInterceptor = __decorate([
    (0, common_1.Injectable)({ scope: interfaces_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [sentry_transaction_service_1.SentryTransactionService])
], SentryInterceptor);
exports.SentryInterceptor = SentryInterceptor;
//# sourceMappingURL=sentry.interceptor.js.map