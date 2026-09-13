import { useEffect, useState } from "react"

function adminLogin(password) {
    const [res, setRes] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        (async () => {
            const url = import.meta.env.DEV ? "http://localhost:3000/" : import.meta.env.VITE_API_URL
            
            try {
                const r = await fetch(`${url}v1/admin`, {
                    method: "post",
                    body: { password }
                })
            } catch {

            }
            
        })()
    }, [])
}

export default () => {
    const [pass, setPass] = useState("")

    useEffect(() => {

    })

    return (
        <div>
            <h1>Odin Blog Admin</h1>
            <h2>Log in</h2>
            <form>
                <div>
                    <label htmlFor="pass">Password</label>
                    <input 
                        onChange={(e) => setPass(e.target.value)}
                        id="pass"
                        value={pass}
                    ></input>
                </div>
                <button onClick={(e) => e.preventDefault()}>Login</button>
            </form>
        </div>
    )
}