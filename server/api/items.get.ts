import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const items = await prismaClient.item.findMany({include: {transactions: {include: {transaction: true}}}});
  return items;
});
