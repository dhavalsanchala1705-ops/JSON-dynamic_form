import React from "react";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

export default function DynamicField({
  field,
  value,
  error,
  isTouched,
  onChange,
  onBlur
}) {
  const {
    name,
    label,
    type = "text",
    required = false,
    placeholder = "",
    helpText = "",
    options = [],
    rows = 3,
    validation = {}
  } = field;

  const id = `field-${name}`;
  const hasError = Boolean(error);
  const isValid = isTouched && !hasError && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0);

  // Helper for multi-checkbox changes
  const handleCheckboxGroupChange = (optValue, checked) => {
    const currentList = Array.isArray(value) ? [...value] : [];
    let updated;
    if (checked) {
      updated = [...currentList, optValue];
    } else {
      updated = currentList.filter((item) => item !== optValue);
    }
    onChange(name, updated);
  };

  return (
    <div className={`form-group ${hasError ? "has-error" : ""} ${isValid ? "is-valid" : ""}`}>
      {/* Label and badges */}
      <div className="field-label-row">
        <label htmlFor={id} className="field-label">
          <span>{label || name}</span>
          {required && <span className="required-star" title="Required field">*</span>}
        </label>
        
        <div className="field-meta-badges">
          <span className="field-type-badge">{type}</span>
          {validation.maxLength && (
            <span className="char-count-badge">
              {String(value || "").length}/{validation.maxLength}
            </span>
          )}
        </div>
      </div>

      {/* Field Input Rendering */}
      <div className="field-input-wrapper">
        {/* TEXT / EMAIL */}
        {(type === "text" || type === "email") && (
          <input
            id={id}
            name={name}
            type={type}
            className={`form-input ${hasError ? "input-error" : ""}`}
            placeholder={placeholder || (required ? "Required" : "")}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur(name)}
          />
        )}

        {/* NUMBER */}
        {type === "number" && (
          <input
            id={id}
            name={name}
            type="number"
            className={`form-input ${hasError ? "input-error" : ""}`}
            placeholder={placeholder}
            min={validation.min}
            max={validation.max}
            step={validation.step || "any"}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur(name)}
          />
        )}

        {/* TEXTAREA */}
        {type === "textarea" && (
          <textarea
            id={id}
            name={name}
            rows={rows}
            className={`form-input form-textarea ${hasError ? "input-error" : ""}`}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur(name)}
          />
        )}

        {/* DROPDOWN / SELECT */}
        {type === "dropdown" && (
          <div className="select-container">
            <select
              id={id}
              name={name}
              className={`form-input form-select ${hasError ? "input-error" : ""}`}
              value={value ?? ""}
              onChange={(e) => onChange(name, e.target.value)}
              onBlur={() => onBlur(name)}
            >
              <option value="">{placeholder || "-- Select an option --"}</option>
              {options.map((opt, idx) => {
                const optVal = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                return (
                  <option key={idx} value={optVal}>
                    {optLabel}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* CHECKBOXES (MULTI-SELECT) */}
        {type === "checkboxes" && (
          <div className="checkbox-group-wrapper" id={id}>
            {options.map((opt, idx) => {
              const optVal = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              const isChecked = Array.isArray(value) && value.includes(optVal);
              const checkId = `${id}-opt-${idx}`;

              return (
                <label key={idx} htmlFor={checkId} className={`checkbox-option-card ${isChecked ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    id={checkId}
                    name={name}
                    value={optVal}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxGroupChange(optVal, e.target.checked)}
                    onBlur={() => onBlur(name)}
                  />
                  <span className="checkbox-custom-indicator"></span>
                  <span className="checkbox-option-text">{optLabel}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* SINGLE CHECKBOX (BOOLEAN TOGGLE / AGREEMENT) */}
        {type === "checkbox" && (
          <label htmlFor={id} className={`single-checkbox-card ${value ? "selected" : ""}`}>
            <input
              type="checkbox"
              id={id}
              name={name}
              checked={Boolean(value)}
              onChange={(e) => onChange(name, e.target.checked)}
              onBlur={() => onBlur(name)}
            />
            <span className="checkbox-custom-indicator"></span>
            <span className="checkbox-option-text">
              {placeholder || label || "Check to confirm"}
            </span>
          </label>
        )}

        {/* RADIO BUTTONS */}
        {type === "radio" && (
          <div className="radio-group-wrapper" id={id}>
            {options.map((opt, idx) => {
              const optVal = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              const isChecked = value === optVal;
              const radioId = `${id}-radio-${idx}`;

              return (
                <label key={idx} htmlFor={radioId} className={`radio-option-card ${isChecked ? "selected" : ""}`}>
                  <input
                    type="radio"
                    id={radioId}
                    name={name}
                    value={optVal}
                    checked={isChecked}
                    onChange={() => onChange(name, optVal)}
                    onBlur={() => onBlur(name)}
                  />
                  <span className="radio-custom-indicator"></span>
                  <span className="radio-option-text">{optLabel}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation error message or help text */}
      {hasError ? (
        <div className="field-error-message" role="alert">
          <AlertCircle size={14} className="error-icon" />
          <span>{error}</span>
        </div>
      ) : helpText ? (
        <div className="field-help-text">
          <HelpCircle size={13} className="help-icon" />
          <span>{helpText}</span>
        </div>
      ) : null}
    </div>
  );
}
