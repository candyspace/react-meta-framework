export function splitWords(text: string) {
    return text.split(/[ _-]+|(?<=[a-z0-9])(?=[A-Z])/gmu).filter(t => t.length)
}

export function titleCase(text: string) {
    return splitWords(text).map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(" ")
}

export function kebabCase(text: string) {
    return splitWords(text).map(t => t.toLowerCase()).join("-")
}
