import { createContext, useContext, useState, useEffect } from 'react';
import { db, isFirebaseConfigured, onAuthChange, logout as firebaseLogout } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, setDoc, getDoc } from 'firebase/firestore';

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
        goals: [],
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
    const [authChecked, setAuthChecked] = useState(false);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser && isFirebaseConfigured()) {
                // User logged in - load their data from Firebase
                await loadUserData(firebaseUser.uid);
            } else if (localStorage.getItem('fuxion_demo_mode')) {
                // Demo mode - use localStorage
                loadFromLocalStorage();
            }

            setLoading(false);
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    const loadFromLocalStorage = () => {
        const savedHistory = localStorage.getItem('fuxion_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedAdvisor = localStorage.getItem('fuxion_advisor');
        if (savedAdvisor) setAdvisorProfile(JSON.parse(savedAdvisor));

        // Load name from registration if exists
        const savedName = localStorage.getItem('fuxion_advisor_name');
        if (savedName && !advisorProfile.name) {
            setAdvisorProfile(prev => ({ ...prev, name: savedName }));
        }
    };

    const loadUserData = async (userId) => {
        try {
            // Load advisor profile
            const profileDoc = await getDoc(doc(db, 'users', userId, 'profile', 'main'));
            if (profileDoc.exists()) {
                setAdvisorProfile(profileDoc.data());
            }

            // Load consultations history
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
            console.error('Error loading user data:', error);
            loadFromLocalStorage();
        }
    };

    const saveAdvisorProfile = async (data) => {
        setAdvisorProfile(data);
        localStorage.setItem('fuxion_advisor', JSON.stringify(data));

        // Save to Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await setDoc(doc(db, 'users', user.uid, 'profile', 'main'), data);
            } catch (error) {
                console.error('Error saving profile to Firebase:', error);
            }
        }
    };

    const saveConsultation = async (resultData) => {
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
            goals: currentConsultation.goals,
            conditions: currentConsultation.conditions,
            results: resultData
        };

        // Save to Firebase if logged in
        if (user && isFirebaseConfigured()) {
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
        // Remove from Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'consultations', id));
            } catch (error) {
                console.error('Error deleting from Firebase:', error);
            }
        }

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
            goals: [],
            conditions: [],
            results: null
        });
    };

    const logout = async () => {
        await firebaseLogout();
        localStorage.removeItem('fuxion_demo_mode');
        setUser(null);
        setHistory([]);
        setAdvisorProfile({ name: '', phone: '', social: '' });
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
            loading,
            authChecked,
            logout,
            isAuthenticated: !!user || localStorage.getItem('fuxion_demo_mode')
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
