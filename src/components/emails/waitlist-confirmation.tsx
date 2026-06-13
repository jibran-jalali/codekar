interface WaitlistEmailProps {
  name: string;
  cohortName: string;
}

export function WaitlistConfirmationEmail({
  name,
  cohortName,
}: WaitlistEmailProps) {
  const logoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', color: '#fff', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img 
          src={logoUrl} 
          alt="CODEKAR" 
          style={{ height: '64px', width: 'auto', marginBottom: '12px' }}
        />
        <p style={{ color: '#888', margin: 0, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Waitlist Registration</p>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #222' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 16px 0', fontWeight: 'bold' }}>Hi {name}!</h2>
        <p style={{ color: '#aaa', lineHeight: '1.6', margin: '0 0 32px 0', fontSize: '16px' }}>
          Thank you for your interest in our workshop! You've been successfully added to the waitlist for <strong style={{ color: '#fff' }}>{cohortName}</strong>.
        </p>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #333' }}>
          <p style={{ margin: '0', color: '#ccc', fontSize: '15px', lineHeight: '1.6' }}>
            Since this cohort is currently full, we will contact you as soon as a spot becomes available or when we announce our next cohort dates.
          </p>
        </div>

        <p style={{ color: '#aaa', lineHeight: '1.6', margin: '32px 0 0 0', fontSize: '16px' }}>
          In the meantime, feel free to follow us on Instagram for updates and coding tips!
        </p>
      </div>

      <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #222' }}>
        <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>Have questions? Contact us:</p>
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
