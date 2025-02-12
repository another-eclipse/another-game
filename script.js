window.addEventListener('load', function() {

    const canvas = document.getElementById('canvas1');
    const pressSpace = document.getElementById("pressSpace");
    const ctx = canvas.getContext('2d');
    let statusText = document.getElementById("statusText");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const idleRight = document.getElementById("idleRight");
    const idleLeft = document.getElementById("idleLeft");

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
                    console.log(this.keys)
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
    let lastKey = 'right';
    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth * 0.5;
            this.gameHeight = gameHeight * 0.9;
            this.image = idleRight;
            this.width = 200;
            this.height = 181.83;
            this.x = this.gameWidth/2 - this.width/2;
            this.y = this.gameHeight;
            this.vy = 0;
            this.weight = 0.3;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 6;
            this.speed = 0;
            this.maxSpeed = 3;
            this.fps = 15;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
        }
        draw(context){
            context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime){
            if(input.keys.indexOf('ArrowRight') > -1){
                if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                    this.speed = 3;
                    this.vy -= 15;
                } else {
                    this.speed = 3;
                }
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                    this.speed = -3;
                    this.vy -= 15;
                    this.frameY = 1;
                } else {
                    this.speed = -3;
                    this.frameY = 1;
                }
                this.frameY = 1;
                
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 15;
            } else {
                this.speed = 0;
            }

            

            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            if (this.speed > 0) {
                this.image = idleRight;
                lastKey = 'right'
            }
            if (this.speed < 0){
                this.image = idleLeft;
                lastKey = 'left'
                
            } 
    

            // vertical movement
            this.y += this.vy;
            if (!this.onGround()){
                if(lastKey == 'right'){
                    this.frameY = 2;
                    lastKey = 'right';
                    this.maxFrame = 6;
                } else if(lastKey == 'left'){
                    this.frameY = 3;
                    lastKey = 'left'
                    this.maxFrame = 6;
                }
                this.vy += this.weight;
                this.maxFrame = 5;
               
            } else {
                
                if(lastKey == 'right'){
                    this.frameY = 0;
                    this.vy = 0;
                    this.maxFrame = 6;
                } else if(lastKey == 'left'){
                    this.frameY = 1;
                    this.vy = 0;
                    this.maxFrame = 6;
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
                    this.frameY = 4;
                    this.maxFrame = 6;
                   
                } else if(lastKey == 'left'){
                    this.frameY = 5;
                    this.maxFrame = 6;
                   
                } 
            }

            if(this.speed < 0 && this.onGround()){
                this.frameY = 7;
                this.maxFrame = 8;
            } else if (this.speed > 0 && this.onGround()){
                this.frameY = 6;
                this.maxFrame = 8;
            } else {
                this.maxFrame = 6;
            }

            if (this.x >= this.gameWidth - this.x*0.3 && input.keys.indexOf('ArrowRight') > -1){
                background.update('forward')
                sign1.update('forward')
            } else if (this.x <= this.gameWidth * 0.1 && input.keys.indexOf('ArrowLeft') > -1){
                background.update('back')
                sign1.update('back')
            }
            
        }
        
        onGround(){
       
            return this.y >= this.gameHeight - this.height
        }
    }


    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("backgroundImage");
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = window.innerHeight;
            this.speed = 2;
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
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("sign1");
            this.width = 200;
            this.height = 200;
            this.x = gameWidth/2;
            this.y = gameHeight * 0.7;
            this.speed = 2;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
           
        }
        update(orientation){
            if(orientation == "forward"){
                this.x -= this.speed;
                
            } else if (orientation == "back"){
                this.x += this.speed;
                
            }
            
            if (this.x >= player.x - 100 && this.x <= player.x + 100){
                pressSpace.style.display = "block";
                pressSpace.style.marginLeft = this.x + 60 +"px";
                if(input.keys.indexOf(' ') > -1){
                         
                        statusText.innerHTML = "This is a test message."
                    
                }
            } else {
                pressSpace.style.display = "none";
                statusText.innerHTML = ""
            };
                
            
            
        }
    }

    

   

 

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height) 
    const sign1 = new InteractableItem(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw(ctx);
        sign1.draw(ctx);
        sign1.update();
        player.draw(ctx);
        player.update(input, deltaTime);
        
        
        requestAnimationFrame(animate);
    }
animate(0);

})