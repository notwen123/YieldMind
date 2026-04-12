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

const KRAKEN_API = '/api/kraken';

export function useTerminalData() {
  // Resilient Oracle Fetcher
  const { data, isLoading: isLoadingChart } = useQuery({
    queryKey: ['institutional-ohlc'],
    queryFn: async () => {
      try {
        const response = await fetch(KRAKEN_API);
        const json = await response.json();
        
        if (!json.result || !Array.isArray(json.result)) {
          console.warn("Institutional Pipeline Warning:", json.error || "Malformed data");
          return { source: json.source || 'ERROR', result: [] as OHLCData[] };
        }

        const formatted = json.result.map((d: any) => ({
          time: Number(d[0]),
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        })) as OHLCData[];

        return {
          source: json.source as string,
          result: formatted
        };
      } catch (e) {
        console.error("Resilient Fetch Error:", e);
        return { source: 'DISRUPTED', result: [] as OHLCData[] };
      }
    },
    refetchInterval: 60000,
  });

  const chartData = data?.result || [];
  const oracleSource = data?.source || 'LOADING';
  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;

  return {
    chartData,
    latestPrice,
    oracleSource,
    isLoading: isLoadingChart,
  };
}
