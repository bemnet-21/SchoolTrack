export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('et-ET', {
    style: 'currency',
    currency: 'ETB',
  }).format(amount)
}
