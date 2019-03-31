console.log("app.js...");

const FPS = 60;
const BALL_RADIUS = 20;
const NBR_OF_BALLS = 15;
const MAX_SPEED = 3;
const MIN_SPEED = 10;

const COLORS =["#E27D60","#85DCB","#E8A87C","#C38D9E","#41B3A3","#EAEDC","#D8C3A5","#8E8D8A","#E98074","#E85A4F","#D83F87","#44318D","#E98074","#A4B3B6"];

class Ball {
    constructor(id){
        this.id = id;
        this.locationX = this.randomLocationX();
        this.locationY = this.randomLocationY();
        this.ballRadius = BALL_RADIUS;
        this.velocityX = this.randomVelocity();
        this.velocityY = this.randomVelocity();
        this.ballColor = this.getRandomColor();
    }
    randomLocationX(){
        return Math.floor(Math.random() * (window.innerWidth * 0.8 - 2 * BALL_RADIUS) + BALL_RADIUS);
    }  
    randomLocationY(){
        return Math.floor(Math.random() * (window.innerHeight * 0.8 - 2 * BALL_RADIUS) + BALL_RADIUS);
    }
    randomVelocity(){
        if (Math.floor(Math.random() * 2) === 0) return this.randomPositiveVelocity();
        return this.randomNegaTiveVelocity();
    }
    randomPositiveVelocity(){
        return (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED);
    }
    randomNegaTiveVelocity(){
        return -this.randomPositiveVelocity();
    }
    move(){
        this.locationX += this.velocityX;
        this.locationY += this.velocityY;
    }
    getRandomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    setVelocityX(value){
        this.velocityX = value;
    }
    setVelocityY(value) {
        this.velocityY = value;
    }
    getLocationX(){
        return this.locationX
    }
    getLocationY(){
        return this.locationY
    }
    getBallRadius(){
        return this.ballRadius
    }
    getVelocityX(){
        return this.velocityX
    }
    getVelocityY(){
        return this.velocityY
    }
    getColor(){
        return this.ballColor
    }
}
class BouncingBallCanvas {
    initialize() {
        this.createCanvas();
        this.initializeBalls();
        setInterval(this.updateGame.bind(this), 1000/FPS);
    }
    createBallArray() {
        this.ballArray = [];
        for (let i = 0; i < NBR_OF_BALLS; i++) {
            this.ballArray.push(new Ball(i));
        }
    }
    setBallsOnClickHandler() {
        const getMousePos = (canvas, evt) => {
            let rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        const isIntersect = (point, ball) => {
            return Math.sqrt((point.x - ball.getLocationX()) ** 2 + (point.y - ball.getLocationY()) ** 2) < ball.getBallRadius();
        }
        const bounceBackClick = (ball) => {
            if (ball.getVelocityX() > 0) {
                ball.setVelocityX(ball.randomNegaTiveVelocity())
            } else ball.setVelocityX(ball.randomPositiveVelocity())
            if (ball.getVelocityY() > 0) {
                ball.setVelocityY(ball.randomNegaTiveVelocity())
            } else ball.setVelocityY(ball.randomPositiveVelocity())

        }
        this.canvas.addEventListener('click', (event) => {
            this.ballArray.forEach(ball => {
                if (isIntersect(getMousePos(canvas, event), ball)) {
                    bounceBackClick(ball);
                    console.log(`There are ${NBR_OF_BALLS} bubbles\nbubbleId ${ball.id} clicked...`);
                }
            });
        });
    }
    moveBalls() {
        this.ballArray.forEach((ball) => {
            ball.move();
        })
    }
    bounceBackWall() {
        this.ballArray.forEach((ball) => {
            if (ball.getLocationX() - ball.getBallRadius() < 0 && ball.getVelocityX() < 0)
                ball.setVelocityX(ball.randomPositiveVelocity());
            if (ball.getLocationY() - ball.getBallRadius() < 0 && ball.getVelocityY() < 0)
                ball.setVelocityY(ball.randomPositiveVelocity());
            if (ball.getLocationX() + ball.getBallRadius() > canvas.width && ball.getVelocityX() > 0)
                ball.setVelocityX(ball.randomNegaTiveVelocity());
            if (ball.getLocationY() + ball.getBallRadius() > canvas.height && ball.getVelocityY() > 0)
                ball.setVelocityY(ball.randomNegaTiveVelocity());
        })
    }
    drawCanvas(){
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ballArray.forEach((ball) => {
            this.context.beginPath();
            this.context.arc(ball.getLocationX(), ball.getLocationY(), ball.getBallRadius(), 0, 2 * Math.PI);
            this.context.fillStyle = ball.getColor();
            this.context.fill();
        })
    }
    resizeCanvas(){
        this.canvas.style.position = "absolute";
        this.canvas.setAttribute("width", window.innerWidth * 0.8);
        this.canvas.setAttribute("height", window.innerHeight * 0.8);
    }
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "canvas");
        this.canvas.setAttribute("width", window.innerWidth * 0.8);
        this.canvas.setAttribute("height", window.innerWidth * 0.8);
        let container = document.getElementById("container");
        container.appendChild(this.canvas);
        this.context = canvas.getContext("2d");
    }
    initializeBalls() {
        this.createBallArray();
        this.setBallsOnClickHandler();
    }
    updateGame() {
        this.resizeCanvas();
        this.moveBalls();
        this.bounceBackWall();
        this.drawCanvas();
    }
}
let bouncingBallCanvas = new BouncingBallCanvas();
bouncingBallCanvas.initialize();