'use client';

/** Check app/[locale]/parent/payment/page.jsx for proper implementation of this component. */

export default function PrintContent({ children, icon = 'mdi-print', classes = '', index = 0, text = '', textStyles = '' }) {
    const print = () => {
        const content = document.getElementById(`printcontents-${index}`);
        const printWindow = document.getElementById(`ifmcontentstoprint-${index}`).contentWindow;

        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                        body {
                            font-family: "Barlow", sans-serif;
                        }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
            <iframe id={`ifmcontentstoprint-${index}`} style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
            <div id={`printcontents-${index}`} className="d-none">
                {children}
            </div>
            {text ?
                <div className="d-flex align-items-center gap-1" onClick={print}>
                    <i className={`mdi ${icon} cursor-pointer ${classes}`}></i>
                    <p className={textStyles}>{text}</p>
                </div> : <i className={`mdi ${icon} cursor-pointer ${classes}`} onClick={print}></i>
            }
        </>
    );
}
