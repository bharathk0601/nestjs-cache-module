import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
    private readonly cache: Map<string, any> = new Map<string, any>();

    constructor(
        @Inject("DEFAULT_TTL") private readonly defaultTTL: number,
        @Inject("MAX_TTL") private readonly maxTTl: number,
    ) {}
    
    /**
     * 
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttl in seconds.
     */
    public set(key: string, value: any, ttl: number = this.defaultTTL): void {
        if (!ttl && ttl !== 0) {
            throw new Error(`Invalid ttl value: ${ttl}`);
        }
        if (ttl < 1 || ttl > this.maxTTl) {
            throw new Error(`ttl: ${ttl} out of range. should be greater than 1 and less than or equals to ${this.maxTTl}`);
        }

        this.cache.set(key, value);
        this.deleteKeyAfterExire(key, ttl);
    }

    public get(key: string): any {
        return this.cache.get(key);
    }

    public del(key: string): boolean {
        return this.cache.delete(key);
    }

    public has(key: string): boolean {
        return this.cache.has(key);
    }

    private deleteKeyAfterExire(key: string, ttl: number): void {
        try {
            setTimeout(() => this.del(key), ttl * 1000);
        } catch (e) {
            this.del(key);
        }
    }
}

