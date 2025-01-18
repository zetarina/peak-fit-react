import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.privacyPolicy}>
        <h1>Privacy Policy</h1>
        <p>Effective Date: January 5, 2025</p>
        <section>
          <h2>Introduction</h2>
          <p>
            PeakFit is committed to protecting your privacy and ensuring the security of your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
            our mobile application, website, and related services (collectively, the "Services"). By using PeakFit, 
            you consent to the practices described in this Privacy Policy. If you do not agree with this policy, 
            please discontinue using our Services.
          </p>
        </section>
        <section>
          <h2>Data Collection</h2>
          <p><strong>1. Personal Information </strong></p>
          <p> We may collect the following personal information when you use our Services or register for an account: </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Age</li>
            <li>Gender</li>
            <li>Fitness and Health Data</li>
          </ul>
          <p><strong> 2. If you use our fitness-related features, we may collect: </strong></p>
          <ul>
            <li>Weight, height, and fitness goals</li>
            <li>Exercise details (e.g., workout type, duration, and intensity)</li>
            <li>Activity data from integrated devices (e.g., steps, heart rate, calories burned)</li>
          </ul>
            
          <p><strong>3. Payment Information </strong></p>
          <ul>
            <li>If you make purchases through our app, we collect payment details (processed by third-party payment gateways).</li>
          </ul> 
            
          <p><strong>4. Usage Data </strong></p>
          <ul>
            <li>Device information (e.g., operating system, device model, unique device identifier)</li>
            <li>Log data (e.g., IP address, browser type, access times, pages viewed)</li>
            <li>App usage patterns and feature engagement</li>
          </ul>
            
          <p><strong> 5. Cookies and Tracking Technologies </strong></p>
          <ul>
            <li>We use cookies, beacons, and tracking technologies to enhance your user experience and improve our Services.</li>
          </ul>
        </section>

        <section>
          <h2>Usage of Data</h2>
          <p> We use the collected information for the following purposes: </p>

          <p><strong> 1. To Provide and Improve Our Services </strong></p>
          <ul>
            <li>Create and manage your account</li>
            <li>Track fitness progress and personalize your workout plans</li>
            <li>Provide coaching recommendations and content</li>
            <li>To Communicate with You</li>
          </ul> 

          <p><strong> 2. Send updates, newsletters, or promotional messages </strong></p>
          <ul>
            <li>Respond to customer service inquiries and technical support requests</li>
          </ul>
            
          <p><strong> 3. For Analytics and Research </strong></p>
          <ul>
            <li>Analyze app performance and user engagement</li>
            <li>Improve the functionality and user experience of PeakFit</li>
          </ul>
            
          <p><strong> 4. For Security and Fraud Prevention </strong></p>
          <ul>
            <li>Protect your account and our platform from unauthorized access</li>
            <li>Comply with legal obligations and enforce our termsImprove the functionality and user experience of PeakFit</li>
          </ul>
        </section>

        <section>
          <h2>Data Sharing</h2>
          <p> We do not sell your personal information. However, we may share your data with the following third parties: </p>

          <p><strong> 1. Service Providers </strong></p>
          <ul>
            <li>Third-party vendors who assist in delivering our Services, such as hosting providers, analytics tools, and payment processors. </li>
          </ul>
            
          <p><strong> 2. Business Partners </strong></p>
          <ul>
            <li>Partners who collaborate with us to provide additional fitness resources or promotions. </li>
          </ul>

          <p><strong> 3. Legal Obligations </strong></p>
          <ul>
            <li>We may disclose your information to comply with legal obligations, respond to lawful requests, or protect our rights and users' safety.</li>
          </ul>
            
          <p><strong> 4. Aggregated Data </strong></p>
          <ul>
            <li>We may share non-identifiable, aggregated data (e.g., usage trends) for research or marketing purposes. </li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            Depending on your location and applicable laws, you may have the following rights regarding your personal data:
          </p>
          <p><strong>
            1. Access and Portability
            </strong>
          </p>
          <ul>
            <li>Request access to the personal data we hold about you. </li>
          </ul>
            
          <p><strong> 2. Correction </strong></p>
          <ul>
            <li>Update or correct inaccuracies in your personal information. </li>
          </ul>
            
          <p><strong> 3. Deletion </strong></p>
          <ul>
            <li>Request the deletion of your account and associated data.</li>
          </ul>
            
          <p><strong> 4. Opt-Out </strong></p>
          <ul>
            <li>Opt out of receiving marketing communications by clicking "Unsubscribe" in emails.</li>
            <li>Disable cookies through your browser settings.</li>
          </ul>
            
          <p>To exercise these rights, please contact us at peakfit06@gmail.com </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            Cookies are small files stored on your device that help us provide a personalized experience. 
            You can manage cookies through your browser settings or opt out of tracking technologies using 
            third-party tools like Google Analytics Opt-Out Browser Add-On.
          </p>
        </section>
        <section>
          <h2>Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including encryption, 
            secure storage, and restricted access protocols. However, no data transmission or storage 
            system can guarantee complete security. Please safeguard your account credentials and notify us 
            immediately of any unauthorized access.</p>
        </section>
        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our practices or for legal and regulatory reasons. 
            Any significant updates will be communicated via email or within the app. The "Effective Date" at the top 
            indicates when the latest changes were made.
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
  privacyPolicy: {
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

export default PrivacyPolicy;
