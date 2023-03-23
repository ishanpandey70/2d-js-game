// The window object represents browsers window
// Global variables are properties of the window object
// Global functions are methods of window object
//HTML DOM is also a property of window object


//The load event listener fires when the whole page has 
// been loaded including all dependent resources such as stylesheets and images
window.addEventListener('load',function(){
    //canvas set up
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    //Drawing context is a built in object that contains all properties
    // that allow us to draw and animate colours shapes and other graphics on HTML canvas
// Drawing context is called using getcontext method
//For 3D rendering , you can use WebGl
canvas.width = 1500;
canvas.height = 500;

//Javascript is prototype based object oriented language which means it doesn't have class, it has prototypes
//However classes can be used as a syntactical sugar
class InputHandler{
    constructor(game){
        this.game= game;
        window.addEventListener('keydown',e =>{
            if(  ((e.key==='ArrowUp') ||(e.key==='ArrowDown')) && this.game.keys.indexOf(e.key)===-1)
            {
                this.game.keys.push(e.key);
            }
            else if (e.key===' ')
            {
                this.game.player.shootTop();
            }
   

        });
        window.addEventListener('keyup',e=>{
            if(this.game.keys.indexOf(e.key)>-1)
            {
                this.game.keys.splice(this.game.keys.indexOf(e.key),1);
            }
        })
    }

}
class Projectile{
    //used for making lasers
    constructor(game,x,y){
        this.game = game;
        this.x = x;
        this.y= y;
        this.width = 10;
        this.height = 3;
        this.speed = 3; //3 pixels perframe and animation is 60 frames per second
        this.markedforDeletion = false;

    }
    update(){
        this.x += this.speed; //x will change using update method as a object created becomes updated
        if(this.x>this.game.width*0.8)
        {
            this.markedforDeletion= true;
        }
    }
    draw(context){
        context.fillStyle='yellow';
        context.fillRect(this.x,this.y,this.width,this.height);
    }

}
class Particle{

}
class Player{
    constructor(game){
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 20 ; 
        this.y = 100;
        this.speedY=0;
        this.maxspeed= 2;
        this.projectiles=[];
        

    }
    update(){
        if(this.game.keys.includes('ArrowUp')) this.speedY=-this.maxspeed;
        else if(this.game.keys.includes('ArrowDown')) this.speedY=this.maxspeed;
        else this.speedY= 0;
        this.y+= this.speedY;
        //So when update runs 60 times , (basically 60 fps ) , each time y is updated when update method is called . Then draw method draws new rectangle of same width and height but just initial points different.
        //Hence an illusion is given that the box is moving up , it just creates a new black box and removes the old one as clear rect is called before draw
        //handling projectiles in update method
        this.projectiles.forEach(projectile =>{
            projectile.update();
        } );
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedforDeletion); 
        //filter method creates a new array and keeps all those projectiles whose marked for deletion is false; so overriding the new array
    }
    draw(context){
        //The fillRect() method draws a filled rectangle whose starting point is at (x, y) and whose size is specified by width and height. 
        context.fillStyle='black';
        //this will make the character black so that it is not affected by yellow colour of laser
        context.fillRect(this.x, this.y,this.width,this.height);
        this.projectiles.forEach( projectile => {
            projectile.draw(context);
        });

    }
    shootTop(){
        if(this.game.ammo >0){
        this.projectiles.push(new Projectile(this.game,this.x,this.y+30));
        this.game.ammo--;
        }
        
    }

}
class Enemy{
    constructor(game){
        this.game = game; 
        this.x = this.game.width;
        this.speedX = Math.random()*(-10) -10;
        this.markedforDeletion = false;
        this.lives = 5;
        this.score = this.lives;

    }
    update(){
        this.x += this.speedX;
        if(this.x + this.width<0) 
        {
            this.markedforDeletion= true;
        }
    }
    draw(context)
    {
        context.fillStyle = 'red';
        context.fillRect(this.x,this.y, this.width,this.height);
        context.fillStyle='black';
        context.font = '20px Helvetica'
        context.fillText("Lives" +this.lives, this.x,this.y);
    }

}
class Angler1 extends Enemy{  //angler 1 is child of Enemy class
    constructor(game){
        super(game);
        this.width=228;
        this.height = 169;
        this.y = Math.random()* (this.game.height * 0.9 - this.height);
    }
}

class Layer{

}
class Background{

}
class UI{
    constructor(game){
        this.game= game;
        this.fontSize = 25;
        this.fontFamily ="Helvetica";
        this.color = "white";

    }
    draw(context){
        context.save()
        context.fillStyle = this.color;
        context.shadowOffsetX =2; //defines shadow offset
        context.shadowOffsetY =2; //defines shadow offset
        context.shadowColor ='black'; //defines shadow offset
        context.font = this.fontSize + 'px ' + this.fontFamily;
        //show score
        context.fillText("Score :"+ this.game.score,20,40); // shows game's score at 20 , 40 coordinate
        //ammo
        
        for (let i =0 ; i< this.game.ammo ; i++ )
        {
           context.fillRect(20 + 5*i,50,3,20); 

        }
        //timer
        const formattedTIme = (this.game.gameTime*0.001).toFixed(1);
        context.fillText('Timer :'+formattedTIme,20,100);




        //game over messages
        if(this.game.gameOver)
        {
            context.textAlign = 'center';
            let message1;
            let message2;
            
            if(this.game.score > this.game.winningScore)
            {
                message1 = 'You Win';
                message2 = 'Well Done';
            }
            else {
                message1 = 'You Loose';
                message2= 'Try Again';
            }
            context.font = '50 px' + this.fontFamily;
            context.fillText(message1, this.game.width*0.5,this.game.height*0.5-40);
            context.font = '25 px' + this.fontFamily;
            context.fillText (message2, this.game.width*0.5,this.game.height*0.5+40);
        }



        context.restore();
        
    }

}
class Game{
    constructor(width,height){
        this.width= width;
        this.height= height;
        this.player = new Player(this); //refers to current game object which will be passed in Player constructor
        this.input = new InputHandler(this)
        this.keys= [];
        this.enemies =[];
        this.enemyTimer= 0;
        this.ammo =20;
        this.maxAmmo =50;
        this.ammoTimer = 0; 
        this.ammoInterval = 500;
        this.ui = new UI(this);
        this.enemyInterval = 100;
        this.gameOver =false;
        this.score = 0;
        this.winningScore = 10;
        this.gameTime = 0 ; 
        this.timeLimit =500000;

    }
    update(deltaTime){
          if(!this.gameOver) this.gameTime+= deltaTime;
          if(this.gameTime>this.timeLimit) this.gameOver =true;
        
        if(this.ammoTimer > this.ammoInterval)
        {
            this.ammoTimer =0; 
            if(this.ammo<this.maxAmmo)
            {
                this.ammo++;
            }
            console.log(this.enemies);
            this.enemies.forEach(enemy => {
                enemy.update();
                if(this.checkCollisions(this.player, enemy))
                {
                    enemy.markedforDeletion = true;
                }
                this.player.projectiles.forEach(projectile=>
                    {
                        if(this.checkCollisions(projectile,enemy))
                        {
                            enemy.lives--;
                            projectile.markedforDeletion= true;
                            if(enemy.lives<=0)
                            {
                                enemy.markedforDeletion = true;

                                if(!this.gameOver)this.score+= enemy.score;
                                if(this.score >this.winningScore)
                                {
                                    this.gameOver =true;

                                }
                            }
                        }
                    })
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedforDeletion) // basically filters out all the enemy whose marked for deletion is false and makes them remain in this.enemy array

            console.log(this.enemyTimer);
            console.log(this.enemyInterval);
            if(this.enemyTimer>this.enemyInterval && !this.gameOver)
            { 
                this.addEnemy();
                this.enemyTimer = 0;

            }
            else{
                this.enemyTimer+=deltaTime;
            }
            
            console.log(this.enemies);
        
        }
        else 
        {
            this.ammoTimer+=deltaTime;
        }
       
        this.player.update();

    }
    draw(context){
        this.player.draw(context);
        
        this.ui.draw(context);
 
        this.enemies.forEach(enemy => {

            enemy.draw(context);
        });

      

    }
    addEnemy(){
        this.enemies.push(new Angler1(this)); //child class is called 
        console.log(this.enemies);
    }
    checkCollisions(rect1 , rect2){ //collision detection method which will return true when there is collison
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        )

    }

}
// There is a certain sequence to making classes . If Projectile is being used in player class , it should be declared before player class

//Actual calling of game class
 const game = new Game(canvas.width,canvas.height);
 //this loops runs 60 timees per second giving us the idea of motion . Every time it runs , it clears the rect, updates y and then draws the context again.  60 times in a second is just 60 pictures which become like animation
let lastTime =0;
 function animate(timeStamp){
    
    const deltaTime  = timeStamp- lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    //requestAnimationFrame() tells the browser that we wish to perform an animation and it requests that the browser calls a specified function to update an animation before the next repaint
    requestAnimationFrame(animate)
}
animate(0);


}) 