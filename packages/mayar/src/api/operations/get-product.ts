import type { MayarConfig } from '../index'
import { Product } from '@vercel/commerce/types/product'
import { GetProductOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import { IProductAPI, IProduct, IGetProduct } from '../../types/product'

export default function getProductOperation(_p: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<MayarConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const res = await fetch(
      `${process.env.MAYAR_API_DOMAIN}/product/${variables!.slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      }
    )

    const result: IGetProduct = await res.json()
    const getItem: IProduct = result.data

    const product: Product = {
      id: getItem.id,
      name: getItem.name,
      description: '',
      descriptionHtml: getItem.description,
      path: `/${getItem.id}`,
      slug: getItem.link,
      category: getItem.category,
      type: getItem.type,
      images: [
        {
          url:
            !getItem.coverImage && getItem.multipleImage
              ? getItem.multipleImage[0].url
              : getItem.coverImage!.url,
          alt: getItem.name,
          width: 1000,
          height: 1000,
        },
      ],
      variants: [],
      price: {
        value: getItem.amount ? getItem.amount : 0,
        currencyCode: 'IDR',
      },
      options: [],
    }

    return {
      product,
    }
  }

  return getProduct
}
