import { useState } from 'react';
import { useEmails } from './hooks/useEmails';
import EmailRow from './components/EmailRow';
import EmailDetail from './components/EmailDetails';
import { type Email } from './types/emails';

export default function App() {
  const { data, isLoading: emailsLoading, error } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const emails: Email[] = Array.isArray(data)
    ? data
    : (data as { emails?: Email[] })?.emails ?? [];

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  if (emailsLoading) {
    return (
      <div className="container-custom section flex-center">
        <p className="muted font-mono text-sm animate-pulse">Loading inbox...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom section flex-center">
        <p className="error-text font-mono text-sm">Failed to connect to DevMail backend.</p>
      </div>
    );
  }

  return (
    <div className="container-custom section">
      <div className="max-w-4xl mx-auto">
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmailId(null)}
          />
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
            {/* Header */}
            <div className="flex-between px-4 py-3 bg-muted border-b border-border text-xs font-mono text-content-muted">
              <span>CAPTURED EMAILS ({emails.length})</span>
              <span>DEVMAIL LOCAL SMTP</span>
            </div>

            {/* List */}
            {emails.length === 0 ? (
              <div className="text-center py-12">
                <p className="muted font-mono text-sm">No intercepted emails found.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {emails.map((email) => (
                  <EmailRow
                    key={email.id}
                    email={email}
                    onSelect={setSelectedEmailId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
