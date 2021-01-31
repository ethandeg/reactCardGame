import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import Card from "./Card"

const DeckOfCards = () => {
    const [cards, setCards] = useState([])
    const [deck, setDeck] = useState({})
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null);
    useEffect(() => {
        const getNewDeck = async() =>{
            const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            setDeck(res.data)
            
        }
        getNewDeck()
    },[])
    const getNewCard = async() => {
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)
            setCards(cards => [...cards, res.data.cards[0]])
        } catch(e){
            alert("You are all out of cards")
            return
        }

    }
    useEffect(() => {
        const getCard = async () => {
            try {
                let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)
                if (res.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error("no cards remaining!");
                  }
                setCards(cards => [...cards, res.data.cards[0]])
            } catch (e) {
                alert(e)
            }

        }
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
              await getCard();
            }, 1000);
          }
      
          return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
          };

        
    }, [autoDraw, setAutoDraw, deck])

    

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };
    
      const cardPlaces = cards.map(c => (
        <Card key={c.id} image={c.image} />
      ));
    
      return (
        <div className="Deck">
          {deck ? (
            <button className="Deck-gimme" onClick={toggleAutoDraw}>
              {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
            </button>
          ) : null}
          <div className="Deck-cardarea">{cardPlaces}</div>
        </div>
      );
    }



export default DeckOfCards