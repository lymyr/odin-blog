import { useState, useContext, useEffect } from "react"
import fetchPosts from "../helpers/fetchPosts.js"
import FetchDependenciesContext from "../hooks/FetchDependenciesContext.js"

export default ({post, setSelectedPost}) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isPublished, setIsPublished] = useState(false)
    const [id, setId] = useState()
    const [error, setError] = useState()
    const [titleError, setTitleError] = useState()
    const [contentError, setContentError] = useState()
    const [loading, setLoading] = useState(false)
    const fetchDependencies = useContext(FetchDependenciesContext)

    useEffect(() => {
        if (post) {
            setTitle(post.title)
            setContent(post.content)
            setIsPublished(post.isPublished)
            setId(post.id)
        }
    }, [post])

    return (
        <div>
            <form onSubmit={async (e) => {
                e.preventDefault()
                if (!loading) {
                    setTitleError("")
                    setContentError("")
                    setLoading(true)
                    const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL
                    try {
                        const res = await fetch(`${url}/v1/posts${post ? `/${id}` : ""}`, {
                            method: post ? "put" : "post",
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${fetchDependencies[fetchDependencies.length - 1]}`
                            },
                            body: JSON.stringify({
                                title,
                                content,
                                isPublished
                            })
                        })
  
                        if (res.headers.get('content-type').includes('application/json')) {
                            const error = await res.json()
                            if (error.title)
                                setTitleError(error.title.msg)
                            if (error.content)
                                setContentError(error.content.msg)
                        }
                        else if (!res.ok)
                            throw new Error("Something went wrong")
                        else {
                            setTitle("")
                            setContent("")
                            setIsPublished(false)
                            setSelectedPost()
                            fetchPosts(...fetchDependencies)
                        }
                            
                    }
                    catch(e) {
                        setError(e.message)
                    }
                    setLoading(false)
                }
            }}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" value={title} onChange={e => setTitle(e.target.value)}></input>
                    {titleError && <p>{titleError}</p>}
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)}></textarea>
                    {contentError && <p>{contentError}</p>}
                </div>
                <div>
                    <label htmlFor="isPublished">Publish</label>
                    <input id="isPublished" type="checkbox" checked={isPublished} onChange={e => setIsPublished(!isPublished)}></input>
                </div>

                <div>
                    {post && <button type="button" onClick={() => {
                        setTitle("")
                        setContent("")
                        setIsPublished(false)
                        setSelectedPost()
                    }}>Cancel</button>}
                    <button disabled={loading}>
                        {loading ? "Loading..." : post ? "Save" : "Submit"}
                    </button>
                </div>
            </form>
            {error && error}
        </div>
    )
}