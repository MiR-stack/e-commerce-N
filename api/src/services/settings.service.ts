import prisma from "@/prisma";
import { removeImage, uploadImage } from "@/utils";
import { Prisma } from "@prisma/client";

const SETTINGS_ID = "site_settings_001"; // Fixed ID for singleton document

export const getSiteSettings = async () => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: SETTINGS_ID },
  });

  if (!settings) {
    return {
      websiteName: "My Website",
      description: "",
      logo: null,
      socialMedia: {},
      contactEmail: "",
    };
  }

  return settings;
};

export const createOrUpdateSettings = async (
  input: Prisma.SiteSettingsCreateInput,
  file?: Express.Multer.File
) => {
  let logoData = input.logo;
  // Handle image upload
  if (file) {
    // Remove old logo if exists
    const existing = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
    if (existing?.logo) {
      await removeImage(existing.logo, "settings");
    }

    // Upload new logo
    logoData = await uploadImage(file, "settings");
  }

  console.log(input);

  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: {
      id: SETTINGS_ID,
      ...input,
      logo: logoData,
    },
    update: {
      ...input,
      logo: logoData || undefined,
    },
  });
};
