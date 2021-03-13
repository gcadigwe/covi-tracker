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
import Table from "../Table/Table";
import { sortData } from "../../util";
import Linegraph from "../../components/Linegraph/Linegraph";
import Map from "../Map/Map";
import "leaflet/dist/leaflet.css";

function Header() {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCountries, setMapCountries] = useState([]);

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
        const sortedData = sortData(result.data);
        setCountries(Country);
        setTableData(sortedData);
        setMapCountries(result.data);
      });
    };
    getCountries();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      await axios.get("/all").then((result) => {
        setCountryInfo(result.data);
      });
    };
    fetchAll();
  }, []);

  const handleChange = async (e) => {
    const countryCode = e.target.value;
    console.log(countryCode);

    const url =
      countryCode === "worldwide" ? "/all" : `/countries/${countryCode}`;

    await axios.get(url).then((result) => {
      setCountry(countryCode);
      setCountryInfo(result.data);
      setMapCenter([result.data.countryInfo.lat, result.data.countryInfo.long]);
      setMapZoom(8);
    });
  };

  console.log(mapCenter);

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
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="header__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>world wide cases</h3>
          <p>Chart</p>
          <Linegraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default Header;
