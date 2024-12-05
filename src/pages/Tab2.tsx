import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { getStorageInstance } from '../storage';
import './Tab2.css';

interface Conversion {
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: string;
  date: string;
}

const Tab2: React.FC = () => {
  const [history, setHistory] = useState<Conversion[]>([]);

  const loadHistory = async () => {
    const storage = getStorageInstance();
    const savedHistory: Conversion[] = (await storage.get('conversionHistory')) || [];
    setHistory(savedHistory);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Histórico</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonList>
          {history.length === 0 ? (
            <IonItem>
              <IonLabel>Sem histórico de conversões.</IonLabel>
            </IonItem>
          ) : (
            history.map((entry, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>
                    {entry.amount} {entry.from} → {entry.convertedAmount} {entry.to}
                  </h2>
                  <p>Taxa: {entry.rate}</p>
                  <p>{new Date(entry.date).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
