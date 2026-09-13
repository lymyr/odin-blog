import { useEffect } from "react"
import useFetchAllPosts from "../hooks/useFetchAllPosts.js"
import { useNavigate } from "react-router"

export default () => {
    const { posts, loading, error } = useFetchAllPosts()
    
    return (
        <div>
            {loading && 
                <h1>Loading</h1>
            }
            {error && 
                <h1>Error: {error ? error : "Something went wrong"}</h1>
            }
            {posts && 
                posts.map(post => <h1 key={post.id}>{post.title}</h1>)
            }
        </div>
    )
}