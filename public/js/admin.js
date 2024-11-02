// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Navigation and UI functionality
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        link.parentElement.classList.add('active');
        
        const section = link.getAttribute('href').substring(1);
        switch(section) {
            case 'savings-entry':
                showSavingsEntry();
                break;
            case 'members':
                showMembersList();
                break;
            case 'transactions':
                showTransactions();
                break;
            case 'logout':
                handleLogout();
                break;
        }
    });
});

// Member list functionality
function loadMembers() {
    const memberListSidebar = document.getElementById('memberListSidebar');
    
    db.collection('users')
        .where('role', '==', 'member')
        .onSnapshot((snapshot) => {
            let membersHTML = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                membersHTML += `
                    <div class="member-item-sidebar">
                        <div class="member-info">
                            <span class="member-id">${doc.id}</span>
                            <span class="member-savings">RM ${(data.savings || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            });
            memberListSidebar.innerHTML = membersHTML;
        });
}

// Main content display functions
function showSavingsEntry() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="section-content">
            <h2>Masukkan Simpanan</h2>
            <form id="savingsForm">
                <div class="form-group">
                    <label for="memberId">ID Ahli</label>
                    <input type="text" id="memberId" required>
                </div>
                <div class="form-group">
                    <label for="amount">Jumlah (RM)</label>
                    <input type="number" id="amount" step="0.01" required>
                </div>
                <button type="submit" class="submit-btn">Simpan</button>
            </form>
        </div>
    `;

    // Add form submission handler
    const form = document.getElementById('savingsForm');
    form.addEventListener('submit', handleSavingsSubmit);
}

async function handleSavingsSubmit(e) {
    e.preventDefault();
    const memberId = document.getElementById('memberId').value;
    const amount = parseFloat(document.getElementById('amount').value);

    try {
        const memberRef = db.collection('users').doc(memberId);
        const doc = await memberRef.get();

        if (!doc.exists) {
            alert('ID Ahli tidak dijumpai');
            return;
        }

        await db.runTransaction(async (transaction) => {
            const memberDoc = await transaction.get(memberRef);
            const newSavings = (memberDoc.data().savings || 0) + amount;
            
            transaction.update(memberRef, { savings: newSavings });
            
            // Add transaction record
            const transactionRef = db.collection('transactions').doc();
            transaction.set(transactionRef, {
                userId: memberId,
                amount: amount,
                type: 'deposit',
                date: firebase.firestore.Timestamp.now()
            });
        });

        alert('Simpanan berjaya direkodkan!');
        document.getElementById('savingsForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Ralat merekod simpanan');
    }
}

function showMembersList() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="section-content">
            <h2>Senarai Ahli</h2>
            <div id="membersList" class="members-list">
                Loading...
            </div>
        </div>
    `;

    loadMembersData();
}

async function loadMembersData() {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'member').get();
        const membersList = document.getElementById('membersList');
        let membersHTML = '';
        
        snapshot.forEach(doc => {
            const data = doc.data();
            membersHTML += `
                <div class="member-item">
                    <div class="member-info">
                        <span class="member-id">ID: ${doc.id}</span>
                        <span class="member-savings">Simpanan: RM ${(data.savings || 0).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        membersList.innerHTML = membersHTML || 'Tiada ahli berdaftar';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('membersList').innerHTML = 'Error loading members';
    }
}

function showTransactions() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="section-content">
            <h2>Transaksi</h2>
            <div id="transactionsList" class="transactions-list">
                Loading...
            </div>
        </div>
    `;

    loadTransactionsData();
}

async function loadTransactionsData() {
    try {
        const snapshot = await db.collection('transactions')
            .orderBy('date', 'desc')
            .get();

        const transactionsList = document.getElementById('transactionsList');
        let transactionsHTML = '';
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date.toDate();
            transactionsHTML += `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-type">${data.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</span>
                        <span class="transaction-amount">RM ${data.amount.toFixed(2)}</span>
                        <span class="transaction-date">${date.toLocaleDateString()}</span>
                        <span class="transaction-member">Member ID: ${data.userId}</span>
                    </div>
                </div>
            `;
        });
        
        transactionsList.innerHTML = transactionsHTML || 'No transactions found';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('transactionsList').innerHTML = 'Error loading transactions';
    }
}

function handleLogout() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

// Initialize member list on page load
document.addEventListener('DOMContentLoaded', loadMembers);
