import React, { useRef } from "react";
import {
  Code2,
  Sparkles,
  Copy,
  Check,
  Upload,
  Download,
  AlertOctagon,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

export default function JsonEditor({
  jsonText,
  onChange,
  error,
  errorLine,
  onFormat,
  onResetToSample,
  selectedPreset,
  onSelectPreset,
  presetList,
  onLoadFromFile
}) {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);

  // Synchronize scroll between line numbers gutter and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-schema-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          onLoadFromFile(content);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate line numbers
  const linesCount = Math.max(1, (jsonText.match(/\n/g) || []).length + 1);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="json-editor-container">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-title">
            <Code2 size={16} className="toolbar-icon" />
            <span>Schema Editor</span>
          </div>

          {/* Preset Selector */}
          <div className="preset-selector-group">
            <label htmlFor="schema-preset-select" className="preset-label">
              Preset:
            </label>
            <select
              id="schema-preset-select"
              className="preset-select"
              value={selectedPreset}
              onChange={(e) => onSelectPreset(e.target.value)}
            >
              {presetList.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn-toolbar"
            onClick={onFormat}
            title="Prettify & format JSON"
          >
            <Sparkles size={14} />
            <span>Format</span>
          </button>

          <button
            type="button"
            className="btn-toolbar"
            onClick={handleCopy}
            title="Copy JSON to clipboard"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            type="button"
            className="btn-toolbar"
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON schema from local file"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="btn-toolbar"
            onClick={handleDownload}
            title="Download JSON schema file"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button
            type="button"
            className="btn-toolbar btn-toolbar-subtle"
            onClick={onResetToSample}
            title="Reset to selected preset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Real-time Syntax / Schema Error Banner */}
      {error ? (
        <div className="schema-error-banner" role="alert">
          <AlertOctagon size={16} className="error-banner-icon" />
          <div className="error-banner-content">
            <span className="error-banner-title">JSON Schema Error</span>
            <span className="error-banner-msg">{error}</span>
          </div>
          {errorLine && <span className="error-line-badge">Line ~{errorLine}</span>}
        </div>
      ) : (
        <div className="schema-valid-banner">
          <CheckCircle2 size={14} />
          <span>Valid JSON schema • Changes compile instantly</span>
        </div>
      )}

      {/* Editor Body with Line Numbers */}
      <div className={`editor-body ${error ? "has-syntax-error" : ""}`}>
        <div ref={lineNumbersRef} className="editor-gutter" aria-hidden="true">
          {lineNumbers.map((num) => (
            <div
              key={num}
              className={`gutter-line-number ${
                errorLine === num ? "gutter-line-error" : ""
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={jsonText}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck="false"
          placeholder="Paste or write your JSON schema here..."
          aria-label="JSON Form Schema Definition"
        />
      </div>

      {/* Editor Footer / Helper info */}
      <div className="editor-footer">
        <span className="editor-stats">
          {linesCount} lines • {jsonText.length} characters
        </span>
        <span className="editor-tip">
          Tip: Add "validation": &#123; "min", "max", "minLength", "pattern" &#125;
        </span>
      </div>
    </div>
  );
}
