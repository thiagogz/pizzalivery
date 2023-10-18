import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/button/Button";
import { Title } from "../../components/title/Title";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useContext, useEffect, useState } from "react";
import OrderContext from "../../contexts/OrderContext";

import { convertToCurrency } from "../../helpers/convertToCurrency";

import {
  FlavourActionWrapper,
  FlavourCard,
  FlavourCardDescription,
  FlavourCardImage,
  FlavourCardPrice,
  FlavourCardTitle,
  FlavourContentWrapper,
} from "./Flavours.style"

export default function Flavours() {
  const navigate = useNavigate()
  const { pizzaSize, pizzaFlavour, setPizzaFlavour} = useContext(OrderContext)
  const [ flavourId, setFlavourId ] = useState("")
  const [ pizzaFlavoursOptions, setPizzaFlavoursOptions ] = useState([])
  const [ isLoading, setIsLoading] = useState(false)

  const getFlavoursOptions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/pizza/flavours")
      const options = await response.json()
      setPizzaFlavoursOptions(options)
    } catch (error) {
      alert(`Deu ruim: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getPizzaFlavour = (id:string) => {
    return pizzaFlavoursOptions.filter((flavour) => flavour.id === id)
  }

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlavourId(event.target.id)
  }

  const handleBack = () => {
    navigate(routes.pizzaSize)
  }

  const handleNext = () => {
    const selectedFlavour = getPizzaFlavour(flavourId)
    setPizzaFlavour(selectedFlavour)
    navigate(routes.summary)
  }

  useEffect(() => {
    if (!pizzaFlavour) return
    
    setFlavourId(pizzaFlavour[0].id)
  }, [])

  useEffect(() => {
    getFlavoursOptions()
  }, [])

  return (
    <Layout>
      <Title tabIndex={0}>Agora escolha o sabor da sua pizza</Title>
      { isLoading ? (
        <FlavourContentWrapper>
          <Title>Carregando...</Title>
        </FlavourContentWrapper>
      ) : (
      <FlavourContentWrapper>
        {pizzaFlavoursOptions.map(({ id, image, name, description, price }) => (
          <FlavourCard key={id} selected={id === flavourId ? true : false}>
            <FlavourCardImage  src={image} alt={name} width="200px" />
            <FlavourCardTitle>{name}</FlavourCardTitle>
            <FlavourCardDescription>{description}</FlavourCardDescription>
            <FlavourCardPrice>
              {convertToCurrency(price[pizzaSize[0].slices])}
            </FlavourCardPrice>
            <Button id={id} onClick={handleClick}>
              Selecionar
            </Button>
          </FlavourCard>
        ))}
      </FlavourContentWrapper>
      )}      
      <FlavourActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Seguir para o resumo</Button>
      </FlavourActionWrapper>
    </Layout>
  )
}
