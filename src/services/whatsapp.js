import { generateReceiptPDF } from './pdfGenerator'

const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN
const API_BASE = 'https://graph.facebook.com/v23.0'

function cleanMobileNumber(raw) {
  if (!raw) return null
  const cleaned = String(raw).replace(/[^0-9]/g, '')
  if (cleaned.length < 10) return null
  if (cleaned.length === 10) return '91' + cleaned
  if (cleaned.length === 11 && cleaned.startsWith('0')) return '91' + cleaned.slice(1)
  if (cleaned.length === 12 && cleaned.startsWith('91')) return cleaned
  if (cleaned.length > 12) return cleaned
  return cleaned
}

export async function uploadMedia(pdfBlob, fileName) {
  const formData = new FormData()
  formData.append('messaging_product', 'whatsapp')
  formData.append('file', pdfBlob, fileName)
  formData.append('type', 'application/pdf')

  const res = await fetch(`${API_BASE}/${PHONE_NUMBER_ID}/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`WhatsApp media upload failed: ${err}`)
  }

  const data = await res.json()
  return data.id
}

export async function sendTemplateWithDocument(to, mediaId, fileName) {
  const res = await fetch(`${API_BASE}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'bsct_receipt',
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'document',
                document: { id: mediaId, filename: fileName },
              },
            ],
          },
        ],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`WhatsApp template send failed: ${err}`)
  }

  return res.json()
}

const PROJECT_PREFIXES = {
  manncar: 'MANNCARE',
  ashray: 'ASHRAY',
  beingsevak: 'BSCT',
}

export async function sendReceiptViaWhatsApp(donor, formattedAmount, formattedDate, projectId, projectName, receiptElement) {
  const mobile = cleanMobileNumber(donor['Mobile No.'])
  if (!mobile) throw new Error(`Invalid mobile number: "${donor['Mobile No.']}"`)

  const pdf = await generateReceiptPDF(receiptElement)

  const receiptNo = donor['Receipt No.'] || 'N/A'
  const donorName = String(donor['Donor Name']).replace(/[<>:"/\\|?*]/g, '_').trim() || 'Donor'
  const prefix = PROJECT_PREFIXES[projectId] || 'RECEIPT'
  const fileName = `${prefix}_${donorName}_${receiptNo}.pdf`

  pdf.setProperties({
    title: fileName.replace('.pdf', ''),
    author: projectName || 'Donation Receipt',
    subject: 'Donation Receipt',
  })

  const pdfBlob = pdf.output('blob')

  const mediaId = await uploadMedia(pdfBlob, fileName)

  return sendTemplateWithDocument(mobile, mediaId, fileName)
}
