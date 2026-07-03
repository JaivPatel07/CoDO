import { useEffect, useState } from "react"
import { fetch_profile_pic } from "../api/user_apis"


// we can customize the height and width for circle 

export default function ProfilePic({ uname, height, width }) {

    const [imgUrl, setUrl] = useState()

    // useEffect(() => {
    //     const get_url = async () => {
    //         try {
    //             const response = await fetch_profile_pic()
    //             setUrl(response.picUrl)
    //         }
    //         catch (err) {
    //             console.log(err)
    //         }

    //     }
    // }, [])

    return (
        <div>
            {
                imgUrl ?
                    <img src={imgUrl} alt="x" srcset="" className={`h-${height} w-${width}`} />
                    :
                    <span className={`grid h-${height} w-${width} place-items-center rounded-full bg-slate-950 text-sm font-bold text-white`}>
                        {uname?.charAt(0)?.toUpperCase()}
                    </span>
            }
        </div>
    )
}