import { createContext } from "react";

/**
 * The context itself.
 *
 * Kept in its own module (no components) so that:
 *  - `react-refresh/only-export-components` is satisfied and Fast Refresh
 *    works correctly in development;
 *  - the provider can be imported without pulling in a component module.
 *
 * `UserContext.jsx` re-exports this for backwards compatibility.
 */
const UserContext = createContext(null);

export default UserContext;
