'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Select from '@/app/components/Select';

export default function TabLayout({ children }) {
    const tabs = [
        { href: "/parent", label: "Home" },
        { href: "/parent/profile", label: "Parent Profile" },
        { href: "/parent/address", label: "Address" },
        { href: "/parent/payment", label: "Payment History" },
    ];

    const pathname = usePathname();

    return (
        <main className="padding-top parent-home">
            <div className="container">
                <nav className="tab-menu">
                    {tabs.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`tab-item ${isActive ? 'active' : ''}`}
                            >
                                <span>
                                    {label.split('\n').map((line, index) => (
                                        <span key={index}>
                                            {line}
                                        </span>
                                    ))}
                                </span>
                            </Link>
                        );
                    })}
                    {/* <Select displayKey="name" valueKey="id" onChange={(e) => { console.log(e) }}></Select> */}
                </nav>
                {children}
            </div>
        </main>
    );
}
