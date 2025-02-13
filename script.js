window.addEventListener('load', function() {

    const canvas = document.getElementById('canvas1');
    const pressSpace = document.getElementById("pressSpace");
    const ctx = canvas.getContext('2d');
    let statusText = document.getElementById("statusText");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const idleRight = document.getElementById("idleRight");
    const idleLeft = document.getElementById("idleLeft");
    const runRight = document.getElementById("runRight");
    const runLeft = document.getElementById("runLeft");
    const jumpRight = document.getElementById("jumpRight");
    const jumpLeft = document.getElementById("jumpLeft");
    const fallRight = document.getElementById("fallRight");
    const fallLeft = document.getElementById("fallLeft");

    const backgroundImage0 = this.document.getElementById("backgroundImage");
    const backgroundImage01 = this.document.getElementById("backgroundImage1");
    const backgroundImage02 = this.document.getElementById("backgroundImage2");
    const backgroundImage03 = this.document.getElementById("backgroundImage3");
    const backgroundImage04 = this.document.getElementById("backgroundImage4");
    const backgroundImage05 = this.document.getElementById("backgroundImage5");

    const signImg1 = document.getElementById("sign1");
    const signImg2 = document.getElementById("sign2");

    let lastOri;

    class InputHandler {
        constructor(){
            this.keys = [];
            
            window.addEventListener('keydown', e => {
                
                if ((e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' || 
                    e.key === ' ' || 
                    e.key === 'ArrowRight') && 
                    this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                    
                }
            })

            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === ' ' || 
                    e.key === 'ArrowLeft' || 
                    e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    
                }
            })
        }
    }
    let lastKey = "";
    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth * 0.6;
            this.gameHeight = gameHeight;
            this.image = idleRight;
            this.width = 500;
            this.height = 500;
            this.x = this.gameWidth/2 - this.width/2;
            this.y = this.gameHeight;
            this.vy = 0;
            this.weight = 0.2;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 4;
            this.speed = 0;
            this.maxSpeed = 3;
            this.fps = 6;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
        }
        draw(context){
            context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime){
            if(input.keys.indexOf('ArrowRight') > -1){
                if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                    this.image = jumpRight
                    this.speed = 3;
                    this.vy -= 15;
                    lastKey = 'right'
                } else {
                    this.speed = 3;
                    this.image = runRight;
                    this.maxFrame = 5;
                    lastKey = 'right'
                }
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                    this.speed = -3;
                    this.vy -= 15;
                    this.image = jumpLeft;
                    lastKey = 'left'
                } else {
                    this.speed = -3;
                    this.maxFrame = 5;
                    this.image = runLeft;
                    lastKey = 'left'
                }
               
                
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 15;
                if(lastKey = 'right'){
                    this.image = jumpRight;
                    this.maxFrame = 4;
                } else if (lastKey = 'left'){
                    this.image = jumpLeft;
                    this.maxFrame = 4;
                }
            } else {
                this.speed = 0;
                if(lastKey = 'right'){
                    this.image = idleRight;
                    this.maxFrame = 3;
                } else if (lastKey = 'left'){
                    this.image = idleLeft;
                    this.maxFrame = 3;
                }
            }

            

            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            if (this.speed > 0) {
                this.image = runRight;
               lastKey = 'right'
                this.maxFrame = 5;
            }
            if (this.speed < 0){
                this.image = runLeft;
                lastKey = 'left'
                this.maxFrame = 5;
            } 

            if (lastKey == 'right' && this.speed == 0){
                this.image = idleRight;
                this.maxFrame = 3;
            } else if (lastKey == 'left' && this.speed == 0){
                this.image = idleLeft;
                this.maxFrame = 3;
            }


            // vertical movement
            this.y += this.vy;
            if (!this.onGround()){
                if(lastKey == 'right'){
                    this.image = jumpRight;
                    lastKey = 'right'
                    this.maxFrame = 3;
                } else if(lastKey == 'left'){
                    this.image = jumpLeft;
                    lastKey = 'left'
                    this.maxFrame = 3;
                }
                this.vy += this.weight;
                this.maxFrame = 3;
               
            } else {
                
                if(lastKey == 'right'){
                    this.image = idleRight;
                    this.vy = 0;
                    this.maxFrame = 3;
                } else if(lastKey == 'left'){
                    this.image = idleLeft;
                    this.vy = 0;
                    this.maxFrame = 3;
                } 
            }

            if (this.y >= this.gameHeight - this.height) this.y = this.gameHeight - this.height

            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            if(this.vy >0){
                if(lastKey == 'right'){
                    this.image = fallRight;
                    this.maxFrame = 3;
                   
                } else if(lastKey == 'left'){
                    this.image = fallLeft;
                    this.maxFrame = 3;
                   
                } 
            }

            if(this.speed < 0 && this.onGround()){
                this.image = runLeft;
                this.maxFrame = 5;
                lastKey = 'left';
            } else if (this.speed > 0 && this.onGround()){
                this.image = runRight;
                this.maxFrame = 5;
                lastKey = 'right'
            } else {
                this.maxFrame = 4;
            }

             if (sign1.x >= this.x - 50 && sign1.x <= this.x + 250){
                sign1.drawText(bodyText1)
                    
            } else if (sign2.x >= this.x - 50 && sign2.x <= this.x + 250){
                sign2.drawText(bodyText2)
            } else {
                statusText.style.display = "none";
                pressSpace.style.display = "none";
                statusText.innerHTML = ""
            };

            if (this.x >= this.gameWidth - (this.x -50) && input.keys.indexOf('ArrowRight') > -1){
                background.update('forward')
                background1.update('forward')
                background2.update('forward')
                background3.update('forward')
                background4.update('forward')
                background5.update('forward')
                sign1.update('forward', bodyText1)
                sign2.update('forward')
             lastKey = 'right'
             lastOri = 'forward';
            } else if (this.x <= this.gameWidth * 0.1 && input.keys.indexOf('ArrowLeft') > -1){
                background.update('back')
                background1.update('back')
                background2.update('back')
                background3.update('back')
                background4.update('back')
                background5.update('back')
                sign1.update('back', bodyText1)
                sign2.update('back')
                lastKey = 'left';
                lastOri = 'back';
            }
            
        }

        
        
        onGround(){
       
            return this.y >= this.gameHeight - this.height
        }
    }


    class Background {
        constructor(gameWidth, gameHeight, bgImage, bgSpeed){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = bgImage;
            this.x = 0;
            this.y = gameHeight - gameHeight;
            this.width = gameWidth;
            this.height = gameHeight;
            this.speed = bgSpeed;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        
        update(orientation){
            if(orientation == "forward"){
                this.x -= this.speed;
                if (this.x < 0 - this.width) this.x = 0;
            } else if (orientation == "back"){
                this.x += this.speed;
                if (this.x < 0 - this.width) this.x = 0;
            }
            
        }
    }

    class InteractableItem {
        constructor(gameWidth, gameHeight, signImg, position){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = signImg;
            this.width = 200;
            this.height = 300;
            this.x = position;
            this.y = gameHeight * 0.65;
            this.speed = 2;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
           
        }
        update(ori){
            if(ori == "forward"){
                this.x -= this.speed;
                
            } else if (ori == "back"){
                this.x += this.speed;
                
            }
        }
        drawText(bodyText){
            pressSpace.style.display = "block";
            pressSpace.style.marginLeft = this.x + 60 +"px";
            if(input.keys.indexOf(' ') > -1){
                    statusText.style.display = "block";
                    statusText.innerHTML = bodyText;
        }
    }
}





    
    let bodyText1 = "Hi! I'm a sign :3 <br> I was put here by Valentina to tell you you are cute! And to prepare you for the test at the end of this perilous path full of invisible enemies... <br> Onward, brave Kjuno!"

    let bodyText2 = "Hi, me again!"


 

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height, backgroundImage0, 2) 
    const background1 = new Background(canvas.width, canvas.height, backgroundImage01, 1) 
    const background2 = new Background(canvas.width, canvas.height, backgroundImage02, 0.6) 
    const background3 = new Background(canvas.width, canvas.height, backgroundImage03, 0.4) 
    const background4 = new Background(canvas.width, canvas.height, backgroundImage04, 0.1) 
    const background5 = new Background(canvas.width, canvas.height, backgroundImage05, 0) 
    const sign1 = new InteractableItem(canvas.width, canvas.height, signImg1, canvas.width*0.5);
    const sign2 = new InteractableItem(canvas.width, canvas.height, signImg2, canvas.width);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background5.draw(ctx);
        background4.draw(ctx);
        background3.draw(ctx);
        background2.draw(ctx);
        background1.draw(ctx);
        background.draw(ctx);
        sign1.draw(ctx);
        sign2.draw(ctx);
        
        sign1.update();
        sign2.update();
        player.draw(ctx);
        player.update(input, deltaTime);
       
        
        requestAnimationFrame(animate);
    }
animate(0);

})