// pages/payment.js
import StripePaymentForm from '@/app/components/payment_gateways/StripePaymentForm';

const PaymentPage = () => {
    // Example props; replace these with actual data from your backend
    const stripePublicKey = 'your-public-key-here'; // Public Stripe key
    const franchiseId = '6211'; // Merchant ID
    const miscData = { amount: 1000 }; // Amount or other data needed for the request
    const mode = 'paymentintent'; // Can be 'paymentintent' or 'setupintent'

    return (
        <div>
            <h1>Stripe Payment</h1>
            <StripePaymentForm
                stripePublicKey={stripePublicKey}
                franchiseId={franchiseId}
                miscData={miscData}
                mode={mode}
            />
        </div>
    );
};

export default PaymentPage;
