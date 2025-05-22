import toast from "react-hot-toast"
const APIURL = process.env.NEXT_PUBLIC_API_URL;


export async function createOrder(token: string, products: { id: string; quantity: number }[], customerId: string) {
  try {
    const body = {
      customerId,
      code: "T07",  // o la lógica para obtener el código
      products,
    };

    const response = await fetch(`${APIURL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      toast.success("La compra fue realizada con exito");
      toast.success("Tu pedido estará listo en 2 días");
      return response.json();
    } else {
      toast.error("Fallo al realizar la compra. Intentelo de nuevo");
      throw new Error("Fallo del servidor");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getOrders (token: string) {
    try {
        const response = await fetch(`${APIURL}/users/orders`,{
            method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              }
        })
        return response.json()
        
    } catch (error: any) {
        throw new Error(error)
    }
}