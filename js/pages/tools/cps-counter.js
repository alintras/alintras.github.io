
        const clickArea = document.getElementById('clickArea');
        const clickText = document.getElementById('clickText');
        const clickCount = document.getElementById('clickCount');
        const timerDisplay = document.getElementById('timer');
        const currentCPSEl = document.getElementById('currentCPS');
        const bestCPSEl = document.getElementById('bestCPS');
        const totalTestsEl = document.getElementById('totalTests');
        const resultMessageEl = document.getElementById('resultMessage');
        const resetBtn = document.getElementById('resetBtn');
        const clearStatsBtn = document.getElementById('clearStatsBtn');
        const historyList = document.getElementById('historyList');

        let clicks = 0;
        let timeLeft = 10;
        let isRunning = false;
        let hasStarted = false;
        let timerInterval = null;
        let bestCPS = parseFloat(localStorage.getItem('bestCPS') || '0');
        let totalTests = parseInt(localStorage.getItem('totalTests') || '0');
        let history = JSON.parse(localStorage.getItem('cpsHistory') || '[]');

        bestCPSEl.textContent = bestCPS.toFixed(1);
        totalTestsEl.textContent = totalTests;
        updateHistory();

        function startTest() {
            if (isRunning) return;
            hasStarted = true;
            isRunning = true;
            clicks = 0;
            timeLeft = 10;
            clickCount.textContent = clicks;
            clickText.textContent = 'Click Fast!';
            resultMessageEl.textContent = '';
            
            timerInterval = setInterval(() => {
                timeLeft -= 0.1;
                if (timeLeft <= 0) {
                    timeLeft = 0;
                    endTest();
                }
                timerDisplay.textContent = timeLeft.toFixed(1);
                
                const currentCPS = timeLeft < 10 ? clicks / (10 - timeLeft) : 0;
                currentCPSEl.textContent = currentCPS.toFixed(1);
            }, 100);
        }

        function endTest() {
            clearInterval(timerInterval);
            isRunning = false;
            hasStarted = false;
            clickArea.classList.add('disabled');
            
            const finalCPS = clicks / 10;
            currentCPSEl.textContent = finalCPS.toFixed(1);
            clickText.textContent = 'Test Complete!';
            
            totalTests++;
            totalTestsEl.textContent = totalTests;
            localStorage.setItem('totalTests', totalTests.toString());
            
            history.unshift({
                cps: finalCPS,
                clicks: clicks,
                date: new Date().toLocaleString()
            });
            
            if (history.length > 10) history = history.slice(0, 10);
            localStorage.setItem('cpsHistory', JSON.stringify(history));
            updateHistory();
            
            if (finalCPS > bestCPS) {
                bestCPS = finalCPS;
                bestCPSEl.textContent = bestCPS.toFixed(1);
                localStorage.setItem('bestCPS', bestCPS.toString());
                resultMessageEl.textContent = 'New Personal Record!';
            } else {
                resultMessageEl.textContent = getRankMessage(finalCPS);
            }
            
            setTimeout(() => {
                clickArea.classList.remove('disabled');
                clickText.textContent = 'Click to Start!';
            }, 2000);
        }

        function getRankMessage(cps) {
            if (cps >= 15) return 'Legendary! Insane speed!';
            if (cps >= 12) return 'Outstanding! Professional level!';
            if (cps >= 10) return 'Excellent! Very impressive!';
            if (cps >= 8) return 'Great job! Above average!';
            if (cps >= 6) return 'Good! Keep practicing!';
            if (cps >= 4) return 'Not bad! Room to improve!';
            return 'Keep trying! Practice makes perfect!';
        }

        function updateHistory() {
            if (history.length === 0) {
                historyList.innerHTML = '<div style="text-align:center; color: var(--border-muted); padding: 20px;">No tests yet</div>';
                return;
            }
            
            historyList.innerHTML = history.map((entry, index) => `
                <div class="leaderboard-entry">
                    <span>#${index + 1} - ${entry.cps.toFixed(1)} CPS (${entry.clicks} clicks)</span>
                    <span style="opacity:0.7; font-size:0.9em;">${entry.date}</span>
                </div>
            `).join('');
        }

        function reset() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
            }
            hasStarted = false;
            clicks = 0;
            timeLeft = 10;
            clickCount.textContent = clicks;
            timerDisplay.textContent = '10.0';
            currentCPSEl.textContent = '0.0';
            clickText.textContent = 'Click to Start!';
            resultMessageEl.textContent = '';
            clickArea.classList.remove('disabled');
        }

        function clearStats() {
            if (confirm('Are you sure you want to clear all your stats and history?')) {
                bestCPS = 0;
                totalTests = 0;
                history = [];
                bestCPSEl.textContent = '0.0';
                totalTestsEl.textContent = '0';
                localStorage.removeItem('bestCPS');
                localStorage.removeItem('totalTests');
                localStorage.removeItem('cpsHistory');
                updateHistory();
                reset();
            }
        }

        // Mouse click support
        clickArea.addEventListener('click', () => {
            if (!hasStarted) startTest();
            if (isRunning) {
                clicks++;
                clickCount.textContent = clicks;
            }
        });

        // Mobile touch support
        clickArea.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevents zooming/scrolling while tapping
            if (!hasStarted) startTest();
            if (isRunning) {
                clicks++;
                clickCount.textContent = clicks;
            }
        });

        resetBtn.addEventListener('click', reset);
        clearStatsBtn.addEventListener('click', clearStats);
    