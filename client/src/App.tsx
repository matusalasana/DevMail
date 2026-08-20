import { useState } from 'react';
import './App.css';
import { useEmails } from './hooks/useEmails';
import { useEmail } from './hooks/useEmail';
import { useDeleteEmail } from './hooks/useDeleteEmail';
import { useDeleteAllEmails } from './hooks/useDeleteAllEmails';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('html'); 

  // Renamed mutation variable to avoid collision
  const { mutate: executeDeleteEmail, isPending: deleting } = useDeleteEmail();
  const { mutate: deleteAllEmails, isPending: deletingAll } = useDeleteAllEmails();
  const { data: email, isLoading: emailLoading } = useEmail(selectedId);
  const { data: emails = [], isLoading: emailsLoading } = useEmails();

  const selectEmail = (id: string) => {
    setSelectedId(id);
  };

  const isPending = deletingAll || deleting;
  const isLoading = emailsLoading || emailLoading;

  const handleDeleteEmail = (id: string) => {
    executeDeleteEmail(id);
    if (selectedId === id) setSelectedId(null);
  };

  const handleClearAll = () => {
    deleteAllEmails();
    setSelectedId(null);
  };
  
  if(isLoading){
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      {/* SIDEBAR: EMAIL LIST */}
      <aside className="sidebar">
        <header className="sidebar-header">
          <h2>📥 Inbox ({emails.length})</h2>
          <button disabled={isPending} onClick={handleClearAll} className="btn-danger">Clear All</button>
        </header>

        <ul className="email-list">
          {/* Renamed item variable to avoids shadowing outer 'email' */}
          {emails.map((item: any) => (
            <li
              key={item.id}
              className={`email-item ${selectedId === item.id ? 'active' : ''}`}
              onClick={() => selectEmail(item.id)}
            >
              <div className="email-item-header">
                <strong>{item.from}</strong>
                <button onClick={() => handleDeleteEmail(item.id)}>✕</button>
              </div>
              <div className="email-subject">{item.subject}</div>
              <small>{new Date(item.createdAt).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT: EMAIL PREVIEW */}
      <main className="main-content">
        {email ? (
          <div className="email-detail">
            <header className="email-header">
              <h3>{email.subject}</h3>
              <p><strong>From:</strong> {email.from}</p>
              <p><strong>To:</strong> {email.to}</p>
            </header>

            {/* TAB NAVIGATION */}
            <div className="tabs">
              <button 
                className={activeTab === 'html' ? 'active' : ''} 
                onClick={() => setActiveTab('html')}
              >
                HTML Preview
              </button>
              <button 
                className={activeTab === 'text' ? 'active' : ''} 
                onClick={() => setActiveTab('text')}
              >
                Plain Text
              </button>
              <button 
                className={activeTab === 'headers' ? 'active' : ''} 
                onClick={() => setActiveTab('headers')}
              >
                Headers / Raw
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
              {activeTab === 'html' && (
                <iframe
                  title="HTML Preview"
                  className="html-frame"
                  srcDoc={email.htmlBody || '<p>No HTML body available</p>'}
                />
              )}

              {activeTab === 'text' && (
                <pre className="text-body">{email.textBody || 'No text content'}</pre>
              )}

              {activeTab === 'headers' && (
                <pre className="raw-json">
                  {JSON.stringify(email.raw, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select an email from the left sidebar to preview it.</p>
          </div>
        )}
      </main>
    </div>
  );
}
