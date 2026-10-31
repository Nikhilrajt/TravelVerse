const WISHLIST_KEY = "wishlist";

export const getWishlist = () => {
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);

    if (!savedWishlist) {
        return {
            items: []
        };
    }

    return JSON.parse(savedWishlist);
};

export const saveWishlist = (wishlist) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};