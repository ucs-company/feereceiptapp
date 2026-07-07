import { useState } from 'react'
import ReceiptTemplate from './ReceiptTemplate'
import ReceiptTemplateAshray from './ReceiptTemplateAshray'
import ReceiptTemplateBeingSevak from './ReceiptTemplateBeingSevak'
import { PROJECTS } from '../data/projects'
import { downloadAllPDFs as downloadAll, downloadSinglePDF } from '../services/pdfGenerator'

export default function ReceiptPreview({ donors, selectedIndex, signature, project, receiptRef }) {
  const [downloadingSingle, setDownloadingSingle] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)

  if (!donors || donors.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Upload an Excel file to preview receipts</p>
        <p className="text-gray-400 text-sm mt-1">Supported formats: .xlsx, .xls, .csv</p>
      </div>
    )
  }

  const handleDownloadSingle = async () => {
    if (selectedIndex === null || selectedIndex === undefined) return
    setDownloadingSingle(true)
    try {
      await downloadSinglePDF(receiptRef.current, donors[selectedIndex], project)
    } catch {
      alert('Failed to download PDF. Please try again.')
    }
    setDownloadingSingle(false)
  }

  const handleDownloadAll = async () => {
    setDownloadingAll(true)
    try {
      const elements = Array.from(
        document.querySelectorAll('[data-receipt-batch]')
      )
      await downloadAll(
        elements.map((el, i) => ({ element: el, donor: donors[i] })),
        project
      )
    } catch {
      alert('Failed to download ZIP. Please try again.')
    }
    setDownloadingAll(false)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print')
      return
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${receiptRef.current.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const currentDonor =
    selectedIndex !== null && selectedIndex !== undefined
      ? donors[selectedIndex]
      : donors[0]

  const currentIndex =
    selectedIndex !== null && selectedIndex !== undefined
      ? selectedIndex
      : 0

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gradient-to-b from-[#d10087] to-[#e4008d] rounded-full" />
          Receipt Preview
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {donors.length > 1 && (
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:hover:from-emerald-600 disabled:hover:to-emerald-500 shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
            >
              {downloadingAll ? (
                <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              )}
              <span className="hidden sm:inline">{downloadingAll ? 'Packaging...' : 'Download All as ZIP'}</span>
              <span className="sm:hidden">{downloadingAll ? 'Packaging...' : 'All PDF'}</span>
            </button>
          )}
          <button
            onClick={handleDownloadSingle}
            disabled={
              downloadingSingle ||
              selectedIndex === null ||
              selectedIndex === undefined
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-gradient-to-r from-[#d10087] to-[#e4008d] text-white text-xs sm:text-sm font-medium rounded-lg hover:from-[#e4008d] hover:to-[#f0009d] disabled:opacity-50 disabled:hover:from-[#d10087] disabled:hover:to-[#e4008d] shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
          >
            {downloadingSingle ? (
              <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            )}
            {downloadingSingle ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 active:scale-[0.97] shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ textAlign: 'center' }}>
        <div ref={receiptRef} data-receipt style={{ display: 'inline-block' }}>
          {project === 'manncar' ? (
            <ReceiptTemplate donor={currentDonor} index={currentIndex} signature={signature} />
          ) : project === 'beingsevak' ? (
            <ReceiptTemplateBeingSevak donor={currentDonor} index={currentIndex} signature={signature} />
          ) : (
            <ReceiptTemplateAshray donor={currentDonor} index={currentIndex} signature={signature} project={project} />
          )}
        </div>
      </div>

      <div style={{ display: 'none' }}>
        {donors.map((donor, i) => (
          <div key={i} data-receipt-batch={i}>
            {project === 'manncar' ? (
              <ReceiptTemplate donor={donor} index={i} signature={signature} />
            ) : project === 'beingsevak' ? (
              <ReceiptTemplateBeingSevak donor={donor} index={i} signature={signature} />
            ) : (
              <ReceiptTemplateAshray donor={donor} index={i} signature={signature} project={project} />
            )}
          </div>
        ))}
      </div>

      {donors.length > 1 && (
        <p className="text-xs text-gray-400 text-center mt-3">
          {selectedIndex !== null && selectedIndex !== undefined
            ? `Showing receipt for: ${currentDonor['Donor Name']}`
            : 'Showing receipt for first donor. Select a donor from the table to preview their receipt.'}
        </p>
      )}
    </div>
  )
}
