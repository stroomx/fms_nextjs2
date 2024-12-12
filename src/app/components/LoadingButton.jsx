import { useState } from 'react';

const LoadingButton = ({ text, loadingText, onClick, btnClasses }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onClick();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <button
            type="button"
            className={btnClasses}
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? (
                <span dangerouslySetInnerHTML={{ __html: loadingText }} />
            ) : (
                text
            )}
        </button>
    );
};

export default LoadingButton;
