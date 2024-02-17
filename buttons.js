const button = document.querySelectorAll('.btn-minecraft')
    button.forEach(btn => {
    btn.addEventListener('mouseleave', function (){
        btn.blur()
    })
})

document.addEventListener('DOMContentLoaded', function () {
    var playButton = document.getElementById('but1');
    var backButton = document.getElementById('backButton');
    var menu1 = document.getElementById('menu1');
    var menu2 = document.getElementById('menu2');
    var startButton = document.getElementById('start');
    var exitButton = document.getElementById('exitButton');
    
    var popup = document.getElementById('popup');
    var yesButton = document.getElementById('yesButton');
    var noButton = document.getElementById('noButton');
        
    exitButton.style.display = 'none';

    const clickSound = document.getElementById('clickSound');
    const bgm = document.getElementById('bgm');
/*
    // Event listener for the Play button
    playButton.addEventListener('click', function () {
        // Hide Menu 1
        menu1.classList.add('hidden');
        // Show Menu 2
        menu2.classList.remove('hidden');
    });

    // Event listener for the back button in menu2
    backButton.addEventListener('click', function () {
        // Hide Menu 2
        menu2.classList.add('hidden');
        // Show Menu 1
        menu1.classList.remove('hidden');
    });
    */

    // Event listener for the Start button in menu2
    startButton.addEventListener('click', function () {
        // Include and execute game.js
        var script = document.createElement('script');
        script.src = 'game.js';
        
        // Show the entire score display
        document.getElementById('scoreDisplay').style.display = 'block';
        document.getElementById('scoreEl').style.display = 'inline'; 

        document.head.appendChild(script);
        menu2.classList.add('hidden');

        // Show the icon container
        document.getElementById('iconScoreContainer').style.display = 'flex';

        // Show individual icons (icon1, icon2, icon3, icon4)
        document.getElementById('icon1').style.display = 'flex';
        document.getElementById('icon2').style.display = 'flex';
        document.getElementById('icon3').style.display = 'flex';
        document.getElementById('icon4').style.display = 'flex';

        // Show the exit button
        exitButton.style.display = 'block';

        document.getElementById('minecraftHeartsContainer').style.display = 'flex';

        if (gameState.gamestart === 0) {
            showStartScreen(true);
            updateHearts(gameState.hearts);
        } else if (typeof pauseAnimation === 'function' && pauseAnimation()) {
            showPauseScreen(true);
            updateHearts(gameState.hearts);
        } else {
            showPauseScreen(false);
        }

        myGameGlobals.canAcceptInput = true;

        
        if (gameState.gameover) {
            showGameOverScreen(true)
            updateHearts(gameState.hearts);
        } else if (gameState.gamestart === 1) {
            showPauseScreen(true)
            updateHearts(gameState.hearts);
        }

    });

    function showStartScreen(show) {
        const startScreen = document.getElementById('startScreen');
        startScreen.style.display = show ? 'block' : 'none';
    }
    
    showStartScreen(false);

    // New stuff below and above
    function showPauseScreen(show) {
        const startScreen = document.getElementById('pauseScreen');
        startScreen.style.display = show ? 'block' : 'none';
    }

    showPauseScreen(false);

    // Add this function to hide the boss warning
    function hideBossWarning() {
        const bossWarning = document.getElementById('bossWarning');
        bossWarning.classList.add('hidden');
    }

    hideBossWarning();

    // Event listener for the Exit button
    exitButton.addEventListener('click', function () {
        //hide other game elements
        showStartScreen(false);
        // Call the pauseAnimation function from game.js
        if (typeof pauseAnimation === 'function' && gameState.gamestart === 1) {
            pauseAnimation();
            showPauseScreen(false)
        }
        // Show the popup
        // JavaScript to show the popup
        document.getElementById('popup').classList.add('visible');

    });
    yesButton.addEventListener('click', function () {
        // Perform actions when the user clicks "Yes"
        // ...
        exitButton.style.display = 'none';
        showGameOverScreen(false)

        // Hide the icon container
        document.getElementById('iconScoreContainer').style.display = 'none';

        // Hide individual icons (icon1, icon2, icon3, icon4)
        document.getElementById('icon1').style.display = 'none';
        document.getElementById('icon2').style.display = 'none';
        document.getElementById('icon3').style.display = 'none';
        document.getElementById('icon4').style.display = 'none';

        document.getElementById('minecraftHeartsContainer').style.display = 'none';

        // Show the main menu
        menu1.classList.remove('hidden');
        // Hide the exit button
        document.getElementById('popup').classList.remove('visible');

        // hide the entire score display
        document.getElementById('scoreDisplay').style.display = 'none';
        document.getElementById('scoreEl').style.display = 'none'; 
        // Hide the popup
        popup.classList.add('hidden');
        myGameGlobals.canAcceptInput = false;

    });

    // Event listener for the No button
    noButton.addEventListener('click', function () {
        document.getElementById('popup').classList.remove('visible');
        if (gameState.gamestart === 0) {
            showStartScreen(true)
        } else if (gameState.gameover) {
            showGameOverScreen(true)
        } else {
            showPauseScreen(true)
        }

    });


    function showGameOverScreen(show) {
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.style.display = show ? 'block' : 'none';
    }


    // Hearts
    const minecraftHeartsContainer = document.getElementById('minecraftHeartsContainer');
    // Function to update hearts based on player's health
     function updateHearts(playerHealth) {
        const fullHeartImage = './img/mcheart.png';
        const emptyHeartImage = './img/mcempty.png';

        // Clear existing hearts
        minecraftHeartsContainer.innerHTML = '';

        // Add hearts based on player's health
        for (let i = 0; i < 10; i++) {
        const heartDiv = document.createElement('div');
        heartDiv.classList.add('minecraft-heart');

        const heartImage = document.createElement('img');
        heartImage.src = i < playerHealth ? fullHeartImage : emptyHeartImage;
        heartImage.alt = i < playerHealth ? 'Full Heart' : 'Empty Heart';
        heartImage.width = 30;
        heartImage.height = 30;

        heartDiv.appendChild(heartImage);
        // Insert each heart before the first child (left-most position)
        minecraftHeartsContainer.insertBefore(heartDiv, minecraftHeartsContainer.firstChild);
        }
    }

    // Function to play the click sound
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0; // Reset the audio to the beginning
            clickSound.play();
        }
    }

    // Function to play the music
    function playBGM() {
        // Check if the audio element is loaded
        if (bgm) {
            // Set the audio to 15 percent or lower
            bgm.volume = 0.15;
            // Play the sound
            //bgm.play();
            bgm.play().catch(function(error) {
                console.error('Error playing background music:', error);
            });
        }
    }

});
