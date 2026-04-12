'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, UTCTimestamp } from 'lightweight-charts';
import { OHLCData } from '@/hooks/useTerminalData';
import { cn } from '@/lib/utils';

interface MarketChartProps {
  data: OHLCData[];
  oracleSource?: string;
  containerClassName?: string;
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, oracleSource, containerClassName }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#020202' }, // Force Deep Obsidian
        textColor: '#71717a',
        fontFamily: 'var(--font-figtree)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#FF6B00',
      downColor: '#09090b',
      borderVisible: true,
      wickUpColor: '#FF6B00',
      wickDownColor: '#71717a',
      borderColor: '#FF6B00',
      borderUpColor: '#FF6B00',
      borderDownColor: '#27272a',
    });

    if (data && data.length > 0) {
      const formattedData = data.map(d => ({
        ...d,
        time: d.time as UTCTimestamp,
      }));
      candlestickSeries.setData(formattedData);
      chart.timeScale().fitContent();
    }

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width } = entries[0].contentRect;
      chartRef.current.applyOptions({ width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return (
    <div className={cn("relative min-h-[400px]", containerClassName)}>
      {/* 🏺 Sync Overlay */}
      {(!data || data.length === 0) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#020202] z-20">
          <div className="w-8 h-8 rounded-full border-2 border-brand-orange/20 border-t-brand-orange animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            {oracleSource === 'DISRUPTED' ? 'Institutional Pipeline Restricted' : 'Syncing Institutional Feeds...'}
          </span>
        </div>
      ) : null}

      {/* 🏺 Pipeline Telemetry */}
      <div className="absolute top-4 right-6 z-[30] flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
          oracleSource?.includes('PRIMARY') ? "bg-emerald-500 shadow-emerald-500/50" : 
          oracleSource?.includes('SECONDARY') ? "bg-amber-500 animate-pulse shadow-amber-500/50" : 
          "bg-red-500 animate-ping shadow-red-500/50"
        )} />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Source: <span className="text-zinc-200">{oracleSource}</span>
        </span>
      </div>

      <div 
        ref={chartContainerRef} 
        className="w-full h-[400px] relative z-10"
      />
      <div className="absolute inset-0 bg-brand-orange/[0.01] pointer-events-none" />
    </div>
  );
};
