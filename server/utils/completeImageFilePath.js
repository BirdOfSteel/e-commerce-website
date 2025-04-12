import fs from 'fs';
import path from 'path';
import { __dirname } from '../index.js';

export default function completeImageFilePath(productArray, hostURL) {
    productArray.forEach(productObject => { // handles adding file extension
        const imageFilePath = path.join(__dirname, 'images', productObject.filepath);
        let doesImageExist = fs.existsSync(imageFilePath + '.jpg');
        
        if (doesImageExist) {
            productObject.filepath = hostURL + '/images' + productObject.filepath + '.jpg';
        } else {
            productObject.filepath = hostURL + '/images' + productObject.filepath + '.png';
        }
    });

    return productArray;
}
