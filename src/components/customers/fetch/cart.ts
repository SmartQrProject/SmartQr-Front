
const APIURL = process.env.NEXT_PUBLIC_API_URL;


export async function getOrdersById (token: string, id: string, slug: string) {
    try {
        const response = await fetch(`${APIURL}/${slug}/customers/${id}`,{
         method: "GET",
         headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });
        return response.json()
        
    } catch (error: any) {
        throw new Error(error)
    }
}