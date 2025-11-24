import { useEffect } from "react";

/**
 * Custom hook to update the browser tab title
 * 
 * Usage: useDocumentTitle("Page Name")
 * Result: Browser tab shows "Page Name | AdoptNest"
 * 
 * @param {string} title - The page title to display
 */
export function useDocumentTitle(title) {
    useEffect(() => {
        const siteName = "AdoptNest";
        const fullTitle = title ? `${title} | ${siteName}` : siteName;
        document.title = fullTitle;

        // When component unmounts, reset title to default
        return () => {
            document.title = siteName;
        };
    }, [title]);
}

export default useDocumentTitle;

