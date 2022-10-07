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
          return;
        }

        const newCart = cart.map((item) => {
          if (item.id === productId) {
            console.log(item);
            return {
              ...item,
              amount: total,
            };
          } else return item;
        });

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

        setCart(newCart);

        console.log(cart);
        return;
      }
      console.log("não existe no carrinho!");

      // guardar adicionando o amount
      const { data } = await api.get<Product>(`products/${productId}`);

      console.log(data);

      const newCart = [...cart, { ...data, amount: 1 }];

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

      setCart(newCart);
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productAlreadyExistOnCart = cart.find(({ id }) => id === productId);

      if (!productAlreadyExistOnCart) {
        toast.error("Erro na remoção do produto");
        return;
      }

      const newCart = cart.filter((item) => item.id !== productId);

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

      setCart(newCart);
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      //
      const { data } = await api.get<Stock>(`stock/${productId}`);

      if (amount > data.amount) {
        toast.error("Quantidade solicitada fora de estoque");

        return;
      }

      const newCart = cart.map((item) => {
        if (item.id === productId) {
          console.log(item);
          return {
            ...item,
            amount,
          };
        } else return item;
      });

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

      setCart(newCart);
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
