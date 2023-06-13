import { Prisma } from "@prisma/client";
import { z } from "zod";

export default z.object({
  id: z.undefined(),
  name: z.string(),
  unit: z.literal('kg').or(z.literal('pcs')),
  quantity: z.number().int(),
  price: z.number(),
  itemImage: z.string(),
}) satisfies z.Schema<Prisma.ItemUncheckedCreateInput>;

