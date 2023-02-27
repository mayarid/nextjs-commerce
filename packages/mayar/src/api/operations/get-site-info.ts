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
    try {
      const res = await fetch(`https://api.mayar.id/hl/v1/product`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      })

      console.log(`[operations/get-site-info]Status: ${res.statusText}`)
      if (!res.ok) {
        return {
          categories: [],
          brands: [],
        }
      }

      let categories: Category[] = []
      let prevType: string[] = []
      const result: IProductAPI = await res.json()

      result.data.map((product, _) => {
        let slug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (!prevType.includes(slug) && product.type === 'physical_product') {
          categories.push({
            id: `${product.type}_${slug}`,
            name: product.category,
            slug: slug,
            path: `/${slug}`,
          })

          prevType.push(slug)
          return
        }

        if (
          !prevType.includes(product.type) &&
          product.type !== 'physical_product'
        ) {
          let name = product.type
            .split('_')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ')

          categories.push({
            id: product.type,
            name,
            slug: product.type,
            path: `/${product.type}`,
          })

          prevType.push(product.type)
          return
        }

        return
      })

      return Promise.resolve({
        categories,
        brands: [],
      })
    } catch (err) {
      console.error(err)
      return {
        categories: [],
        brands: [],
      }
    }
  }

  return getSiteInfo
}
