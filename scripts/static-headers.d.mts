export declare const ONE_YEAR: number;
export declare const IMMUTABLE_PATTERN: RegExp;
export declare function isImmutable(pathname: string): boolean;
export declare function buildCsp(scriptHashes: Iterable<string>): string;
export declare function securityHeaders(csp: string): Record<string, string>;
export declare function cacheControl(pathname: string): string;
export declare function buildHtaccess(csp: string): string;
