import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import prismaClient from "../prismaClient";

interface ExpectedItemData {
  id: number;
  quantity: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const items: ExpectedItemData[] = body.items;
  delete body.items;
  if (!items) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Custom Items must exist'
    });
  }
  try {
    // Handle item validation and preserve quantity data
    const mappedItems = await Promise.all(items.map(async (i) => {
      const item = await prismaClient.item.findUnique({where: {id: i.id}, include: {transactions: {include: {transaction: true}}}});
      if (!i.id || !i.quantity || !item) {
        throw new PrismaClientValidationError("Item is invalid");
      }
      if (item.quantity - item.transactions.reduce((acc, curr) => acc + curr.quantity, 0) < i.quantity) {
        throw new PrismaClientValidationError("Item is short on stock");
      }
      return {
        item,
        quantity: i.quantity,
      };
    }));

    // Create transaction
    const transaction = await prismaClient.transaction.create({
      data: body
    });

    // Create item to transaction
    await prismaClient.$transaction(mappedItems.map((i) => {
      return prismaClient.itemToTransaction.create({
        data: {
          quantity: i.quantity,
          itemId: i.item.id,
          transactionId: transaction.id,
        }
      });
    }));
  } catch (e: any) {
    console.error(e);
    throw createError({
      statusCode: 400,
      statusMessage: 'An error occured. Read the data for details.',
      data: e?.issues,
    });
  }
});
