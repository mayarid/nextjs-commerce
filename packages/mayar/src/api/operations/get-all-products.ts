import { Product } from '@vercel/commerce/types/product'
import { GetAllProductsOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import type { MayarConfig, Provider } from '../index'
import { IProductAPI } from '../../types/product'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<MayarConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] }> {
    const res = await fetch(`${process.env.MAYAR_API_DOMAIN}/product`, {
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      },
    })

    if (!res.ok) {
      return {
        products: [],
      }
    }

    let products: Product[] = []
    const result: IProductAPI = await res.json()

    result.data.map((item, _) => {
      return products.push({
        id: item.id,
        name: item.name,
        description: '',
        descriptionHtml: item.description,
        path: `/${item.id}`,
        slug: item.link,
        category: item.category,
        type: item.type,
        images: [
          {
            url:
              !item.coverImage && item.multipleImage
                ? item.multipleImage[0].url
                : item.coverImage!.url,
            alt: item.name,
            width: 1000,
            height: 1000,
          },
        ],
        variants: [],
        price: {
          value: item.amount ? item.amount : 0,
          currencyCode: 'IDR',
        },
        options: [],
      })
    })

    return {
      products,
    }
  }
  return getAllProducts
}
