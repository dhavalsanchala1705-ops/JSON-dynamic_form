import React, { useState, useEffect } from "react";
import DynamicField from "./DynamicField";
import { validateField, validateForm } from "../utils/validation";
import { Send, RotateCcw, CheckCircle, AlertTriangle, Layers } from "lucide-react";

export default function FormPreview({
  schema,
  onSubmitSuccess,
  isSchemaValid
}) {
  const fields = schema?.fields || [];
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  // Synchronize form default values when schema changes
  useEffect(() => {
    setFormData((prev) => {
      const nextData = {};
      fields.forEach((f) => {
        if (prev[f.name] !== undefined) {
          nextData[f.name] = prev[f.name];
        } else if (f.defaultValue !== undefined) {
          nextData[f.name] = f.defaultValue;
        } else if (f.type === "checkboxes") {
          nextData[f.name] = [];
        } else if (f.type === "checkbox") {
          nextData[f.name] = false;
        } else {
          nextData[f.name] = "";
        }
      });
      return nextData;
    });

    // Clear stale errors for fields that no longer exist
    setErrors((prevErrors) => {
      const nextErrors = {};
      fields.forEach((f) => {
        if (prevErrors[f.name]) {
          nextErrors[f.name] = prevErrors[f.name];
        }
      });
      return nextErrors;
    });
  }, [schema]);

  // Handle field change with instant validation if field was touched
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // If field has been touched or submit attempted, run real-time validation
    if (touched[name] || isSubmitted) {
      const fieldDef = fields.find((f) => f.name === name);
      const fieldError = validateField(fieldDef, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Handle field blur (triggers real-time validation on blur)
  const handleFieldBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    const fieldDef = fields.find((f) => f.name === name);
    const fieldError = validateField(fieldDef, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  // Reset form to defaults
  const handleReset = () => {
    const freshData = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        freshData[f.name] = f.defaultValue;
      } else if (f.type === "checkboxes") {
        freshData[f.name] = [];
      } else if (f.type === "checkbox") {
        freshData[f.name] = false;
      } else {
        freshData[f.name] = "";
      }
    });
    setFormData(freshData);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setSubmitFeedback(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Mark all fields as touched
    const allTouched = {};
    fields.forEach((f) => {
      allTouched[f.name] = true;
    });
    setTouched(allTouched);

    // Run full form validation
    const { isValid, errors: validationErrors } = validateForm(fields, formData);
    setErrors(validationErrors);

    if (!isValid) {
      const errorCount = Object.keys(validationErrors).length;
      setSubmitFeedback({
        type: "error",
        message: `Validation failed: Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} before submitting.`
      });
      return;
    }

    // Submission succeeded!
    setSubmitFeedback({
      type: "success",
      message: "Form response successfully validated and recorded in memory!"
    });

    // Pass response payload to parent
    onSubmitSuccess({
      id: `SUB-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString(),
      schemaTitle: schema.title || "Untitled Form",
      data: { ...formData }
    });

    // Clear feedback notice after 4 seconds
    setTimeout(() => {
      setSubmitFeedback(null);
    }, 4000);
  };

  const activeErrorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="form-preview-card">
      <div className="preview-header">
        <div className="preview-header-info">
          <div className="preview-title-row">
            <h2 className="preview-title">{schema?.title || "Dynamic Form Preview"}</h2>
            <span className="badge-field-count">
              <Layers size={13} />
              {fields.length} {fields.length === 1 ? "Field" : "Fields"}
            </span>
          </div>
          {schema?.description && (
            <p className="preview-description">{schema.description}</p>
          )}
        </div>

        {/* Live status badge */}
        <div className="preview-status-indicator">
          {activeErrorCount > 0 ? (
            <span className="status-badge status-warning">
              <AlertTriangle size={13} />
              {activeErrorCount} Issue{activeErrorCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="status-badge status-ready">
              <CheckCircle size={13} />
              Schema Live
            </span>
          )}
        </div>
      </div>

      {submitFeedback && (
        <div
          className={`submission-feedback-banner ${
            submitFeedback.type === "success" ? "feedback-success" : "feedback-error"
          }`}
        >
          {submitFeedback.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{submitFeedback.message}</span>
        </div>
      )}

      {fields.length === 0 ? (
        <div className="empty-fields-state">
          <p>No fields defined yet. Add field objects to the JSON schema on the left to render your form dynamically.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="rendered-dynamic-form">
          <div className="fields-stack">
            {fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                isTouched={touched[field.name]}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
              />
            ))}
          </div>

          <div className="form-action-bar">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={!isSchemaValid}
            >
              <Send size={16} />
              Submit Response
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-reset"
              onClick={handleReset}
            >
              <RotateCcw size={15} />
              Reset Form
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
