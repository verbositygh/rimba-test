import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  name: z.string().nonempty(),
  phone: z.string().regex(/^\+\d{1,3}\d+$/),
  email: z.string().email(),
  address: z.string().nonempty(),
  idCardImage: z.string(),
  discount: z.number().nonnegative(),
  discountType: z.literal('fixed').or(z.literal('percentage')),
}) satisfies z.Schema<Prisma.CustomerUncheckedCreateInput>;

