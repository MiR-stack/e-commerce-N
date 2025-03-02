import { Request, Response } from "express";
import {
  createOrUpdateSettings,
  getSiteSettings,
} from "../services/settings.service";
import { UpdateSettingsInput } from "../schemas/settings.schema";

export const getSettingsHandler = async (_req: Request, res: Response) => {
  try {
    const settings = await getSiteSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
};

export const updateSettingsHandler = async (
  req: Request<{}, {}, UpdateSettingsInput["body"]>,
  res: Response
) => {
  try {
    const settings = await createOrUpdateSettings(req.body!, req.file);
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: "Error updating settings" });
  }
};
