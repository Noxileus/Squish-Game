let GameState = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameState.START;
let score = 0;
let highScore = 0;
let time = 10;
let textPadding = 15;
let gameFont;
let spiderSprite;
let alive = true;
let spiders = [];
let squishedSpider;

function preload(){
  spiderSprite = loadImage("media/Spider.png");
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  squishedSpider = loadImage("media/Squished.png");
}
class Spider { 
  constructor(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.frame = 0;
    this.direction = random([-1,1]);
    this.alive = true;
    this.squishTime = null;
  }
  move(){
    this.x += this.speed * this.direction;

    if(this.x < 0 || this.x > width){
      this.direction *= -1;
    }
    this.frame = (floor(frameCount/6)%6);
  }
  draw(){
    if(this.alive){
      push();
      translate(this.x, this.y);
      scale(this.direction,1);

      if(this.alive){
      image(spiderSprite, 0, 0, 32, 32, this.frame * 32, 0, 32, 32);
      }
      else if(this.squishTime !== null){
        image(squishedSpider, 0, 0, 32, 32);
        
        if(millis()-this.squishTime > 500){
            this.squishTime = null;
        }
      }

      pop();
    }
  }
  checkSquish(mx, my){
    if(this.alive && dist(mx, my, this.x, this.y) < 40){
      this.alive = false;
      this.squishTime = millis();
      score++;
    }
  }
  update(){
    if(!this.alive && this.squishTime !== null && millis() - this.squishTime > 500){
      this.squishTime = null;
    }
  }
}
function setup() {
  createCanvas(400, 400);
  textFont(gameFont);
  for(let i = 0; i < 5; i++){
    spiders.push(new Spider(random(width), random(height), random(1,3)));
  }
  setInterval(() => {
    if(gameState === GameState.PLAY){
      spiders.push(new Spider(random(width), random(height), random(1,3)));
    }
  }, 500)
}

function draw() {
  background(220);


  switch(gameState){
    case GameState.START:
      textAlign(CENTER, CENTER);
      text("Press ENTER to start", width/2, height/2);
      break;
    case GameState.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width-textPadding, textPadding);

      for(let spider of spiders){
        spider.move();
        spider.draw();
        spider.update();
      }

      spiders = spiders.filter(spider => spider.alive || spider.squishTime !== null);

      time -= deltaTime / 1000;
      if(time <= 0){
        gameState = GameState.END;
      }
      break;
    case GameState.END:
      textAlign(CENTER, CENTER);
      text("Press ENTER to retry", width/2, height/10-10);
      text("Game Over!", width/2, height/2-20);
      text("Score: " + score, width/2, height/2);
      if(score > highScore){
        highScore = score;
      }
      text("High Score: " + highScore, width/2, height/2+20);
      break;
  }
}
function mousePressed(){
  if(gameState !== GameState.PLAY){
    return;
  }
  for(let spider of spiders){
    spider.checkSquish(mouseX, mouseY);
  }
}
function keyPressed(){
  switch(gameState){
    case GameState.START:
      if(keyCode === ENTER){
        gameState = GameState.PLAY;
      }
      break;
    case GameState.END:
      if(keyCode === ENTER){
        restartGame();
      }
      break;  
  }
}
function restartGame(){
  score = 0;
  time = 10;
  spiders = [];
  gameState = GameState.PLAY;

  for(let i = 0; i < 5; i++){
    spiders.push(new Spider(random(width), random(height), random(1,3)));
  }
}