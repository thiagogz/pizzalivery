import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import OrderContext from "../../contexts/OrderContext";

import { Button } from "../../components/button/Button";
import { Layout } from "../../components/layout/Layout";
import { Title } from "../../components/title/Title";
import { convertToCurrency } from "../../helpers/convertToCurrency";
import {
  SummaryActionWrapper,
  SummaryAmount,
  SummaryContentWrapper,
  SummaryDescription,
  SummaryDetails,
  SummaryImage,
  SummaryPrice,
  SummaryTitle,
} from "./Summary.style"
import { routes } from "../../routes";

export default function Summary() {
  const navigate = useNavigate()
  
  const { pizzaSize, pizzaFlavour, setPizzaOrder } = useContext(OrderContext)
  const [ summaryData, setSummaryData ] = useState({})
  const [ summaryAmount, setSummaryAmount ] = useState(0)

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = () => {
    const payload = {
      item: {
        name: summaryData.name,
        image: summaryData.image,
        size: summaryData.text,
        slices: summaryData.slices,
        value: summaryData.price,
      },
      total: summaryAmount,
    }

    setPizzaOrder(payload)
    navigate(routes.checkout)
  }
  
  const handleNewOrder = () => {
    navigate(routes.pizzaSize)
  }

  useEffect(() => {
    if (!pizzaFlavour) {
      return navigate(routes.pizzaFlavour)
    }

    if (!pizzaSize) {
      return navigate(routes.home)
    }

    if (Array.isArray(pizzaFlavour) && pizzaFlavour.length === 2) {
      const [flavour1, flavour2] = pizzaFlavour
      const totalPrice = Math.max(flavour1?.price?.[pizzaSize[0].slices], flavour2?.price?.[pizzaSize[0].slices])

      setSummaryData({
        text: pizzaSize[0].text,
        slices: pizzaSize[0].slices,
        name: `1/2 ${flavour1.name} e 1/2 ${flavour2.name}`,
        price: totalPrice,
        image: flavour1.image
      })
    } else if (Array.isArray(pizzaFlavour) && pizzaFlavour.length === 1) {
      const [flavour1] = pizzaFlavour
      
      setSummaryData({
        text: pizzaSize[0].text,
        slices: pizzaSize[0].slices,
        name: flavour1.name,
        price: flavour1.price[pizzaSize[0].slices],
        image: flavour1.image
      })
    }
  }, [])

  useEffect(() => {
    setSummaryAmount(summaryData.price)
  }, [summaryData])
  
  return (
    <Layout>
      <Title tabIndex={0}>Resumo do pedido</Title>
      <SummaryContentWrapper>
        <SummaryDetails>
          <SummaryImage  src={summaryData.image} alt="" width="200px"/>
          <SummaryTitle>{summaryData.name}</SummaryTitle>
          <SummaryDescription>{summaryData.text}, {`${summaryData.slices} pedaços`}</SummaryDescription>
          <SummaryPrice>
            {convertToCurrency(summaryData.price)}
          </SummaryPrice>
        </SummaryDetails>
        <SummaryAmount>
          <SummaryPrice>{convertToCurrency(summaryAmount)}</SummaryPrice>
        </SummaryAmount>
      </SummaryContentWrapper>
      <SummaryActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNewOrder}>Adicionar uma nova Pizza</Button>
        <Button onClick={handleNext}>Ir para o pagamento</Button>
      </SummaryActionWrapper>
    </Layout>
  )
}
