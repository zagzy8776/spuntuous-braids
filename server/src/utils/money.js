const toNumber = (value) => Number(value || 0);

const formatProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    price: toNumber(product.price),
    costPrice: product.costPrice === null || product.costPrice === undefined ? null : toNumber(product.costPrice),
    salePrice: product.salePrice === null || product.salePrice === undefined ? null : toNumber(product.salePrice),
    gender: product.gender || null,
    scentFamily: product.scentFamily || null,
    occasion: product.occasion || null,
    brandType: product.brandType || null,
  };
};

const formatOrder = (order) => {
  if (!order) return null;
  return {
    ...order,
    subtotal: toNumber(order.subtotal),
    discount: toNumber(order.discount),
    manualDiscount: toNumber(order.manualDiscount),
    deliveryFee: toNumber(order.deliveryFee),
    total: toNumber(order.total),
    items: order.items?.map((item) => ({
      ...item,
      productPrice: toNumber(item.productPrice),
      total: toNumber(item.total),
    })),
  };
};

module.exports = { toNumber, formatProduct, formatOrder };
