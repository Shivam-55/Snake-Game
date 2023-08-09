// snake ki initial position 
let direction = {
    x:0,
    y:0
}
let lastdirection=direction ;
//sounds jo game mai honge
const foodsound = new Audio('food.mp3');
const gameoversound = new Audio('game_over_sound1.mp3');
const gameoversound2 = new Audio('game_over_sound2.mp3');
const musicsound = new Audio('snake_game.mp3');
let speed=2;
let lastpainttime=0;
let score=0;

// snake ke bht saare particals honge so that's why ek array bnana pd rha hai saare particals ko rkhne ke liye
let snakearr=[
    { x: 5,y:6} 
];


//food ek partical hai jo ek alag alag coordiantes pr rhega bs ek partical jisme 2 values hai so food
// ek object hai only array ki jrurt nhi hai snake mai parts hai isliye array of objects ki jrurt hai
let food={
    x:13,
    y:14
}

// game board ko paint krne ki speed ko ctrl krne ke liye 
function main(ctime){
    //loop create krne ke liye phirse requestanimationframe ka use kr rhe hai
    requestAnimationFrame(main);

    // frame per second / speed ctrl krne ke liye condn
    if((ctime-lastpainttime)/1000< 1/speed){
        return ;
    }
    lastpainttime=ctime;

    // mai function call jaha game se related code hai
    gameengine();
}

//board class vale element ko select kiya
const board = document.querySelector('.board');  
let sc = document.querySelector('#score');

//for high score
let highsc = localStorage.getItem("highsc");
if(highsc == null){
    localStorage.setItem("highsc",JSON.stringify(0));
}
document.querySelector('#highscore').innerHTML = "High Score : " + highsc ;




function gameengine(){
    //game engine 2 parts mai work krega
    // part 1: updating the snake 
    // part 2: displaying the snake
    
    //collide krne pr kya ho
    if(isCollide(snakearr)){
        musicsound.pause();
        gameoversound.play();
        gameoversound2.play();

        // direction ko update kr rhe 0,0 se taaki snake stationary rhe move na kre
        // bcz jaise hi apn snake ke head mai direction add krenge to uss direction mai
        // snake ka head copy hoga aur pichla page ke html ko clear kr rhe to ese snake move krta hua dikhega
        // jaise jaise head mai direction ki value ko add krte jate udher snake ka head copy hote jata and
        // body ko bhi copy krte jate aur piche ka html clear krte jate jisse head baar baar bnta hua nhi dikhta hau
        // so in short snake ko stationary rkhne ke liye direction 0,0 kiya hai
        direction={
            x:0,y:0
        }
        alert("Game over press any key to start again");
        gameoversound.pause();

        // reinitialise speed 
        speed=2;

        //updating highscore
        if(highsc < score){
            localStorage.setItem("highsc",JSON.stringify(score)) ;
            document.querySelector('#highscore').innerHTML = "High Score : " + localStorage.getItem("highsc") ;
        }
        snakearr=[{ x: 2,y:2}];
        // musicsound.play();
        score=0;
        sc.innerHTML = "Score : " + score ;
    }

    //agr snake ne khana kha liya hai then snake ki size ko increase krna 
    // and randomly food ko doosare jgh generate krna --
    if(snakearr[0].x === food.x && snakearr[0].y === food.y){
        score+=5;
        sc.innerHTML = "Score : " + score ;
        speed+=0.5 ;
        foodsound.play();
        snakearr.unshift( { x : snakearr[0].x + direction.x , y : snakearr[0].y + direction.y } );
        let a = 2;
        let b = 8;
        food = { x:Math.floor(a+(b-a)*Math.random()),y:Math.floor(a+(b-a)*Math.random()) }
    }

    //moving the snake --
    for (let i = snakearr.length-2; i >= 0; i--) {
        // naya object bna kr move krne ke liye esa kr rhe hai vrna referencing problem create hogi aur at the end
        // saare block ek hi block pr point krne lgenge agr naya object bna kr copy nhi kiya to so we have to do like this
        snakearr[i+1]={...snakearr[i]} ;
    }
    //loop mai last se lekr 1st block ko ek ek position aage bdha di mtlb pure body ko move kr diya
    // pr head ko kha change kiya to keyboard pr jo dabaya usse apn direction object ko change kr hi rhe hai
    // usko head vale mai add krdo usse snake ka head ka bhi position change ho jaega
    snakearr[0]. x += direction.x ;
    snakearr[0]. y += direction.y ;

    //  esa na ho ki board pr alag alag snake dikhne lge ek hi snake dikhe uske liye pehle ke saare clear kr rhe hai
    board.innerHTML="" ;

    //snake body ko board pr display krne ke liye
    snakearr.forEach((element,index)=>{
        snakeelement = document.createElement('div');
        snakeelement.style.gridRowStart=element.y ;
        snakeelement.style.gridColumnStart=element.x ;
        if(index==0){
            snakeelement.classList.add("head");
            // if(direction.x == 1){
            //     snakeelement.style.transform = "rotate(-90deg)"
            // }
            // else if(direction.x == -1){
            //     snakeelement.style.transform = "rotate(90deg)"
            // }
            // else if(direction.y == -1){
            //     snakeelement.style.transform = "rotate(180deg)"
            // }
            // else if(direction.y == 1){
            //     snakeelement.style.transform = "rotate(0deg)"
            // }
        }
        else{
            snakeelement.classList.add("snakebody");
        }
        board.appendChild(snakeelement);
    })

    // food ko board pr dikhane ke liye
    // ek div bnaya and phir uska coordinate select kiya aur phir class add kri jisse css add kr paye nd phir 
    // append kr diya board pr same yhi chij snake body ke liye bhi kia hai
    foodelement = document.createElement('div');
    foodelement.style.gridRowStart=food.y ;
    foodelement.style.gridColumnStart=food.x ;
    foodelement.classList.add('food');
    board.appendChild(foodelement);
}


//collide check krne vala fn
function isCollide(snakearr){
    for (let i = 1; i < snakearr.length; i++) {
        if(snakearr[i].x === snakearr[0].x && snakearr[i].y === snakearr[0].y){
            return true ;
        }
    }
    if(snakearr[0].x<=1 || snakearr[0].x>=18 || snakearr[0].y<=1 || snakearr[0].y>=18){
        return true; 
    }
}

// Paint krne ke liye requestanimationframe ka use kr rha hai
window.requestAnimationFrame(main);

window.addEventListener('keydown', e=> {
    // direction={x:0,y:1} ; // starting the game
    musicsound.play();
    switch(e.key){
        case "ArrowUp" :
            // if condns lgai bcs agr neeche ja rha hai nd aapne arrowup press kiya to snake achanak uper nhi 
            // move krte basically jis direction mai ja rha hai uske opposite mai by pressing opposite direction
            // key snake opposite direction mai move nhi krta hai 
            if(lastdirection.y == 1) break;
            direction.x = 0 ;
            direction.y = -1 ;
            break;
        case "ArrowDown" :
            if(lastdirection.y === -1) break;
            direction.x = 0 ;
            direction.y = 1 ;
            break;
        case "ArrowLeft" :
            if(lastdirection.x === 1) break;
            direction.x = -1 ;
            direction.y = 0 ;
            break;
        case "ArrowRight" :
            if(lastdirection.x === -1) break;
            direction.x = 1 ;
            direction.y = 0 ;
            break;
        default :
    }
    lastdirection=direction ;
})