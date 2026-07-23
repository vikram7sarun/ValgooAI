export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startMockSignalGenerator } = await import("./src/lib/signals/generator");
    const { startMarketDataTicker } = await import("./src/lib/market/mockMarketData");
    startMockSignalGenerator();
    startMarketDataTicker();
  }
}
