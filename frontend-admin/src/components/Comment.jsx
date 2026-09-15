import { useContext, useState } from "react"
import PostsContext from "../hooks/PostsContext"
import styles from "./Comment.module.css"

export default ({comment}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [posts, setPosts] = useContext(PostsContext)

    return (
        <div className={styles.comment}>
            <div>
                <p>{comment.username}</p>
                <p>{new Date(comment.dateAdded).toLocaleDateString()}, {new Date(comment.dateAdded).toLocaleTimeString()}</p>
            </div>
            <p>{comment.comment}</p>
            <button 
                disabled={loading}
                onClick={async () => {
                    setLoading(true)
                    try {
                         if (!loading) {
                            const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL
                            const res = await fetch(`${url}/v1/posts/${comment.postId}/comments/${comment.id}`, {
                                method: "delete",
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`
                                }
                            })
                            if (!res.ok)
                                throw new Error("Something went wrong")
                            setPosts(posts.map(p => {
                                if (p.id == comment.postId)
                                    p.comments = p.comments.filter(c => c.id != comment.id)
                                return p
                            }))
                        }
                    }
                    catch(e) {
                        setError(e.message)
                    } finally {
                        setLoading(false)
                    }
            }}> { loading ? "deleting..." : "delete" }</button>
            {error && <p>{error}</p>}
        </div>
    )
}