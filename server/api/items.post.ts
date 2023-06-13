import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const item = await prismaClient.item.create({
      data: body
    });
    return item;
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An error occured. Read the data for details.',
      data: e?.issues,
    });
  }
});
