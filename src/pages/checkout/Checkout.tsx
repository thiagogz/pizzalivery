import { useContext, useEffect, useState } from "react"
import OrderContext from "../../contexts/OrderContext"
import { useNavigate } from "react-router-dom"
import { Layout } from "../../components/layout/Layout"
import { routes } from "../../routes"
import { convertToCurrency } from "../../helpers/convertToCurrency"
import { Title } from "../../components/title/Title"
import { Button } from "../../components/button/Button"
import {
  CheckoutAction,
  CheckoutItem,
  CheckoutItemFlex,
  PaymentMethodGroup,
} from "./Checkout.style"

export default function Checkout() {
  const { pizzaOrder } = useContext(OrderContext)
  const navigate = useNavigate()

  const [paymentType, setPaymentType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentOptions, setPaymentOptions] = useState([])

  const getPaymentOptions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/payment/options")
      const options = await response.json()
      setPaymentOptions(options)
    } catch (error) {
      alert(`Deu ruim: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event) => {
    setPaymentType(event.target.value)
  }

  const getPaymentOptionType = (paymentType: number) => {
    if (!paymentType) return

    const filteredValue = paymentOptions.filter(
      (payment) => payment.value === paymentType
    )

    return filteredValue[0].value
  }

  // const handleClick = () => {
  //   setIsLoading(true)
    
  //   fetch('https://www.api.pizzalivery.com.br/order', {
  //     method: "POST",
  //     body: JSON.stringify(pizzaOrder),
  //   })
  //     .then(() => {
  //       alert("Deu bom")
  //     })
  //     .catch(() => {
  //       console.log("Deu ruim")
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //       console.log("Finalizou")
  //     })
  // }

  // async/await
  const doOrder = async () => {
    setIsLoading(true)

    try{
      const response = await fetch('https://www.api.pizzalivery.com.br/order', 
          {
            method: "POST",
            body: JSON.stringify(pizzaOrder),
          }
        )

        console.log(response)
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  // //  METHODS/VEBS HTTP
  // //  GET: Receber uma informação; √
  // fetch("https://www.api.pizzalivery.com.br/order")

  // const filter = "coca cola"
  // fetch(`https://www.api.pizzalivery.com.br/bebidas=${filter}`)

  // //  POST: Enviar uma informação; √
  // fetch("https://www.api.pizzalivery.com.br/order", {
  //   method: "POST",
  //   body: JSON.stringify(pizzaOrder),
  // })

  // //  PUT: Alterar uma informação; √
  // fetch("https://www.api.pizzalivery.com.br/order", {
  //   method: "PUT",
  //   body: JSON.stringify(pizzaOrder),
  // })

  // //  DELETE: Remover uma informação;
  // const orderID = 12345100;

  // fetch(`https://www.api.pizzalivery.com.br/order/${orderID}`, {
  //   method: "DELETE",
  // })


  useEffect(() => {
    if (pizzaOrder === undefined) {
      return navigate(routes.pizzaSize)
    }
  }, [])

  useEffect(() => {
    getPaymentOptions()
  }, [])

  // ?. nullish -- pode não existir, mas evita a quebra da página. Apresenta um valor nulo, caso não exista

  return (
    <Layout>
      {isLoading ? (
        <>Carregando</>
      ) : (
        <>
          <Title tabIndex={0}>Checkout</Title>
          <CheckoutItem>
            <h2>Items</h2>
            <CheckoutItemFlex>
              <p>
                {pizzaOrder?.item.name} - {pizzaOrder?.item.size}
              </p>
              <p>
                {convertToCurrency(pizzaOrder?.item.value)}
              </p>
            </CheckoutItemFlex>
          </CheckoutItem>
          <CheckoutItem>
            <h2>Forma de Pagamento</h2>
            <CheckoutItemFlex>
              <PaymentMethodGroup>
                <label htmlFor="payments">Selecione a forma de pagamento</label>
                <select name="payments" id="payments" defaultValue={""} onChange={handleChange}>
                  <option disabled value="">Selecione</option>
                    {paymentOptions.map(({ id, value, text}) => (
                    <option key={id} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </PaymentMethodGroup>
              <p>{getPaymentOptionType(Number(paymentType))}</p>
            </CheckoutItemFlex>
          </CheckoutItem>
          <CheckoutItem>
            <CheckoutItemFlex>
              <h2>Total do pedido</h2>
              <p>{convertToCurrency(pizzaOrder?.total)}</p>
            </CheckoutItemFlex>
          </CheckoutItem>
          <CheckoutAction>
            <Button onClick={doOrder} disabled={!Boolean(paymentType)}>Fazer pedido</Button>
          </CheckoutAction>
        </>
      )}
    </Layout>
  ) 
}
