import { IProductAPI } from '../../types/product'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
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

    let paths: Array<{ path: string }> = []
    const result: IProductAPI = await res.json()

    result.data.map((product, _) => {
      paths.push({
        path: `/${product.id}`,
      })
    })

    return Promise.resolve({
      // products: data.products.map(({ path }) => ({ path })),
      products: paths,
    })
  }

  return getAllProductPaths
}
