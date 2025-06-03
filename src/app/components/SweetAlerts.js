'use client';

import Swal from "sweetalert2";

const showSwal = (options = {}) => {
    new Swal({
        toast: true,
        icon: options.type === 'success' ? 'success' : 'error',
        position: "top-right",
        iconColor: "white",
        width: options.width ? options.width : 400,
        text: options.message,
        customClass: {
            popup: options.type === "success" ? "bg-success" : "bg-danger",
            htmlContainer: "text-white",
        },
        showConfirmButton: false,
        showCloseButton: true,
        timer: options.timer ? options.timer : 7000,
        timerProgressBar: true,
    });
}

export default showSwal;