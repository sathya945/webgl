document.addEventListener('keydown', function(event) {

    if(event.keyCode == 37) {
        player.moveleft();
    }
    else if(event.keyCode == 39) {
        player.moveright();
    }

    else if (event.keyCode == 32){
        player.jump();
    }
    if(event.keyCode == 71){
        gray_scale = !gray_scale
    }
    if(event.keyCode == 70){
        flash = !flash
    }
});