export type RoleType = "owner" | "admin" | "guest" | "user";

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
    shelfLocation: string[];
    isRecommended?: boolean;
    isWishList?: boolean;
    notes?: string;
}

export interface IBorrowRecord {
    _id?: string;
    ISBN: string;
    totalQty:number;
    outstandingQty: number;
    borrowerName: string;
    borrowDate:Date;
    isReturned?: boolean;
    returnDate?:Date,
    isBadDebt?: boolean;
    notes?: string;
}

export interface ICategoriedBooks{
   [name:string]:IBook[];
}

export interface IUser{
    _id?: string;
    email: string;
    password?: string;
    role: RoleType;
    firstName?: string;
    lastName?: string;
    tel?: string;
}

export interface IParseBomRecord  {

    email:string;
    uuid:string;
    originalString:string;
    timestamp:Date;

}