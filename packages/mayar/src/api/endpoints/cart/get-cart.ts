import { LineItem } from '@vercel/commerce/types/cart'
import type { CartEndpoint } from '.'
import type { Cart, MayarCartAPI } from '../../../types/cart'

import getCartCookie from '../../utils/get-cart-cookie'

// Return current cart info
const getCart: CartEndpoint['handlers']['getCart'] = async ({
  body: { cartId },
  config,
}) => {
  const sessionId = cartId ? cartId : getCartCookie(config.cartCookie)
  const res = await fetch(`${config.commerceUrl}/cart?sessionId=${sessionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
  })

  console.log(`[get-cart]: CartID ${cartId}`)
  if (!res.ok) {
    return {
      data: null,
    }
  }

  let items: LineItem[] = []
  const result: MayarCartAPI = await res.json()
  console.log(result.data)

  result.data.productItems.map((item, _) => {
    items.push({
      id: item.product.id,
      variantId: item.product.id,
      productId: item.product.id,
      name: item.product.name,
      quantity: item.qty,
      discounts: [],
      path: item.product.path,
      variant: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.amount ? item.product.amount : 0,
        listPrice: item.product.amount ? item.product.amount : 0,
        image:
          item.product.multipleImage && item.product.multipleImage.length > 0
            ? {
                url: item.product.multipleImage[0].url,
                alt: item.product.name,
                width: 1000,
                height: 1000,
              }
            : {
                url: item.product.coverImage!.url,
                alt: item.product.name,
                width: 1000,
                height: 1000,
              },
      },
    })
  })

  const cartData: Cart = {
    id: result.data.sessionId,
    customerId: result.data.userId,
    createdAt: new Date().toString(),
    currency: { code: 'IDR' },
    taxesIncluded: false,
    lineItems: items,
    lineItemsSubtotalPrice: result.data.amountTotal,
    subtotalPrice: result.data.amountTotal,
    totalPrice: result.data.amountTotal,
  }

  return {
    data: cartData,
  }
}

export default getCart
