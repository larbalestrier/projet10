import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
    // Création d'un état pour stocker le dernier événement.
  const [lastEvent, setlastEvent] = useState(null);
  const getData = useCallback(async () => {
    try {
      // Appel à la méthode loadData de l'objet api pour charger les données
      const apiData= await api.loadData();

      // Calcul du dernier événement en triant les événements par date 
      // et en récupérant le premier élément de la liste triée (qui est le dernier événement).
      const last = apiData?.events.sort((evtA, evtB) =>
      new Date(evtB.date) < new Date(evtA.date)? -1 : 1)[0];

      // Stockage des données
      setlastEvent(last)

      // Stockage des données
      setData(apiData);
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        lastEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
