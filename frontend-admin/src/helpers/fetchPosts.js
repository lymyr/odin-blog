
export default async (currentPage, setPosts, setMaxPage, setLoading, setError, nav, token, controller) => {
    const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL
    const headers = controller ? 
        {
            Authorization: `Bearer ${token}`,
            lilTest: "HELLOOOOO BACKEND",
            signal: controller.signal
        } : 
        {
            Authorization: `Bearer ${token}`,
            lilTest: "HELLOOOOO BACKEND",
        }

    try {
        setLoading(true)
        let res = await fetch(`${url}/v1/posts/admin?page=${currentPage}`, {
            headers: headers
        })
        res = await res.json()
        if (res.page)
            throw new Error(res.page.msg)
        if (res.error?.name == "MissingAuthorizationHeader" || res.error?.name == "JsonWebTokenError")
            nav('/login')
        setPosts(res.posts)
        setMaxPage(res.maxPage)
    } 
    catch(e) {
        setError(e.message)
    }
    finally {
        setLoading(false)
    }    
}