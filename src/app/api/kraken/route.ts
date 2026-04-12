import { NextResponse } from 'next/server';

export async function GET() {
  const KRAKEN_API = 'https://api.kraken.com/0/public/OHLC?pair=ETHUSD&interval=60';
  const BINANCE_API = 'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h&limit=100';
  
  // 🏺 Source 1: Kraken (Primary)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    
    const response = await fetch(KRAKEN_API, {
      next: { revalidate: 60 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const json = await response.json();
      const pairKey = Object.keys(json.result).find(key => key !== 'last');
      if (pairKey) {
        return NextResponse.json({
          source: 'PRIMARY (KRAKEN)',
          result: json.result[pairKey]
        });
      }
    }
  } catch (error) {
    console.warn('Kraken Primary Oracle Restricted. Diverting to Fallback...', error);
  }

  // 🏺 Source 2: Binance (Fallback)
  try {
    const response = await fetch(BINANCE_API, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Normalize Binance Format [time, open, high, low, close, ...] to Kraken-ish [time, open, high, low, close]
      const normalized = data.map((d: any) => [
        Math.floor(d[0] / 1000), // convert to seconds
        d[1], // open
        d[2], // high
        d[3], // low
        d[4]  // close
      ]);
      
      return NextResponse.json({
        source: 'SECONDARY (BINANCE)',
        result: normalized
      });
    }
  } catch (error) {
    console.error('All Institutional Oracles Restricted.', error);
  }

  return NextResponse.json({ 
    source: 'OFFLINE',
    error: 'Institutional Data Pipeline Disrupted',
    result: [] 
  }, { status: 500 });
}
