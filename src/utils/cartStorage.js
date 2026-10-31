const CART_KEY = "cart";

export const getCart = () => {
    const savedCart = localStorage.getItem(CART_KEY);

    if (!savedCart) {
        return {
            items: [],
            totalItems: 0
        };
    }

    return JSON.parse(savedCart);
};

export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};