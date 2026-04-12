import { useQuery } from '@tanstack/react-query';

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TerminalMetrics {
  apr: number;
  tvl: number;
  volatility: number;
  ethBalance: string;
  usdcBalance: string;
  auditLogs: Array<{
    id: string;
    action: 'DEPOSIT_LP' | 'OPEN_HEDGE' | 'REBALANCE' | 'EXIT';
    timestamp: string;
    txHash: string;
    status: 'VALIDATED' | 'PENDING' | 'FAILED';
    details: string;
  }>;
}

const KRAKEN_API = 'https://api.kraken.com/0/public/OHLC?pair=ETHUSD&interval=60';

export function useTerminalData() {
  // Kraken Market Data Fetcher
  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['kraken-ohlc', 'ETHUSD'],
    queryFn: async () => {
      try {
        const response = await fetch(KRAKEN_API);
        const json = await response.json();
        
        const pairKey = Object.keys(json.result).find(key => key !== 'last');
        if (!pairKey) return [];

        return json.result[pairKey].map((d: any) => ({
          time: d[0],
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        })) as OHLCData[];
      } catch (e) {
        console.error("Kraken Fetch Error:", e);
        return [];
      }
    },
    refetchInterval: 60000,
  });

  const latestPrice = chartData && chartData.length > 0 ? chartData[chartData.length - 1].close : 0;

  return {
    chartData,
    latestPrice,
    isLoading: isLoadingChart,
  };
}
