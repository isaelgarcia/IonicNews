import {IonButton, IonInput, IonSelect, IonSelectOption, IonPage, IonTitle, IonToolbar, IonHeader, IonSearchbar, } from "@ionic/react";
import { getStorageInstance } from "../storage";
import React, { useEffect, useRef, useState } from "react";
import "./Tab1.css";

function Tab1() {
  const currencyElementOne = useRef<HTMLIonSelectElement | null>(null);
  const currencyElementTwo = useRef<HTMLIonSelectElement | null>(null);
  const amountElementOne = useRef<HTMLIonInputElement | null>(null);
  const amountElementTwo = useRef<HTMLIonInputElement | null>(null);
  const rateElement = useRef<HTMLDivElement | null>(null);
  const swapButton = useRef<HTMLIonButtonElement | null>(null);
  const convertButton = useRef<HTMLIonButtonElement | null>(null);

  interface Conversion {
    from: string;
    to: string;
    amount: number;
    rate: number;
    convertedAmount: string;
    date: string;
  }

  const isOnline = () => {
    console.log(`Conexão online: ${navigator.onLine}`);
    return navigator.onLine;
  };

  const saveRates = async (base: string, rates: object) => {
    const storage = getStorageInstance();
    await storage.set(`rates-${base}`, {
      date: new Date().toISOString(),
      rates,
    });
    console.log(`Taxas salvas para ${base}:`, rates);
  };

  const getStoredRates = async (base: string) => {
    const storage = getStorageInstance();
    const data = await storage.get(`rates-${base}`);
    console.log(`Taxas armazenadas para ${base}:`, data);
    return data?.rates;
  };

  const calculate = async () => {
    const currencyOne = currencyElementOne.current?.value;
    const currencyTwo = currencyElementTwo.current?.value;

    if (!currencyOne || !currencyTwo || !amountElementOne.current) return;

    const inputElement = await amountElementOne.current.getInputElement();
    const amountOne = inputElement.value;

    if (!amountOne) return;

    let rate;

    if (isOnline()) {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${currencyOne}`
      );
      const data = await response.json();
      rate = data.rates[currencyTwo];
      await saveRates(currencyOne, data.rates);
    } else {
      console.log(`Tentando usar taxas armazenadas para ${currencyOne}`);
      const storedRates = await getStoredRates(currencyOne);
      if (storedRates) {
        rate = storedRates[currencyTwo];
      } else {
        console.log("Nenhuma taxa armazenada encontrada");
      }
    }

    if (!rate) {
      console.error("Rate not found");
      return;
    }

    if (rateElement.current) {
      rateElement.current.innerText = `1 ${currencyOne} = ${rate} ${currencyTwo}`;
    }
    if (amountElementTwo.current) {
      amountElementTwo.current.getInputElement().then((input) => {
        input.value = (parseFloat(amountOne) * rate).toFixed(2);
      });
    }

    const newConversion: Conversion = {
      from: currencyOne,
      to: currencyTwo,
      amount: parseFloat(amountOne),
      rate,
      convertedAmount: (parseFloat(amountOne) * rate).toFixed(2),
      date: new Date().toISOString(),
    };

    const storage = getStorageInstance();
    const history = (await storage.get("conversionHistory")) || [];
    history.push(newConversion);
    await storage.set("conversionHistory", history);

    console.log("Conversão salva:", newConversion);
  };

  const swapCurrencies = () => {
    const temp = currencyElementOne.current?.value;
    if (currencyElementOne.current && currencyElementTwo.current && temp) {
      currencyElementOne.current.value = currencyElementTwo.current.value;
      currencyElementTwo.current.value = temp;
    }
  };

  useEffect(() => {
    if (swapButton.current) {
      swapButton.current.addEventListener("click", swapCurrencies);
    }
    if (convertButton.current) {
      convertButton.current.addEventListener("click", calculate);
    }

    return () => {
      if (swapButton.current) {
        swapButton.current.removeEventListener("click", swapCurrencies);
      }
      if (convertButton.current) {
        convertButton.current.removeEventListener("click", calculate);
      }
    };
  }, []);

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Conversão</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="container">
        <div className="currency">
          <IonInput type="number" 
          ref={amountElementOne} 
          placeholder="Digite o valor para conversão!" />

          <IonSelect ref={currencyElementOne} 
          id="currency-one" 
          value="BRL">
            
            <IonSelectOption value="AED">AED</IonSelectOption>
            <IonSelectOption value="ARS">ARS</IonSelectOption>
            <IonSelectOption value="AUD">AUD</IonSelectOption>
            <IonSelectOption value="BGN">BGN</IonSelectOption>
            <IonSelectOption value="BRL">BRL</IonSelectOption>
            <IonSelectOption value="BSD">BSD</IonSelectOption>
            <IonSelectOption value="CAD">CAD</IonSelectOption>
            <IonSelectOption value="CHF">CHF</IonSelectOption>
            <IonSelectOption value="CLP">CLP</IonSelectOption>
            <IonSelectOption value="CNY">CNY</IonSelectOption>
            <IonSelectOption value="COP">COP</IonSelectOption>
            <IonSelectOption value="CZK">CZK</IonSelectOption>
            <IonSelectOption value="DKK">DKK</IonSelectOption>
            <IonSelectOption value="DOP">DOP</IonSelectOption>
            <IonSelectOption value="EGP">EGP</IonSelectOption>
            <IonSelectOption value="EUR">EUR</IonSelectOption>
            <IonSelectOption value="FJD">FJD</IonSelectOption>
            <IonSelectOption value="GBP">GBP</IonSelectOption>
            <IonSelectOption value="GTQ">GTQ</IonSelectOption>
            <IonSelectOption value="HKD">HKD</IonSelectOption>
            <IonSelectOption value="HRK">HRK</IonSelectOption>
            <IonSelectOption value="HUF">HUF</IonSelectOption>
            <IonSelectOption value="IDR">IDR</IonSelectOption>
            <IonSelectOption value="ILS">ILS</IonSelectOption>
            <IonSelectOption value="INR">INR</IonSelectOption>
            <IonSelectOption value="ISK">ISK</IonSelectOption>
            <IonSelectOption value="JPY">JPY</IonSelectOption>
            <IonSelectOption value="KRW">KRW</IonSelectOption>
            <IonSelectOption value="KZT">KZT</IonSelectOption>
            <IonSelectOption value="MXN">MXN</IonSelectOption>
            <IonSelectOption value="MYR">MYR</IonSelectOption>
            <IonSelectOption value="NOK">NOK</IonSelectOption>
            <IonSelectOption value="NZD">NZD</IonSelectOption>
            <IonSelectOption value="PAB">PAB</IonSelectOption>
            <IonSelectOption value="PEN">PEN</IonSelectOption>
            <IonSelectOption value="PHP">PHP</IonSelectOption>
            <IonSelectOption value="PKR">PKR</IonSelectOption>
            <IonSelectOption value="PLN">PLN</IonSelectOption>
            <IonSelectOption value="PYG">PYG</IonSelectOption>
            <IonSelectOption value="RON">RON</IonSelectOption>
            <IonSelectOption value="RUB">RUB</IonSelectOption>
            <IonSelectOption value="SAR">SAR</IonSelectOption>
            <IonSelectOption value="SEK">SEK</IonSelectOption>
            <IonSelectOption value="SGD">SGD</IonSelectOption>
            <IonSelectOption value="THB">THB</IonSelectOption>
            <IonSelectOption value="TRY">TRY</IonSelectOption>
            <IonSelectOption value="TWD">TWD</IonSelectOption>
            <IonSelectOption value="UAH">UAH</IonSelectOption>
            <IonSelectOption value="USD">USD</IonSelectOption>
            <IonSelectOption value="UYU">UYU</IonSelectOption>
            <IonSelectOption value="VND">VND</IonSelectOption>
            <IonSelectOption value="ZAR">ZAR</IonSelectOption>
          </IonSelect>
        </div>

        <div className="swap-rate-container">
          <div className="rate" ref={rateElement}></div>
          <IonButton className="btn" ref={swapButton}>
            Alternar
          </IonButton>
          <IonButton className="btn" ref={convertButton}>
            Converter
          </IonButton>
        </div>

        <div className="currency">
          <IonInput
            type="number"
            ref={amountElementTwo}
            placeholder=""
            readonly={true}
          />
          <IonSelect ref={currencyElementTwo} id="currency-two" value="USD">
            <IonSelectOption value="AED">AED</IonSelectOption>
            <IonSelectOption value="ARS">ARS</IonSelectOption>
            <IonSelectOption value="AUD">AUD</IonSelectOption>
            <IonSelectOption value="BGN">BGN</IonSelectOption>
            <IonSelectOption value="BRL">BRL</IonSelectOption>
            <IonSelectOption value="BSD">BSD</IonSelectOption>
            <IonSelectOption value="CAD">CAD</IonSelectOption>
            <IonSelectOption value="CHF">CHF</IonSelectOption>
            <IonSelectOption value="CLP">CLP</IonSelectOption>
            <IonSelectOption value="CNY">CNY</IonSelectOption>
            <IonSelectOption value="COP">COP</IonSelectOption>
            <IonSelectOption value="CZK">CZK</IonSelectOption>
            <IonSelectOption value="DKK">DKK</IonSelectOption>
            <IonSelectOption value="DOP">DOP</IonSelectOption>
            <IonSelectOption value="EGP">EGP</IonSelectOption>
            <IonSelectOption value="EUR">EUR</IonSelectOption>
            <IonSelectOption value="FJD">FJD</IonSelectOption>
            <IonSelectOption value="GBP">GBP</IonSelectOption>
            <IonSelectOption value="GTQ">GTQ</IonSelectOption>
            <IonSelectOption value="HKD">HKD</IonSelectOption>
            <IonSelectOption value="HRK">HRK</IonSelectOption>
            <IonSelectOption value="HUF">HUF</IonSelectOption>
            <IonSelectOption value="IDR">IDR</IonSelectOption>
            <IonSelectOption value="ILS">ILS</IonSelectOption>
            <IonSelectOption value="INR">INR</IonSelectOption>
            <IonSelectOption value="ISK">ISK</IonSelectOption>
            <IonSelectOption value="JPY">JPY</IonSelectOption>
            <IonSelectOption value="KRW">KRW</IonSelectOption>
            <IonSelectOption value="KZT">KZT</IonSelectOption>
            <IonSelectOption value="MXN">MXN</IonSelectOption>
            <IonSelectOption value="MYR">MYR</IonSelectOption>
            <IonSelectOption value="NOK">NOK</IonSelectOption>
            <IonSelectOption value="NZD">NZD</IonSelectOption>
            <IonSelectOption value= "PAB">PAB</IonSelectOption>
            <IonSelectOption value="PEN">PEN</IonSelectOption>
            <IonSelectOption value="PHP">PHP</IonSelectOption>
            <IonSelectOption value="PKR">PKR</IonSelectOption>
            <IonSelectOption value="PLN">PLN</IonSelectOption>
            <IonSelectOption value="PYG">PYG</IonSelectOption>
            <IonSelectOption value="RON">RON</IonSelectOption>
            <IonSelectOption value="RUB">RUB</IonSelectOption>
            <IonSelectOption value="SAR">SAR</IonSelectOption>
            <IonSelectOption value="SEK">SEK</IonSelectOption>
            <IonSelectOption value="SGD">SGD</IonSelectOption>
            <IonSelectOption value="THB">THB</IonSelectOption>
            <IonSelectOption value="TRY">TRY</IonSelectOption>
            <IonSelectOption value="TWD">TWD</IonSelectOption>
            <IonSelectOption value="UAH">UAH</IonSelectOption>
            <IonSelectOption value="USD">USD</IonSelectOption>
            <IonSelectOption value="UYU">UYU</IonSelectOption>
            <IonSelectOption value="VND">VND</IonSelectOption>
            <IonSelectOption value="ZAR">ZAR</IonSelectOption>
          </IonSelect>
        </div>
      </div>
    </IonPage>
  );
}

export default Tab1;
