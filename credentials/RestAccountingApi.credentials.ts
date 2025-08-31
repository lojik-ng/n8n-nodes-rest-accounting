import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RestAccountingApi implements ICredentialType {
    name = 'restAccountingApi';
    displayName = 'Rest Accounting API';
    properties: INodeProperties[] = [
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
