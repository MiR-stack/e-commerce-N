// services/permission.service.ts
import prisma from "@/prisma";
import { VALID_PERMISSIONS } from "@/schemas";
import { error } from "@/utils";

export const seedPermissions = async () => {
  const existingPermissions = await prisma.permission.findMany();

  const permissionsToCreate = VALID_PERMISSIONS.filter(
    (permission) => !existingPermissions.some((ep) => ep.name === permission)
  ).map((permission) => ({
    name: permission,
    type: permission.split(":")[0].toUpperCase(),
    description: `Allows ${permission.split(":")[1]} operations on ${
      permission.split(":")[0]
    }`,
  }));

  if (permissionsToCreate.length > 0) {
    await prisma.permission.createMany({
      data: permissionsToCreate,
    });
  }
};

export const validatePermissions = (permissions: string[]) => {
  const invalidPermissions = permissions.filter(
    (p) => !VALID_PERMISSIONS.includes(p as any)
  );

  if (invalidPermissions.length > 0) {
    throw error(401, `Invalid permissions: ${invalidPermissions.join(", ")}`);
  }
};

export const getPermissionMap = async () => {
  const permissions = await prisma.permission.findMany();
  return permissions.reduce((acc, curr) => {
    acc[curr.name] = curr.id;
    return acc;
  }, {} as Record<string, string>);
};
