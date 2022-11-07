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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryTransactionService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Sentry = require("@sentry/node");
let SentryTransactionService = class SentryTransactionService {
    constructor(request) {
        this.request = request;
        const { method, headers, url } = this.request;
        const transaction = Sentry.startTransaction({
            name: `Route: ${method} ${url}`,
            op: 'transaction',
        });
        Sentry.getCurrentHub().configureScope((scope) => {
            scope.setSpan(transaction);
            scope.setContext('http', {
                method,
                url,
                headers,
            });
        });
    }
    get span() {
        var _a;
        return (_a = Sentry.getCurrentHub().getScope()) === null || _a === void 0 ? void 0 : _a.getSpan();
    }
    startChild(spanContext) {
        var _a;
        return (_a = this.span) === null || _a === void 0 ? void 0 : _a.startChild(spanContext);
    }
};
SentryTransactionService = __decorate([
    (0, common_2.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_2.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], SentryTransactionService);
exports.SentryTransactionService = SentryTransactionService;
//# sourceMappingURL=sentry-transaction.service.js.map