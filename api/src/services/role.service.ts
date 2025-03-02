import prisma from "@/prisma";
import { validatePermissions, getPermissionMap } from "./permission.service";
import { CreateRoleInput } from "@/types";

export const createRole = async (input: CreateRoleInput) => {
  await validatePermissions(input.permissions);
  const permissionMap = await getPermissionMap();

  return prisma.role.create({
    data: {
      name: input.name,
      description: input.description,
      permissions: {
        connect: input.permissions.map((p) => ({ id: permissionMap[p] })),
      },
    },
    include: { permissions: true },
  });
};

export const updateRole = async (
  roleId: string,
  input: {
    name?: string;
    description?: string;
    permissions?: string[];
  }
) => {
  if (input.permissions) await validatePermissions(input.permissions);
  const permissionMap = await getPermissionMap();

  return prisma.role.update({
    where: { id: roleId },
    data: {
      name: input.name,
      description: input.description,
      permissions: input.permissions
        ? {
            set: input.permissions.map((p) => ({ id: permissionMap[p] })),
          }
        : undefined,
    },
    include: { permissions: true },
  });
};
