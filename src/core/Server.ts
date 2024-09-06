import { config } from "../config";

interface RequestOptions {
    method: string;
    headers?: Record<string, string>;
    body?: any;
};

export interface IBodyMyScore {
    userId: string
    score: number
}

export interface IBodySetUser {
    username: string
    firstName: string
    lastName: string
    id: string
}

export default class Server {
    baseUrl: string;

    constructor() {
        this.baseUrl = config.isDev ? 'http://localhost:5000/' : 'https://carnivalshot.hallofgoats.com/'
    }

    private async request(endpoint: string, options: RequestOptions): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config: RequestInit = {
            method: options.method,
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : null
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Server error');
            }
            return data.data;
        } catch (error) {
            throw error;
        }
    }
    
    public async getLeaderboard(): Promise<any> {
        return await this.request('leaderboards', { method: 'GET' })
    }
    
    public async setMyScore(body: IBodyMyScore): Promise<any> {
        return await this.request('scores', { method: 'POST', body })
    }
    
    public async getMyScore(user: string): Promise<any> {
        return await this.request(`leaderboards/for/${user}`, { method: 'GET' })
    }
}