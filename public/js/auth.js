import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBGdTrIovOjrG6U6S4MZ3ALj_p3JsfFySM",
  authDomain: "firestore-database-c4e73.firebaseapp.com",
  databaseURL: "https://firestore-database-c4e73-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firestore-database-c4e73",
  storageBucket: "firestore-database-c4e73.firebasestorage.app",
  messagingSenderId: "692300432464",
  appId: "1:692300432464:web:e5511daf666d48f4a0bd55",
  measurementId: "G-V2RNKCZ77Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');

        try {
            if (type === 'member') {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists() && userDoc.data().password === password) {
                    sessionStorage.setItem('userType', 'member');
                    sessionStorage.setItem('userId', userId);
                    window.location.href = 'member-dashboard.html';
                } else {
                    alert('ID atau kata laluan tidak sah!');
                }
            } else if (type === 'admin') {
                const adminDoc = await getDoc(doc(db, 'admin', userId));
                if (adminDoc.exists() && adminDoc.data().password === password) {
                    sessionStorage.setItem('userType', 'admin');
                    sessionStorage.setItem('userId', userId);
                    window.location.href = 'admin-dashboard.html';
                } else {
                    alert('ID atau kata laluan tidak sah!');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Ralat semasa log masuk. Sila cuba lagi.');
        }
    });
});