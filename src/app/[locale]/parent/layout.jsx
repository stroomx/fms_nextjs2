import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TabLayout from "./tabs.layout";

export default function ParentLayout({ params: { locale }, children }) {
    const tabs = [
        { href: "/parent", label: "Home" },
        { href: "/parent/profile", label: "Parent Profile" },
        { href: "/parent/address", label: "Address" },
        { href: "/parent/payment", label: "Payment" },
    ];

    return (
        <>
            <Header locale={locale} />
            <TabLayout tabs={tabs}>{children}</TabLayout>
            <Footer locale={locale} />
        </>
    );
}
