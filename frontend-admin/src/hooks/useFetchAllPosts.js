import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

export default () => {
    const url = import.meta.env.DEV ? "http://localhost:3000/" : import.meta.env.VITE_API_URL
    
    const [posts, setPosts] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const nav = useNavigate()

    useEffect(() => {
        let ignore = false

        if (!ignore) {
            (async () => {
                try {
                    let res = await fetch(`${url}v1/posts/admin?page=2`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
                            lilTest: "HELLOOOOO BACKEND"
                        }
                    })
                    res = await res.json()
                    if (res.page)
                        throw new Error(res.page.msg)
                    if (res.error?.name == "MissingAuthorizationHeader" || res.error?.name == "JsonWebTokenError")
                        nav('/login')
                    setPosts(res.posts)
                } 
                catch(e) {
                    setError(e.message)
                }
                finally {
                    setLoading(false)
                }
            })()
        }
        
        return () => {
            ignore = true
        }
    }, [])

    return { posts, loading, error }
}