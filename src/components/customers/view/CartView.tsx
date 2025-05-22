'use client'

import { ICartProduct } from "@/components/adminComponents/menu/menuTypes/menuTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { createOrder } from "../fetch/cart";

const CartView = () => {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const [totalCart, setTotalCart] = useState<number>(0);
  const [cart, setCart] = useState<ICartProduct[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ICartProduct[];

    if (storedCart) {
      const cartWithQuantity = storedCart.map((product) => ({
        ...product,
        quantity: product.quantity ?? 1,
      }));

      recalculateTotal(cartWithQuantity);
      setCart(cartWithQuantity);
    }
  }, []);

  // Función para recalcular total
  const recalculateTotal = (cartData: ICartProduct[]) => {
    let total = 0;
    cartData.forEach((product) => {
      total += Number(product.price) * product.quantity;
    });
    setTotalCart(total);
  };

  // Cambiar cantidad de producto
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) quantity = 1; // mínimo 1

    const updatedCart = cart.map((product) =>
      product.id === id ? { ...product, quantity } : product
    );

    setCart(updatedCart);
    recalculateTotal(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (idToRemove: string) => {
    const updatedCart = cart.filter((product) => product.id !== idToRemove);
    recalculateTotal(updatedCart);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const token = await getAccessTokenSilently();

      if (!user || !user.sub) {
        console.warn("Usuario no disponible.");
        return;
      }

      const productsForOrder = cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      await createOrder(token, productsForOrder, user.sub);

      localStorage.setItem("cart", "[]");
      setCart([]);
      setTotalCart(0);
    } catch (error) {
      console.error("Error en checkout:", error);
    }
  };

  const total = totalCart > 0 ? totalCart : 0;

  return (
    <div className="p-4 md:min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="cart-item bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-center text-2xl font-bold mb-5">Products</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2">
            {cart.length === 0 ? (
              <p className="text-lg text-gray-900 mb-4 font-semibold">
                No products in the cart.
              </p>
            ) : (
              cart.map((product) => (
                <div
                  key={product.id}
                  className="outline-2 outline-gray-600 m-2 p-4 rounded-md border-b py-2 items-center sm:h-auto sm:w-auto"
                >
                  <div className="flex flex-wrap justify-around items-center p-4 xl:grid xl:grid-cols-2 gap-4">
                    <div className="xl:flex flex-col items-left justify-center space-x-4">
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        {product.name}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        ${product.price}
                      </p>

                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          onClick={() =>
                            updateQuantity(product.id, product.quantity - 1)
                          }
                          disabled={product.quantity <= 1}
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${
                            product.quantity <= 1
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          -
                        </button>

                        <span className="p-1">{product.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(product.id, product.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="max-w-xs overflow-hidden m-auto flex justify-center">
                      <img
                        className="max-w-full h-auto object-cover"
                        src={
                          typeof product.image_url === "string"
                            ? product.image_url
                            : URL.createObjectURL(product.image_url)
                        }
                        alt={product.name}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="py-2 px-2 rounded-xl font-medium transition-colors duration-200 w-30 bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="cart-item bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-center text-2xl font-bold mb-5">Order Summary</h2>

          <div className="mb-2 flex justify-between">
            <p className="text-lg font-semibold text-gray-900 mb-4">Subtotal:</p>
            <span>${total.toFixed(2)}</span>
          </div>

          <br />
          <div className="mb-2 flex justify-between font-bold border-t pt-2">
            <p>Total:</p>
            <span>${total.toFixed(2)}</span>
          </div>

          {cart.length > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleCheckout}
                className="rounded-xl font-medium transition-colors duration-200 w-30 bg-blue-300 text-white hover:bg-blue-400 p-2"
              >
                💳 Checkout
              </button>

              <button
                className="rounded-xl font-medium transition-colors duration-200 w-50 bg-green-300 text-white hover:bg-green-400 p-2"
              >
                Pay at the table
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;
