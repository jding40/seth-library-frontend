import {type FC, type JSX} from "react";
import {getUserRole} from "../utils";
import {Link} from "react-router-dom";
import {type RoleType} from "../types";

const SubMenu:FC = ():JSX.Element=>{

    const userRole:RoleType = getUserRole()

    return (
        <div className="flex gap-4 my-1">
            <Link
                to="/books/wishlist"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                💖 Wishlist
            </Link>
            <Link
                to="/books/find"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded"
            >
                🔍 Find Book By ISBN
            </Link>

            {(userRole === "admin"|| userRole === "owner") && <Link
                to="/books/add-new-book-by-isbn"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                ✏️ Register A New Book By ISBN
            </Link>}


            {(userRole === "owner" || userRole==="admin") && <Link
                to="/borrows/new"
                className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
            >
                {/*🪪 My Profile*/}
                Create Borrow Record
            </Link>}
            {/*<Link to="/books/add-new-book-by-isbn"*/}
            {/*      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">*/}
            {/*    Register A New Book Manually*/}
            {/*</Link>*/}

        </div>

    )
}

export default SubMenu;