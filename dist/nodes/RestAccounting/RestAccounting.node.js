"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestAccounting = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function apiRequest(method, endpoint, body, qs) {
    const credentials = await this.getCredentials('restAccountingApi');
    const baseUrl = credentials.baseUrl;
    const apiKey = credentials.apiKey;
    const options = {
        method: method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        qs,
        body,
        json: true,
    };
    try {
        return await this.helpers.httpRequest(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: (error === null || error === void 0 ? void 0 : error.message) || 'Request failed' });
    }
}
class RestAccounting {
    constructor() {
        this.description = {
            displayName: 'Rest Accounting',
            name: 'restAccounting',
            icon: 'file:restAccounting.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Rest Accounting API',
            defaults: { name: 'Rest Accounting' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'restAccountingApi', required: true }],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    options: [
                        { name: 'Health', value: 'health' },
                        { name: 'Accounts', value: 'accounts' },
                        { name: 'Journal Entries', value: 'journals' },
                        { name: 'Reports', value: 'reports' },
                    ],
                    default: 'health',
                },
                // Health
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['health'] } },
                    options: [{ name: 'Get', value: 'get' }],
                    default: 'get',
                },
                // Accounts operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['accounts'] } },
                    options: [
                        { name: 'List', value: 'list' },
                        { name: 'Create', value: 'create' },
                        { name: 'Get', value: 'get' },
                        { name: 'Update', value: 'update' },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Account ID',
                    name: 'accountId',
                    type: 'number',
                    required: true,
                    default: 1,
                    displayOptions: { show: { resource: ['accounts'], operation: ['get', 'update'] } },
                },
                {
                    displayName: 'Account Fields',
                    name: 'accountFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    options: [
                        { displayName: 'Code', name: 'code', type: 'string', default: '' },
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Type', name: 'type', type: 'string', default: '' },
                        { displayName: 'Parent ID', name: 'parent_id', type: 'number', default: 0 },
                    ],
                    displayOptions: { show: { resource: ['accounts'], operation: ['create', 'update'] } },
                    required: false,
                    default: {},
                },
                // Journals
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['journals'] } },
                    options: [
                        { name: 'Search', value: 'search' },
                        { name: 'Create', value: 'create' },
                        { name: 'Get', value: 'get' },
                        { name: 'Delete', value: 'delete' },
                    ],
                    default: 'search',
                },
                {
                    displayName: 'Entry ID',
                    name: 'entryId',
                    type: 'number',
                    required: true,
                    default: 1,
                    displayOptions: { show: { resource: ['journals'], operation: ['get', 'delete'] } },
                },
                {
                    displayName: 'Journal Payload',
                    name: 'journalPayload',
                    type: 'json',
                    required: true,
                    default: '{"date":"2025-01-01","lines":[]}',
                    displayOptions: { show: { resource: ['journals'], operation: ['create'] } },
                },
                // Reports
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['reports'] } },
                    options: [
                        { name: 'Trial Balance', value: 'trialBalance' },
                        { name: 'Ledger', value: 'ledger' },
                        { name: 'Balance Sheet', value: 'balanceSheet' },
                        { name: 'Profit & Loss', value: 'profitLoss' },
                    ],
                    default: 'trialBalance',
                },
                {
                    displayName: 'Account ID',
                    name: 'ledgerAccountId',
                    type: 'number',
                    required: true,
                    default: 1,
                    displayOptions: { show: { resource: ['reports'], operation: ['ledger'] } },
                },
                {
                    displayName: 'Query Parameters',
                    name: 'query',
                    type: 'collection',
                    placeholder: 'Add Query',
                    options: [
                        { displayName: 'Start Date', name: 'start_date', type: 'string', default: '' },
                        { displayName: 'End Date', name: 'end_date', type: 'string', default: '' },
                        { displayName: 'Reference', name: 'reference', type: 'string', default: '', displayOptions: { show: { resource: ['journals'], operation: ['search'] } } },
                        { displayName: 'Description', name: 'description', type: 'string', default: '', displayOptions: { show: { resource: ['journals'], operation: ['search'] } } },
                        { displayName: 'Page', name: 'page', type: 'number', default: 1 },
                        { displayName: 'Page Size', name: 'page_size', type: 'number', default: 50 },
                    ],
                    default: {},
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            let response;
            if (resource === 'health' && operation === 'get') {
                response = await apiRequest.call(this, 'GET', '/health');
            }
            if (resource === 'accounts') {
                if (operation === 'list') {
                    const query = this.getNodeParameter('query', i, {});
                    response = await apiRequest.call(this, 'GET', '/accounts', undefined, query);
                }
                if (operation === 'create') {
                    const body = this.getNodeParameter('accountFields', i, {});
                    response = await apiRequest.call(this, 'POST', '/accounts', body);
                }
                if (operation === 'get') {
                    const id = this.getNodeParameter('accountId', i);
                    response = await apiRequest.call(this, 'GET', `/accounts/${id}`);
                }
                if (operation === 'update') {
                    const id = this.getNodeParameter('accountId', i);
                    const body = this.getNodeParameter('accountFields', i, {});
                    response = await apiRequest.call(this, 'PUT', `/accounts/${id}`, body);
                }
            }
            if (resource === 'journals') {
                if (operation === 'search') {
                    const query = this.getNodeParameter('query', i, {});
                    response = await apiRequest.call(this, 'GET', '/journal-entries', undefined, query);
                }
                if (operation === 'create') {
                    const body = this.getNodeParameter('journalPayload', i);
                    response = await apiRequest.call(this, 'POST', '/journal-entries', body);
                }
                if (operation === 'get') {
                    const id = this.getNodeParameter('entryId', i);
                    response = await apiRequest.call(this, 'GET', `/journal-entries/${id}`);
                }
                if (operation === 'delete') {
                    const id = this.getNodeParameter('entryId', i);
                    response = await apiRequest.call(this, 'DELETE', `/journal-entries/${id}`);
                }
            }
            if (resource === 'reports') {
                const query = this.getNodeParameter('query', i, {});
                if (operation === 'trialBalance') {
                    response = await apiRequest.call(this, 'GET', '/reports/trial-balance', undefined, query);
                }
                if (operation === 'ledger') {
                    const accountId = this.getNodeParameter('ledgerAccountId', i);
                    response = await apiRequest.call(this, 'GET', `/reports/ledger/${accountId}`, undefined, query);
                }
                if (operation === 'balanceSheet') {
                    response = await apiRequest.call(this, 'GET', '/reports/balance-sheet', undefined, query);
                }
                if (operation === 'profitLoss') {
                    response = await apiRequest.call(this, 'GET', '/reports/profit-loss', undefined, query);
                }
            }
            returnData.push({ json: response });
        }
        return [returnData];
    }
}
exports.RestAccounting = RestAccounting;
