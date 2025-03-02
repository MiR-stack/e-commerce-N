import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { Account_status, Login_attempt } from "@prisma/client";
import { AdminLogin, AdminRegistration } from "@/types";
import { accessTokenGenerator, error } from "@/utils";
import sendEmail from "./email.service";

const adminRegistration = async (data: AdminRegistration) => {
  // check if admin exist
  const admin = await prisma.admin.findFirst({
    where: { email: data.email },
  });

  if (admin) {
    throw error(400, "admin already exist");
  }

  // create hash password
  const salt = await bcrypt.genSalt(10);

  const password = await bcrypt.hash(data.password, salt);

  //   create connection for role

  if (!data.role_id) {
    // get default role
    const defaultAdminRole = await prisma.role.findUnique({
      where: { name: "Default Admin" },
    });
    if (!defaultAdminRole) {
      throw error(
        404,
        "default role is not found please provide role id or create default role with name Default Admin"
      );
    }

    data.role_id = defaultAdminRole.id;
  }

  // create admin
  const newAdmin = await prisma.admin.create({
    data: {
      ...data,
      password,
      verified: true,
      role_id: data.role_id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      status: true,
    },
  });

  sendEmail({
    recipient: newAdmin.email,
    subject: "account creation",
    body: `your account has been created successfully on ${process.env.APP_NAME}`,
    source: "registration",
  });

  const accessToken = accessTokenGenerator({
    ...newAdmin,
  });

  return accessToken;
};

const changeAdminStatus = async (id: string, status: Account_status) => {
  await prisma.admin.update({ where: { id }, data: { status } });
};

const updateAdminRole = async (id: string, role_id: string) => {
  // check is admin exist
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) {
    throw error(404, "admin not found");
  }

  await prisma.admin.update({
    where: { id },
    data: { role: { connect: { id: role_id } } },
  });
  return "role updated successfully";
};

interface AdminLoginType extends AdminLogin {
  ip: string;
  user_agent: string;
}

const adminLogin = async ({
  email,
  password,
  ip,
  user_agent,
}: AdminLoginType) => {
  // check if admin exist
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      verified: true,
      status: true,
      password: true,
    },
  });

  if (!admin) {
    throw error(401, "invalid credentials");
  }
  // check password
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    await createLoginHistory({
      admin_id: admin.id,
      ip_address: ip,
      user_agent,
      attempt: "FAILED",
    });

    throw error(401, "invalid credentials");
  }

  //   check admin verification

  if (!admin.verified) {
    await createLoginHistory({
      admin_id: admin.id,
      ip_address: ip,
      user_agent,
      attempt: "FAILED",
    });

    throw error(403, "admin is not verified");
  }

  //   check admin status
  if (admin.status !== "ACTIVE") {
    await createLoginHistory({
      admin_id: admin.id,
      ip_address: ip,
      user_agent,
      attempt: "FAILED",
    });

    throw error(403, `admin account is ${admin.status}`);
  }

  await createLoginHistory({
    admin_id: admin.id,
    ip_address: ip,
    user_agent,
    attempt: "SUCCESS",
  });

  const accessToken = accessTokenGenerator(admin);

  return accessToken;
};

interface LoginHistoryType {
  admin_id: string;
  ip_address: string;
  user_agent: string;
  attempt: Login_attempt;
}

const createLoginHistory = async (info: LoginHistoryType) => {
  return await prisma.login_history.create({
    data: { ...info },
  });
};

const resetPassword = async (
  id: string,
  oldPassword: string,
  password: string
) => {
  // get admin for password
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      verified: true,
      password: true,
    },
  });

  if (!admin) {
    throw error(404, "invalid request");
  }

  // check old password
  const isValid = bcrypt.compare(oldPassword, admin.password);
  if (!isValid) {
    throw error(403, "old password is not correct");
  }

  // create hash password
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(password, salt);

  await prisma.admin.update({
    where: { id },
    data: { password: hashPassword },
  });

  const accessToken = accessTokenGenerator(admin);

  return accessToken;
};

const getAdmin = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      verified: true,
      status: true,
      role: { select: { permissions: true, name: true } },
    },
  });

  if (!admin) throw error(404, "admin not found");

  const { name, email, verified, role } = admin;

  return {
    name,
    email,
    verified,
    role: {
      name: role.name,
      permissions: role.permissions.map((p) => p.name),
    },
  };
};

export {
  adminRegistration,
  adminLogin,
  changeAdminStatus,
  updateAdminRole,
  resetPassword,
  getAdmin,
};
