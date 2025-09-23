// src/api/googleBooksApi.ts
import axios from "axios";
import {type IBook} from "../types"

export async function fetchBookByISBN(isbn: string): Promise<IBook | null> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await axios.get(url);

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const bookData = response.data.items[0].volumeInfo;

    const book: IBook = {
      ISBN: isbn,
      title: bookData.title || "no title",
      subtitle: bookData.subtitle,
      authors: bookData.authors,
      publishDate: bookData.publishedDate,
      description: bookData.description,
      pageCount: bookData.pageCount,
      categories: bookData.categories,
      imageLink: bookData.imageLinks?.thumbnail?.replace("http:", "https:"),
      language: bookData.language,
      pdfTokenLink:
        response.data.items[0].accessInfo?.pdf?.acsTokenLink?.replace(
          "http:",
          "https:"
        ),
      webReaderLink: response.data.items[0].accessInfo?.webReaderLink?.replace(
        "http:",
        "https:"
      ),
      qtyOwned: 0, // default qty is 0
      borrowedBooksCount: 0, // default value is 0
      isRecommended: false,
      isWishList: false,
    };

    return book;
  } catch (error) {
    console.error("Failed to get book information:", error);
    return null;
  }
}
