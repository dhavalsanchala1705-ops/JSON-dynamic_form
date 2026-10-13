/**
 * Validates a single form field value based on its schema configuration
 */
export function validateField(field, value) {
  if (!field) return null;

  const { name, label, type, required, validation = {} } = field;
  const fieldLabel = label || name || "Field";

  // Check required
  if (required) {
    if (type === "checkbox") {
      if (!value) {
        return validation.message || `${fieldLabel} must be checked.`;
      }
    } else if (type === "checkboxes") {
      if (!Array.isArray(value) || value.length === 0) {
        return validation.message || `Please select at least one option for ${fieldLabel}.`;
      }
    } else if (type === "number") {
      if (value === "" || value === null || value === undefined || isNaN(Number(value))) {
        return `${fieldLabel} is required and must be a valid number.`;
      }
    } else {
      if (value === undefined || value === null || String(value).trim() === "") {
        return validation.message || `${fieldLabel} is required.`;
      }
    }
  }

  // If value is empty and not required, skip further validation
  const isEmpty =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    return null;
  }

  // Text, Email, Textarea string validations
  if (type === "text" || type === "email" || type === "textarea") {
    const strVal = String(value);

    if (validation.minLength !== undefined && strVal.length < validation.minLength) {
      return (
        validation.message ||
        `${fieldLabel} must be at least ${validation.minLength} characters (current: ${strVal.length}).`
      );
    }

    if (validation.maxLength !== undefined && strVal.length > validation.maxLength) {
      return (
        validation.message ||
        `${fieldLabel} must not exceed ${validation.maxLength} characters (current: ${strVal.length}).`
      );
    }

    // Email specific check
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(strVal)) {
        return validation.message || "Please enter a valid email address.";
      }
    }

    // Regex pattern check
    const patternStr = validation.pattern || validation.regex;
    if (patternStr) {
      try {
        const regex = new RegExp(patternStr);
        if (!regex.test(strVal)) {
          return validation.message || `${fieldLabel} does not match required format.`;
        }
      } catch (err) {
        console.warn(`Invalid regex pattern provided for ${name}:`, patternStr);
      }
    }
  }

  // Number validations
  if (type === "number") {
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldLabel} must be a number.`;
    }

    if (validation.min !== undefined && num < validation.min) {
      return validation.message || `${fieldLabel} must be at least ${validation.min}.`;
    }

    if (validation.max !== undefined && num > validation.max) {
      return validation.message || `${fieldLabel} cannot exceed ${validation.max}.`;
    }
  }

  // Checkboxes list validation (multi-select)
  if (type === "checkboxes" && Array.isArray(value)) {
    if (validation.minSelected !== undefined && value.length < validation.minSelected) {
      return (
        validation.message ||
        `Please select at least ${validation.minSelected} option(s).`
      );
    }

    if (validation.maxSelected !== undefined && value.length > validation.maxSelected) {
      return (
        validation.message ||
        `Please select no more than ${validation.maxSelected} option(s).`
      );
    }
  }

  return null;
}

/**
 * Validates entire form data against schema fields
 */
export function validateForm(fields = [], formData = {}) {
  const errors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validateField(field, formData[field.name]);
    if (error) {
      errors[field.name] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
}

/**
 * Validates the raw JSON schema text
 */
export function parseAndValidateSchema(jsonString) {
  if (!jsonString || typeof jsonString !== "string" || !jsonString.trim()) {
    return {
      isValid: false,
      schema: null,
      error: "JSON schema cannot be empty.",
      line: 1
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    // Extract line/column number from standard JSON parse error if possible
    let errorMsg = err.message;
    let line = null;
    const match = err.message.match(/line\s+(\d+)|position\s+(\d+)/i);
    if (match) {
      line = match[1] ? parseInt(match[1], 10) : null;
    }
    return {
      isValid: false,
      schema: null,
      error: `Syntax Error: ${errorMsg}`,
      line
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      schema: null,
      error: "Schema root must be a valid JSON object with a 'fields' array.",
      line: 1
    };
  }

  if (!Array.isArray(parsed.fields)) {
    return {
      isValid: false,
      schema: null,
      error: "Schema must contain a 'fields' array containing field definitions.",
      line: 1
    };
  }

  // Validate each field has at least name and type
  const names = new Set();
  for (let i = 0; i < parsed.fields.length; i++) {
    const field = parsed.fields[i];
    if (!field || typeof field !== "object") {
      return {
        isValid: false,
        schema: null,
        error: `Field at index ${i} is not a valid object.`,
        line: null
      };
    }
    if (!field.name) {
      return {
        isValid: false,
        schema: null,
        error: `Field at index ${i} is missing required 'name' property.`,
        line: null
      };
    }
    if (names.has(field.name)) {
      return {
        isValid: false,
        schema: null,
        error: `Duplicate field name detected: "${field.name}". Field names must be unique.`,
        line: null
      };
    }
    names.add(field.name);

    if (!field.type) {
      return {
        isValid: false,
        schema: null,
        error: `Field "${field.name}" is missing 'type' (e.g. text, number, email, dropdown, checkboxes, textarea).`,
        line: null
      };
    }
  }

  return {
    isValid: true,
    schema: parsed,
    error: null,
    line: null
  };
}
