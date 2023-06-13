import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  code: z.string(),
  time: z.string().datetime(),
  customerId: z.number(),
}) satisfies z.Schema<Prisma.TransactionUncheckedCreateInput>;

