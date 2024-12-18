import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonButton, IonInput, IonLabel, IonCheckbox } from '@ionic/react';
import './Tab4.css';
import { setStorage, getStorage } from '../storagedata';

const Tab4: React.FC = () => {
  const [updateFrequency, setUpdateFrequency] = useState<string>('daily');
  const [enableNotifications, setEnableNotifications] = useState<boolean>(false);

  const saveSettings = async () => {
    await setStorage('updateFrequency', updateFrequency);
    await setStorage('enableNotifications', enableNotifications ? 'true' : 'false');
    console.log('Configurações salvas:', { updateFrequency, enableNotifications });
  };

  const updateExchangeRates = async () => {
    try {
      const oldRates = JSON.parse(await getStorage('exchangeRates') || '{}');
      const newRates = await fetchExchangeRates();

      if (Object.keys(oldRates).length > 0 && hasSignificantChange(oldRates, newRates)) {
        if (enableNotifications) {
          showNotification('As taxas de câmbio mudaram significativamente!');
        }
      }

      await setStorage('exchangeRates', JSON.stringify(newRates));
      await setStorage('lastUpdate', new Date().getTime().toString());
      console.log('Taxas de câmbio atualizadas:', newRates);
    } catch (error) {
      console.error("Erro ao atualizar taxas de câmbio", error);
    }
  };

  const hasSignificantChange = (oldRates: Record<string, number>, newRates: Record<string, number>) => {
    const threshold = 0.05;
    for (const currency in oldRates) {
      if (Math.abs(newRates[currency] - oldRates[currency]) / oldRates[currency] > threshold) {
        return true;
      }
    }
    return false;
  };

  const showNotification = (message: string) => {
    alert(message);
  };

  const fetchExchangeRates = async (): Promise<Record<string, number>> => {
    console.log('Obtendo as taxas de câmbio...');
    return { USD: Math.random() * 5 + 1, EUR: Math.random() * 6 + 2 };
  };

  useEffect(() => {
    const loadSettings = async () => {
      const storedFrequency = await getStorage('updateFrequency');
      const storedNotifications = await getStorage('enableNotifications');

      if (storedFrequency) setUpdateFrequency(storedFrequency);
      if (storedNotifications) setEnableNotifications(storedNotifications === 'true');
    };

    loadSettings();
    fetchHistoricalRates();
  }, []);

  const fetchHistoricalRates = async () => {
    const lastUpdate = await getStorage('lastUpdate');
    const now = new Date().getTime();
    const frequency = await getStorage('updateFrequency');

    const timeElapsed = lastUpdate ? now - parseInt(lastUpdate) : Infinity;
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    if (
      (frequency === 'hourly' && timeElapsed >= oneHour) ||
      (frequency === 'daily' && timeElapsed >= oneDay)
    ) {
      console.log('Atualizando taxas de câmbio...');
      await updateExchangeRates();
    } else {
      console.log('Aguardando próxima atualização.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configurações</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='container-configuracao'>
        <div style={{ marginTop: '10vw', textAlign: 'center',}}>
          <IonLabel className='label-configuracao'>Frequência de Atualização</IonLabel>
          <IonSelect className='select-configuracao'
            value={updateFrequency}
            onIonChange={(e) => setUpdateFrequency(e.detail.value)}
          >
            <IonSelectOption value="hourly">Hora a Hora</IonSelectOption>
            <IonSelectOption value="daily">Diariamente</IonSelectOption>
          </IonSelect>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <IonLabel>Ativar Notificações de Variações Significativas</IonLabel>
          <IonCheckbox
            checked={enableNotifications}
            onIonChange={(e) => setEnableNotifications(e.detail.checked)}
          />
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <IonButton onClick={saveSettings}>Salvar Configurações</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
