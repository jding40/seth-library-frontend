export interface IUserPayload {
    role: "admin" | "guest";
    email: string;
}

export interface IBook {
    _id?: string;
    ISBN: string;
    title: string;
    qtyOwned: number;
    borrowedBooksCount: number;
    subtitle?: string;
    authors?: string[];
    publishDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLink?: string;
    language?: string;
    pdfTokenLink?: string;
    webReaderLink?: string;
    shelfLocation?: string;
    isRecommended?: boolean;
    isWishList?: boolean;
    notes?: string;
}

