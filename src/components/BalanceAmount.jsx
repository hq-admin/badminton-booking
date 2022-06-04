import React, { useEffect, useState } from 'react'
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

const BalanceAmount = () => {
    const [balanceData, setBalanceData] = useState([]);

    useEffect(()=> {
        const unsub = onSnapshot(query(
            collection(db, "players")),
            (snapShot) => {
              let list = [];
              snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
              });
              setBalanceData(list);
              console.log(list)
              
            },
            (error) => {
              console.log(error);
            }
          );
      
          return () => {
            unsub();
          };
        }, []);

  return (
    <div>
        <h3>Balance</h3>
        {balanceData.map((data)=> (
            <p><b>{data.name}:</b> ${data.balance}</p>
        ))}
    </div>
  )
}

export default BalanceAmount