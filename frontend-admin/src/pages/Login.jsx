import { useState } from "react"
import { useNavigate } from "react-router"
import styles from "./Login.module.css"

export default () => {
    const [pass, setPass] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    async function handleSubmit() {
        setLoading(true)
        const url = import.meta.env.DEV ? "http://localhost:3000/" : import.meta.env.VITE_API_URL
        
        try {
            let r = await fetch(`${url}v1/admin`, {
                method: "POST",
                body: JSON.stringify({ password: pass }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            r = await r.json()
            if (r.password)
                throw new Error(r.password.msg)
            
            localStorage.setItem("JWT_TOKEN", r.token)
            nav('/')

        } catch(e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.loginContainer}>
            <h1>Odin Blog Admin</h1>
            <div>
                <h2>Log in</h2>
                {loading ?
                    <div>
                        <h1 className={styles.loading}>Loading</h1>
                        <p>lmao</p>
                        <p>render (backend) may take a while to wake up D:</p>
                    </div> :
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        setLoading(true)
                        await handleSubmit()
                    }}>
                        <div>
                            <label htmlFor="pass">Password</label>
                            <input
                                onChange={(e) => setPass(e.target.value)}
                                id="pass"
                                value={pass}
                                type="password"
                            ></input>
                            {error && <p>{error}</p>}
                        </div>
                        <button>Login</button>
                    </form>
                }
            </div>
            
        </div>
    )
}