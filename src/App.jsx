import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import JsonEditor from "./components/JsonEditor";
import FormPreview from "./components/FormPreview";
import SubmissionsTable from "./components/SubmissionsTable";
import { SAMPLE_SCHEMAS } from "./data/sampleSchemas";
import { parseAndValidateSchema } from "./utils/validation";
import {
  FileCode,
  LayoutTemplate,
  Moon,
  Sun,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function App() {
  const [selectedPresetKey, setSelectedPresetKey] = useState("allFields");
  const [jsonText, setJsonText] = useState(() => {
    return JSON.stringify(SAMPLE_SCHEMAS.allFields.schema, null, 2);
  });
  const [parsedSchema, setParsedSchema] = useState(SAMPLE_SCHEMAS.allFields.schema);
  const [schemaError, setSchemaError] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("schema_form_theme") || "dark";
  });
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Apply theme class to document body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("schema_form_theme", theme);
  }, [theme]);

  // Live validation whenever jsonText changes
  useEffect(() => {
    const result = parseAndValidateSchema(jsonText);
    if (result.isValid) {
      setParsedSchema(result.schema);
      setSchemaError(null);
      setErrorLine(null);
    } else {
      setSchemaError(result.error);
      setErrorLine(result.line);
    }
  }, [jsonText]);

  // Handle preset switch
  const handleSelectPreset = (key) => {
    setSelectedPresetKey(key);
    const chosen = SAMPLE_SCHEMAS[key];
    if (chosen) {
      const formatted = JSON.stringify(chosen.schema, null, 2);
      setJsonText(formatted);
    }
  };

  // Format / Prettify JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (err) {
      // If invalid, keep as is
    }
  };

  // Reset to default sample
  const handleResetToSample = () => {
    const chosen = SAMPLE_SCHEMAS[selectedPresetKey] || SAMPLE_SCHEMAS.allFields;
    setJsonText(JSON.stringify(chosen.schema, null, 2));
  };

  // Handle importing schema from file
  const handleLoadFromFile = (fileContent) => {
    setJsonText(fileContent);
  };

  // Record submission in memory
  const handleNewSubmission = (submission) => {
    setSubmissions((prev) => [submission, ...prev]);
  };

  // Delete single submission
  const handleDeleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all submissions
  const handleClearAllSubmissions = () => {
    setSubmissions([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const presetList = useMemo(() => {
    return Object.entries(SAMPLE_SCHEMAS).map(([key, val]) => ({
      key,
      name: val.name,
      description: val.description
    }));
  }, []);

  const totalFields = parsedSchema?.fields?.length || 0;
  const requiredFieldsCount =
    parsedSchema?.fields?.filter((f) => f.required).length || 0;

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-logo">
            <LayoutTemplate size={22} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">SchemaForm Studio</h1>
            <p className="brand-tagline">Dynamic JSON-Driven Form Builder & Runner</p>
          </div>
        </div>

        {/* Global Statistics & Actions */}
        <div className="navbar-controls">
          <div className="stats-badges">
            <div className="stat-pill" title="Total dynamic fields in active schema">
              <Layers size={13} />
              <span>{totalFields} Fields</span>
              <span className="stat-highlight">({requiredFieldsCount} req)</span>
            </div>

            <div
              className={`stat-pill ${schemaError ? "pill-error" : "pill-success"}`}
              title={schemaError ? "Schema syntax error detected" : "Schema is valid and live"}
            >
              {schemaError ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
              <span>{schemaError ? "Syntax Issue" : "Engine Live"}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-nav"
            onClick={() => setShowDocsModal(true)}
            title="View Schema Specification & Examples"
          >
            <Info size={15} />
            <span>Docs & Schema Rules</span>
          </button>

          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Main Two-Panel Workspace */}
      <main className="main-content">
        <div className="editor-preview-grid">
          {/* Panel 1: JSON Schema Editor */}
          <section className="panel-column left-panel" aria-label="JSON Schema Editor Panel">
            <JsonEditor
              jsonText={jsonText}
              onChange={setJsonText}
              error={schemaError}
              errorLine={errorLine}
              onFormat={handleFormatJson}
              onResetToSample={handleResetToSample}
              selectedPreset={selectedPresetKey}
              onSelectPreset={handleSelectPreset}
              presetList={presetList}
              onLoadFromFile={handleLoadFromFile}
            />
          </section>

          {/* Panel 2: Live Dynamic Form Preview */}
          <section className="panel-column right-panel" aria-label="Live Form Preview Panel">
            <FormPreview
              schema={parsedSchema}
              onSubmitSuccess={handleNewSubmission}
              isSchemaValid={!schemaError}
            />
          </section>
        </div>

        {/* Bottom Section: In-Memory Submissions Table */}
        <section className="submissions-container" aria-label="Form Submissions Table">
          <SubmissionsTable
            submissions={submissions}
            fields={parsedSchema?.fields || []}
            onDeleteSubmission={handleDeleteSubmission}
            onClearAllSubmissions={handleClearAllSubmissions}
          />
        </section>
      </main>

      {/* Schema Documentation & Specification Modal */}
      {showDocsModal && (
        <div className="modal-backdrop" onClick={() => setShowDocsModal(false)}>
          <div className="modal-card modal-docs" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <FileCode size={20} className="modal-icon" />
                <div>
                  <h3 className="modal-title">JSON Form Schema Specification</h3>
                  <p className="modal-subtitle">Schema attributes and validation rules reference</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setShowDocsModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body docs-body">
              <h4>Supported Field Types</h4>
              <ul className="docs-list">
                <li><code>text</code>: Standard text input</li>
                <li><code>number</code>: Numeric input with min, max, step</li>
                <li><code>email</code>: Validates email structure</li>
                <li><code>dropdown</code>: Select box with <code>options: [&#123; label, value &#125;]</code></li>
                <li><code>checkboxes</code>: Multi-select checkboxes array with minSelected</li>
                <li><code>checkbox</code>: Single boolean toggle / confirmation checkbox</li>
                <li><code>textarea</code>: Multi-line text with rows and character boundaries</li>
                <li><code>radio</code>: Mutually exclusive radio option cards</li>
              </ul>

              <h4>Validation Attributes</h4>
              <div className="docs-table-wrapper">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Rule</th>
                      <th>Type</th>
                      <th>Applies To</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>required</code></td>
                      <td>boolean</td>
                      <td>All fields</td>
                      <td>Rejects submission if field is empty or unselected</td>
                    </tr>
                    <tr>
                      <td><code>minLength</code> / <code>maxLength</code></td>
                      <td>number</td>
                      <td>text, email, textarea</td>
                      <td>Boundary constraints on string length</td>
                    </tr>
                    <tr>
                      <td><code>min</code> / <code>max</code></td>
                      <td>number</td>
                      <td>number</td>
                      <td>Boundary constraints on numeric values</td>
                    </tr>
                    <tr>
                      <td><code>pattern</code> / <code>regex</code></td>
                      <td>string</td>
                      <td>text, email, textarea</td>
                      <td>Regular expression pattern for client-side evaluation</td>
                    </tr>
                    <tr>
                      <td><code>minSelected</code></td>
                      <td>number</td>
                      <td>checkboxes</td>
                      <td>Requires user to select at least N choices</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowDocsModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
