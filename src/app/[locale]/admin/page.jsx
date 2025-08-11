"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import AuthService from '@/auth.service';
import Cookies from 'js-cookie';
import axiosInstance from "@/axios";
import axios from "axios";


export default function Admin() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const id = searchParams.get('id');
        const action = searchParams.get('action');

        execute(action, id);
    }, []);

    const execute = (action, id = 0) => {
        switch (action) {
            case 'impersonate':
                impersonate(id);
                break;
            case 'endimpersonate':
                AuthService.endImpersonate();
                break;
        }

        router.push('/');
    }

    const impersonate = async (id) => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/api/admin.php?action=impersonate&id=${id}`);
            const token = response.data.token;

            const config = {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json" }
            };

            axios.defaults.headers.common = config['headers'];
            const userDetails = await axios.get(`${apiUrl}/api/userdetails.php`);

            AuthService.impersonate(userDetails['data'], token);
        } catch (e) {
            return;
        }
    }

    return <></>;
}