/**
 * Generates a Prisma select object based on a query string.
 *
 * The query string should list fields separated by commas.
 * Nested (relational) fields are wrapped in parentheses.
 *
 * Example:
 *   Input: "id,name,posts(id,title,comments(content))"
 *   Output:
 *     {
 *       id: true,
 *       name: true,
 *       posts: {
 *         select: {
 *           id: true,
 *           title: true,
 *           comments: { select: { content: true } }
 *         }
 *       }
 *     }
 */
export function generateSelectFields(query: string): Record<string, any> {
  if (!query) return {};
  let index = 0;
  const length = query.length;

  // Skip any whitespace characters
  function skipWhitespace() {
    while (index < length && /\s/.test(query[index])) {
      index++;
    }
  }

  // Parse a field name (letters, numbers, underscores)
  function parseFieldName(): string {
    skipWhitespace();
    const start = index;
    while (index < length && /[a-zA-Z0-9_]/.test(query[index])) {
      index++;
    }
    return query.slice(start, index);
  }

  // Recursively parse the list of fields
  function parseFieldsList(): Record<string, any> {
    const fields: Record<string, any> = {};

    while (index < length) {
      skipWhitespace();

      // If we hit a closing parenthesis, return what we have so far
      if (query[index] === ")") {
        break;
      }

      const fieldName = parseFieldName();
      if (!fieldName) break;

      skipWhitespace();

      // Check if this field has nested relational fields
      if (index < length && query[index] === "(") {
        index++; // Skip the '('
        const nested = parseFieldsList();
        fields[fieldName] = { select: nested };
        skipWhitespace();
        if (query[index] === ")") {
          index++; // Skip the ')'
        }
      } else {
        fields[fieldName] = true;
      }

      skipWhitespace();
      // If there's a comma, skip it and continue with the next field
      if (index < length && query[index] === ",") {
        index++;
      }
    }
    return fields;
  }

  return parseFieldsList();
}
