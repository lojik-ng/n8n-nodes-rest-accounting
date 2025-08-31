"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestAccountingApi = void 0;
class RestAccountingApi {
    constructor() {
        this.name = 'restAccountingApi';
        this.displayName = 'Rest Accounting API';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://localhost:3000',
                description: 'Base URL of the Rest Accounting API',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                description: 'API key passed in x-api-key header',
                required: true,
                typeOptions: { password: true },
            },
        ];
    }
}
exports.RestAccountingApi = RestAccountingApi;
