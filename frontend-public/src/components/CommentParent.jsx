import { useState } from "react"

export default ({posts, setPosts, post}) => {
    const [username, setUsername] = useState("")
    const [comment, setComment] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    return (
        <div>
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
                    <div>
                        <label htmlFor="username">Username</label>
                        <input id='username' value={username} onChange={e => setUsername(e.target.value)} />
                        {error && error.username && <p>{error.username.msg}</p>}
                    </div>
                    <div>
                        <label htmlFor="comment">Comment*</label>
                        <textarea id='comment' value={comment} onChange={e => setComment(e.target.value)}/>
                            {error && error.comment && <p>{error.comment.msg}</p>}
                    </div>
                </div>
                <button disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
            </form>
            <div>
                {post.comments.map(c => {
                    return (
                    <div key={c.id}>
                        <div>
                            <p>{c.username}</p>
                            {new Date(c.dateAdded).toLocaleDateString()}, {new Date(c.dateAdded).toLocaleTimeString()}
                        </div>
                        <p >{c.comment}</p>
                    </div>
                )
                })}
            </div>
        </div>
    )
}