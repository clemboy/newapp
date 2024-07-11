document.addEventListener('DOMContentLoaded', () => {
    const toggleModeButton = document.getElementById('toggle-mode');
    const userInterface = document.getElementById('user-interface');
    const adminInterface = document.getElementById('admin-interface');
    const numbersContainer = document.getElementById('numbers');
    const submitNumbersButton = document.getElementById('submit-numbers');
    const generateTicketsButton = document.getElementById('generate-tickets');
    const ticketCostElement = document.getElementById('ticket-cost');
    const simulateDrawButton = document.getElementById('simulate-draw');
    const winningNumbersElement = document.getElementById('winning-numbers');
    const winningTicketsElement = document.getElementById('winning-tickets');

    let selectedNumbers = [];
    let isAdmin = false;

    // Toggle between admin and user mode
    toggleModeButton.addEventListener('click', () => {
        isAdmin = !isAdmin;
        userInterface.style.display = isAdmin ? 'none' : 'block';
        adminInterface.style.display = isAdmin ? 'block' : 'none';
        toggleModeButton.textContent = isAdmin ? 'Switch to User' : 'Switch to Admin';
    });

    // Generate number buttons
    for (let i = 1; i <= 52; i++) {
        const numberButton = document.createElement('div');
        numberButton.textContent = i;
        numberButton.classList.add('number');
        if (i <= 13) {
            numberButton.classList.add('red');
        } else if (i <= 25) {
            numberButton.classList.add('yellow');
        } else if (i <= 37) {
            numberButton.classList.add('green');
        } else {
            numberButton.classList.add('blue');
        }
        numberButton.addEventListener('click', () => selectNumber(i));
        numbersContainer.appendChild(numberButton);
    }

    // Select a number
    function selectNumber(number) {
        if (selectedNumbers.includes(number)) {
            selectedNumbers = selectedNumbers.filter(num => num !== number);
        } else if (selectedNumbers.length < 6) {
            selectedNumbers.push(number);
        }
        updateNumberSelection();
    }

    // Update number selection display
    function updateNumberSelection() {
        document.querySelectorAll('.number').forEach(button => {
            if (selectedNumbers.includes(parseInt(button.textContent))) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    // Submit selected numbers
    submitNumbersButton.addEventListener('click', () => {
        if (selectedNumbers.length !== 6) {
            alert('Please select exactly 6 numbers');
            return;
        }
        localStorage.setItem('selectedNumbers', JSON.stringify(selectedNumbers));
        alert('Numbers saved!');
    });

    // Generate tickets and calculate cost
    generateTicketsButton.addEventListener('click', () => {
        const boards = parseInt(document.getElementById('boards').value);
        const lottoPlus1 = document.getElementById('lotto-plus-1').checked;
        const lottoPlus2 = document.getElementById('lotto-plus-2').checked;

        let totalCost = boards * 5;
        if (lottoPlus1) totalCost += boards * 2.5;
        if (lottoPlus2) totalCost += boards * 2.5;

        ticketCostElement.textContent = `Total Cost: R${totalCost.toFixed(2)}`;
    });

    // Simulate draw
    simulateDrawButton.addEventListener('click', () => {
        const winningNumbers = generateRandomNumbers();
        const storedNumbers = JSON.parse(localStorage.getItem('selectedNumbers') || '[]');

        winningNumbersElement.textContent = `Winning Numbers: ${winningNumbers.join(', ')}`;
        winningTicketsElement.textContent = `Winning Tickets: ${countWinningTickets(storedNumbers, winningNumbers)}`;
    });

    // Generate random numbers for draw
    function generateRandomNumbers() {
        const numbers = [];
        while (numbers.length < 6) {
            const rand = Math.floor(Math.random() * 52) + 1;
            if (!numbers.includes(rand)) {
                numbers.push(rand);
            }
        }
        return numbers;
    }

    // Count winning tickets
    function countWinningTickets(storedNumbers, winningNumbers) {
        if (!storedNumbers.length) return 0;

        let matchCount = 0;
        storedNumbers.forEach(number => {
            if (winningNumbers.includes(number)) matchCount++;
        });
        return matchCount >= 3 ? 1 : 0;
    }
});

