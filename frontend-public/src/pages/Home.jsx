import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import Post from "../components/Post.jsx"
import CommentParent from "../components/CommentParent.jsx"
import styles from "./Home.module.css"

export default () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams({page: 1});
    const [visiblePages, setVisiblePages] = useState([1])
    const [maxPage, setMaxPage] = useState(1)
    // can cache posts but meh
    const [posts, setPosts] = useState([])
    const nav = useNavigate()

    useEffect(() => {
        let amnt = []
        if (searchParams.get("page") == 1 || maxPage < 4) {
            for (let i = 1; i <= maxPage; i++)
                amnt.push(i)
        }
        else {
            amnt = [searchParams.get("page") - 1, searchParams.get("page")]
            searchParams.get("page") + 1 < maxPage && amnt.push(searchParams.get("page") + 1)
        }
        setVisiblePages(amnt)
    }, [ searchParams.get("page"), maxPage ])

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true)
                const url = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL
                const res = await fetch(`${url}/v1/posts?page=${searchParams.get("page")}`, {
                    signal: controller.signal
                })
                const r = await res.json()
                if (r.posts.length == 0) 
                    throw new Error("No post available")
                setPosts(r.posts)
                setMaxPage(r.maxPage)
                setLoading(false)
                setError(false)
            } catch(e) {
                setError(e)
            }
        })()
        
        return () => controller.abort()
    }, [searchParams.get("page")])

    return (
        <main>
            { 
                error ? <h1>{error.message}</h1> :
                loading ? <div>
                    <h1 className={styles.loading}>Loading</h1>
                    <p>lmao</p>
                    <p>Might take a while for render to wake up D:</p>
                </div> : 
                <>
                { 
                    <div className={styles.postContainer}>
                        {posts.map(post => {
                            return (
                                <div key={post.id} className={styles.post}>
                                    <Post post={post} currentPage={searchParams.get("page")} />
                                    {params.postId == post.id &&
                                        <div className={styles.commentParent}>
                                            <CommentParent posts={posts} setPosts={setPosts} post={post} />
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                }

                <div className={styles.pages}>
                    {visiblePages.map((n) => <button 
                        onClick={() => { nav(`/?page=${n}`)}} 
                        key={n}
                        disabled={n == searchParams.get("page") ? true : false}
                    >{n}</button>)}
                </div>
    
                </>
            }
        </main>
    )
}