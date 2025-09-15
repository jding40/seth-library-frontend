// src/api/googleBooksApi.ts
import axios from "axios";
import { type IBook } from "./bookApi";

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
      title: bookData.title || "未命名",
      subtitle: bookData.subtitle,
      authors: bookData.authors,
      publishDate: bookData.publishedDate,
      description: bookData.description,
      pageCount: bookData.pageCount,
      categories: bookData.categories,
      imageLink: bookData.imageLinks?.thumbnail?.replace("http:", "https:"),
      language: bookData.language,
      pdfTokenLink: response.data.items[0].accessInfo?.pdf?.acsTokenLink,
      webReaderLink: response.data.items[0].accessInfo?.webReaderLink,
      qtyOwned: 0, // 默认库存量，后续可在表单修改
      borrowedBooksCount: 0, // 默认借出 0
      isRecommended: false,
      isWishList: false,
    };

    return book;
  } catch (error) {
    console.error("获取图书信息失败:", error);
    return null;
  }
}
