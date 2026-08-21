import { type Email } from '../types/emails';

interface EmailRowProps {
  email: Email;
  onSelect: (id: string) => void;
}

export default function EmailRow({ email, onSelect }: EmailRowProps) {
  const bodyPreview =
    email.textBody ||
    email.htmlBody?.replace(/<[^>]*>?/gm, '') ||
    'No text preview';

  const formattedTime = email.receivedAt
    ? new Date(email.receivedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      onClick={() => onSelect(email.id)}
      className="flex items-center gap-4 px-4 py-3 border-b border-border bg-card hover:bg-muted/60 cursor-pointer transition-colors group"
    >
      {/* Sender */}
      <div className="w-44 shrink-0 truncate font-mono text-xs text-content font-semibold">
        {email.from}
      </div>

      {/* Subject + Snippet preview on one line */}
      <div className="flex-1 min-w-0 flex items-center gap-2 text-sm">
        <span className="font-medium text-content truncate max-w-[220px]">
          {email.subject}
        </span>
        <span className="text-content-muted truncate text-xs">
          - {bodyPreview}
        </span>
      </div>

      {/* Format Indicators & Time */}
      <div className="shrink-0 flex items-center gap-3">
        {email.htmlBody && <span className="badge text-[10px] py-0 px-1.5">HTML</span>}
        <span className="text-xs font-mono text-content-muted">{formattedTime}</span>
      </div>
    </div>
  );
}
