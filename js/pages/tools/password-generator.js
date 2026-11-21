
        const passwordText = document.getElementById('passwordText');
        const copyBtn = document.getElementById('copyBtn');
        const generateBtn = document.getElementById('generateBtn');
        const lengthSlider = document.getElementById('lengthSlider');
        const lengthValue = document.getElementById('lengthValue');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        const charSets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        // Update length display
        lengthSlider.oninput = function() {
            lengthValue.innerText = this.value;
        };

        function calculateStrength(pwd) {
            let strength = 0;
            if (pwd.length > 8) strength += 25;
            if (pwd.length > 15) strength += 25;
            if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength += 15;
            if (/[0-9]/.test(pwd)) strength += 15;
            if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;

            strengthFill.style.width = strength + '%';
            
            if (strength < 40) strengthText.innerText = 'Weak';
            else if (strength < 75) strengthText.innerText = 'Medium';
            else strengthText.innerText = 'Strong';
        }

        function generate() {
            let dictionary = '';
            const length = parseInt(lengthSlider.value);
            let result = '';

            if (document.getElementById('upper').checked) dictionary += charSets.upper;
            if (document.getElementById('lower').checked) dictionary += charSets.lower;
            if (document.getElementById('numbers').checked) dictionary += charSets.numbers;
            if (document.getElementById('symbols').checked) dictionary += charSets.symbols;

            if (dictionary === '') {
                passwordText.innerText = 'Select an option!';
                return;
            }

            for (let i = 0; i < length; i++) {
                result += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
            }

            passwordText.innerText = result;
            calculateStrength(result);
        }

        async function copy() {
            const text = passwordText.innerText;
            if (text === 'Select an option!') return;
            
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.innerText = 'Copied!';
                setTimeout(() => copyBtn.innerText = 'Copy', 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }

        generateBtn.addEventListener('click', generate);
        copyBtn.addEventListener('click', copy);

        // Run once on load
        generate();
    