import { Product } from '@vercel/commerce/types/product'
import { IProductAPI } from '../../../../types/product'
import { ProductsEndpoint } from '.'

const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  body: { search, categoryId, brandId, sort },
  config,
  commerce,
}) => {
  let url = `https://api.mayar.id/hl/v1/product`
  if (categoryId) {
    if (categoryId.includes('physical_product')) {
      url += `?type=physical_product`
    } else {
      url += `?type=${categoryId}`
    }
  }

  let res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
    },
  })

  console.log(`[catalog/products]Status: ${res.statusText}`)
  if (!res.ok) {
    return {
      data: {
        products: [],
        found: false,
        total: 0,
        page: 1,
        pageSize: 1,
        pageCount: 1,
      },
    }
  }

  const result: IProductAPI = await res.json()
  const found = result.data.length > 0
  if (!found) {
    return {
      data: {
        products: [],
        found,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        pageCount: result.pageCount,
      },
    }
  }

  let products: Product[] = []

  if (categoryId?.includes('physical_product')) {
    result.data.map((item, _) => {
      let slug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (!categoryId.includes(slug)) {
        return
      }
      const product: Product = {
        id: item.id,
        name: item.name,
        description: '',
        descriptionHtml: item.description,
        path: `/${item.id}`,
        slug: item.link,
        category: item.category,
        type: item.type,
        images: item.coverImage
          ? [
              {
                url: item.coverImage.url,
                alt: item.name,
                width: 1000,
                height: 1000,
              },
            ]
          : item.multipleImage && item.multipleImage.length > 0
          ? [
              {
                url: item.multipleImage[0].url,
                alt: item.name,
                width: 1000,
                height: 1000,
              },
            ]
          : [],
        variants: [],
        price: {
          value: item.amount ? item.amount : 0,
          currencyCode: 'IDR',
        },
        options: [],
        createdAt: item.createdAt, // Add the createdAt property to the product
      }
      products.push(product)
    })
  } else {
    result.data.map((item, _) => {
      const product: Product = {
        id: item.id,
        name: item.name,
        description: '',
        descriptionHtml: item.description,
        path: `/${item.id}`,
        slug: item.link,
        category: item.category,
        type: item.type,
        images: item.coverImage
          ? [
              {
                url: item.coverImage.url,
                alt: item.name,
                width: 1000,
                height: 1000,
              },
            ]
          : item.multipleImage && item.multipleImage.length > 0
          ? [
              {
                url: item.multipleImage[0].url,
                alt: item.name,
                width: 1000,
                height: 1000,
              },
            ]
          : [],
        variants: [],
        price: {
          value: item.amount ? item.amount : 0,
          currencyCode: 'IDR',
        },
        options: [],
        createdAt: item.createdAt, // Add the createdAt property to the product
      }
      products.push(product)
    })
  }

  if (sort && sort == 'price-desc') {
    products = products.sort((a, b) => b.price.value - a.price.value)
  }

  if (sort && sort == 'price-asc') {
    products = products.sort((a, b) => a.price.value - b.price.value)
  }

  if (sort && sort == 'lastest-desc') {
    products = products.sort((a, b) => b.createdAt - a.createdAt)
  }

  console.log(result)

  return {
    data: {
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      pageCount: result.pageCount,
      products: products,
      found,
    },
  }
}

export default getProducts
