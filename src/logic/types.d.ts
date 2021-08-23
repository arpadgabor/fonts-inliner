export interface FontFamily {
  name: string
  charsets: string[]
  fonts: Font[]
}

export interface Font {
  charset: string
  italic: boolean
  css: string
}
