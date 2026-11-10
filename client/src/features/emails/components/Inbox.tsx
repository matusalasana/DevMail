import { useState } from "react";
import { useEmails } from "../hooks/useEmails";
import EmailDetail from "./EmailDetail";
import EmailRow from "./EmailRow";

export function Inbox() {
  const { data: emails = [], isLoading, error } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const selectedEmail = emails.find((email) => email.id === selectedEmailId);

  if (isLoading) {
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
            <div className="flex-between px-4 py-3 bg-muted border-b border-border text-xs font-mono text-content-muted">
              <span>CAPTURED EMAILS ({emails.length})</span>
              <span>DEVMAIL LOCAL SMTP</span>
            </div>

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
