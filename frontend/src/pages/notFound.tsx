import { Link } from "react-router-dom"

function NotFoundPage() {
    return (
        <div>
            <h1>Not found page</h1>
            <Link to={"/"}>
                <button>Go back home</button>
            </Link>
        </div>
    )
}

export default NotFoundPage