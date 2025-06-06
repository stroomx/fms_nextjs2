'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

const MapComponent = ({ locations, redirectUrl = '/profile', containerStyle = { width: '100%', height: '500px' } }) => {
    // Reference to GoogleMap
    const mapRef = useRef(null);
    const router = useRouter();

    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);

    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        const location = {};

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    location['lat'] = latitude;
                    location['lng'] = longitude;
                    setUserLocation(location);
                }
            );
        }

        // If user location is available, use it to center the map
        setMapCenter(location || {
            lat: 39.8283,
            lng: -98.5795
        });
    }, []);

    const searchZip = async (e) => {
        e.preventDefault();

        const zip = document.getElementById('zipcode').value;

        // Check against existing database locations
        for (let i = 0; i < locations?.length; i++) {
            if (
                locations[i]?.territoryzip === zip ||
                locations[i]?.territoryextrazip?.split(',')?.includes(zip)
            ) {
                setMapCenter({
                    lat: +locations[i]?.addresslat,
                    lng: +locations[i]?.addresslong,
                });

                console.group('DATABASE');
                console.log(locations[i]?.addresslat);
                console.log(locations[i]?.addresslong);
                console.groupEnd();
                return; // Exit early if match found in your data
            }
        }

        // Use Google Maps Geocoder API via browser JS API
        if (window.google) {
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: zip }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    const newCenter = {
                        lat: location.lat(),
                        lng: location.lng(),
                    };
                    setMapCenter(newCenter);

                    console.group('GEOCODER');
                    console.log('lat', newCenter.lat);
                    console.log('lng', newCenter.lng);
                    console.groupEnd();

                    profileZoomToIncludeMarkers(12);
                } else {
                    console.error('Geocoding failed:', status);
                }
            });
        } else {
            console.error('Google Maps JS API not loaded');
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
    const profileZoomToIncludeMarkers = (startZoom) => {
        if (!mapRef.current || !window.google) return;

        const map = mapRef.current;
        let zoomLevel = startZoom;

        const checkMarkersInBounds = () => {
            const bounds = map.getBounds();
            if (!bounds) return false;

            return locations.some((marker) => {
                const markerPosition = new window.google.maps.LatLng(
                    parseFloat(marker.addresslat),
                    parseFloat(marker.addresslong)
                );
                return bounds.contains(markerPosition);
            });
        };

        const smoothZoomOut = () => {
            if (checkMarkersInBounds() || zoomLevel <= 4) {
                console.log(`Stopped zooming at level: ${zoomLevel}`);
                return;
            }

            zoomLevel -= 1;
            map.setZoom(zoomLevel);

            setTimeout(smoothZoomOut, 300); // Delay for smooth animation
        };

        map.setZoom(zoomLevel);
        setTimeout(smoothZoomOut, 300);
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
