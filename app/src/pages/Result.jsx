import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router';
import { AwesomeButton } from 'react-awesome-button';
import { backgroundStyle } from './Landing'
import {useNavigate} from 'react-router-dom';

export default function Result({
    process, 
    year,
    selectCounty,
    selectState,
}) {
    let location = useLocation();
    const { data } = location.state;
    const navigate = useNavigate();
    const [score, setScore] = useState(810)
    const [tax, setTax] = useState(20000.00)
    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('../dashboard', { state: {result:"abc"}, replace: false })
    }

    const locationInfo = ((selectCounty != null) ? selectCounty + ', ' : '') + ((selectState != null) ? selectState : '')
    const headerInfo = year != null ? 
        ((process === 'Predict' ? 'Predicted Carbon Score for the year ' + year.toString() : 'Existing Carbon Score for the year ' + year.toString()) + ' in ' + locationInfo) 
        : 'Carbon Score'


    useEffect(() => {
        fetch(
            "http://carbon-score.us-west-1.elasticbeanstalk.com/score" + 
            (selectState != null && selectState != '' ? `?state=${selectState}` : '') +
            (selectCounty != null && selectCounty != '' ? `&county=${selectCounty}` : '')
        )
        .then(response => {
          response.json().then(data => {
            setScore(data.score)
            setTax(data.tax)
          })
        })
        .catch(err => console.log(err))
      }, [])

    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {headerInfo}
                </p>
                <h1>
                    {score}
                </h1>
            </header>
            <div>
                <h2>{'$' + tax}</h2>
            </div>
            <br />
            <AwesomeButton onPress={handleGetData}>Dashboard</AwesomeButton>
        </div>
    )
}
