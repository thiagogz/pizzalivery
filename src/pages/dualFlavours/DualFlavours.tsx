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
} from "../flavours/Flavours.style"

export default function DualFlavours() {
  const navigate = useNavigate()
  const { pizzaSize, pizzaFlavour, setPizzaFlavour} = useContext(OrderContext)
  const [ selectedFlavourIds, setSelectedFlavourIds ] = useState([])
  const [ pizzaFlavoursOptions, setPizzaFlavoursOptions ] = useState([])
  const [ isLoading, setIsLoading] = useState(false)

  const isFlavourSelected = (id) => selectedFlavourIds.includes(id);

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
    const clickedFlavourId = event.target.id;
    setSelectedFlavourIds(previousIds => {
      if (previousIds.includes(clickedFlavourId)) {
        return previousIds.filter(id => id !== clickedFlavourId);
      } else {
        if (previousIds.length === 2) {
          previousIds.shift();
        }
        return [...previousIds, clickedFlavourId];
      }
    })
  }

  const handleBack = () => {
    navigate(routes.pizzaSize)
  }

  const handleNext = () => {
    if (selectedFlavourIds.length === 2) {
      const selectedFlavours: Array<PizzaFlavourType> = selectedFlavourIds.map(id => {
        const flavour = getPizzaFlavour(id)[0];
        return {
          id: flavour.id,
          image: flavour.image,
          name: flavour.name,
          description: flavour.description,
          price: { ...flavour.price },
        };
      });
      setPizzaFlavour(selectedFlavours);
      navigate(routes.summary);
    } else {
      alert("Selecione 2 sabores para continuar.")
    }
  }

  useEffect(() => {
    if (!pizzaFlavour) return
    
    if (selectedFlavourIds.length > 0) {
      const selectedFlavours = selectedFlavourIds.map(id => getPizzaFlavour(id))
      setPizzaFlavour(selectedFlavours)
    }
  }, [])

  useEffect(() => {
    getFlavoursOptions()
  }, [])

  return (
    <Layout>
      <Title tabIndex={0}>Agora escolha os 2 sabores da sua pizza</Title>
      { isLoading ? (
        <FlavourContentWrapper>
          <Title>Carregando...</Title>
        </FlavourContentWrapper>
      ) : (
        <FlavourContentWrapper>
        {pizzaFlavoursOptions.map(({ id, image, name, description, price }) => (
          <FlavourCard key={id} selected={isFlavourSelected(id)}>
            <FlavourCardImage  src={image} alt={name} width="200px" />
            <FlavourCardTitle>1/2 {name}</FlavourCardTitle>
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
