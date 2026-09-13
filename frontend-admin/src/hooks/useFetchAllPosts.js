import { useState, useEffect } from "react"

export default () => {
    // todo: update to get ALL posts instead of public only posts
    const url = import.meta.env.DEV ? "http://localhost:3000/" : import.meta.env.VITE_API_URL
    
    const [posts, setPosts] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let ignore = false

        if (!ignore) {
            (async () => {
                try {
                    let res = await fetch(`${url}v1/posts?page=1`)
                    res = await res.json()
                    if (res.page)
                        throw new Error(res.page.msg)
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