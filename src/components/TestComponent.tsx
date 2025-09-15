// import { useEffect, useState } from "react";
// import bookApi, { type IBook } from "../services/bookApi";
//
// function TestComponent() {
//     const [books, setBooks] = useState<IBook[]>([]);
//
//     useEffect(() => {
//         bookApi.getAll()
//             .then(res => {
//                 if (Array.isArray(res)) {
//                     console.log("data:", res?.join(","))
//                     setBooks(res);
//                 } else {
//                     console.warn("Unexpected data format:", res);
//                 }
//             })
//             .catch(error => {
//                 console.error("获取书籍失败:", error);
//             });
//     }, []);
//
//     useEffect(() => {
//         console.log("books updated:", books);
//     }, [books]);
//
//     return (
//         <div style={{ padding: 10 }}>
//             <h1>📚 💥Seth's Book Collection</h1>
//             <ul>
//                 {books?.map((book) => (
//                     <li key={book.ISBN}>
//                         {book.title} —— {book.authors?.join(", ")}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
//
// export default TestComponent;
