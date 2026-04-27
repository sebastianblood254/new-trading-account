import { isProduction } from '@/components/shared';
import brandConfig from '../../brand.config.json';
import { DEFAULT_APP_ID } from '@/components/shared/utils/config/config';

/**
 * Service for handling DerivWS trading operations via REST API (V2)
 */
export class DerivWSTradingService {
    /**
     * Gets the DerivWS base URL based on environment
     */
    private static getDerivWSBaseURL(): string {
        const environment = isProduction() ? 'production' : 'staging';
        return brandConfig.platform.derivws.url[environment];
    }

    /**
     * Gets the App ID to use for API requests
     */
    private static getAppId(): string {
        return process.env.APP_ID || (isProduction() ? DEFAULT_APP_ID.PRODUCTION : DEFAULT_APP_ID.STAGING);
    }

    /**
     * Fetches active symbols from the V2 REST API
     */
    static async fetchActiveSymbols(): Promise<any[]> {
        try {
            const baseURL = this.getDerivWSBaseURL();
            const optionsDir = brandConfig.platform.derivws.directories.options;
            const endpoint = `${baseURL}${optionsDir}active_symbols?app_id=${this.getAppId()}`;

            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch active symbols: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result?.data || result?.active_symbols || [];
        } catch (error) {
            console.error('[DerivWS] Error fetching active symbols via REST:', error);
            throw error;
        }
    }

    /**
     * Fetches contracts for a specific symbol
     */
    static async fetchContractsFor(symbol: string): Promise<any[]> {
        try {
            const baseURL = this.getDerivWSBaseURL();
            const optionsDir = brandConfig.platform.derivws.directories.options;
            const endpoint = `${baseURL}${optionsDir}contracts_for/${symbol}?app_id=${this.getAppId()}`;

            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch contracts for ${symbol}: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result?.data?.available || result?.contracts_for?.available || [];
        } catch (error) {
            console.error(`[DerivWS] Error fetching contracts for ${symbol} via REST:`, error);
            throw error;
        }
    }

    /**
     * Fetches ticks history for a symbol
     */
    static async fetchTicksHistory(symbol: string, options: any = {}): Promise<any> {
        try {
            const baseURL = this.getDerivWSBaseURL();
            const optionsDir = brandConfig.platform.derivws.directories.options;
            const queryParams = new URLSearchParams({
                app_id: this.getAppId(),
                count: options.count || '1000',
                end: options.end || 'latest',
                style: options.style || 'ticks',
                ...options
            });
            const endpoint = `${baseURL}${optionsDir}ticks/${symbol}?${queryParams.toString()}`;

            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ticks history for ${symbol}: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[DerivWS] Error fetching ticks history for ${symbol} via REST:`, error);
            throw error;
        }
    }

    /**
     * Fetches trading times from the V2 REST API
     */
    static async fetchTradingTimes(date: string): Promise<any> {
        try {
            const baseURL = this.getDerivWSBaseURL();
            const optionsDir = brandConfig.platform.derivws.directories.options;
            const endpoint = `${baseURL}${optionsDir}trading_times/${date}?app_id=${this.getAppId()}`;

            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch trading times for ${date}: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result?.data || result?.trading_times || { markets: [] };
        } catch (error) {
            console.error(`[DerivWS] Error fetching trading times for ${date} via REST:`, error);
            throw error;
        }
    }
}
