import { useState, useCallback, useRef } from 'react'
import ExcelUpload from './components/ExcelUpload'
import DonorTable from './components/DonorTable'
import ReceiptPreview from './components/ReceiptPreview'
import BulkProgressModal from './components/BulkProgressModal'
import Toast from './components/Toast'
import { PROJECTS, PROJECT_OPTIONS } from './data/projects'
import { formatIndianCurrency, formatReceiptDate } from './services/pdfGenerator'
import { sendReceiptViaWhatsApp } from './services/whatsapp'

export default function App() {
  const [donors, setDonors] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [project, setProject] = useState('manncar')
  const [toast, setToast] = useState({ message: '', type: '', visible: false })

  const [bulkState, setBulkState] = useState({
    active: false,
    total: 0,
    sent: 0,
    failed: 0,
    currentBatch: 0,
    totalBatches: 0,
    results: [],
    previousBatches: [],
  })
  const cancelBulkRef = useRef(false)

  const showToast = useCallback((type, message) => {
    setToast({ type, message, visible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  const handleDataLoaded = useCallback((data) => {
    setDonors(data)
    setSelectedIndex(null)
  }, [])

  const receiptRef = useRef(null)

  const handleSelect = useCallback((index) => {
    setSelectedIndex(index)
  }, [])

  const handleProjectChange = useCallback((e) => {
    setProject(e.target.value)
  }, [])

  const currentProject = PROJECTS[project]

  const handleSendWhatsApp = useCallback(async (donor, index) => {
    const amount = formatIndianCurrency(donor['Amount'])
    const date = formatReceiptDate(donor['Receipt Date'])
    await sendReceiptViaWhatsApp(donor, amount, date, project, currentProject.label, receiptRef.current)
  }, [project, currentProject.label])

  const handleSendAllWhatsApp = useCallback(async () => {
    const validDonors = donors.filter((d) => {
      const mobile = String(d['Mobile No.'] || '').replace(/[^0-9]/g, '')
      return mobile.length >= 10
    })

    if (validDonors.length === 0) {
      showToast('error', 'No donors with valid mobile numbers')
      return
    }

    const batches = []
    for (let i = 0; i < validDonors.length; i += 10) {
      batches.push(validDonors.slice(i, i + 10))
    }

    cancelBulkRef.current = false

    setBulkState({
      active: true,
      total: validDonors.length,
      sent: 0,
      failed: 0,
      currentBatch: 0,
      totalBatches: batches.length,
      results: [],
      previousBatches: [],
    })

    let totalSent = 0
    let totalFailed = 0

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      if (cancelBulkRef.current) break

      const batch = batches[batchIdx]

      setBulkState((prev) => ({
        ...prev,
        currentBatch: batchIdx + 1,
        results: batch.map((d) => ({ name: d['Donor Name'], status: 'sending' })),
      }))

      const batchResults = await Promise.allSettled(
        batch.map(async (donor) => {
          const realIndex = donors.indexOf(donor)
          const batchElement = document.querySelector(`[data-receipt-batch="${realIndex}"]`)
          if (!batchElement) throw new Error('Receipt element not found')

          const amount = formatIndianCurrency(donor['Amount'])
          const date = formatReceiptDate(donor['Receipt Date'])
          await sendReceiptViaWhatsApp(donor, amount, date, project, currentProject.label, batchElement)
        })
      )

      const batchSent = batchResults.filter((r) => r.status === 'fulfilled').length
      const batchFailed = batchResults.filter((r) => r.status === 'rejected').length
      totalSent += batchSent
      totalFailed += batchFailed

      const batchResultItems = batchResults.map((r, i) => ({
        name: batch[i]['Donor Name'],
        status: r.status === 'fulfilled' ? 'sent' : 'failed',
        error: r.status === 'rejected' ? r.reason?.message : null,
      }))

      setBulkState((prev) => ({
        ...prev,
        sent: totalSent,
        failed: totalFailed,
        results: batchResultItems,
        previousBatches: [
          ...prev.previousBatches,
          { batch: batchIdx + 1, sent: batchSent, failed: batchFailed },
        ],
      }))
    }

    setBulkState((prev) => ({ ...prev, active: false }))

    if (cancelBulkRef.current) {
      showToast('info', `Cancelled. ${totalSent} sent, ${totalFailed} failed`)
    } else {
      showToast('success', `Bulk send complete! ${totalSent} sent, ${totalFailed} failed`)
    }
  }, [donors, project, currentProject.label, showToast])

  const handleCancelBulk = useCallback(() => {
    cancelBulkRef.current = true
    setBulkState((prev) => ({ ...prev, cancelled: true }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-[#d10087] to-[#e4008d] shadow-lg">
        <div className="max-w-6xl mx-auto px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 ring-1 ring-white/30">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white truncate drop-shadow-sm">
                ULTIMATE FUND RAYS SOLUTIONS Receipt Generator
              </h1>
              <p className="text-xs sm:text-sm text-pink-100 truncate">
                Upload Excel & generate donation receipts
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 animate-fadeIn">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/80 p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 hover:shadow-lg animate-slideUp">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-[#d10087] to-[#e4008d] rounded-full" />
              Select Project
            </h2>
            <select
              value={project}
              onChange={handleProjectChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[#d10087]/40 focus:ring-2 focus:ring-[#d10087]/20 focus:outline-none transition-all duration-300 text-gray-700 font-medium"
            >
              {PROJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {donors && (
            <div className="mt-3 text-xs text-gray-400">
              Generating receipts for: <span className="font-semibold text-gray-600">{currentProject.label}</span>
            </div>
          )}
        </div>

        <ExcelUpload onDataLoaded={handleDataLoaded} />

        {donors && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/80 p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 hover:shadow-lg animate-slideUp">
            <DonorTable
              donors={donors}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onSendWhatsApp={handleSendWhatsApp}
              showToast={showToast}
              onSendAll={handleSendAllWhatsApp}
              bulkSending={bulkState.active}
              bulkSent={bulkState.sent}
              bulkFailed={bulkState.failed}
              bulkTotal={bulkState.total}
            />
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/80 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <ReceiptPreview
            donors={donors}
            selectedIndex={selectedIndex}
            project={project}
            receiptRef={receiptRef}
          />
        </div>
      </main>
      <BulkProgressModal
        visible={bulkState.active}
        total={bulkState.total}
        sent={bulkState.sent}
        failed={bulkState.failed}
        currentBatch={bulkState.currentBatch}
        totalBatches={bulkState.totalBatches}
        results={bulkState.results}
        previousBatches={bulkState.previousBatches}
        onCancel={handleCancelBulk}
      />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  )
}
