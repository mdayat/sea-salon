import { z as zod } from "zod";

const customerSchema = zod.object({
  fullName: zod.string(),
  email: zod.string().email(),
  phoneNumber: zod.string().superRefine((value, ctx) => {
    const phonePattern = /^(\+62|0)\d{8,13}$/;
    if (phonePattern.test(value) === false) {
      ctx.addIssue({
        code: zod.ZodIssueCode.invalid_string,
        validation: "regex",
        message: "Invalid phone number",
      });
    }
  }),
  password: zod.string(),
});

type Customer = zod.infer<typeof customerSchema>;

export { customerSchema };
export type { Customer };
