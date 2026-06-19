import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";
export default function VyroScore() {
    const data = [
        { metric: "Win Rate (66%)", value: 66 },
        { metric: "Profit Factor (72%)", value: 72 },
        { metric: "Avg RR (84%)", value: 84 },
        { metric: "Recovery (91%)", value: 91 },
        { metric: "Drawdown (78%)", value: 78 },
        { metric: "Consistency (88%)", value: 88 },
    ];
    const score = 82.4;
    return (
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
  h-[420px]
  "
>
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-[80px]" />
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-xl font-bold text-white">
                    Vyro Score
                </h2>
            </div>

            {/* Radar */}
            <div className="h-[220px] overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />

                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 11,
                            }}
                        />
                        <div className="relative h-full">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                {/* RadarChart */}
                            </ResponsiveContainer>
                        </div>
                        <Radar
                            dataKey="value"
                            stroke="#00df73"
                            fill="#00df73"
                            fillOpacity={0.25}
                            strokeWidth={2}
                            isAnimationActive={false}
                            activeDot={false}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Score Section */}
            <div className="mt-5 border-t border-white/[0.05] pt-3">

                <div className="flex items-end gap-4 mb-3">
                    <div>
                        <p className="text-emerald-400/70 text-[10px] uppercase tracking-[0.3em]">
                            VYRO SCORE
                        </p>

                        <h3 className="text-3xl font-black text-white tracking-tight">
                            {score}
                        </h3>
                    </div>
                </div>

                {/* Meter */}
                <div className="relative">

                    <div className="h-2 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.05]">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                            style={{ width: `${score}%` }}
                        />
                    </div>

                    <div
                        className="
absolute
top-[-6px]
h-5
w-5
rounded-full
bg-emerald-400
border
border-white/20
shadow-[0_0_25px_rgba(0,223,115,0.9)]
"
                        style={{
                            left: `calc(${score}% - 8px)`,
                        }}
                    />

                    <div className="flex justify-between mt-2 text-[11px] text-slate-500">
                        <span>0</span>
                        <span>20</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                    </div>

                </div>
            </div>

        </div>
    );
}