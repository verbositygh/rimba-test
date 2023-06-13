import { PrismaClient } from "@prisma/client";
import CustomerValidation from "../lib/validators/CustomerValidation";
import ItemValidation from "../lib/validators/ItemValidation";
import TransactionValidation from "../lib/validators/TransactionValidation";

export default new PrismaClient({
  // log: ['query']
}).$extends({
  query: {
    customer: {
      create({args, query}) {
        args.data = CustomerValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = CustomerValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = CustomerValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = CustomerValidation.parse(args.create);
        args.update = CustomerValidation.partial().parse(args.update);
        return query(args);
      },
    },
    item: {
      create({args, query}) {
        args.data = ItemValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = ItemValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = ItemValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = ItemValidation.parse(args.create);
        args.update = ItemValidation.partial().parse(args.update);
        return query(args);
      },
    },
    transaction: {
      create({args, query}) {
        args.data = TransactionValidation.parse(args.data);
        return query(args);
      },
      update({args, query}) {
        args.data = TransactionValidation.partial().parse(args.data);
        return query(args);
      },
      updateMany({args, query}) {
        args.data = TransactionValidation.partial().parse(args.data);
        return query(args);
      },
      upsert({args, query}) {
        args.create = TransactionValidation.parse(args.create);
        args.update = TransactionValidation.partial().parse(args.update);
        return query(args);
      },
    },
  }
});
