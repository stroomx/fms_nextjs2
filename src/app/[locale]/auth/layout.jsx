import Header from "@/app/components/Header";
import CookieConsent from "@/app/components/CookieConsent";

export default function AuthLayout({ params: { locale }, children }) {
    return (
        <>
            <Header locale={locale}></Header>
            {children}
            <CookieConsent />
        </>
    );
}