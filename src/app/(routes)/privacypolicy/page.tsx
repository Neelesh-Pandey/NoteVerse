export default function PrivacyPolicy() {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
  
        <p className="mb-4">Effective Date: [09-04-2025]</p>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="mb-2">
            We may collect personal information such as your name, email, profile picture,
            institution (via Clerk authentication), uploaded content (notes, titles, documents),
            purchase data (via Stripe), and usage data (IP address, device, browser, etc.).
          </p>
          <p>
            We also use cookies to enhance user experience, for authentication, and for analytics.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide and maintain the platform</li>
            <li>To allow uploads, downloads, and transactions</li>
            <li>To analyze and improve the user experience</li>
            <li>To prevent fraud and ensure security</li>
            <li>To send updates and announcements (if opted in)</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Sharing of Data</h2>
          <p className="mb-2">
            We do not sell or rent your personal data. We only share it with:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Stripe – to securely handle payments</li>
            <li>Clerk – for user authentication</li>
            <li>Analytics tools (e.g., Google Analytics)</li>
            <li>Legal authorities – if required by law</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Data Storage & Security</h2>
          <p>
            We store data in a secure PostgreSQL database with encryption, HTTPS, and access control. Files are stored securely and access is limited.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Access and update your data</li>
            <li>Delete your account and content</li>
            <li>Opt out of marketing emails</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Third-Party Services</h2>
          <p>
            We use Clerk, Stripe, and cloud services that have their own privacy policies. Please review them separately.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this policy. If we do, we&apos;ll notify you via email or through the site.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            If you have questions, email us at <a href="mailto:pandeyneelesh390@gmail.com" className="text-blue-600 underline">pandeyneelesh390@gmail.com</a>.
          </p>
        </section>
      </div>
    );
  }
  