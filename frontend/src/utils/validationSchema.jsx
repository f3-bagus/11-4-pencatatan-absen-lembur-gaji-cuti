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
  date: Yup.date().required("Date is required"),
  reason: Yup.string().required("Reason is required"),
  overtime_rate: Yup.number()
    .required("Overtime rate is required")
    .positive("Overtime rate must be positive"),
});

export const validationSchemaLeave = Yup.object().shape({
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date()
    .required("End date is required")
    .min(Yup.ref("start_date"), "End date must be after start date")
    .when("start_date", (start_date, schema) => {
      if (start_date) {
        const maxDate = new Date(start_date);
        maxDate.setDate(maxDate.getDate() + 12);
        return schema.max(maxDate, "End date must not be more than 12 days after start date");
      }
      return schema;
    }),
  type: Yup.string().required("Type is required"),
  reason: Yup.string().required("Reason is required"),
  leave_letter: Yup.mixed().required("Leave letter is required"),
});
