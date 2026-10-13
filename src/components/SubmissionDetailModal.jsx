import React, { useState } from "react";
import { X, Copy, Check, FileJson, Calendar, Hash } from "lucide-react";

export default function SubmissionDetailModal({ submission, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const jsonString = JSON.stringify(submission, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <FileJson size={18} className="modal-icon" />
            <div>
              <h3 className="modal-title">Submission Details</h3>
              <p className="modal-subtitle">
                ID: {submission.id} • Recorded: {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Form field summary cards */}
          <div className="modal-section-title">Submitted Field Values</div>
          <div className="field-values-grid">
            {Object.entries(submission.data || {}).map(([key, val]) => (
              <div key={key} className="field-value-cell">
                <span className="field-value-key">{key}</span>
                <span className="field-value-content">
                  {typeof val === "boolean" ? (
                    <span className={`badge-bool ${val ? "bool-true" : "bool-false"}`}>
                      {val ? "True / Accepted" : "False"}
                    </span>
                  ) : Array.isArray(val) ? (
                    <span className="array-tags">
                      {val.map((item, i) => (
                        <span key={i} className="array-tag">
                          {String(item)}
                        </span>
                      ))}
                    </span>
                  ) : (
                    String(val || "—")
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Raw JSON Payload */}
          <div className="modal-section-title raw-json-title">
            <span>Raw In-Memory JSON Payload</span>
            <button className="btn-copy-sm" onClick={handleCopy}>
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy Payload"}</span>
            </button>
          </div>
          <pre className="raw-json-block">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
