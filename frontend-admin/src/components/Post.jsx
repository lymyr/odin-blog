import { useState, useContext } from "react"
import FetchDependenciesContext from "../hooks/FetchDependenciesContext.js"
import fetchPosts from "../helpers/fetchPosts.js"

export default ({post, posts, setPosts}) => {
    const [error, setError] = useState("")
    const [ignore, setIgnore] = useState(false)
    const fetchDependencies = useContext(FetchDependenciesContext)

    const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL

    return (
        <div className={post.isPublished ? "published" : undefined}>
            <div>
                <div>
                    <h3>{post.title}</h3>
                    <p>{new Date(post.dateAdded).toLocaleDateString()}, {new Date(post.dateAdded).toLocaleTimeString()}</p>
                </div>
                <button
                    onClick={async () => {
                        if (!ignore) {
                            try {
                                setIgnore(true)
                                const res = await fetch(`${url}/v1/posts/${post.id}`, {
                                    method: "delete",
                                    headers: {
                                        Authorization: `Bearer ${fetchDependencies[fetchDependencies.length-1]}`
                                    }
                                })
                                const deleted = await res.json()
                                if (!(deleted?.post)) {
                                    setIgnore(false)
                                    return setError("Something went wrong")
                                }
                                fetchPosts(...fetchDependencies)
                            }
                            catch(e) {
                                setIgnore(false)
                                setError(e.message)
                            }
                            
                        }
                    }}
                    disabled={ignore}
                >{ignore ? "Deleting..." : "Delete"}</button>
            </div>
            {error && <p>{error}</p>}
            <p>{post.content}</p>
        </div>
    )
}