import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AuthLayout({
    params: { locale },
    children,
}) {
    return (
        <>
            <Header locale={locale}></Header>
            {children}
            <Footer locale={locale}></Footer>
        </>
    );
}