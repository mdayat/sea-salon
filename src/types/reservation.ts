import { z as zod } from "zod";

const serviceTypeSchema = zod.union([
  zod.literal("haircuts_and_styling"),
  zod.literal("manicure_and_pedicure"),
  zod.literal("facial_treatments"),
]);

type ServiceType = zod.infer<typeof serviceTypeSchema>;

const reservationSchema = zod.object({
  id: zod.string(),
  customerName: zod.string(),
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
  serviceType: serviceTypeSchema,
  date: zod.string().date(),
  time: zod.string().time(),
});

type Reservation = zod.infer<typeof reservationSchema>;

export { reservationSchema };
export type { ServiceType, Reservation };
