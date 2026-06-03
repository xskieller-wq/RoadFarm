"use client";

import { useMarketplace } from "@/context/MarketplaceContext";

export default function AdminReportsPage() {
  const { reports, resolveReport } = useMarketplace();

  return (
    <div>
      <h1 className="text-2xl font-bold text-warm-900">User reports</h1>
      <p className="text-sm text-warm-600">Review and resolve community reports</p>

      <div className="mt-6 space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="badge bg-warm-100 text-warm-700">{report.type}</span>
                <p className="mt-2 font-semibold text-warm-900">{report.targetName}</p>
                <p className="text-sm text-warm-600">{report.reason}</p>
                <p className="text-xs text-warm-400">{report.createdAt.slice(0, 10)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${
                  report.status === "open" ? "bg-sunflower-100 text-sunflower-800" : "bg-sage-100 text-sage-800"
                }`}>
                  {report.status}
                </span>
                {report.status === "open" && (
                  <>
                    <button onClick={() => resolveReport(report.id, "resolved")} className="btn-primary text-xs">
                      Resolve
                    </button>
                    <button onClick={() => resolveReport(report.id, "dismissed")} className="btn-secondary text-xs">
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
