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

    // Event listener for the Leaderboard button

    // Event listener for the Start button in menu2
    startButton.addEventListener('click', function () {
        // Include and execute game.js
        var script = document.createElement('script');
        script.src = 'game2.js';
        showStartScreen(true);
        document.head.appendChild(script);
        menu2.classList.add('hidden');
        game.classList.remove('hidden');
    });

    function showStartScreen(show) {
        const startScreen = document.getElementById('startScreen');
        startScreen.style.display = show ? 'block' : 'none';
    }
    
    showStartScreen(false);
});


