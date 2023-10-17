import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/button/Button";
import { Title } from "../../components/title/Title";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useContext, useEffect, useState } from "react";
import OrderContext from "../../contexts/OrderContext";

import Mussarela from "../../assets/pizza-flavours/mucarela.png"
import ChickenWithCheese from "../../assets/pizza-flavours/frango-catupiry.png"
import Margherita from "../../assets/pizza-flavours/margherita.png"
import Lusa from "../../assets/pizza-flavours/portuguesa.png"

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
  const [selectedFlavourIds, setSelectedFlavourIds] = useState([])

  const isFlavourSelected = (id) => selectedFlavourIds.includes(id);

  const flavoursOptions = [
    {
      id: "10",
      image: Mussarela,
      name: "Mussarela",
      description:
        "Muçarela especial fresca, finalizada com orégano e azeitonas portuguesas.",
      price: {
        "8": 71,
        "4": 35.5,
        "1": 18,
      },
    },
    {
      id: "11",
      image: ChickenWithCheese,
      name: "Frango com catupiry",
      description:
        "Peito de frango cozido, desfiado e refogado em azeite de oliva e temperos naturais, anéis de cebola sobre base de muçarela especial, bacon em cubos e Catupiry® gratinado. É finalizada com orégano.",
      price: {
        "8": 95,
        "4": 47.5,
        "1": 24,
      },
    },
    {
      id: "12",
      image: Margherita,
      name: "Margherita",
      description:
        "Muçarela especial, muçarela de búfala rasgada, fatias de tomate finalizada com folhas de manjericão orgânico e um fio de azeite aromatizado.",
      price: {
        "8": 90,
        "4": 45,
        "1": 22.5,
      },
    },
    {
      id: "13",
      image: Lusa,
      name: "Portuguesa",
      description:
        "Clássica pizza, leva presunto magro, cebola, palmito e ervilha sobre base de muçarela fresca. Finalizada com cobertura de ovos, orégano e azeitonas portuguesas. ",
      price: {
        "8": 93,
        "4": 46.5,
        "1": 23.5,
      },
    },
  ]

  const getPizzaFlavour = (id:string) => {
    return flavoursOptions.filter((flavour) => flavour.id === id)
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

  return (
    <Layout>
      <Title tabIndex={0}>Agora escolha os 2 sabores da sua pizza</Title>
      <FlavourContentWrapper>
        {flavoursOptions.map(({ id, image, name, description, price }) => (
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
      <FlavourActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Seguir para o resumo</Button>
      </FlavourActionWrapper>
    </Layout>
  )
}
