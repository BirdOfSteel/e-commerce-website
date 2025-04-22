import { ReactNode } from "react";
import { IncomingMessage } from 'http';

export interface CustomIncomingMessage extends IncomingMessage {
    cookies: { [key: string]: string }; // Define cookies as a key-value pair
}

// generic product listing structure
export interface Product {
    brand: string;
    filepath: string;
    name: string;
    pk: number;
    price: string;
    product_id: string;
    product_type: string;
}

// for functions that handle rendering generic product listing
export type RenderListingsProps = {
    data: Product[];
    isLoading: boolean;
    error: Error | null;
    sortingMethod: string;
}

export type RenderScrollListingsProps = {
    data: Product[];
    isLoading: boolean;
    error: Error | null;
}

// object structure in basket
export type BasketObjectType = {
    id: string;
    img_src: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// AuthContext
export type UserType = {
    email: string;
    name: string;
    profileColour: string;
} | null;

export type AuthContextType = {
    user: UserType;
    setUser: (user: UserType) => void;
};

export type AuthProviderProps = {
    initialUser?: UserType;
    children: ReactNode;
};


// registration form
export type RegistrationFormObject = {
    email: string;
    name: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
}

// custom server response structure
export type ServerResponse = {
    message?: string;
} | null

// App.tsx pageProps
export type PagePropsType = {
  userinfo?: UserType;
}