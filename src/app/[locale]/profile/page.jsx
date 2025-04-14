'use client';

import LocationMap from "@/app/components/Map";
import axiosInstance from "@/axios";
import { useEffect, useState } from "react";

export default function Profile() {

    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get('api/maplocations.php');
                console.log(data);
                setLocations(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            {loading && <div className="loading-overlay">
                <div className="spinner"></div>
            </div>}

            <div className="container pt-5 mt-5" style={{ height: "100svh" }}>

                <LocationMap locations={locations}></LocationMap>
            </div>
        </>
    );
};