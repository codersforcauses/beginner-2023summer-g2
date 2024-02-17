document.addEventListener('DOMContentLoaded', function () {
    // Get the audio element by id
    const bgm = document.getElementById('bgm');
    const clickSound = document.getElementById('clickSound');

    let isBGMMuted = false;
    let isSFXMuted = false;

    // Function to play the music
    function playBGM() {
        // Check if the audio element is loaded
        if (bgm) {
            // Set the audio to 50 percent or lower
            bgm.volume = 0.15;
            // Play the sound
            bgm.play();
        }
    }

    playBGM();
    
    // Function to play the click sound
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0; // Reset the audio to the beginning
            clickSound.play();
        }
    }

    // Function to toggle mute/unmute BGM
    function toggleBGM() {
        if (bgm) {
            if (isBGMMuted) {
                // Unmute BGM
                bgm.volume = 0.15; // Adjust the volume level as needed
                isBGMMuted = false;
                this.innerText = 'Mute BGM';
                playBGM();
            } else {
                // Mute BGM
                bgm.volume = 0;
                isBGMMuted = true;
                this.innerText = 'Unmute BGM';
                myGameGlobals.BGMC++;
            }
        }
    }
    
    // Function to toggle mute/unmute BGM
    function toggleSFX() {
        if (isSFXMuted) {
            // Unmute SFX
            myGameGlobals.SFXMute = false;
            isSFXMuted = false;
            this.innerText = 'Mute SFX';
            console.log(myGameGlobals.SFXMute)
        } else {
            // Mute SFX
            myGameGlobals.SFXMute = true;
            isSFXMuted = true;
            this.innerText = 'Unmute SFX';
            console.log(myGameGlobals.SFXMute)
        }
    }

    // Get all elements with the class 'mute-button'
    const muteButtons = document.querySelectorAll('.mute-button');

    // Add event listeners to all mute buttons
    muteButtons.forEach(button => {
        button.addEventListener('click', function () {
            playClickSound(); // Play click sound
            // Check which button was clicked and call the corresponding function
            if (button.innerText.includes('BGM')) {
                toggleBGM.call(button); // 'this' inside toggleBGM will refer to the clicked button
            } else if (button.innerText.includes('SFX')) {
                toggleSFX.call(button); // 'this' inside toggleSFX will refer to the clicked button
            }
        });
    });

});
