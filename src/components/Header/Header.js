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
import Infobox from "../InfoBoxs/Infobox";

function Header() {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      await axios.get("/countries").then((result) => {
        console.log(result);
        const Country = result.data.map((data) => [
          {
            name: data.country,
            value: data.countryInfo.iso2,
          },
        ]);
        setCountries(Country);
      });
    };
    getCountries();
  }, []);

  const handleChange = async (e) => {
    const countryCode = e.target.value;
    console.log(countryCode);

    const url =
      countryCode === "worldwide" ? "/all" : `/countries/${countryCode}`;

    await axios.get(url).then((result) => {
      setCountry(countryCode);
      setCountryInfo(result.data);
    });
  };

  console.log(countryInfo);

  //   console.log("COUNTRIES >>>",countries && countries[0].[0].value)
  //   console.log("COUNTRIES2 >>>",countries && countries)

  return (
    <div className="header">
      <div className="header__left">
        <div className="header__dropdown">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={countryName}
              onChange={handleChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country[0].name} value={country[0].value}>
                  {country[0].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="header__infobox">
          <Infobox
            title="coronavirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <Infobox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <Infobox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
      </div>
      <Card className="header__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <h3>world wide cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default Header;
