import { NavItem } from "@/types";
import { verifyTokenAndReturnCookies } from "@/lib/cookie";

// Function to fetch username asynchronously
const getUsername = async () => {
    try {
        const userData = await verifyTokenAndReturnCookies();
        return userData?.username || 'defaultUsername'; // Return a default if username is not available
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'defaultUsername'; // Handle errors gracefully, return a default username
    }
};

// Use an IIFE to fetch username and construct navItems
export const fetchNavItems = async (): Promise<NavItem[]> => {
    const username = await getUsername();

    return [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'dashboard',
            label: 'Dashboard'
        },
        {
            title: 'Portfolio',
            href: '/dashboard/portfolio',
            icon: 'DollarSign',
            label: 'Portfolio'
        },
        {
            title: 'Calculator',
            href: '/dashboard/calculator',
            icon: 'user',
            label: 'user'
        },
        {
            title: 'Profile',
            href: `/dashboard/profile/${username}`,
            icon: 'profile',
            label: 'profile'
        },
        
       
    ];
};

// Export navItems asynchronously
export const navItems: Promise<NavItem[]> = fetchNavItems();
