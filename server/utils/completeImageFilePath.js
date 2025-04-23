import { promises as fsPromises } from 'fs';

export default async function completeImageFilePath(productArray, hostURL) {
    for (const productObject of productArray) {
        const baseImageFilePath = path.join(__dirname, 'images', productObject.filepath);

        try { // check if img exists as .jpg
            await fsPromises.access(baseImageFilePath + '.jpg');
            productObject.filepath = `${hostURL}/images${productObject.filepath}.jpg`;
        } catch (error) {
            try { // if no .jpg, check if image exists as .png
                await fsPromises.access(baseImageFilePath + '.png');
                productObject.filepath = `${hostURL}/images${productObject.filepath}.png`;
            } catch (error) { //
                // console.logs if the img doesn't exist with either file extension
                console.log(`Image not found for ${productObject.filepath}`);
            }
        }
    }

    return productArray;
}
