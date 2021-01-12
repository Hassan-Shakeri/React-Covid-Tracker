import React, { useState, useEffect } from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core"
import InfoBox from "./InfoBox";
import Map from "./Map"
import Table from './Table';
import { prettyPrintStat, sortData } from "./util";
import LineGragh from './LineGragh';
import "leaflet/dist/leaflet.css";
import logo from './logo.png';




function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry ] = useState("worldwide");
  const [countryInfo, setCountryInfo ] = useState({});
  const [tableData, setTableData ] = useState([]);
  const [mapCenter, setMapCenter ] = useState({lat:34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom ] = useState(3);
  const [mapCountries, setMapCountries] = useState ([])
  const [casesType, setCasesType] = useState ("cases")

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    })

  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    let countryCode = event.target.value;

    let url =
      countryCode === 'worldwide'
        ? "https://disease.sh/v3/covid-19/all" 
        :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);

        setCountryInfo(data);
        let mapObj = countryCode === "worldwide" ? { lat: 34.80746, lng: -40.4796 } : { lat: data.countryInfo.lat, lng: data.countryInfo.long };
        setMapCenter(mapObj);
        setMapZoom(4);
      })
  };

  console.log("country INFO ...", countryInfo)


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}>
                <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isRed active ={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="CoronaVirus New Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox isGreen active ={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox isBlack active ={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGragh className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
