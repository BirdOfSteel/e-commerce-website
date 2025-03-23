export default function mapProductsData(rawData) {
    const productsMap = rawData.map((object) => {
        const product = {
            id: object.fields.id,
            name: object.fields.name,
            price: object.fields.price,
            img_src: object.fields.img_src
        };
        
        return product
    })

    return productsMap
}