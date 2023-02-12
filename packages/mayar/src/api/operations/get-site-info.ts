import { OperationContext } from '@vercel/commerce/api/operations'
import { Category, GetSiteInfoOperation } from '@vercel/commerce/types/site'
import { MayarConfig } from '../index'
import { IProductAPI } from '../../types/product'

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[]
    brands: any[]
  }
> = T

export default function getSiteInfoOperation({}: OperationContext<any>) {
  async function getSiteInfo({
    query,
    variables,
    config: cfg,
  }: {
    query?: string
    variables?: string
    config?: Partial<MayarConfig>
    preview?: boolean
  } = {}): Promise<GetSiteInfoResult> {
    const res = await fetch('http://api.mayar.club/hl/v1/product', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      },
    })

    if (!res.ok) {
      return {
        categories: [],
        brands: [],
      }
    }

    let categories: Category[] = []
    const result: IProductAPI = await res.json()

    result.data.map((product, _) => {
      let name = product.type
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')

      return categories.push({
        id: product.type,
        name,
        slug: product.type,
        path: `/${product.type}`,
      })
    })

    return Promise.resolve({
      categories,
      brands: [],
    })
  }

  return getSiteInfo
}
