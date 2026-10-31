const getCartKey = (userId) => `cart_user_${userId}`;

export const getCart = (userId) => {
    if (!userId) {
        return {
            items: [],
            totalItems: 0
        };
    }

    const savedCart = localStorage.getItem(getCartKey(userId));

    if (!savedCart) {
        return {
            items: [],
            totalItems: 0
        };
    }

    return JSON.parse(savedCart);
};

export const saveCart = (userId, cart) => {
    if (!userId) return;

    localStorage.setItem(
        getCartKey(userId),
        JSON.stringify(cart)
    );
};