import { createContext, useState } from "react";


// this page is used to provide user name,email to navbar,profile and all ohter requireds

// here we will add userData from MainLayout

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [userData,setUserData] = useState({})
    const [profileData,setProfileData] = useState({}) //to store user profile data like img,username etc...
    return (
        <UserContext.Provider value={{userData,setUserData,profileData,setProfileData}} >
            {children}
        </UserContext.Provider>
    )
}