import type { MayarConfig } from '../index'
import { Product } from '@vercel/commerce/types/product'
import { Image } from '@vercel/commerce/types/common'
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
  } = {}): Promise<Product | {}> {
    try {
      const res = await fetch(
        `https://api.mayar.id/hl/v1/product/${variables!.slug}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
          },
        }
      )

      console.log(`[operations/get-product]Status: ${res.statusText}`)
      if (!res.ok) {
        return {
          data: {},
        }
      }

      const result: IGetProduct = await res.json()
      const getItem: IProduct = result.data
      if (!getItem) {
        return {
          data: {},
        }
      }

      let images: Image[] = []
      if (getItem.multipleImage && getItem.multipleImage.length > 0) {
        getItem.multipleImage.map((img, index) => {
          images.push({
            url: img.url,
            alt: `${getItem.link}-image-${index}`,
            width: 1000,
            height: 1000,
          })
        })
      }

      const product: Product = {
        id: getItem.id,
        name: getItem.name,
        description: '',
        descriptionHtml: getItem.description,
        path: `/${getItem.id}`,
        slug: getItem.link,
        category: getItem.category,
        type: getItem.type,
        images: getItem.coverImage
          ? [
              {
                url: getItem.coverImage.url,
                alt: getItem.name,
                width: 1000,
                height: 1000,
              },
            ]
          : getItem.multipleImage && getItem.multipleImage.length > 0
          ? images
          : [],
        variants: [],
        price: {
          value: getItem.amount ? getItem.amount : 0,
          currencyCode: 'IDR',
        },
        options: [],
        order: getItem.order,
        createdAt: getItem.createdAt ? getItem.createdAt : 0,
      }

      return {
        product: product,
      }
    } catch (err) {
      console.error(err)
      return {
        data: {},
      }
    }
  }

  return getProduct
}
