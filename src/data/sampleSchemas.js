export const SAMPLE_SCHEMAS = {
  allFields: {
    name: "Complete Field Showcase",
    description: "Demonstrates all required and advanced field types with various validation rules.",
    schema: {
      title: "Employee Onboarding & Preferences",
      description: "Please fill out your personal information, role details, and workstation preferences.",
      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "e.g. Alexandra Chen",
          helpText: "Enter your legal first and last name",
          validation: {
            minLength: 3,
            maxLength: 50,
            pattern: "^[a-zA-Z\\s'-]+$",
            message: "Name can only contain letters, spaces, hyphens, and apostrophes"
          }
        },
        {
          name: "workEmail",
          label: "Work Email Address",
          type: "email",
          required: true,
          placeholder: "alexandra.chen@company.io",
          helpText: "Must be a valid business email address",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message: "Please enter a valid email format (user@domain.com)"
          }
        },
        {
          name: "age",
          label: "Age (Years)",
          type: "number",
          required: true,
          placeholder: "e.g. 28",
          validation: {
            min: 18,
            max: 100
          }
        },
        {
          name: "department",
          label: "Department / Team",
          type: "dropdown",
          required: true,
          placeholder: "Select your department",
          options: [
            { label: "Engineering & Architecture", value: "engineering" },
            { label: "Product Management", value: "product" },
            { label: "Design & UX Research", value: "design" },
            { label: "Marketing & Growth", value: "marketing" },
            { label: "Customer Success & Support", value: "support" }
          ]
        },
        {
          name: "experienceYears",
          label: "Years of Professional Experience",
          type: "number",
          required: false,
          placeholder: "e.g. 5",
          validation: {
            min: 0,
            max: 50
          }
        },
        {
          name: "equipment",
          label: "Workstation Equipment & Peripherals",
          type: "checkboxes",
          required: true,
          helpText: "Select all items you will need on Day 1",
          options: [
            { label: "Dual 4K External Monitors", value: "monitors" },
            { label: "Ergonomic Mechanical Keyboard", value: "keyboard" },
            { label: "Wireless Noise-Canceling Headset", value: "headset" },
            { label: "Motorized Standing Desk Mat", value: "standing_desk" },
            { label: "High-Precision Ergonomic Mouse", value: "mouse" }
          ],
          validation: {
            minSelected: 1,
            message: "Please choose at least 1 equipment item"
          }
        },
        {
          name: "bio",
          label: "Professional Bio & Introduction",
          type: "textarea",
          required: true,
          placeholder: "Tell your team a little about your background, passions, and favorite hobbies...",
          rows: 4,
          validation: {
            minLength: 20,
            maxLength: 400
          }
        },
        {
          name: "agreeToTerms",
          label: "I confirm the provided information is accurate and agree to company guidelines",
          type: "checkbox",
          required: true,
          validation: {
            message: "You must accept the terms before submitting"
          }
        }
      ]
    }
  },

  jobApplication: {
    name: "Software Engineer Application",
    description: "Technical role application with portfolio, expected salary, and stack selection.",
    schema: {
      title: "Senior Full-Stack Engineer Application",
      description: "Join our core infrastructure team. Please submit your technical qualifications.",
      fields: [
        {
          name: "candidateName",
          label: "Applicant Full Name",
          type: "text",
          required: true,
          placeholder: "Johnathan Doe",
          validation: {
            minLength: 2,
            maxLength: 60
          }
        },
        {
          name: "contactEmail",
          label: "Primary Email",
          type: "email",
          required: true,
          placeholder: "john@example.com"
        },
        {
          name: "primaryLanguage",
          label: "Core Specialization",
          type: "dropdown",
          required: true,
          options: [
            { label: "TypeScript / Node / React", value: "ts_fullstack" },
            { label: "Python / FastAPI / PyTorch", value: "py_ai" },
            { label: "Go / Kubernetes / Distributed Systems", value: "go_infra" },
            { label: "Rust / High-Performance Systems", value: "rust_systems" }
          ]
        },
        {
          name: "expectedSalary",
          label: "Expected Annual Compensation ($ USD)",
          type: "number",
          required: true,
          placeholder: "140000",
          validation: {
            min: 50000,
            max: 500000
          }
        },
        {
          name: "skills",
          label: "Demonstrated Technical Competencies",
          type: "checkboxes",
          required: true,
          options: [
            { label: "Cloud Native (AWS/GCP/Azure)", value: "cloud" },
            { label: "Database Modeling (Postgres/Redis)", value: "databases" },
            { label: "CI/CD & DevOps Automation", value: "cicd" },
            { label: "Microservices & GraphQL/REST APIs", value: "apis" }
          ]
        },
        {
          name: "coverNote",
          label: "Why this team & proudest engineering achievement",
          type: "textarea",
          required: true,
          placeholder: "Describe a complex technical challenge you solved...",
          rows: 5,
          validation: {
            minLength: 30,
            maxLength: 1000
          }
        }
      ]
    }
  },

  customerFeedback: {
    name: "Product Experience Survey",
    description: "CSAT survey with rating scores, categories, and feature requests.",
    schema: {
      title: "Quarterly Platform Feedback Survey",
      description: "Help us shape the roadmap for the next quarter. We read every response!",
      fields: [
        {
          name: "respondentEmail",
          label: "Account Email",
          type: "email",
          required: false,
          placeholder: "optional@company.com",
          helpText: "Leave blank if you prefer anonymous feedback"
        },
        {
          name: "satisfactionRating",
          label: "Overall Satisfaction Rating (1 to 10)",
          type: "number",
          required: true,
          placeholder: "10",
          validation: {
            min: 1,
            max: 10
          }
        },
        {
          name: "primaryUse",
          label: "Primary Workflow Category",
          type: "dropdown",
          required: true,
          options: [
            { label: "Data Pipeline & Analytics", value: "analytics" },
            { label: "Customer Relationship Management", value: "crm" },
            { label: "Automated Billing & Invoicing", value: "billing" },
            { label: "Internal Team Collaboration", value: "collab" }
          ]
        },
        {
          name: "desiredFeatures",
          label: "Which new capabilities would you like prioritized?",
          type: "checkboxes",
          required: false,
          options: [
            { label: "AI-Powered Report Summarization", value: "ai_reports" },
            { label: "Mobile Native Application", value: "mobile_app" },
            { label: "Webhook & Event Triggers", value: "webhooks" },
            { label: "Single Sign-On (Okta / Azure AD)", value: "sso" }
          ]
        },
        {
          name: "detailedFeedback",
          label: "Detailed Feedback & Suggestions",
          type: "textarea",
          required: true,
          placeholder: "What made your experience great or where did we fall short?",
          rows: 4,
          validation: {
            minLength: 10,
            maxLength: 500
          }
        }
      ]
    }
  }
};
