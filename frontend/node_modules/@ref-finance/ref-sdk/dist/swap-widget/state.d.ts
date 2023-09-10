import React from 'react';
import { EstimateSwapView, Pool, StablePool, TokenMetadata, Transaction } from '../types';
import { SwapOptions } from '../v1-swap/swap';
import { SwapOutParams } from './types';
import { Theme } from './constant';
export declare const ThemeContext: React.Context<Theme>;
export declare const ThemeContextProvider: React.FC<{
    customTheme: Theme | undefined;
}>;
export declare const estimateValidator: (swapTodos: EstimateSwapView[], tokenIn: TokenMetadata, parsedAmountIn: string, tokenOut: TokenMetadata) => boolean;
export declare const useAllTokens: ({ reload }: {
    reload?: boolean | undefined;
}) => {
    tokens: Record<string, TokenMetadata> | undefined;
    tokensLoading: boolean;
};
export declare const useTokensIndexer: ({ defaultTokenList, AccountId, }: {
    defaultTokenList?: TokenMetadata[] | undefined;
    AccountId?: string | undefined;
}) => {
    tokens: TokenMetadata[];
    tokenLoading: boolean;
};
export declare const useRefPools: (refreshTrigger: boolean) => {
    allPools: {
        simplePools: Pool[];
        ratedPools: Pool[];
        unRatedPools: Pool[];
    };
    allStablePools: StablePool[];
    poolFetchingState: "loading" | "end";
};
export declare const useSwap: (params: {
    tokenIn?: TokenMetadata | undefined;
    tokenOut?: TokenMetadata | undefined;
    amountIn: string;
    simplePools: Pool[];
    options?: SwapOptions | undefined;
} & {
    slippageTolerance: number;
    refreshTrigger: boolean;
    onSwap: (transactionsRef: Transaction[]) => void;
    AccountId?: string | undefined;
    poolFetchingState?: "loading" | "end" | undefined;
    referralId?: string | undefined;
}) => SwapOutParams;
export declare const TokenPriceContext: React.Context<Record<string, any> | null>;
export declare const useTokenPriceList: () => Record<string, any>;
export declare const TokenPriceContextProvider: React.FC;
export declare const useTokenBalnces: (tokens: TokenMetadata[], AccountId: string) => Record<string, string>;
