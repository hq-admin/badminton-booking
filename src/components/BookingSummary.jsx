import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import styled from 'styled-components'
import {
    collection,
    query,
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
import BalanceAmount from './BalanceAmount';
import { style } from '@mui/system';

const Summary = styled.div`
  display: flex;
`
const PlaySummary = styled.div`
  flex: 3;
`
const BalanceSummary = styled.div`
  flex: 1;
`

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
    const [newPlayer, setNewPlayer] = useState(" ")
    const [duplicatePlayer, setDuplicatePlayer] = useState(false)
    const [newBalance, setNewBalance] = useState({})
    const [updPlayerInfo, setUpdPlayerInfo] = useState([])

    const handleBooking = (e) => {
        e.preventDefault()
        setButtonClick(buttonClick ? false : true)
    }
    useEffect(()=> {
        const unsub = onSnapshot(query(
            collection(db, "booking")),
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

            const handlePlayerDelete =  async (id, oldPlayers, player, duration) => {
              const newPlayers = oldPlayers.reduce((r, v) => v !== player ? r.concat(v): r, []);

                try {
                  const res = await updateDoc(doc(db, "booking", id),{
                    players: newPlayers
                  })
                  handleBalance(oldPlayers, newPlayers, duration, player, "remove")
                } catch (err) {
                  console.log(err);
                }
                
              };

              const handleAdd = async (id, oldPlayers, duration) => {
                
                const duplicateFound = oldPlayers && oldPlayers.find(p => p === newPlayer)
                if(duplicateFound) {
                  setDuplicatePlayer(true)
                  return
                } 
                const newPlayers = oldPlayers ? oldPlayers.concat(newPlayer) : [newPlayer]

                try {
                  const res = await setDoc(doc(db, "booking", id), {
                    players: newPlayers,
                  },
                  {
                    merge: true
                  })
                  handleBalance(oldPlayers, newPlayers, duration, newPlayer, "add")
                } catch (err) {
                  console.log(err)
                }
              }

        const handleDocDelete = async (id) => {
          try{
            await deleteDoc(doc(db, "booking",id))
          } catch(err) {
            console.log(err)
          }
          
        }

        const handleBalance =  (oldPlayers, newPlayers, duration, newPlay, handle) => {
          const prevAmount = parseFloat(((duration * 40) / oldPlayers.length).toFixed(2));
          const newAmount = handle === "remove" ? parseFloat(((duration * 40) / (oldPlayers.length-1)).toFixed(2)) : parseFloat(((duration * 40) / (oldPlayers.length+1)).toFixed(2))
          const diff = handle === "add" ? prevAmount-newAmount : newAmount-prevAmount

          let testArray = []
          let c=0;

          handle === "add" ? oldPlayers.map((p)=>{ 
            playerData.map((f)=>{
              if(f.name === p) {

                const name = f.name
                const plaBalance = handle === "add" ? parseFloat(f.balance.toFixed(2)) + diff : parseFloat(f.balance.toFixed(2)) - diff
               
                testArray.push({name: name, balance: plaBalance})
                
                
              
              }
              else if((f.name === newPlay) && (c===0)) {
                c=1;
                const placBalance = handle === "add" ? parseFloat(f.balance.toFixed(2)) - prevAmount : parseFloat(f.balance.toFixed(2)) + prevAmount;
                const name = f.name
                
                testArray.push({name: name, balance: placBalance})
              }
            })
          }) 
          
          :

          newPlayers.map((p)=>{ 
            playerData.map((f)=>{
              if(f.name === p) {

                const name = f.name
                const id = f.id
                const plaBalance = handle === "add" ? parseFloat(f.balance.toFixed(2)) + diff : parseFloat(f.balance.toFixed(2)) - diff
               
                testArray.push({name: name, balance: plaBalance, id: id})
                //request(name, plaBalance, id)
                
              }
              else if((f.name === newPlay) && (c===0)) {
                c=1;
                const placBalance = handle === "add" ? parseFloat(f.balance.toFixed(2)) - prevAmount : parseFloat(f.balance.toFixed(2)) + prevAmount;
                const name = f.name
                
                testArray.push({name: name, balance: placBalance, id: f.id})
                //request(name, placBalance, f.id)
              }
            })
          })
          request(testArray)
          //console.log(testArray)
        }

        const request = (test) => {
          
          test && test.map((t)=>{
            try {
              const res = setDoc(doc(db, "players", t.id), {
                name: t.name, balance: t.balance
              },
              {
                merge: true
              })
              console.log(res.data())
            } catch (err) {
              console.log(err)
            }
          })
          
        }

  return (
    <Summary>
      <PlaySummary>
      
          <button onClick={handleBooking}>Add Booking</button>
          {buttonClick && <BookingCalender setButtonClick={setButtonClick}/>}
          {bookingData && bookingData.map((data)=>(
              <Booking key={data.id}>
              <Link to={'/editbooking/'+data.id}><button>Edit</button></Link>
              <button onClick={()=>handleDocDelete(data.id)}>Delete</button>
                  <h3>{data.date}</h3>
                  <h3>Start time: {data.startTime}</h3>
                  <h4>Duration: {data.duration}</h4>
                  <Players>Players: {data.players && data.players.map((player, index, key)=>(
                      <PlayerList id={key}>
                          <Player>{index+1}. {player}</Player>
                          <Remove onClick={()=>handlePlayerDelete(data.id, data.players, player, data.duration)}>
                              <RemoveCircleIcon />
                              Remove
                          </Remove>
                      </PlayerList>
                    ))}
                    
                  </Players>
                  
                  <label>Add a player: </label>
                  <PlayerSelect onChange={((e)=>setNewPlayer(e.target.value))}>
                          <option value="" selected disabled hidden>Choose a player</option>
                  {playerData.map((data)=>(
                          <option value={data.name}>{data.name}</option> 
                              
                  ))}
                  
                  </PlayerSelect>
                  <button onClick={()=>handleAdd(data.id, data.players, data.duration)}>ADD</button>
                  
              </Booking>
          ))}
          
          
      </PlaySummary>
      <BalanceSummary>
        <BalanceAmount/>
      </BalanceSummary>
    </Summary>
  )
}

export default BookingSummary