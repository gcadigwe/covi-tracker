import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./Header.css";
import axios from "../../axios/axios";

function Header() {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountry] = useState('Worldwide')

  useEffect(() => {
    const getCountries = async () => {
      await axios.get("/countries").then(result => {
          console.log(result)
          const Country =  result.data.map(data => ([{
          name: data.country,
          value: data.countryInfo.iso2
      }]))
      setCountries(Country)
      })
      
    };
    getCountries();
  }, []);

  const handleChange = async (e) => {
      const countryCode = e.target.value;
      console.log(countryCode)
      setCountry(countryCode)
  }

//   console.log("COUNTRIES >>>",countries && countries[0].[0].value)
//   console.log("COUNTRIES2 >>>",countries && countries)

  return (
    <div className="header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" value={countryName} onChange={handleChange}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map(country => (
              <MenuItem key={country.[0].name} value={country.[0].value}>{country.[0].name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Header;
