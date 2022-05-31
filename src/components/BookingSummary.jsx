import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
import BookingCalender from './BookingCalender';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Booking = styled.div`
    border: 2px solid black;
    width: 50%;
    margin: 10px 0;
    padding: 10px;
`

const Players = styled.div`
    text-align: start;
`
const Player = styled.p`
    margin: 5px 0;
    
`
const PlayerList = styled.div`
    display: flex;
    align-items: center;
`
const Remove = styled.button`
    margin-left: 5px;
    font-size: small;
    border-radius: 0;
    display: flex;
    align-items: center;
`
const PlayerSelect = styled.select`
  padding: 10px;
`

const BookingSummary = () => {
    const [bookingData, setBookingData] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const [buttonClick, setButtonClick] = useState(false)
    const [newPlayer, setNewPlayer] = useState("")

    const handleBooking = (e) => {
        e.preventDefault()
        setButtonClick(buttonClick ? false : true)
    }
    useEffect(()=> {
        const unsub = onSnapshot(
            collection(db, "booking"),
            (snapShot) => {
              let list = [];
              snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
              });
              setBookingData(list);
              
            },
            (error) => {
              console.log(error);
            }
          );
      
          return () => {
            unsub();
          };
        }, []);
    
        useEffect(()=> {
            const unsub = onSnapshot(
                collection(db, "players"),
                (snapShot) => {
                  let players = [];
                  snapShot.docs.forEach((doc) => {
                    players.push({ id: doc.id, ...doc.data() });
                  });
                  setPlayerData(players);
                  
                },
                (error) => {
                  console.log(error);
                }
              );
          
              return () => {
                unsub();
              };
            }, []);

            const handleDelete =  async (id, oldPlayers, player) => {
              const newPlayers = oldPlayers.reduce((r, v) => v !== player ? r.concat(v): r, []);

                try {
                  const res = await updateDoc(doc(db, "booking", id),{
                    players: [newPlayers]
                  })
                  console.log(res.data())
                } catch (err) {
                  console.log(err);
                }
                
              };

              const handleAdd = async (id, oldPlayers) => {
                const newPlayers = oldPlayers.push(newPlayer)
                try {
                  const res = await updateDoc(doc(db, "booking", id), {
                    players: [newPlayers]
                  })
                  
                } catch (err) {
                  console.log(err)
                }
              }

  return (
    <div>
        <button onClick={handleBooking}>Add Booking</button>
        {buttonClick && <BookingCalender setButtonClick={setButtonClick}/>}
        {bookingData && bookingData.map((data)=>(
            <Booking key={data.id}>
                <h3>{data.date}</h3>
                <Players>Players: {data.players && data.players.map((player, index, key)=>(
                    <PlayerList id={key}>
                        <Player>{index+1}. {player}</Player>
                        <Remove onClick={()=>handleDelete(data.id, data.players, player)}>
                            <RemoveCircleIcon />
                            Remove
                        </Remove>
                    </PlayerList>
        ))}
                </Players>
                <label>Add a player: </label>
                <PlayerSelect onChange={((e)=>setNewPlayer(e.target.value))}>
                {playerData.map((data)=>(
                        <option value={data.name}>{data.name}</option>      
                ))}
                </PlayerSelect>
                <button onClick={handleAdd(data.id, data.players)}>ADD</button>
            </Booking>
        ))}
        
        
    </div>
  )
}

export default BookingSummary