export default function generateRandomProfileColour() {
    const colourOptions = [
        '#EA4335',
        '#FBBC05',
        '#34A853',
        '#A142F4',
        '#FF6D01',
        '#F06292',
        '#5E35B1'
    ]

    const randomNumber = Math.floor(Math.random() * colourOptions.length);

    return colourOptions[randomNumber];
}