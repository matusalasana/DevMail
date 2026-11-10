/**
 * Public API of the emails feature.
 * Other features must import from here, never from internal files.
 */
export { emailRoutes } from "./routes.js";
export { emailService } from "./service.js";
export type { Email, NewEmail } from "./types.js";
