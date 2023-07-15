import { DynamicModule, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";

@Module({})
export class CacheModule {
    private static MAX_TTL = 2147483; // maximum value of setTimeout in seconds.

    static register(opts?: { defaultTTL: number }): DynamicModule {
        const defaultTTL = opts?.defaultTTL;
        if (defaultTTL && (defaultTTL < 1 || defaultTTL > this.MAX_TTL)) {
            throw new Error(`ttl: ${defaultTTL} out of range. should be greater than 1 and less than or equals to ${this.MAX_TTL}`);
        }

        return {
            module: CacheModule,
            providers: [
                CacheService,
                {
                    provide: "DEFAULT_TTL",
                    useFactory: () => defaultTTL
                },
                {
                    provide: "MAX_TTL",
                    useFactory: () => this.MAX_TTL 
                }
            ],
            exports: [CacheService]
        };
    }
}
