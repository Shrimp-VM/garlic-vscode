import * as net from 'net';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo } from 'vscode-languageclient/node';

let client: LanguageClient | undefined;
let restarting = false;

export function activate(context: vscode.ExtensionContext) {
    client = createClient();
    context.subscriptions.push(client);
    client.start();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
        if (event.affectsConfiguration('garlicLsp.host') || event.affectsConfiguration('garlicLsp.port')) {
            restart(context);
        }
    }));
}

async function restart(context: vscode.ExtensionContext) {
    if (restarting) {
        return;
    }
    restarting = true;
    try {
        await client?.stop();
        client = createClient();
        context.subscriptions.push(client);
        client.start();
    } finally {
        restarting = false;
    }
}

function createClient(): LanguageClient {
    const config = vscode.workspace.getConfiguration('garlicLsp');
    const host = config.get<string>('host', '127.0.0.1');
    const port = config.get<number>('port', 6009);
    const serverOptions: ServerOptions = async (): Promise<StreamInfo> => {
        let lastError: unknown;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await new Promise<StreamInfo>((resolve, reject) => {
                    const socket = net.connect({ host, port }, () => resolve({ reader: socket, writer: socket }));
                    socket.on('error', reject);
                });
            } catch (error) {
                lastError = error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        throw lastError ?? new Error(`cannot connect to Garlic LSP at ${host}:${port}`);
    };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ language: 'garlic' }]
    };
    return new LanguageClient('garlicLsp', 'Garlic LSP', serverOptions, clientOptions);
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
