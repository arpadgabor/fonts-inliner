import ky from 'ky'

export async function fetchFont(url: string): Promise<string> {
  const response = await ky.get(url)

  return await response.text()
}
