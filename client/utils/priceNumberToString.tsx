export default function priceNumberToString(price: number) {
    return price.toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}