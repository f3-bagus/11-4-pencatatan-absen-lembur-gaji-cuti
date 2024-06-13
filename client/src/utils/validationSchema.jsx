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
