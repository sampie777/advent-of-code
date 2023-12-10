
export const readInput = async (filename: string): Promise<string> => {
    return (await Bun.file(`./src/inputs/${filename}`).text()).trim()
}