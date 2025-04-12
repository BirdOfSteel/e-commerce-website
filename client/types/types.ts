export interface Product {
    brand: string;
    filepath: string;
    name: string;
    pk: number;
    price: string;
    product_id: string;
    product_type: string;
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
