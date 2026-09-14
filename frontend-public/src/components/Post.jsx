import { Link, useParams } from "react-router"

export default ({post, currentPage, children}) => {
    
    return (
        <>
        <Link to={`/${post.id}?page=${currentPage}`}>
        <div 
            className={post.isPublished ? "published" : undefined}
            onClick={() => setOpen(true)}
        >
            <div>
                <div>
                    <h3>{post.title}</h3>
                    <p>{new Date(post.dateAdded).toLocaleDateString()}, {new Date(post.dateAdded).toLocaleTimeString()}</p>
                </div>
            </div>
            <p>{post.content}</p>
        </div>
        </Link>
        </>
    )
}