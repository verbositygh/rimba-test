import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const transactions = await prismaClient.transaction.findMany({include: {customer: true, items: {include: {item: true}}}});
  return transactions;
});
