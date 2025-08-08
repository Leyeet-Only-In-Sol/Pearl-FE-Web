export interface Pool {
  id: string;
  name: string;
  token0: string;
  token1: string;
  tvl: number;
  apr: number;
  volume24h: number;
  fees24h: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Portfolio {
  totalValue: number;
  totalFees: number;
  pools: PortfolioPool[];
}

export interface PortfolioPool {
  poolId: string;
  poolName: string;
  deposited: number;
  fees: number;
  tvl: number;
  feeTvlRatio: number;
}