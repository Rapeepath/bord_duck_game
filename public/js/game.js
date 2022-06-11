const area = document.getElementById('area');
const srt =document.getElementById('start');
const wn = document.getElementById('win');
const btn_start = document.getElementById('btn_start');

const random=(min,max)=>{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const creat =()=>{
    const {left,top,bottom,right}=area.getBoundingClientRect()
    console.log(left,right,top,bottom)
     return [...Array(5)].map(()=>{
        return{
            x:random(left,right-20),
            y:bottom-20,
            speedX:random(-10,10),
            speedY:random(5,10)
        }
    })
}

const creatElem=(duck)=>{
    const duckelem = document.createElement('div')
    duckelem.className = "duck";
    duckelem.style.left =`${duck.x}px`
    duckelem.style.top =`${duck.y}px`
    area.appendChild(duckelem);
    return {duck,duckelem};
}

const chang_img=(duck,duckelem)=>{
    const direc = duck.speedX<0?"left":"right";
    return duckelem.style.backgroundImage.indexOf('1') !==-1?
    `url(img/${direc}_2.png)`:
    `url(img/${direc}_1.png)`
}

function move(duck,duckelem){
    const {left,right,top,bottom} = area.getBoundingClientRect();
     if(duck.x < left||duck.x > right-20){
        duck.speedX*=-1;
    } if(duck.y > bottom-20||duck.y < top){
        duck.speedY*=-1;
    }
    duck.x += duck.speedX;
    duck.y -= duck.speedY;

    duckelem.style.left =`${duck.x}px`;
    duckelem.style.top =`${duck.y}px`;

    duckelem.style.backgroundImage = chang_img(duck,duckelem);
}

function click(even){
   const {bottom} = area.getBoundingClientRect();
    const duckelem = even.target;
    clearInterval(duckelem.intval);
    duckelem.style.transition='2s top'
    duckelem.style.top = `${bottom-20}px`;

    setTimeout(()=>{        
        const duck = document.getElementsByClassName('duck');
        area.removeChild(duckelem);
        console.log(duck)
        console.log(duck.length)
        if(duck.length===0){
            console.log('winner')
            wn.style.opacity = '1';
            btn_start.style.opacity = '1';
        }
    },2000)
}

function run(){
    srt.style.opacity = '0';
    btn_start.style.opacity = '0';
    let duck = creat();
    let duckelem = duck.map(creatElem);
    duckelem.forEach(({duck,duckelem})=>{
        duckelem.intval=setInterval(()=>{
            move(duck,duckelem);
        },100)
        duckelem.addEventListener('click',click);
    })
}
