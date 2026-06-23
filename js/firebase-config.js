let db;
let firestoreReady = false;

function initFirebase() {
  if (typeof firebase === 'undefined') return;
  const firebaseConfig = {
    apiKey: "AIzaSyBuD88K2qylq69vFnSbOlcOm0WSQTLG0TA",
    authDomain: "alelatina-3aed9.firebaseapp.com",
    projectId: "alelatina-3aed9",
    storageBucket: "alelatina-3aed9.firebasestorage.app",
    messagingSenderId: "609389381567",
    appId: "1:609389381567:web:661c37fcb5585d0325c30a",
    measurementId: "G-P8BBF9Q02N"
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  db.settings({ merge: true });
  firebase.firestore().enablePersistence().catch(() => {});
  firestoreReady = true;
}

async function syncToFirestore(key) {
  if (!firestoreReady || !db) return;
  try {
    const val = localStorage.getItem('ticketflow_' + key);
    await db.collection('ticketflow_portal').doc(key).set({ value: val ? JSON.parse(val) : null, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { console.warn('Firestore sync error:', e); }
}

async function loadFromFirestore() {
  if (!firestoreReady || !db) return false;
  try {
    const snapshot = await db.collection('ticketflow_portal').get();
    if (snapshot.empty) return false;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.value !== null && data.value !== undefined) {
        localStorage.setItem('ticketflow_' + doc.id, JSON.stringify(data.value));
      }
    });
    return true;
  } catch (e) { console.warn('Firestore load error:', e); return false; }
}
