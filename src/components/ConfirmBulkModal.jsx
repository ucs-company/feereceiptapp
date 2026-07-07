export default function ConfirmBulkModal({ visible, donorCount, projectName, onConfirm, onCancel }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slideUp">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-white font-bold text-lg">Confirm Bulk Send</h3>
          </div>
        </div>

        <div className="p-5">
          <p className="text-gray-700 text-sm leading-relaxed">
            You are about to send donation receipts to <strong>{donorCount} donors</strong> via WhatsApp using the <strong>{projectName}</strong> template.
          </p>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-800">
              This action cannot be undone once started. Sending will be done in batches of 10 at a time.
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Project:</span>
              <span className="font-semibold text-gray-800">{projectName}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipients:</span>
              <span className="font-semibold text-gray-800">{donorCount} donors</span>
            </div>
            <div className="flex justify-between">
              <span>Batch size:</span>
              <span className="font-semibold text-gray-800">10 at a time</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
            >
              Yes, Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
