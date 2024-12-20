'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function StripeRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [paymentIntent, setPaymentIntent] = useState({});

    const fetchData = async () => {
        try {
            // Make a request with the payment intent id and franchise id
            // Get the schedule details along with the enrollment status from the response
            // Handle the redirect from there.
        } catch (err) {
            // If this fails, go to dashboard and show and error message.
        }
    }

    const handleRedirect = (schedules) => {
        let url = '';

        const status = searchParams.get('redirect_status');

        switch (paymentType) {
            case 'enrollment':
                if (status == 'failed') {
                    alert({ message: t(`${studentIds?.length} student(s) enrollment failed.`) })
                    url = `/profile/${franchise_id}/${schedule_id}?id`;
                }
                else
                    alert({ type: "success", message: t(`${studentIds?.length} student(s) successfully enrolled.`) })
                break;
            default:
                const enrollmentId = searchParams.get('eid');
                const amount = searchParams.get('amount');
                handlePayment(enrollmentId, amount, status, schedules);
        }

        router.push(url);
    }


    useEffect(() => {
        fetchData();
        handleRedirect();
    }, []);

    return <div className="loading-overlay">
        <div className="spinner"></div>
    </div>;
}