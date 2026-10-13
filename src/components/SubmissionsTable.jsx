import React, { useState } from "react";
import {
  Database,
  Search,
  Download,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileCode,
  Inbox
} from "lucide-react";
import { exportSubmissionsToCSV, exportSubmissionsToJSON } from "../utils/exportUtils";
import SubmissionDetailModal from "./SubmissionDetailModal";

export default function SubmissionsTable({
  submissions,
  fields = [],
  onDeleteSubmission,
  onClearAllSubmissions
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Filter submissions by search term
  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    if (sub.id?.toLowerCase().includes(term)) return true;
    if (sub.schemaTitle?.toLowerCase().includes(term)) return true;

    // Search inside data fields
    return Object.values(sub.data || {}).some((val) => {
      if (val === null || val === undefined) return false;
      if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(term));
      return String(val).toLowerCase().includes(term);
    });
  });

  return (
    <div className="submissions-section">
      <div className="submissions-header">
        <div className="submissions-title-group">
          <div className="submissions-icon-wrap">
            <Database size={18} />
          </div>
          <div>
            <div className="submissions-title-row">
              <h2 className="submissions-title">In-Memory Submissions Store</h2>
              <span className="badge-count">
                {submissions.length} {submissions.length === 1 ? "Record" : "Records"}
              </span>
            </div>
            <p className="submissions-subtitle">
              Valid form submissions stored in-memory during this session
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="submissions-actions">
          {submissions.length > 0 && (
            <>
              <div className="search-input-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn-action"
                onClick={() => exportSubmissionsToCSV(submissions, fields)}
                title="Export as CSV spreadsheet"
              >
                <FileSpreadsheet size={15} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                className="btn-action"
                onClick={() => exportSubmissionsToJSON(submissions)}
                title="Export as JSON file"
              >
                <FileCode size={15} />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                className="btn-action btn-danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all in-memory submissions?")) {
                    onClearAllSubmissions();
                  }
                }}
                title="Clear all recorded responses"
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Content */}
      {submissions.length === 0 ? (
        <div className="empty-submissions-state">
          <div className="empty-icon-wrap">
            <Inbox size={36} />
          </div>
          <h4 className="empty-title">No submissions recorded yet</h4>
          <p className="empty-description">
            Fill out the dynamically generated form in the preview panel and click
            <strong> "Submit Response"</strong> to validate and record your first entry.
          </p>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>ID</th>
                <th style={{ width: "160px" }}>Submitted At</th>
                {fields.slice(0, 5).map((f) => (
                  <th key={f.name}>{f.label || f.name}</th>
                ))}
                {fields.length > 5 && <th>+ {fields.length - 5} More Fields</th>}
                <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 3} className="no-matches-cell">
                    No submissions matched search query "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => (
                  <tr key={sub.id || index}>
                    <td>
                      <span className="id-badge">{sub.id}</span>
                    </td>
                    <td className="timestamp-cell">
                      {new Date(sub.submittedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                      <span className="date-subtext">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Display primary schema field values */}
                    {fields.slice(0, 5).map((f) => {
                      const val = sub.data ? sub.data[f.name] : null;

                      if (f.type === "checkbox") {
                        return (
                          <td key={f.name}>
                            <span className={`pill-badge ${val ? "pill-true" : "pill-false"}`}>
                              {val ? "Yes" : "No"}
                            </span>
                          </td>
                        );
                      }

                      if (f.type === "checkboxes" && Array.isArray(val)) {
                        return (
                          <td key={f.name}>
                            <div className="tags-preview">
                              {val.length === 0 ? (
                                <span className="text-muted">None</span>
                              ) : (
                                val.map((item, i) => (
                                  <span key={i} className="mini-tag">
                                    {String(item)}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={f.name} className="cell-truncate" title={String(val || "")}>
                          {val !== undefined && val !== null && String(val) !== "" ? (
                            String(val)
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      );
                    })}

                    {fields.length > 5 && (
                      <td className="text-muted">
                        <span className="more-fields-badge">
                          {Object.keys(sub.data || {}).length} Total
                        </span>
                      </td>
                    )}

                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => setSelectedSubmission(sub)}
                        title="View Submission Details & JSON"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        onClick={() => onDeleteSubmission(sub.id)}
                        title="Delete submission"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
