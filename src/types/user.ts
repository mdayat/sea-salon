import { z as zod } from "zod";

const userRoleSchema = zod.union([
  zod.literal("customer"),
  zod.literal("admin"),
]);

const userSchema = zod.object({
  id: zod.string().uuid(),
  fullName: zod.string(),
  email: zod.string().email(),
  phoneNumber: zod.string().superRefine((value, ctx) => {
    const phonePattern = /^0\d{8,13}$/;
    if (phonePattern.test(value) === false) {
      ctx.addIssue({
        code: zod.ZodIssueCode.invalid_string,
        validation: "regex",
        message: "Invalid phone number",
      });
    }
  }),
  password: zod.string().superRefine((value, ctx) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$/;
    if (passwordPattern.test(value) === false) {
      ctx.addIssue({
        code: zod.ZodIssueCode.invalid_string,
        validation: "regex",
        message: "Invalid password",
      });
    }
  }),
  role: userRoleSchema,
});

type UserRole = zod.infer<typeof userRoleSchema>;
type User = zod.infer<typeof userSchema>;

export { userSchema };
export type { User, UserRole };
