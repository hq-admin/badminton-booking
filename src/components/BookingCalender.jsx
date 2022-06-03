import React, { useState } from 'react'
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

const BookingCalender = ({setButtonClick}) => {  
    const [value, setValue] = useState(new Date());
    const [duration, setDuration] = useState(1)
 
    const handleAdd = async () => {
      const v = value._d.toString().split(" ")
      const date = v.slice(0,3).toString()
      const time = v[4]
      console.log(value)
      
      
      try {
        const res = await addDoc(collection(db, "booking"),{
          duration,
          startTime: time,
          date,
          rawTime: value._d
        })
        
      } catch (err) {
        console.log(err);
      }

      setButtonClick(false)
    }
  return (
    <div>   
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
          <label  class="p-2">Duration</label>
          <select class="p-3" name='duration' id='duration' onChange={(e)=>setDuration(e.target.value)}>
            <option class="p-3" value="" selected disabled hidden>Duration</option>
            <option class="p-3" value={1}>1 hour</option>
            <option class="p-3" value={2}>2 hours</option>
          </select>
        </div>
        <button onClick={()=>handleAdd()}>Add</button>
        <button onClick={()=>setButtonClick(false)}>Close</button>
    </div>
  )
}

export default BookingCalender