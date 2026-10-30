// Contact form validation and state, shared by the Server Action and the form.

export type ContactField = "name" | "email" | "subject" | "message";

export type ContactValues = Record<ContactField, string>;

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  // Echoed back so the form keeps what the visitor typed after a failed submit.
  values?: ContactValues;
}

const limits: Record<ContactField, number> = { name: 100, email: 254, subject: 150, message: 5000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactValues): ContactState["errors"] {
  const errors: NonNullable<ContactState["errors"]> = {};
  if (!values.name) errors.name = "Please enter your name.";
  if (!values.email) errors.email = "Please enter your email.";
  else if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address.";
  if (!values.subject) errors.subject = "Please enter a subject.";

  for (const field of Object.keys(limits) as ContactField[]) {
    if (!errors[field] && values[field].length > limits[field]) {
      errors[field] = `Please keep this under ${limits[field]} characters.`;
    }
  }
  return Object.keys(errors).length ? errors : undefined;
}
