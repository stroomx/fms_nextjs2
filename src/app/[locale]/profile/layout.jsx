import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CookieConsent from "@/app/components/CookieConsent";

export default function AuthLayout({
    params: { locale },
    children,
}) {
    return (
        <>
            <Header locale={locale}></Header>
            {children}
            <CookieConsent />
            <Footer locale={locale}></Footer>
        </>
    );
}