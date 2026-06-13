interface LocationInvitationEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  locationName: string;
  locationLink: string;
}

export function LocationInvitationEmail({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  locationName,
  locationLink,
}: LocationInvitationEmailProps) {
  const logoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#000', color: '#fff', padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', backgroundColor: '#000', padding: '20px', borderRadius: '12px' }}>
        <img 
          src={logoUrl} 
          alt="CODEKAR" 
          style={{ height: '64px', width: 'auto', marginBottom: '12px', backgroundColor: '#000', borderRadius: '8px' }}
        />
        <p style={{ color: '#888', margin: 0, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Workshop Invitation</p>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #222' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 16px 0', fontWeight: 'bold' }}>Workshop Location for {cohortName}</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '8px' }}>
          <div>
            <p style={{ color: '#888', margin: '0 0 4px 0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Date</p>
            <p style={{ color: '#fff', margin: 0, fontSize: '14px' }}>{cohortDates}</p>
          </div>
          <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px' }}>
            <p style={{ color: '#888', margin: '0 0 4px 0', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Time</p>
            <p style={{ color: '#fff', margin: 0, fontSize: '14px' }}>{cohortTime}</p>
          </div>
        </div>

        <p style={{ color: '#aaa', lineHeight: '1.6', margin: '0 0 32px 0', fontSize: '16px' }}>
          Hi {name}, we are excited to see you at the workshop! Below are the details for the physical location.
        </p>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#fff', fontWeight: 'bold' }}>Location Name</h3>
          <p style={{ color: '#fff', fontSize: '16px', margin: '0 0 24px 0' }}>{locationName}</p>
          
          <a 
            href={locationLink} 
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#fff', 
              color: '#000', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Open in Google Maps
          </a>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '16px', wordBreak: 'break-all' }}>
            Link: {locationLink}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #222' }}>
        <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>Need help? Reach out:</p>
        <div style={{ textAlign: 'center' }}>
          <a href="https://wa.me/923390053713" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>WhatsApp</a>
          <a href="https://instagram.com/codekar_" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Instagram</a>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>
          © 2026 Codekar. All rights reserved.
        </p>
      </div>
    </div>
  );
}
