'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const MapComponent = ({ locations, redirectUrl = '/profile', containerStyle = { width: '100%', height: '500px' } }) => {
    // Reference to GoogleMap
    const mapRef = useRef(null);
    const router = useRouter();

    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);

    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                }
            );
        }

        // If user location is available, use it to center the map
        setMapCenter(userLocation || {
            lat: 39.8283,
            lng: -98.5795
        });
    }, []);

    const searchZip = async (e) => {
        e.preventDefault();

        const zip = document.getElementById('zipcode').value;

        for (var i = 0; i < locations?.length; i++) {
            if (locations[i]?.territoryzip == zip || locations[i]?.territoryextrazip?.split(',')?.includes(zip)) {
                setMapCenter({ lat: +locations[i]?.addresslat, lng: +locations[i]?.addresslong });

                console.group('DATABASE');
                console.log(locations[i]?.addresslat);
                console.log(locations[i]?.addresslong);
                console.groupEnd();
                // router.push(`${redirectUrl}/${locations[i]?.objectid}`)
                break;
            }
        }

        try {
            const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${mapsKey}`);
            console.log(data);
            // setMapCenter({ lat: +data[0]?.lat, lng: +data[0]?.lon });
            // console.group('API');
            // console.log(data[0]?.lat);
            // console.log(data[0]?.lon);
            // console.groupEnd();
            // profileZoomToIncludeMarkers(12);

        } catch (err) {
            console.error(err);
        }
    };

    // Map options (control settings)
    const mapOptions = {
        zoomControl: true,
        zoomControlOptions: {
            position: 'LEFT_CENTER',
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: 'DROPDOWN_MENU',
            position: 'LEFT_CENTER',
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: 'LEFT_CENTER',
        },
    };

    // Function to zoom map to include markers
    const profileZoomToIncludeMarkers = (minZoom) => {
        if (!mapRef.current) return;

        const map = mapRef.current; // The map instance returned from onLoad

        map.setZoom(minZoom);

        let zoomCheck = minZoom;

        for (zoomCheck; zoomCheck > 4; zoomCheck--) {
            let breakNow = false;
            const bounds = map.getBounds();

            // Loop through each marker and check if it's within the bounds
            for (let i = 0; i < locations.length; i++) {
                const marker = locations[i];
                const markerPosition = new window.google.maps.LatLng(marker.addresslat, marker.addresslong);

                // If a marker is within t5he current bounds, stop further zoom changes
                if (bounds?.contains(markerPosition)) {
                    console.log('Found a marker within bounds, stopping zoom adjustment.');
                    console.log(markerPosition, 'position')
                    breakNow = true;
                    break; // Break out of the marker checking loop
                }
            }

            map.setZoom(zoomCheck); // Apply the current zoom level

            if (breakNow) {
                break;
            }
            console.log(zoomCheck)
        }
    };

    useEffect(() => {
        // Initially zoom to include markers when component mounts
        profileZoomToIncludeMarkers(12);
    }, [locations]);

    return (
        <LoadScript googleMapsApiKey={mapsKey}>
            <form onSubmit={searchZip} className='d-flex align-items-center mb-3 gap-2'>
                <input type="text" id="zipcode" maxLength={16} className="form-control rounded-0" placeholder="Have Zip code ? Enter here" />
                <button className='btn btn-outline-primary rounded-0'>Submit</button>
            </form>
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={containerStyle}
                zoom={12}
                center={mapCenter}
                options={mapOptions}
                onLoad={(mapInstance) => {
                    mapRef.current = mapInstance; // Store the map instance when the map is loaded
                }}
            >
                {locations?.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{
                            lat: parseFloat(marker.addresslat),
                            lng: parseFloat(marker.addresslong),
                        }}
                        onClick={() => router.push(`${redirectUrl}/${marker?.objectid}`)}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
