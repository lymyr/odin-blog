import { Link, useParams } from "react-router"
import styles from "./Post.module.css"

export default ({post, currentPage }) => {
    const params = useParams()
    return (
        <div className={styles.post}>
            <Link to={`/${post.id}?page=${currentPage}`}>
            <div>
                <div className={styles.header}>
                    <h3>{post.title}</h3>
                    <p>{new Date(post.dateAdded).toLocaleDateString()}, {new Date(post.dateAdded).toLocaleTimeString()}</p>
                </div>
            </div>
            </Link>
            {params.postId == post.id && <p className={styles.content}>{post.content}</p>}
        </div>
        
    )
}