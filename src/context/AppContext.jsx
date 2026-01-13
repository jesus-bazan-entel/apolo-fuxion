import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentConsultation, setCurrentConsultation] = useState({
        profile: {
            name: '',
            phone: '',
            age: '',
            gender: '',
        },
        goal: '',
        conditions: [],
        results: null
    });

    const [history, setHistory] = useState([]);
    const [advisorProfile, setAdvisorProfile] = useState({
        name: '',
        phone: '',
        social: ''
    });

    // Load history & advisor profile
    useEffect(() => {
        const savedHistory = localStorage.getItem('fuxion_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedAdvisor = localStorage.getItem('fuxion_advisor');
        if (savedAdvisor) setAdvisorProfile(JSON.parse(savedAdvisor));
    }, []);

    const saveAdvisorProfile = (bg) => {
        setAdvisorProfile(bg);
        localStorage.setItem('fuxion_advisor', JSON.stringify(bg));
    };

    const saveConsultation = (resultData) => {
        // Update current valid state immediately so UI can update
        setCurrentConsultation(prev => ({
            ...prev,
            results: resultData
        }));

        const newItem = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...currentConsultation,
            results: resultData
        };

        // Update state
        const newHistory = [newItem, ...history];
        setHistory(newHistory);

        // Persist
        localStorage.setItem('fuxion_history', JSON.stringify(newHistory));
        return newItem;
    };

    const clearCurrent = () => {
        setCurrentConsultation({
            profile: { name: '', phone: '', age: '', gender: '' },
            goal: '',
            conditions: [],
            results: null
        });
    };

    return (
        <AppContext.Provider value={{
            currentConsultation,
            setCurrentConsultation,
            saveConsultation,
            history,
            setHistory,
            clearCurrent,
            advisorProfile,
            saveAdvisorProfile
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
