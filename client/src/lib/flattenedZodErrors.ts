import { z } from "zod";

export function flattenZodErrors(error: z.ZodError<any>): Record<string, string> {
    const flattened: Record<string, string> = {};

    function recurse(errors: any, path = "") {
        for (const key in errors) {
            if (!errors.hasOwnProperty(key)) continue;

            const value = errors[key];

            const newPath = path ? `${path}.${key}` : key;

            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === "string") {
                    flattened[newPath] = value[0]; // first error message
                }
            } else if (typeof value === "object" && value !== null) {
                recurse(value, newPath);
            }
        }
    }

    recurse(error.format());

    return flattened;
}
