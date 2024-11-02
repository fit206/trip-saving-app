import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

const navLinks = document.querySelectorAll('.nav-links a');
const mainContent = document.querySelector('.main-content');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.id === 'logoutBtn') {
            sessionStorage.clear();
            window.location.href = '../index.html';
            return;
        }

        e.preventDefault();
        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        link.parentElement.classList.add('active');

        const section = link.getAttribute('href').substring(1);
        if (section === 'history') {
            showTransactionHistory();
        }
    });
});

async function showTransactionHistory() {
    const userId = sessionStorage.getItem('userId');
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h2>Sejarah Transaksi</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="transactions-list" id="fullTransactionsList">
                <div class="loading">Memuat data...</div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());

    const transactionsRef = collection(db, 'transactions');
    const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
    );

    try {
        const querySnapshot = await getDocs(q);
        const transactionsList = popup.querySelector('#fullTransactionsList');
        
        if (querySnapshot.empty) {
            transactionsList.innerHTML = '<div class="no-data">Tiada transaksi dijumpai</div>';
            return;
        }

        const transactionsHTML = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate();
            const formattedDate = new Intl.DateTimeFormat('ms-MY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);

            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-type ${data.type}">
                            ${data.type === 'deposit' ? 'Deposit' : 'Pengeluaran'}
                        </span>
                        <span class="transaction-amount">
                            RM ${data.amount.toFixed(2)}
                        </span>
                        <span class="transaction-date">
                            ${formattedDate}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
        
        transactionsList.innerHTML = transactionsHTML;
    } catch (error) {
        console.error('Transaction loading error:', error);
        const transactionsList = popup.querySelector('#fullTransactionsList');
        transactionsList.innerHTML = '<div class="error">Ralat memuat data. Sila cuba lagi.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        window.location.href = '../index.html';
        return;
    }
    loadDashboardData();
});

async function loadDashboardData() {
    const userId = sessionStorage.getItem('userId');
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('userName').textContent = userId;
            document.getElementById('totalSavings').textContent = 
                `RM ${userData.savings?.toFixed(2) || '0.00'}`;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}
