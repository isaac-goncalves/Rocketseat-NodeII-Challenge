import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [
      {
        id: 1,
        title: "Tênis de Caminhada Leve Confortável",
        price: 179.9,
        image:
          "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg",
        amount: 1,
      },
      {
        id: 2,
        title: "Tênis de Caminhada Leve Confortável",
        price: 179.9,
        image:
          "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg",
        amount: 1,
      },
    ];
  });

  const addProduct = async (productId: number) => {
    try {
      console.log(productId);

      const productAlreadyExistOnCart = cart.find(({ id }) => id === productId);

      if (productAlreadyExistOnCart) {
        console.log("ja existe no carrinho!");

        //somar e guardar adicionando o amount
        const total = productAlreadyExistOnCart.amount + 1;

        const { data } = await api.get<Stock>(`stock/${productId}`);

        if (total > data.amount) {
          toast.error("Quantidade solicitada fora de estoque");
        }

        console.log(data);
      }
      // guardar adicionando o amount
    } catch {}
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
