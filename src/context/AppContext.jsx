import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth, isFirebaseConfigured, signInAnon } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth and load data
    useEffect(() => {
        async function init() {
            // Try Firebase first
            if (isFirebaseConfigured()) {
                const firebaseUser = await signInAnon();
                if (firebaseUser) {
                    setUser(firebaseUser);
                    await loadHistoryFromFirebase(firebaseUser.uid);
                }
            } else {
                // Fallback to localStorage
                loadFromLocalStorage();
            }
            setLoading(false);
        }
        init();
    }, []);

    const loadFromLocalStorage = () => {
        const savedHistory = localStorage.getItem('fuxion_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedAdvisor = localStorage.getItem('fuxion_advisor');
        if (savedAdvisor) setAdvisorProfile(JSON.parse(savedAdvisor));
    };

    const loadHistoryFromFirebase = async (userId) => {
        try {
            const q = query(
                collection(db, 'users', userId, 'consultations'),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setHistory(items);
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            loadFromLocalStorage();
        }
    };

    const saveAdvisorProfile = (data) => {
        setAdvisorProfile(data);
        localStorage.setItem('fuxion_advisor', JSON.stringify(data));
    };

    const saveConsultation = async (resultData) => {
        // Update current state immediately
        const updatedConsultation = {
            ...currentConsultation,
            results: resultData
        };
        setCurrentConsultation(updatedConsultation);

        const newItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            profile: currentConsultation.profile,
            goal: currentConsultation.goal,
            conditions: currentConsultation.conditions,
            results: resultData
        };

        // Save to Firebase if available
        if (isFirebaseConfigured() && user) {
            try {
                const docRef = await addDoc(
                    collection(db, 'users', user.uid, 'consultations'),
                    newItem
                );
                newItem.id = docRef.id;
            } catch (error) {
                console.error('Error saving to Firebase:', error);
            }
        }

        // Always save to localStorage as backup
        const newHistory = [newItem, ...history];
        setHistory(newHistory);
        localStorage.setItem('fuxion_history', JSON.stringify(newHistory));

        return newItem;
    };

    const deleteConsultation = async (id) => {
        // Remove from Firebase if available
        if (isFirebaseConfigured() && user) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'consultations', id));
            } catch (error) {
                console.error('Error deleting from Firebase:', error);
            }
        }

        // Remove from state and localStorage
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('fuxion_history', JSON.stringify(newHistory));
    };

    const loadConsultation = (id) => {
        const consultation = history.find(item => item.id === id);
        if (consultation) {
            setCurrentConsultation(consultation);
            return consultation;
        }
        return null;
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
            deleteConsultation,
            loadConsultation,
            history,
            setHistory,
            clearCurrent,
            advisorProfile,
            saveAdvisorProfile,
            user,
            loading
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
