import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import styled from 'styled-components';
import {
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase";

const BookingPage = styled.div`
  border: 2px solid black;
  padding: 20px;
  width: 50%;
`

const Duration = styled.select`
  padding: 10px;
`

const EditBooking = () => {
    const location = useLocation()
    const id = location.pathname.split("/")[2]
    console.log(id)
    const navigate = useNavigate()

    const [value, setValue] = useState(new Date());
    const [duration, setDuration] = useState(1)
    const [bookingData, setBookingData] = useState({});
 
    useEffect(()=> {
        
        try{
            const unsub = onSnapshot(
                doc(db, "booking", id),
                (snapShot) => {
                  setBookingData(snapShot.data());
                  console.log(bookingData)
                },
                
                (error) => {
                  console.log(error);
                }
              );
              console.log(bookingData)
              setValue(bookingData.rawTime)
              return () => {
                unsub();
                
              };
        } catch(err) {
            console.log(err)
        }
        
        }, []);

    const handleAdd = async () => {
      const v = value._d.toString().split(" ")
      const date = v.slice(0,3).toString()
      const time = v[4]
      console.log(date)
      console.log(time)
      
      try {
        const res = await addDoc(collection(db, "booking"),{
          duration,
          startTime: time,
          date
        })
        
      } catch (err) {
        console.log(err);
      }

      navigate('/')
      
    }

  return (
    <BookingPage>
    <p>{}</p> 
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Play time"
                value={value}
                onChange={(newValue) => {
                setValue(newValue);
                }}
            />
        </LocalizationProvider>
        <div>
        <label>Duration</label>
        <Duration value={bookingData.duration} name='duration' id='duration' onChange={(e)=>setDuration(e.target.value)}>
            <option value="" selected disabled hidden>Duration</option>
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
        </Duration>
        </div>
        <button onClick={()=>handleAdd()}>Save</button>
        
    </BookingPage>
  )
}

export default EditBooking