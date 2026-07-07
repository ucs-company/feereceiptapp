export default function BulkProgressModal({ visible, total, sent, failed, currentBatch, totalBatches, results, previousBatches, onCancel }) {
  if (!visible) return null

  const done = sent + failed
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-white font-bold text-lg">Sending WhatsApp Messages</h3>
          </div>
        </div>

        <div className="p-5">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-600">{sent} Sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600">{failed} Failed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-gray-600">{total - done} Remaining</span>
            </div>
          </div>

          {/* Batch indicator */}
          {totalBatches > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              Batch {currentBatch} of {totalBatches}
            </p>
          )}

          {/* Current Batch Results */}
          {results.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Current Batch — {results.filter(r => r.status === 'sent').length}/{results.length} complete
              </p>
              <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
                    {r.status === 'sending' ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : r.status === 'sent' ? (
                      <svg className="h-3.5 w-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="flex-1 truncate">{r.name}</span>
                    {r.status === 'sent' && <span className="text-emerald-600 text-xs font-medium">Sent</span>}
                    {r.status === 'sending' && <span className="text-gray-400 text-xs">Sending...</span>}
                    {r.status === 'failed' && (
                      <span className="text-red-500 text-xs truncate max-w-[120px]" title={r.error}>
                        {r.error || 'Failed'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Batches */}
          {previousBatches.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Previous Batches</p>
              <div className="space-y-1">
                {previousBatches.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-600 w-20">Batch {b.batch}:</span>
                    <span className="text-emerald-600">{b.sent}/{b.sent + b.failed}</span>
                    {b.failed > 0 && <span className="text-red-500">({b.failed} failed)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-[0.97]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
