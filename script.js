// Variables for Month and Year Select Elements
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');
const outputBox = document.getElementById('output');

// Populate Month Dropdown
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
months.forEach((month, index) => {
    let option = document.createElement('option');
    option.value = index < 9 ? '0' + (index + 1) : (index + 1);
    option.textContent = month;
    monthSelect.appendChild(option);
});

// Populate Year Dropdown
const currentYear = new Date().getFullYear();
for (let i = currentYear; i <= currentYear + 11; i++) {
    let option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}

// Luhn Algorithm for Validating Card Numbers
function luhnCheck(number) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

// Generate Cards Function
function generateCard(bin, month, year, cvv, quantity) {
    const cards = [];
    for (let i = 0; i < quantity; i++) {
        let cardNumber = bin;
        while (cardNumber.length < 16) {
            cardNumber += Math.floor(Math.random() * 10);
        }
        if (!luhnCheck(cardNumber)) continue;
        
        let cardMonth = month || (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
        let cardYear = year || (Math.floor(Math.random() * (2035 - currentYear + 1)) + currentYear).toString();
        let cardCVV = cvv || Math.floor(Math.random() * 900) + 100;

        cards.push(`${cardNumber}|${cardMonth}|${cardYear}|${cardCVV}`);
    }
    return cards;
}

// Form Submit Event Listener
document.getElementById('generateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bin = document.getElementById('bin').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const cvv = document.getElementById('cvv').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (bin.length < 6) {
        alert("Please enter at least 6 digits for BIN.");
        return;
    }

    const cards = generateCard(bin, month, year, cvv, quantity);
    outputBox.textContent = cards.join('\n');
});

// Dark Mode Toggle
document.getElementById('switch').addEventListener('change', toggleDarkMode);

function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
}

// Copy to Clipboard
document.getElementById('copyButton').addEventListener('click', function() {
    const text = document.getElementById('output').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Cards copied to clipboard!");
    });
});
