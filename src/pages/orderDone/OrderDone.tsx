import { Layout } from "../../components/layout/Layout"
import { Title } from "../../components/title/Title";
import OrderContext from "../../contexts/OrderContext";
import { HomeWrapper } from "../home/Home.style"
import { useContext, useEffect, useState } from "react"

export default function OrderDone() {
  const [ isLoading, setIsLoading] = useState(true);
  const { orderInformation } = useContext(OrderContext)

  useEffect(() => {
    if (orderInformation != null) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [orderInformation])
  
  return (
    <Layout>
      { isLoading ? (
        <HomeWrapper>
          <Title>Carregando...</Title>
        </HomeWrapper>
      ) : (
        <HomeWrapper>
          <Title>{orderInformation.message}</Title>
          <h2>Número do seu pedido: {orderInformation.orderId}</h2>
          <h2>Horário do pedido: {new Date(orderInformation.created_at).toLocaleString()}</h2>
        </HomeWrapper>
        )}
    </Layout>
  )
}
