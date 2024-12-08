export const setStorage = async (key: string, value: string) => {
    try {
      await localStorage.setItem(key, value);
    } catch (error) {
      console.error("Erro ao salvar no storage", error);
    }
  };
  
  export const getStorage = async (key: string): Promise<string | null> => {
    try {
      return await localStorage.getItem(key);
    } catch (error) {
      console.error("Erro ao carregar do storage", error);
      return null;
    }
  };
  