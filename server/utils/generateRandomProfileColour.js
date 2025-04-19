export default function generateRandomProfileColour() {
    const colourOptions = [
        "#F4A261",
        "#E9C46A",
        "#A8DADC",
        "#B5E48C",
        "#FDCBCA",
        "#CDB4DB",
        "#90CAF9",
        "#FFE0AC",
        "#D3EBCD",
        "#FFDAC1",
        "#D1C4E9",
        "#B2DFDB"
    ];

    const randomNumber = Math.floor(Math.random() * colourOptions.length);

    return colourOptions[randomNumber];
}