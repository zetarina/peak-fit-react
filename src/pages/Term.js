import React from 'react';

const TermsOfService = () => {
  return (
    <div style={styles.container}>
      <div style={styles.terms}>
        <h1>Terms of Service</h1>
        <p>Effective Date: January 5, 2025</p>
        
        <section>
          <h2>Introduction</h2>
          <p>
            By accessing and using the PeakFit app (hereinafter referred to as "PeakFit"), you agree to be bound by the 
            following terms and conditions. If you do not agree to these terms, you must refrain from using our services.
          </p>
        </section>
        
        <section>
          <h2>User Responsibilities</h2>
          <p>
            You agree to provide accurate and up-to-date information when creating an account or using our services. 
            You are responsible for maintaining the confidentiality of your account credentials and for all activities 
            under your account.
          </p>
        </section>

        <section>
          <h2>Subscription & Payments</h2>
          <p>
            PeakFit offers various subscription plans. Payments for subscriptions are processed upon sign-up and are non-refundable 
            unless otherwise stated. Please refer to the payment terms for specific details.
            </p>
        </section>

        <section>
          <h2>Account Management</h2>
          <p>
            It is your responsibility to maintain the security of your account. If you suspect any unauthorized access or 
            activity on your account, you must notify PeakFit immediately.
          </p>
        </section>

        <section>
          <h2>Liability & Disclaimers</h2>
          <p>
            PeakFit is not liable for any damages arising from your use of the service. 
            We do not guarantee the availability, accuracy, or performance of the app, and are not responsible 
            for any errors, interruptions, or loss of data.
          </p>
        </section>

        <section>
          <h2>Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <a href="/privacypolicy">Privacy Policy</a> for more information.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you violate any terms outlined in this agreement. 
            Upon termination, you may lose access to your account and any data associated with it.
          </p>
        </section>

        <section>
          <h2>Dispute Resolution</h2>
          <p>
            Any disputes arising out of or in connection with the use of PeakFit will be resolved through binding arbitration, 
            in accordance with applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2>Modifications</h2>
          <p>
            PeakFit reserves the right to modify these terms and conditions at any time. Significant changes to these terms 
            will be communicated to users, and continued use of the app will constitute acceptance of the modified terms.
          </p>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  terms: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  h1: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  h2: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
};

export default TermsOfService;
