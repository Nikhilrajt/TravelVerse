const getWishlistKey = (userId) => `wishlist_user_${userId}`;

export const getWishlist = (userId) => {
    if (!userId) {
        return {
            items: []
        };
    }

    const savedWishlist = localStorage.getItem(
        getWishlistKey(userId)
    );

    if (!savedWishlist) {
        return {
            items: []
        };
    }

    return JSON.parse(savedWishlist);
};

export const saveWishlist = (userId, wishlist) => {
    if (!userId) {
        return;
    }

    localStorage.setItem(
        getWishlistKey(userId),
        JSON.stringify(wishlist)
    );
};