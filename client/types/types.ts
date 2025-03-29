export interface Product {
    id: string;
    name: string;
    price: string;
    img_src: string;
}

export interface RenderListingsProps {
    data: Product[];
    isLoading: boolean;
    error: Error | null;
}

export interface BasketObject {
    id: string;
    img: string;
    name: string;
    price: string;
    quantity: number;
}
