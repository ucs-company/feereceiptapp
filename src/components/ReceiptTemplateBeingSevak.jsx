import {
  formatIndianCurrency,
  amountInWords,
  getFormattedDate,
} from '../services/pdfGenerator'
import defaultStamp from '../../Capture.PNG'
import beingSevakLogo from '../../beingsevaklogo.jpeg'
import beingSevakName from '../../beingsevakname3.png'

const ACCENT = '#009BD4'
const NAVY = '#1a3fa3'
const ROYAL = '#1a3fa3'
const DARK = '#0c1a3a'
const MID = '#2a3f70'
const SOFT = '#546285'
const PALE = '#dce9fd'
const LIGHT = '#eef4ff'
const TEAL = '#0d8c82'
const BORDER = '#aec5ef'

const GRAD = `linear-gradient(to right, ${ACCENT} 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%)`

function formatAmount(amount) {
  return Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ReceiptTemplateBeingSevak({ donor, index, signature }) {
  const formattedDate = getFormattedDate()
  const amount = Number(donor['Amount']) || 0

  if (donor._dataMissing) {
    return (
      <div
        style={{
          width: '720px',
          margin: '0 auto',
          background: '#fff',
          padding: '40px',
          border: '5.5px solid #1f497c',
          color: '#222',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#c0392b', marginTop: '100px' }}>
          DATA MISSING
        </div>
        <div style={{ fontSize: '20px', marginTop: '20px', color: '#666' }}>
          Receipt for <b>{donor['Donor Name'] || 'Unknown'}</b> could not be generated due to missing mandatory fields.
        </div>
        <div style={{ fontSize: '18px', marginTop: '30px', color: '#999' }}>
          Receipt No.: {donor['Receipt No.'] || 'N/A'}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '210mm',
        background: '#fff',
        fontFamily: "'Open Sans', Arial, sans-serif",
        fontSize: '10px',
        color: DARK,
      }}
    >
      <div style={{ height: '5px', background: ACCENT }} />

      {/* HEADER */}
      <header
        style={{
          background: GRAD,
          padding: '10px 14px 9px',
          display: 'grid',
          gridTemplateColumns: '62px 1fr 100px',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src={beingSevakLogo}
            alt="Logo"
            style={{ width: '57px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
          />
          
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontStyle: 'italic', fontSize: '7.5px', color: 'rgba(255,255,255,0.65)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '3px' }}>
            We Rise By Lifting Others
          </p>
          <img
            src={beingSevakName}
            alt="Being Sevak Charitable Trust"
            style={{ height: '43px', objectFit: 'contain', margin: '0 auto', display: 'block' }}
          />
          <p style={{ fontSize: '7px', color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '3px' }}>
            Charity Commissioner (Reg.) No. E-31948
          </p>
          <p style={{ fontSize: '6.5px', color: '#fff', marginTop: '3px', lineHeight: '1.5' }}>
            Income Tax Exempted Under 80G No. AACTB6422FF20214 | PAN No. AACTB6422F<br />
            80G Reg. No.: AACTB6422FF20214 | CSR Reg. No.: CSR00015528
          </p>
        </div>

       
      </header>

      {/* TITLE BAR */}
      <div style={{ background: ACCENT, padding: '5px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
          80G · Certificate of Donation
        </h2>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, padding: '10px 14px 8px', background: '#fff', position: 'relative' }}>
        {/* Watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-28deg)', fontFamily: "'Merriweather', serif", fontSize: '48px', fontWeight: 700, color: 'rgba(26,63,163,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0, letterSpacing: '6px' }}>
          BEING SEVAK
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* META ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: LIGHT, border: `1px solid ${PALE}`, borderRadius: '4px', padding: '6px 12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1px', color: SOFT }}>Receipt No.</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ROYAL }}>{donor['Receipt No.']}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'center' }}>
              <span style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1px', color: SOFT }}>Mode of Payment</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ROYAL }}>{donor['Mode of Payment (MOP)']}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'center' }}>
              <span style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1px', color: SOFT }}>Payment ID No.</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ROYAL }}>{donor['Payment ID No.']}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'right' }}>
              <span style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1px', color: SOFT }}>Dated</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ROYAL }}>{formattedDate}</span>
            </div>
          </div>

          <p style={{ fontSize: '9px', color: SOFT, marginBottom: '2px', margin: '0 0 2px' }}>Dear Sir / Madam,</p>
          <p style={{ fontSize: '10px', fontWeight: 700, color: DARK, marginBottom: '6px', margin: '0 0 6px' }}>
            Received with thanks from: <span style={{ color: ROYAL }}>{donor['Donor Name']}</span>
          </p>

          <p style={{ fontSize: '9px', color: DARK, lineHeight: '1.65', marginBottom: '6px', margin: '0 0 6px' }}>
            <strong style={{ color: NAVY }}>Being Sevak Charitable Trust</strong> would like to thank you for your generous donation of
            <span style={{ background: PALE, color: ROYAL, fontWeight: 700, padding: '1px 6px', borderRadius: '3px', fontSize: '10px' }}>
              &nbsp;Rs. {formatAmount(amount)}&nbsp;
            </span>
            &nbsp;&mdash;&nbsp;
            <em>Rupees {amountInWords(amount)} Only</em>
            &nbsp;&mdash; for a noble cause &amp; Make a Difference.
          </p>

          {/* DETAILS GRID */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: '5px', overflow: 'hidden', marginBottom: '7px' }}>
            <div style={{ background: ACCENT, padding: '5px 12px', fontSize: '8px', fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Donation Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: `1px solid ${PALE}` }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Receipt No.</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Receipt No.']}</div>
              </div>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: 'none' }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Donor Name</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: ROYAL }}>{donor['Donor Name']}</div>
              </div>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: `1px solid ${PALE}` }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Address</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Address 1'] || 'NA'}</div>
              </div>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: 'none' }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>On Account Of</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Account Of'] || 'Corpus'}</div>
              </div>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: `1px solid ${PALE}` }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Bank Name</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Donor Bank Name'] || 'NA'}</div>
              </div>
              <div style={{ padding: '5px 10px', borderBottom: `1px solid ${PALE}`, borderRight: 'none' }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Payment ID No.</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Payment ID No.']}</div>
              </div>
              <div style={{ padding: '5px 10px', borderRight: `1px solid ${PALE}` }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>PAN No.</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['PAN No.'] || 'NA'}</div>
              </div>
              <div style={{ padding: '5px 10px' }}>
                <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.8px', color: SOFT, marginBottom: '1px' }}>Email ID</div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: DARK }}>{donor['Email ID'] || 'NA'}</div>
              </div>
            </div>
          </div>

          {/* AMOUNT BANNER */}
          <div style={{ background: ACCENT, borderRadius: '4px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '7px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff' }}>Sum of Rupees</span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.88)', fontStyle: 'italic' }}>Rupees {amountInWords(amount)} Only</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '7px', letterSpacing: '1px', color: '#fff' }}>AMOUNT (INR)</div>
              <div style={{ fontFamily: "'Merriweather', serif", fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{formatAmount(amount)}</div>
            </div>
          </div>

          {/* ACTIVITIES BOX */}
          <div style={{ borderLeft: `3px solid ${ACCENT}`, background: LIGHT, padding: '6px 10px', fontSize: '8.5px', color: MID, lineHeight: '1.65', marginBottom: '6px', borderRadius: '0 4px 4px 0' }}>
            Your financial support helps us continue our mission. With the valuable support of donors <strong style={{ color: NAVY }}>LIKE YOU</strong>,
            we are able to help many needy families and individuals to meet essential daily needs and manage their livelihood through
            activities like <strong style={{ color: NAVY }}>Food-grain Kit Distribution, Medical Kit Distribution, Education Facilities</strong> &amp; many other activities.
          </div>

          {/* TAX NOTE */}
          <div style={{ background: '#f0fdf9', border: '1px solid #9ef0e0', borderRadius: '4px', padding: '5px 10px', fontSize: '8.5px', color: TEAL, fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px' }}>✦</span>
            Your donation to Being Sevak Charitable Trust is eligible for <strong>50% Tax Rebate</strong> [U/S 80G of Income Tax Act 1961].
            Please keep this written acknowledgement for your tax records.
          </div>

          <p style={{ fontSize: '8.5px', color: MID, lineHeight: '1.65', marginBottom: '8px', margin: '0 0 8px' }}>
            We thank you once again for your support and love we have received from you. We also look forward to your continued support.<br />
            <br />
            Thanking you, &nbsp; Yours truly,
          </p>

          {/* SIGNATURE ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '8px', borderTop: `1.5px solid ${PALE}` }}>
            <div style={{ fontSize: '8px', color: DARK, lineHeight: '1.7' }}>
              <strong style={{ fontSize: '10px', color: NAVY, fontFamily: "'Merriweather', serif" }}>Being Sevak Charitable Trust</strong><br />
              Reg. Add.: 401, 4th Floor, A-Wing, New Delhi Apartment,<br />
              Chandavarkar Lane, Borivali (West), Mumbai – 92.<br />
              Website: www.beingsevak.org &nbsp;|&nbsp; Email: being.sevak@gmail.com<br />
              Helpline: SEVAK: *878-035-035 &nbsp;|&nbsp; *879-034-034
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ }}>
                <img
                  src={signature || defaultStamp}
                  alt="Stamp"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'contain', zIndex: 1 }}
                />
              </div>
              <span style={{ fontSize: '7.5px', color: SOFT, letterSpacing: '0.3px' }}>Authorised Sign.</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ background: GRAD, padding: '8px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ fontSize: '7.5px', color: '#fff', lineHeight: '1.65' }}>
          <strong style={{ fontSize: '7px', color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '1px' }}>Registered Address</strong>
          401, 4th Floor, A-Wing, New Delhi Apartment, Chandavarkar Lane,<br />
          Borivali (West), Mumbai – 92.
        </div>
        <div style={{ fontSize: '7.5px', color: '#fff', lineHeight: '1.65' }}>
          <strong style={{ fontSize: '7px', color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '1px' }}>Registration Details</strong>
          80G Reg. No.: AACTB6422FF20214 &nbsp;|&nbsp; Trust PAN: AACTB6422F<br />
          CSR Reg. No.: CSR00015528 &nbsp;|&nbsp; Charity Comm. Reg. No.: E-31948
        </div>
      </div>

      <div style={{ background: LIGHT, textAlign: 'center', padding: '4px', fontSize: '8px', color: SOFT, letterSpacing: '1px' }}>
        ★★★★ This is a system generated auto receipt ★★★★
      </div>

      <div style={{ height: '4px', background: `linear-gradient(90deg, ${TEAL}, ${ACCENT}, ${ROYAL}, ${NAVY})` }} />
    </div>
  )
}
