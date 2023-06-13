import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const customers = await prismaClient.customer.findMany();
  return customers;
});
