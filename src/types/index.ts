export type RoleType = "admin" | "guest" | "user";

export interface IUserPayload {
    role: RoleType;
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

