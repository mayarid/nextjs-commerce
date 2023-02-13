export type Page = { id: string; name: string; body: string }
export type GetAllPagesResult = { pages: Page[] }
import { IProductAPI } from '../../types/product'
import type { MayarConfig } from '../index'

export default function getAllPagesOperation() {
  async function getAllPages({
    config,
    preview,
  }: {
    url?: string
    config?: Partial<MayarConfig>
    preview?: boolean
  }): Promise<GetAllPagesResult> {
    const res = await fetch(`${process.env.MAYAR_API_DOMAIN}/hl/v1/product`, {
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      },
    })

    console.log(`[operations/get-all-pages]Status: ${res.statusText}`)
    if (!res.ok) {
      return {
        pages: [],
      }
    }

    let pages: Page[] = []
    const result: IProductAPI = await res.json()

    result.data.map((product, _) => {
      pages.push({
        id: product.id,
        name: product.name,
        body: product.description,
      })
    })

    return Promise.resolve({
      pages,
    })
  }
  return getAllPages
}
