export default function Profile() {
    return (
        <>
            {false && <div className="loading-overlay">
                <div className="spinner"></div>
            </div>}

            <div className="height-vw-100">
                <h1 className="mt-3">Generic Profile Page</h1>
            </div>
        </>
    );
};