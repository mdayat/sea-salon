import { z as zod } from "zod";

const reviewSchema = zod.object({
  rating: zod.number().min(1).max(5),
  description: zod.string(),
});

type Review = zod.infer<typeof reviewSchema>;

export { reviewSchema };
export type { Review };
