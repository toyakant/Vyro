{/* Calendar */}
<div className="col-span-12 xl:col-span-8">
  <div
    className="
    relative
    overflow-hidden
    bg-[#081018]/80
    border border-white/[0.08]
    rounded-3xl
    p-6
    backdrop-blur-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.45)]
    h-full
    "
  >
    <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />

    <TradingCalendar />
  </div>
</div>