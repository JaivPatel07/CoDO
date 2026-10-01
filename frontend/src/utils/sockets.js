/**
 * WebSocket URL helpers.
 *
 * The backend used to be hardcoded to `ws://127.0.0.1:8000/...` in five
 * different files, which meant a deployed build could never open a socket.
 * Everything now derives from the same `WS_URL` used by `api/axios.js`.
 */

import { WS_URL } from "../api/axios";

/**
 * Sanitise a username so it is safe inside a Channels group name.
 * Channels group names only allow ASCII alphanumerics, `-`, `_` and `.`.
 */
export const sanitizeChannelName = (value) =>
  String(value ?? "")
    .trim()
    .replace(/@/g, "_at_")
    .replace(/\+/g, "_plus_")
    // Collapse anything Channels would reject into a single underscore.
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .slice(0, 90);

/** Notification socket for a given user. */
export const notificationSocketUrl = (username) =>
  `${WS_URL}/notification/user_${sanitizeChannelName(username)}/`;

/** Workspace group-chat socket for a given workspace id. */
export const workspaceSocketUrl = (workspaceId) =>
  `${WS_URL}/workshop_${sanitizeChannelName(workspaceId)}/`;
