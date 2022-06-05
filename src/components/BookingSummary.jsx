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
    const [playerExist, setPlayerExist] = useState(false)

    const handleBooking = (e) => {
        e.preventDefault()
        setButtonClick(buttonClick ? false : true)
    }
    useEffect(()=> {
      setPlayerExist(false)
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
                console.log(oldPlayers)
                if(oldPlayers === undefined){
                  oldPlayers=[];
                }  
                setPlayerExist(false)
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

        const handleDocDelete = async (id, playerQuantity) => {
          if(playerQuantity>0) {
            setPlayerExist(true)
            return
          }
          setPlayerExist(false)
          try{
            await deleteDoc(doc(db, "booking",id))
          } catch(err) {
            console.log(err)
          }
          
        }

        const handleBalance =  (oldPlayers, newPlayers, duration, newPlay, handle) => {
          let prevNum = (duration * 40) / oldPlayers.length
          prevNum = isFinite(prevNum) ? prevNum : 0.00
          let newNum1 = (duration * 40) / (oldPlayers.length-1)
          newNum1 = isFinite(newNum1) ? newNum1 : 0.00
          let newNum2 = (duration * 40) / (oldPlayers.length+1)
          newNum2 = isFinite(newNum2) ? newNum2 : 0.00
          const prevAmount = oldPlayers.length === 0 ? 0 : Math.round((prevNum+ Number.EPSILON)*100)/100;
          const newAmount = newPlayers.length === 0 ? 0 : handle === "remove" ? Math.round((newNum1 + Number.EPSILON)*100)/100 : Math.round((newNum2+ Number.EPSILON)*100)/100
            
          const diff = handle === "add" ? Math.abs(prevAmount-newAmount) : Math.abs(newAmount-prevAmount)

          let testArray = []
          
          if(handle === "add") {
            if(oldPlayers.length === 0) {
              playerData.map((f) => {
                if(f.name === newPlay) {
                  const balance = f.balance - newAmount;
                  testArray.push({id: f.id, name: f.name, balance: balance})
                }
              })
            }
            else {
              let count = 0;
              oldPlayers.map((p)=>{ 
                playerData.map((f)=>{
                  if(f.name === p) {
                    const balance = f.balance + diff 
                    testArray.push({id: f.id, name: f.name, balance: balance})
                  }
                  if(f.name === newPlay && count === 0) {
                    const balance = f.balance - newAmount
                    testArray.push({id: f.id, name: f.name, balance: balance})
                    count++;
                  }
            })
          })
        }
        
      } else {
        if(newPlayers.length === 0) {
          playerData.map((f) => {
            if(f.name === newPlay) {
              const balance = f.balance + prevAmount;
              testArray.push({id: f.id, name: f.name, balance: balance})
            }

          })
        } else {
          let count =0;
          newPlayers.map((p)=>{ 
            playerData.map((f)=>{
              if(f.name === p) {
                const balance = f.balance - diff 
                testArray.push({id: f.id, name: f.name, balance: balance})
              }
              if(f.name === newPlay && count === 0) {
                const balance = f.balance + prevAmount
                testArray.push({id: f.id, name: f.name, balance: balance})
                count++;
              }
        })
      })
        }
        
      }
      console.log(testArray)
      request(testArray)
    }

        const request = (test) => {
          test && test.map((t)=>{
            try {
              const res = updateDoc(doc(db, "players", t.id),{
                balance: t.balance
              })
              
              console.log(res.data())
            } catch (err) {
              console.log(err)
            }
          })
          
        }

  return (
    <div class="flex flex-row w-3/5 sm:flex-col text-center justify-center mx-auto my-0">
      <div class="flex flex-col justify-center my-0 mx-auto">
          <button class="my-0 mx-28" onClick={handleBooking}>Add New Booking</button>
          {buttonClick && <BookingCalender setButtonClick={setButtonClick}/>}
          {playerExist && <p class="bg-midnight">Remove all players first</p>}
          {bookingData && bookingData.map((data)=>(
              <div class="border-solid border-2 border-indigo-600 w-96 p-8 my-2" key={data.id}>
              <Link to={'/editbooking/'+data.id}><button class="font-bold">Edit</button></Link>
              <button class="m-2 font-bold" onClick={()=>handleDocDelete(data.id, data.players.length)}>Delete</button>
                    
                  <p><b>Date: </b>{data.date}</p>
                  <p><b>Start time: </b>{data.startTime}</p>
                  <p><b>Duration: </b>{data.duration}</p>
                  <div class="text-left">Players: {data.players && data.players.map((player, index, key)=>(
                      <div class="flex items-center" id={key}>
                          <Player>{index+1}. {player}</Player>
                          <button class="m-1" onClick={()=>handlePlayerDelete(data.id, data.players, player, data.duration)}>
                              <RemoveCircleIcon />
                              Remove
                          </button>
                      </div>
                    ))}
                    
                  </div>
                  
                  <label>Add a player: </label>
                  <PlayerSelect onChange={((e)=>setNewPlayer(e.target.value))}>
                          <option value="" selected disabled hidden>Choose a player</option>
                  {playerData.map((data)=>(
                          <option value={data.name}>{data.name}</option> 
                              
                  ))}
                  
                  </PlayerSelect>
                  <button onClick={()=>handleAdd(data.id, data.players, data.duration)}>ADD</button>
                  
              </div>
          ))}
          
          
      </div>
      <div class="">
        <BalanceAmount/>
      </div>
    </div>
  )
}

export default BookingSummary