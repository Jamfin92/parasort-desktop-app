export function TitleBar() {
  return (
    <div
      className="flex h-10 shrink-0 items-center border-b border-border px-4"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <span className="text-sm font-semibold text-foreground">ParaSort</span>
    </div>
  )
}
