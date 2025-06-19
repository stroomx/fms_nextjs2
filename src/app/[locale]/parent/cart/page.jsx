'use client';

import { useCart } from '@/app/hooks/useCart';
import money from '@/app/localization/currency';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const { t } = useTranslation();
  const router = useRouter();

  const total = items.reduce((acc, item) => acc + (item.cost || 0), 0);

  const checkout = () => {
    if (items.length > 0) {
      router.push('/parent/payment');
    }
  };

  return (
    <div className="home-section mt-4">
      <h1 className="mb-3">{t('Shopping Cart')}</h1>
      {items.length === 0 ? (
        <p>{t('Your cart is empty')}</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {items.map((item) => (
              <li key={item.schedule_id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.name}</span>
                <span>{money(item.cost, item.countryCode)}</span>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.schedule_id)}>{t('Remove')}</button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mb-3">
            <strong>{t('Total')}</strong>
            <span>{money(total, items[0]?.countryCode)}</span>
          </div>
          <button className="btn btn-primary" onClick={checkout}>{t('Proceed to Checkout')}</button>
        </>
      )}
    </div>
  );
}
