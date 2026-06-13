interface PaymentConfirmationEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  meetingLink?: string;
}

export function PaymentConfirmationEmail({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  joiningType,
  meetingLink,
}: PaymentConfirmationEmailProps) {
  const logoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#000', color: '#fff', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', backgroundColor: '#000', padding: '20px', borderRadius: '12px' }}>
        <img 
          src={logoUrl} 
          alt="CODEKAR" 
          style={{ height: '64px', width: 'auto', marginBottom: '12px', backgroundColor: '#000', borderRadius: '8px' }}
        />
        <p style={{ color: '#888', margin: 0, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Payment Confirmed</p>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #222' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 16px 0', fontWeight: 'bold' }}>Payment Received!</h2>
        <p style={{ color: '#aaa', lineHeight: '1.6', margin: '0 0 32px 0', fontSize: '16px' }}>
          Hi {name}, we have successfully verified your payment. Your spot for the workshop has been officially confirmed!
        </p>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333' }}>
          <h3 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Your Workshop Details</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={{ margin: '8px 0', color: '#ccc', fontSize: '15px' }}>
              <strong style={{ color: '#fff', width: '100px', display: 'inline-block' }}>Workshop:</strong> {cohortName}
            </p>
            <p style={{ margin: '8px 0', color: '#ccc', fontSize: '15px' }}>
              <strong style={{ color: '#fff', width: '100px', display: 'inline-block' }}>Dates:</strong> {cohortDates}
            </p>
            <p style={{ margin: '8px 0', color: '#ccc', fontSize: '15px' }}>
              <strong style={{ color: '#fff', width: '100px', display: 'inline-block' }}>Time:</strong> {cohortTime}
            </p>
            <p style={{ margin: '8px 0', color: '#ccc', fontSize: '15px', textTransform: 'capitalize' }}>
              <strong style={{ color: '#fff', width: '100px', display: 'inline-block' }}>Format:</strong> {joiningType === 'inperson' ? 'In-person' : joiningType}
            </p>
            {meetingLink && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #333' }}>
                <p style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>Joining Link:</p>
                <a 
                  href={meetingLink} 
                  style={{ 
                    display: 'inline-block', 
                    backgroundColor: '#fff', 
                    color: '#000', 
                    padding: '12px 24px', 
                    borderRadius: '8px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Join Workshop
                </a>
                <p style={{ margin: '12px 0 0 0', color: '#888', fontSize: '12px', wordBreak: 'break-all' }}>
                  {meetingLink}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '32px', marginBottom: '32px', border: '1px solid #222' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>What&apos;s Next?</h4>
        <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '15px' }}>
          {meetingLink 
            ? "You can use the link above to join the workshop at the scheduled time. We recommend joining 5 minutes early to test your connection."
            : "We will send you the final agenda and live online joining instructions 24 hours before the workshop starts."
          }
        </p>
        <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '15px', marginTop: '16px' }}>
          If you have any questions in the meantime, feel free to reach out to us.
        </p>
      </div>

      <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #222' }}>
        <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>Stay connected:</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="https://wa.me/923390053713" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>WhatsApp</a>
          <a href="https://instagram.com/codekar_" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Instagram</a>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>
          © 2025 Codekar. All rights reserved.
        </p>
      </div>
    </div>
  );
}
