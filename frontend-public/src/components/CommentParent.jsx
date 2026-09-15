import { useState } from "react"
import styles from "./CommentParent.module.css"

export default ({posts, setPosts, post}) => {
    const [username, setUsername] = useState("")
    const [comment, setComment] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    return (
        <div className={styles.container}>
            <form onSubmit={async (e) => {
                setLoading(true)
                e.preventDefault()
                try {
                    const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL
                    const res = await fetch(`${url}/v1/posts/${post.id}/comments`, {
                        method: "post",
                        body: JSON.stringify({
                            username,
                            comment
                        }),
                        headers: {
                            'content-type': "application/json"
                        }
                    })
                    if (!res.ok && res.headers.get('Content-Type').includes('application/json')) {
                        const errors = await res.json()
                        return setError(errors)
                    } else if (!res.ok) {
                        throw new Error("Something went wrong")
                    }

                    const newComment = await res.json()
                    setUsername("")
                    setComment("")
                    setPosts(posts.map(p => {
                        if (p.id == post.id) {
                            p.comments = [...p.comments, newComment.comment]
                        }
                        return p
                    }))
                }
                catch(e) {
                    setError(e)
                } finally {
                    setLoading(false)
                }
            }}>
                <h4>Add Comment</h4>
                <div>
                    <div className={styles.labelInput}>
                        <label htmlFor="username">Username</label>
                        <input id='username' value={username} onChange={e => setUsername(e.target.value)} />
                        {error && error.username && <p>{error.username.msg}</p>}
                    </div>
                    <div className={styles.labelInput}>
                        <label htmlFor="comment">Comment*</label>
                        <textarea id='comment' value={comment} onChange={e => setComment(e.target.value)}/>
                            {error && error.comment && <p>{error.comment.msg}</p>}
                    </div>
                </div>
                <button disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
            </form>
            <div className={styles.comments}>
                {post.comments.map(c => {
                    return (
                    <div key={c.id} className={styles.comment}>
                        <div>
                            <p>{c.username}</p>
                            <p>{new Date(c.dateAdded).toLocaleDateString()}, {new Date(c.dateAdded).toLocaleTimeString()}</p>
                        </div>
                        <p >{c.comment}</p>
                    </div>
                )
                })}
            </div>
        </div>
    )
}