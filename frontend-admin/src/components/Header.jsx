import { useNavigate } from "react-router"

export default () => {
    const nav = useNavigate()
    return (
        <header>
            <h1>{"Admin >:D"}</h1>
            <button
                onClick={() => {
                    localStorage.removeItem("JWT_TOKEN")
                    nav('/login')
                }}
            >log out</button>
        </header>
    )
}