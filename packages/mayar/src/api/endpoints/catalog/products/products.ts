import { Product } from '@vercel/commerce/types/product'
import { IProductAPI } from '../../../../types/product'
import { ProductsEndpoint } from '.'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  body: { search, categoryId, brandId, sort },
  config,
  commerce,
}) => {
  let url = `${config.commerceUrl}/product`
  if (categoryId) {
    url += `?type=${categoryId}`
  }

  let res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
    },
  })

  if (!res.ok) {
    return {
      data: { products: [], found: false },
    }
  }

  const result: IProductAPI = await res.json()
  const found = result.data.length > 0
  if (!found) {
    return {
      data: { products: [], found },
    }
  }

  let products: Product[] = []
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
    data: {
      products: products,
      found,
    },
  }
}

export default getProducts
