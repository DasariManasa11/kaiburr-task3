import { Task } from './types';

const BASE = 'http://localhost:8080/tasks';

async function handleResp(resp: Response) {
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || resp.statusText);
    }
    return resp.json().catch(() => null);
}

export const api = {
    list: async (): Promise<Task[]> => {
        const r = await fetch(BASE);
        return handleResp(r);
    },
    get: async (id: string): Promise<Task> => {
        const r = await fetch(`${BASE}/${encodeURIComponent(id)}`);
        return handleResp(r);
    },
    save: async (task: Task): Promise<Task> => {
        const r = await fetch(BASE, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        return handleResp(r);
    },
    delete: async (id: string): Promise<void> => {
        const r = await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
        return handleResp(r);
    },
    searchByName: async (name: string): Promise<Task[]> => {
        const r = await fetch(`${BASE}/search?name=${encodeURIComponent(name)}`);
        return handleResp(r);
    },
    execute: async (id: string, podName?: string) => {
        const url = `${BASE}/${encodeURIComponent(id)}/executions${podName ? `?podName=${encodeURIComponent(podName)}` : ''
            }`;
        const r = await fetch(url, { method: 'PUT' });
        return handleResp(r);
    },
};
