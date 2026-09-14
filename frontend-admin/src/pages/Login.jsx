import { useState } from "react"
import { useNavigate } from "react-router"

async function handleSubmit(password, setError, setLoading, nav) {
    setLoading(true)
    const url = import.meta.env.DEV ? "http://localhost:3000/" : import.meta.env.VITE_API_URL
    
    try {
        let r = await fetch(`${url}v1/admin`, {
            method: "POST",
            body: JSON.stringify({ password }),
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

export default () => {
    const [pass, setPass] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    return (
        <div>
            
            <h1>Odin Blog Admin</h1>
            <h2>Log in</h2>
            {loading ? 
                <h1>Loading</h1> :
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    await handleSubmit(pass, setError, setLoading, nav)
                }}>
                    <div>
                        <label htmlFor="pass">Password</label>
                        <input 
                            onChange={(e) => setPass(e.target.value)}
                            id="pass"
                            value={pass}
                        ></input>
                        {error && <p>{error}</p>}
                    </div>
                    <button>Login</button>
                </form>
            }
            
        </div>
    )
}