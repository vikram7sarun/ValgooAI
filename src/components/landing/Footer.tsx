export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-cream">
          Valgoo<span className="text-brown-400">.AI</span>
        </p>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted">
          Valgoo.AI is a demonstration MVP. All market prices and algo signals shown are mock/sample
          data and do not reflect real market conditions. Nothing on this platform constitutes
          investment or trading advice, and no real trades are placed. This is not a licensed
          broker or investment advisor.
        </p>
        <p className="mt-4 text-xs text-muted/70">© {new Date().getFullYear()} Valgoo.AI</p>
      </div>
    </footer>
  );
}
