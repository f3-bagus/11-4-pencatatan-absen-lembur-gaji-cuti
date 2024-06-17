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
    .required("Date is required")
    .transform((value, originalValue) => {
      return moment(originalValue).utc().startOf("day").toDate();
    })
    .typeError("Date must be in the format YYYY-MM-DD"),
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

export const validationSchemaEditProfile = Yup.object().shape({
  name: Yup.string().required("Fullname is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone Number is required"),
});
