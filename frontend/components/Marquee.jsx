'use client';

export default function Marquee({ items, renderItem, minItems = 10, duration = 40, testid }) {
  if (!items || items.length === 0) return null;
  if (items.length < 4) {
    return (
      <div className="flex flex-wrap justify-center gap-6" data-testid={testid}>
        {items.map((item, i) => <div key={i}>{renderItem(item, i)}</div>)}
      </div>
    );
  }
  const base = [];
  while (base.length < minItems) base.push(...items);
  const half = (hidden) =>
    base.map((item, i) => (
      <div key={`${hidden ? 'b' : 'a'}-${i}`} className="marquee-item" aria-hidden={hidden || undefined}>
        {renderItem(item, i)}
      </div>
    ));

  return (
    <div className="marquee" data-testid={testid}>
      <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}
