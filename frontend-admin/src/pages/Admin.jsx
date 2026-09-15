import { useEffect, useState } from "react"
import Header from "../components/Header.jsx"
import { NavLink, useNavigate, useParams } from "react-router"
import Post from "../components/Post.jsx"
import fetchPosts from "../helpers/fetchPosts.js"
import FetchDependenciesContext from "../hooks/FetchDependenciesContext.js"
import PostForm from "../components/PostForm.jsx"
import PostsContext from "../hooks/PostsContext.js"
import styles from "./Admin.module.css"

export default () => {
    const nav = useNavigate()
    const params = useParams()
    const currentPage = params.page ? parseInt(params.page) : 1
    const [visiblePages, setVisiblePages] = useState([1])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [maxPage, setMaxPage] = useState(1)
    const token = localStorage.getItem("JWT_TOKEN")
    const [selectedPost, setSelectedPost] = useState()

    useEffect(() => {
        let amnt = []
        if (currentPage == 1 || maxPage < 4) {
            for (let i = 1; i <= maxPage; i++)
                amnt.push(i)
        }
        else {
            amnt = [currentPage - 1, currentPage]
            currentPage + 1 < maxPage && amnt.push(currentPage + 1)
        }
            
        setVisiblePages(amnt)
    }, [ currentPage, maxPage ])

    useEffect(() => {
        let ignore = false
        const controller = new AbortController()

        if (!ignore && token == null)
            nav('/login')
        else if (!ignore)
            (async () => await fetchPosts(currentPage, setPosts, setMaxPage, setLoading, setError, nav, token, controller))()

        return () => {
            controller.abort()
            ignore = true
        }
    }, [currentPage])

    return (
        <div className={styles.supaContainer}>
            <Header />
            <FetchDependenciesContext value={[currentPage, setPosts, setMaxPage, setLoading, setError, nav, token]}>
                <PostsContext value={[posts, setPosts]}>
                    <PostForm post={selectedPost} setSelectedPost={setSelectedPost}/>
                </PostsContext>
            </FetchDependenciesContext>
            <main>
                {
                loading ?
                    <h1>Loading</h1> :
                error ?
                    <h1>{error ? error : "Something went wrong"}</h1> :
                posts.length > 0 ?
                    <>
                        <FetchDependenciesContext value={[currentPage, setPosts, setMaxPage, setLoading, setError, nav, token]}>
                            <div className={styles.postsContainer}>
                                {posts.map(post => <Post 
                                    post={post} 
                                    onClick={() => {setSelectedPost(post)}}
                                    key={post.id}
                                />)}
                            </div>
                        </FetchDependenciesContext>
                        <div className={styles.pageContainer}>
                            {visiblePages.map(num => {
                                return (
                                    <NavLink to={`/${num}`} key={num}>
                                        <button disabled={num == currentPage ? true : undefined}>
                                            {num}
                                        </button>
                                    </NavLink>
                                )
                            })}
                        </div>
                    </> :
                    <h1>No posts yet</h1>
                }
            </main>
        </div>
    )
}