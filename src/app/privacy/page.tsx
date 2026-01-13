import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full bg-card shadow-sm rounded-lg p-8 border border-border">
        
        {/* Header */}
        <div className="mb-8 border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-card-foreground leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Anonymity
            </h2>
            <p>
              We prioritize anonymity. No account, name, email, or profile creation is required to <strong>send</strong> messages. We do not publicly associate messages with sender identities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Data We Collect
            </h2>
            <p className="mb-3">
              To protect the platform from abuse, we collect limited technical data:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
              <li>
                <strong>IP Addresses:</strong> Collected strictly for abuse detection, rate limiting, and blocking malicious actors.
              </li>
              <li>
                <strong>Message Content:</strong> Stored securely to deliver the message to the recipient.
              </li>
              <li>
                <strong>Timestamps:</strong> Used for ordering messages and enforcing cooldown periods.
              </li>
            </ul>
            <p className="mt-3 text-sm italic text-muted-foreground">
              This data is NOT used for tracking ads or marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Message Data Retention
            </h2>
            <p>
              Message content is stored in our database. Messages can be deleted permanently by the recipient at any time. We do not keep backups of deleted user messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Data Use & Sharing
            </h2>
            <p>
              We do not sell user data. Data is not shared with third parties except where required by law or for infrastructure security (e.g., hosting providers, AI moderation services).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Security
            </h2>
            <p>
              We take reasonable measures to protect stored data from unauthorized access, including encryption in transit and secure database practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Contact
            </h2>
            <p>
              For questions regarding safety or privacy, please contact the platform administrator.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground pt-8 border-t border-border">
            Questions? Contact <a href="mailto:support@whisper-box.xyz" className="text-primary hover:underline">support@whisper-box.xyz</a>
          </p>
        </div>
      </div>
    </div>
  );
}