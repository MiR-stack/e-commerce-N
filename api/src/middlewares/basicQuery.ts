import { generateSelectFields } from "@/utils";
import { Request, Response, NextFunction } from "express";
import { URLSearchParams } from "url";

declare module "express" {
  interface Request {
    paginations?: {
      page: number;
      limit: number;
      skip: number;
    };
    fields?: object;
    where?: object;
  }
}

const basicQuery = async (req: Request, _res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const fields = req.query.fields
    ? generateSelectFields(String(req.query.fields))
    : undefined;

  const filter = req.query.filter
    ? convertQueryToPrismaFilter(String(req.query.filter))
    : undefined;

  req.paginations = { page, limit, skip };
  req.fields = fields;
  req.where = filter;
  next();
};
/**
 * The function `convertQueryToPrismaFilter` converts a query string into a Prisma filter object based
 * on specified operators and values.
 * @param {string} value - The `value` parameter in the context of the provided code refers to the
 * value associated with a specific key in a query string. This value needs to be converted to the
 * appropriate `PrismaValue` type based on the operator specified for that key.
 * @param {PrismaOperator} operator - The `operator` parameter in the code snippet refers to a specific
 * operation that can be applied to a field in a query filter. The `PrismaOperator` type defines
 * various operators such as "equals", "gt" (greater than), "lt" (less than), "contains", and others
 * @returns The `convertQueryToPrismaFilter` function returns a `PrismaFilter` object that represents
 * the parsed query string. The function parses the query string, extracts field paths and operators,
 * and converts values accordingly using the `convertValue` and `convertSingleValue` functions. The
 * resulting `PrismaFilter` object contains the parsed filter conditions based on the query string
 * provided.
 */

type PrismaValue =
  | string
  | number
  | boolean
  | Date
  | PrismaFilter
  | PrismaValue[];
type PrismaOperatorCondition = { [operator in PrismaOperator]?: PrismaValue };
type PrismaFilter = { [key: string]: PrismaValue | PrismaOperatorCondition };

type PrismaOperator =
  | "equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "not"
  | "in"
  | "notIn"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "mode"
  | "search";

const validOperators = new Set<PrismaOperator>([
  "equals",
  "gt",
  "gte",
  "lt",
  "lte",
  "not",
  "in",
  "notIn",
  "contains",
  "startsWith",
  "endsWith",
  "mode",
  "search",
]);

export function convertQueryToPrismaFilter(queryString: string): PrismaFilter {
  const searchParams = new URLSearchParams(queryString);
  const filter: PrismaFilter = {};

  for (const [key, value] of searchParams) {
    let operator: PrismaOperator = "equals";
    let fieldPath = key;

    // Split operator from field
    const lastUnderscoreIndex = fieldPath.lastIndexOf("_");
    if (lastUnderscoreIndex > -1) {
      const potentialOperator = fieldPath.slice(
        lastUnderscoreIndex + 1
      ) as PrismaOperator;
      if (validOperators.has(potentialOperator)) {
        operator = potentialOperator;
        fieldPath = fieldPath.slice(0, lastUnderscoreIndex);
      }
    }

    // Split nested fields
    const fieldParts = fieldPath.split(".");
    let currentLevel: PrismaFilter = filter;

    for (let i = 0; i < fieldParts.length; i++) {
      const part = fieldParts[i];

      if (i === fieldParts.length - 1) {
        const convertedValue = convertValue(value, operator);

        if (operator === "equals") {
          currentLevel[part] = convertedValue;
        } else {
          if (
            !currentLevel[part] ||
            typeof currentLevel[part] !== "object" ||
            Array.isArray(currentLevel[part])
          ) {
            currentLevel[part] = {};
          }
          (currentLevel[part] as PrismaOperatorCondition)[operator] =
            convertedValue;
        }
      } else {
        if (
          !currentLevel[part] ||
          typeof currentLevel[part] !== "object" ||
          Array.isArray(currentLevel[part])
        ) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part] as PrismaFilter;
      }
    }
  }

  return filter;
}

function convertValue(value: string, operator: PrismaOperator): PrismaValue {
  if (operator === "in" || operator === "notIn") {
    return value.split(",").map((v) => convertSingleValue(v));
  }
  return convertSingleValue(value);
}

function convertSingleValue(value: string): PrismaValue {
  // Try number conversion
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return Number(value);
  }

  // Try boolean conversion
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;

  // Try date conversion
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  if (isoDateRegex.test(value)) {
    return new Date(value);
  }

  // Try JSON parsing
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export default basicQuery;
