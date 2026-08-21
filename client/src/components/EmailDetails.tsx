import { useState } from 'react';
import { type Email } from '../types/emails';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
}

export default function EmailDetail({ email, onBack }: EmailDetailProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'text'>(
    email.htmlBody ? 'html' : 'text'
  );

  const formattedDate = email.receivedAt
    ? new Date(email.receivedAt).toLocaleString()
    : 'Unknown date';

  return (
    <div className="card space-y-6">
      {/* Navigation Header */}
      <div className="flex-between pb-4 border-b border-border">
        <button onClick={onBack} className="btn-ghost text-xs py-1 px-3">
          ← Back to Inbox
        </button>

        <div className="flex-start gap-2">
          {email.htmlBody && <span className="badge">HTML</span>}
          {email.textBody && <span className="badge">TEXT</span>}
          <span className="badge font-mono text-[10px]">
            {email.id?.slice(0, 8) ?? 'N/A'}
          </span>
        </div>
      </div>

      {/* Subject & Envelope Details */}
      <div>
        <h2 className="heading text-xl mb-3">{email.subject}</h2>
        <div className="flex-between bg-muted/50 p-3 rounded-lg border border-border text-xs font-mono">
          <div className="space-y-1">
            <p className="text-content">
              <span className="text-content-muted">From:</span> {email.from}
            </p>
            <p className="text-content">
              <span className="text-content-muted">To:</span> {email.to}
            </p>
          </div>
          <span className="text-content-muted">{formattedDate}</span>
        </div>
      </div>

      {/* Body View Controls */}
      <div className="flex-start gap-2 border-b border-border pb-2">
        {email.htmlBody && (
          <button
            onClick={() => setActiveTab('html')}
            className={activeTab === 'html' ? 'btn-primary text-xs py-1 px-3' : 'btn-ghost text-xs py-1 px-3'}
          >
            HTML View
          </button>
        )}
        <button
          onClick={() => setActiveTab('text')}
          className={activeTab === 'text' ? 'btn-primary text-xs py-1 px-3' : 'btn-ghost text-xs py-1 px-3'}
        >
          Raw Text
        </button>
      </div>

      {/* Email Frame Render */}
      <div>
        {activeTab === 'html' && email.htmlBody ? (
          <div className="border border-border rounded-lg p-2 bg-white min-h-[350px]">
            <iframe
              srcDoc={email.htmlBody}
              title="Email Body Preview"
              className="w-full min-h-[350px] border-none"
            />
          </div>
        ) : (
          <div className="code-block whitespace-pre-wrap min-h-[200px]">
            {email.textBody || 'No text content available.'}
          </div>
        )}
      </div>
    </div>
  );
}
