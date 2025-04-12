export default function mapProductsData(rawData) {
    const productsMap = rawData.map(object => {
        const product = {
            id: object.id,
            name: object.name,
            price: object.price,
            img_src: object.img_src
        };
        
        return product;
    });

    return productsMap;
}