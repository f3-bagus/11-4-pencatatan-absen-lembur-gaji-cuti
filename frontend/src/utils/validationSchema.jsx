import * as Yup from "yup";

export const validationSchema = Yup.object({
  nip: Yup.string()
    .required("NIP is required")
    .matches(/^\d+$/, "NIP must be a number")
    .min(6, "NIP must be at least 8 digits")
    .max(20, "NIP must be at most 20 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const validationSchemaOvertime = Yup.object().shape({
  division: Yup.string().required("Division is required"),
  date: Yup.date()
    .required("Date is required"),
  reason: Yup.string().required("Reason is required"),
  overtime_rate: Yup.number()
    .required("Overtime rate is required")
    .positive("Overtime rate must be positive"),
  hours: Yup.number()
    .required("Hours are required")
    .max(5, "Hours cannot be more than 5"),
});

export const validationSchemaChangePassword = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

export const validationSchemaCreateAccount = Yup.object({
  nip: Yup.number().required("NIP is required"),
  gender: Yup.string().required("Gender is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  division: Yup.string().required("Division is required"),
  type: Yup.string().required("Type is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.number()
    .required("Phone Number is required"),
});

export const validationSchemaCreateAccountHr = Yup.object({
  nip: Yup.number().required("NIP is required"),
  gender: Yup.string().required("Gender is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.number()
    .required("Phone number is required"),
});
