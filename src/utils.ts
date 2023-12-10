
export const readInput = (filename: string): Promise<string> => {
    return Bun.file(`./src/inputs/${filename}`).text()
}