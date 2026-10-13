/**
 * Downloads a string content as a file in browser
 */
export function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts array of submission records to CSV format
 */
export function exportSubmissionsToCSV(submissions, fields = []) {
  if (!submissions || submissions.length === 0) return;

  // Extract all keys from fields or from the submissions
  const fieldKeys = fields.map((f) => f.name);
  const extraKeys = ["_id", "_submittedAt"];
  const allHeaders = [...extraKeys, ...fieldKeys];

  // Helper to format CSV cells
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    if (typeof val === "object") {
      val = Array.isArray(val) ? val.join("; ") : JSON.stringify(val);
    }
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = allHeaders.map(escapeCell).join(",");
  const dataRows = submissions.map((sub) => {
    return allHeaders
      .map((header) => {
        if (header === "_id") return escapeCell(sub.id);
        if (header === "_submittedAt") return escapeCell(sub.submittedAt);
        return escapeCell(sub.data ? sub.data[header] : "");
      })
      .join(",");
  });

  const csvContent = [headerRow, ...dataRows].join("\r\n");
  downloadFile(
    csvContent,
    `form_submissions_${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv;charset=utf-8;"
  );
}

/**
 * Exports submissions array as JSON file
 */
export function exportSubmissionsToJSON(submissions) {
  if (!submissions || submissions.length === 0) return;
  const jsonContent = JSON.stringify(submissions, null, 2);
  downloadFile(
    jsonContent,
    `form_submissions_${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
}
