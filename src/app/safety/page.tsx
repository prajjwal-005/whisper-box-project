export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full bg-card shadow-sm rounded-lg p-8 border border-border">
        
        {/* Header */}
        <div className="mb-8 border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            Safety & Usage Guidelines
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-card-foreground leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Purpose
            </h2>
            <p>
              Whisper Box is an anonymous messaging platform. These guidelines exist to keep the platform safe and usable for everyone. By using this service, you agree to these rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Prohibited Content
            </h2>
            <p className="mb-3">
              Users must not use the platform to send content that includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
              <li>Harassment, bullying, or degrading language.</li>
              <li>Hate speech or discriminatory abuse regarding race, religion, or identity.</li>
              <li>Sexual harassment or sexually abusive messages.</li>
              <li>Threats of violence or encouragement of self-harm.</li>
              <li>Spam, flooding, or attempts to disrupt the service (e.g., bots).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Enforcement
            </h2>
            <p className="mb-4">
              We use automated AI moderation systems to detect and limit abusive behavior.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-primary">
              <li>Messages that violate these guidelines may be suppressed, restricted, or blocked.</li>
              <li>Repeated or severe violations will result in <strong>temporary or permanent blocking</strong> of your IP address.</li>
              <li>Enforcement actions may occur without prior notice.</li>
            </ul>
            <div className="bg-accent/10 p-4 rounded-md border-l-4 border-primary text-sm">
              <strong>Note:</strong> We do not guarantee delivery or visibility of any message. If you violate these rules, your message may appear sent to you, but will never reach the recipient.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. User Responsibility
            </h2>
            <p>
              Users are fully responsible for the content they submit. Anonymous use does not exempt users from following these guidelines or local laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Disclaimer
            </h2>
            <p>
              Whisper Box provides a communication platform but is not responsible for user-generated content. Views expressed in messages belong solely to the sender and do not represent the platform.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Community Rules
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
              <li>Do not use the platform for bullying.</li>
              <li>Do not share private information (doxing).</li>
              <li>Use the reporting tool if you receive a harmful message.</li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground pt-8 border-t border-border">
            Report violations to <a href="mailto:support@whisper-box.xyz" className="text-primary hover:underline">support@whisper-box.xyz</a>
          </p>
        </div>
      </div>
    </div>
  );
}