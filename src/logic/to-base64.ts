import ky from 'ky'

const urlRegex = /url\((.*?)\)/

export async function toBase64(fontFace: string): Promise<string> {
  const [, url] = fontFace.match(urlRegex)!

  const response = await ky.get(url)
  const blobFont = await response.blob()

  const base64Font: string = await new Promise<string>((done, fail) => {
    const reader = new FileReader()
    reader.readAsDataURL(blobFont)

    reader.onload = () => done(reader.result!.toString())
    reader.onerror = () => fail(reader.error)
  })

  return fontFace.replace(urlRegex, `url('${base64Font}')`).trim()
}
