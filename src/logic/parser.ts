import { toBase64 } from './to-base64'
import { FontFamily } from './types'

const regex = {
  name: /font-family\:\s\'(.*)\'/,
  charsets: /\/\*\s(.*)\s\*\//g,
  style: /font-style\:\s(.*)/,
}

export async function parseFont(css: string): Promise<FontFamily> {
  const [, familyName] = css.match(regex.name)!

  const charsets = Array.from(
    css.matchAll(regex.charsets),
    ([, match]) => match
  )

  const [, ...fontFaces]: string[] = css
    .replaceAll(/\/\*\s.*\s\*\//g, '')
    .split('@font-face ')

  const fonts = fontFaces.map(async (face, idx) => ({
    charset: charsets[idx],
    css: await toBase64(`@font-face ${face}`),
    italic: face.match(regex.style)![1] === 'italic',
  }))

  return {
    name: familyName,
    fonts: await Promise.all(fonts),
    charsets: Array.from(new Set(charsets)),
  }
}
