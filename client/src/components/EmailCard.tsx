import { useState } from 'react';
import { type Email } from '../types/emails';

export default function EmailCard({ email }: { email: Email }) {
  const [viewMode, setViewMode] = useState<'preview' | 'html' | 'text'>('preview');

  // Derive preview snippet from textBody or htmlBody
  const bodyPreview =
    email.textBody ||
    email.htmlBody?.replace(/<[^>]*>?/gm, '') ||
    'No content';

  // Format timestamp
  const formattedTime = new Date(email.receivedAt).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card hover-scale transition-default">
      {/* Header: Sender, Recipient, Received Time */}
      <div className="flex-between mb-3 pb-3 border-b border-border">
        <div className="flex-start gap-2 text-xs font-mono">
          <span className="text-content font-semibold truncate max-w-[160px]">
            {email.from}
          </span>
          <span className="muted">→</span>
          <span className="muted truncate max-w-[160px]">
            {email.to}
          </span>
        </div>

        <div className="flex-start gap-2">
          <span className="muted text-xs font-mono">{formattedTime}</span>
          <span className="badge-success">Received</span>
        </div>
      </div>

      {/* Subject & Preview */}
      <div className="mb-4">
        <h3 className="heading text-base mb-1 truncate">
          {email.subject}
        </h3>
        {viewMode === 'preview' && (
          <p className="subheading text-xs line-clamp-2">
            {bodyPreview}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex-start gap-2 mb-4">
        {email.htmlBody && <span className="badge">HTML</span>}
        {email.textBody && <span className="badge">TEXT</span>}
        <span className="badge font-mono text-[10px]">{email.id?.slice(0, 8) ?? 'N/A'}</span>
      </div>

      {/* Expanded Code Body Viewer */}
      {viewMode === 'text' && (
        <div className="code-block mb-4 max-h-48 whitespace-pre-wrap">
          {email.textBody || 'No text body available.'}
        </div>
      )}

      {viewMode === 'html' && (
        <div className="code-block mb-4 max-h-48 overflow-y-auto">
          <pre className="text-content-muted whitespace-pre-wrap">
            {email.htmlBody || 'No HTML body available.'}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex-between pt-3 border-t border-border">
        <button
          onClick={() => setViewMode(viewMode === 'preview' ? 'text' : 'preview')}
          className="btn-ghost text-xs py-1 px-2.5"
        >
          {viewMode === 'text' ? 'Hide Raw Text' : 'Inspect Text'}
        </button>

        <div className="flex-start gap-2">
          {email.htmlBody && (
            <button
              onClick={() => setViewMode(viewMode === 'html' ? 'preview' : 'html')}
              className="btn-outline text-xs py-1 px-3"
            >
              {viewMode === 'html' ? 'Close HTML' : 'View Raw HTML'}
            </button>
          )}
          <button className="btn-primary text-xs py-1 px-3">
            Open Message
          </button>
        </div>
      </div>
    </div>
  );
}
