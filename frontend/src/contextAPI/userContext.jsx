import { useState } from "react";
import UserContext from "./UserContext";

/**
 * Provides the signed-in user's data and profile to the whole tree.
 *
 * `userData`   → account data (username, email, …) fetched by the layout.
 * `profileData`→ profile fields (picture, bio, skills, …).
 *
 * The context object itself lives in `./UserContext` so this file only exports
 * components, which keeps Fast Refresh working.
 */
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});

  return (
    <UserContext.Provider
      value={{ userData, setUserData, profileData, setProfileData }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Re-exported so existing `import { UserContext } from "../contextAPI/userContext"`
// keeps working everywhere.
export { UserContext };

export default UserProvider;
