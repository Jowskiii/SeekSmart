import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, query, orderByChild, get, onValue } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKcJLjCsCaWqxpvbbsPSJLwh7HVwUGV9k",
    authDomain: "test-form-631da.firebaseapp.com",
    projectId: "test-form-631da",
    storageBucket: "test-form-631da.appspot.com",
    messagingSenderId: "759689742074",
    appId: "1:759689742074:web:118c882af9ccea3c89ab43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let saveContactInfo = ref(database, "infos");

document.querySelector(".contact-form").addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    let fname = document.querySelector(".fname").value;
    let lname = document.querySelector(".lname").value;
    let email = document.querySelector(".email").value;
    let message = document.querySelector(".message").value;
    console.log(fname, lname, email, message);

    saveContactInfoToFirebase(fname, lname, email, message);
}

function saveContactInfoToFirebase(fname, lname, email, message) {
    let newContactInfo = push(saveContactInfo);

    set(newContactInfo, {
        fname: fname,
        lname: lname,
        email: email,
        message: message,
        timestamp: Date.now()
    });
}

// Function to display contact info
function displayContactInfo() {
    const contactInfoQuery = query(saveContactInfo, orderByChild('timestamp'));

    onValue(contactInfoQuery, (snapshot) => {
        const contactInfoContainer = document.querySelector('.contact-info-container');
        contactInfoContainer.innerHTML = ""; // Clear previous data

        let contactInfos = [];
        snapshot.forEach((childSnapshot) => {
            contactInfos.push(childSnapshot.val());
        });

        contactInfos.sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order

        contactInfos.forEach((contactInfo) => {
            const infoElement = document.createElement('div');
            infoElement.innerHTML = `
                <p><strong>Name:</strong> ${contactInfo.fname} ${contactInfo.lname}</p>
                <p><strong>Email:</strong> ${contactInfo.email}</p>
                <p><strong>Message:</strong> ${contactInfo.message}</p>
                <hr>
            `;
            contactInfoContainer.appendChild(infoElement);
        });
    });
}

// Call displayContactInfo to fetch and display data on page load
displayContactInfo();
