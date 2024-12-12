import Header from "@/app/components/Header";

export default function AuthLayout({ params: { locale }, children }) {
    return (
        <>
            <Header locale={locale}></Header>
            {children}
        </>
    );
}