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
    const [reminders, setReminders] = useState([]);
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

        const savedReminders = localStorage.getItem('fuxion_reminders');
        if (savedReminders) setReminders(JSON.parse(savedReminders));

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

            // Load reminders
            const remindersQ = query(
                collection(db, 'users', userId, 'reminders'),
                orderBy('scheduledDate', 'asc')
            );
            const remindersSnapshot = await getDocs(remindersQ);
            const reminderItems = remindersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReminders(reminderItems);
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

    const updateConsultation = async (id, updatedData) => {
        const consultationIndex = history.findIndex(item => item.id === id);
        if (consultationIndex === -1) return null;

        const updatedConsultation = {
            ...history[consultationIndex],
            ...updatedData,
            date: new Date().toISOString() // Update timestamp
        };

        // Update in Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await setDoc(doc(db, 'users', user.uid, 'consultations', id), updatedConsultation);
            } catch (error) {
                console.error('Error updating in Firebase:', error);
            }
        }

        // Update local state
        const newHistory = [...history];
        newHistory[consultationIndex] = updatedConsultation;
        setHistory(newHistory);
        localStorage.setItem('fuxion_history', JSON.stringify(newHistory));

        // Update current consultation if it's the one being edited
        if (currentConsultation.id === id) {
            setCurrentConsultation(updatedConsultation);
        }

        return updatedConsultation;
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

    const addReminder = async (reminder) => {
        const newReminders = [...reminders, reminder];
        setReminders(newReminders);
        localStorage.setItem('fuxion_reminders', JSON.stringify(newReminders));

        // Save to Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await addDoc(collection(db, 'users', user.uid, 'reminders'), reminder);
            } catch (error) {
                console.error('Error saving reminder to Firebase:', error);
            }
        }

        return reminder;
    };

    const updateReminder = async (reminderId, updates) => {
        const newReminders = reminders.map(r =>
            r.id === reminderId ? { ...r, ...updates } : r
        );
        setReminders(newReminders);
        localStorage.setItem('fuxion_reminders', JSON.stringify(newReminders));

        // Update in Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await setDoc(doc(db, 'users', user.uid, 'reminders', reminderId),
                    newReminders.find(r => r.id === reminderId)
                );
            } catch (error) {
                console.error('Error updating reminder in Firebase:', error);
            }
        }
    };

    const deleteReminder = async (reminderId) => {
        const newReminders = reminders.filter(r => r.id !== reminderId);
        setReminders(newReminders);
        localStorage.setItem('fuxion_reminders', JSON.stringify(newReminders));

        // Delete from Firebase if logged in
        if (user && isFirebaseConfigured()) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'reminders', reminderId));
            } catch (error) {
                console.error('Error deleting reminder from Firebase:', error);
            }
        }
    };

    const logout = async () => {
        await firebaseLogout();
        localStorage.removeItem('fuxion_demo_mode');
        setUser(null);
        setHistory([]);
        setReminders([]);
        setAdvisorProfile({ name: '', phone: '', social: '' });
    };

    return (
        <AppContext.Provider value={{
            currentConsultation,
            setCurrentConsultation,
            saveConsultation,
            deleteConsultation,
            updateConsultation,
            loadConsultation,
            history,
            setHistory,
            clearCurrent,
            advisorProfile,
            saveAdvisorProfile,
            reminders,
            addReminder,
            updateReminder,
            deleteReminder,
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
