import prisma from "@/prisma";
import { Status } from "@prisma/client";

const updateStatus = async ({
  model,
  id,
  status,
}: {
  model: string;
  id: string;
  status: Status;
}) => {
  await prisma[model].update({
    where: { id },
    data: { status },
  });
};

export { updateStatus };
