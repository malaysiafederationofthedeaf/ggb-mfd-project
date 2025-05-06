import { useState, useEffect } from "react";
import { getAlphabetsList, getVocabsByAlphabet } from "../services/api/alphabetAPI";
import { Store } from "../flux";

export const useAlphabetData = (alphabet) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vocabs, setVocabs] = useState([]);
  const [alphasLists, setAlphasLists] = useState([]);
  
  useEffect(() => {
    try {
      const alphasFormatted = Store.formatString(alphabet);
      
      // Get alphabets list
      const alphabetsList = getAlphabetsList();
      setAlphasLists(alphabetsList);
      
      // Get vocabs for the selected alphabet
      const vocabsData = getVocabsByAlphabet(alphasFormatted);
      setVocabs(vocabsData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching alphabet data:", err);
      setError(err);
      setLoading(false);
    }
  }, [alphabet]);
  
  return { vocabs, alphasLists, loading, error };
};