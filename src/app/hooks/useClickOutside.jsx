import { useEffect } from 'react';

/**
 * Close a component when clicking outside of it
 *
 * @param {React.RefObject} ref - The element to detect outside clicks for
 * @param {Function} callback - What to do when clicked outside
 */
export default function useClickOutside(ref, callback) {
    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback]);
}
