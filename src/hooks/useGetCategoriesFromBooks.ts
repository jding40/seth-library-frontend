// import {type IBook} from "../types"
//
// function useGetCategoriesFromBooks(books:IBook[]) {
//
//     return books.reduce((acc: Set<string>, book) => {
//         if (book.categories) {
//             book.categories.forEach((category) => {
//                 if (!acc.has(category)) {
//                     acc.add(category);
//                 }
//             });
//         }
//         return acc;
//     }, new Set<string>());
//
// }
//
// export default useGetCategoriesFromBooks;