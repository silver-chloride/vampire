class Thing {
    constructor(isVampire=false, laytencyTime=3, Fatality=3+(Math.random()*2-1)) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        this.x = Math.random() * windowWidth;
        this.y = Math.random() * windowHeight;

        this.dx = 0;
        this.dy = 0;
        this.speed = 15;

        this.radius = 10;

        this.isVampire = isVampire;

        this.laytencyTime = laytencyTime;
        this.Fatality = Fatality;

        this.div = document.createElement('div');
        this.div.classList.add('thing');

        document.body.appendChild(this.div);

        if(this.isVampire) {
            this.intoVampire();
        }

        setInterval(() => {
            let angle = Math.random() * Math.PI * 2;
            this.dx = Math.cos(angle) * this.speed;
            this.dy = Math.sin(angle) * this.speed;
        }, 200);

        setInterval(() => {
            let presentX = this.x + this.dx;
            let presentY = this.y + this.dy;

            if (presentX <= windowWidth-this.radius && presentX >= 0 ) {
                this.x += this.dx;
            }
            if (presentY <= windowHeight-this.radius && presentY >= 0) {
                this.y += this.dy;
            }

            this.div.style.left = this.x + 'px';
            this.div.style.top = this.y + 'px';
        }, 50);
    }

    intoVampire() {
        this.isVampire = true;
        this.div.classList.add('vampire');
    }
}
const dayDisplay = document.getElementById('day');

let day = 0;

let vampires = [new Thing(true)];
let persons = [];
let die = [];
let laytency = [];

for (let i=0; i<250; i++) {
    persons.push(new Thing());
}

setInterval(() => {
    for (const vampire of vampires) {
        for (let i=0; i<persons.length; i++) {
            if( vampire.x < persons[i].x + persons[i].radius &&
                vampire.x + vampire.radius > persons[i].x &&
                vampire.y < persons[i].y + persons[i].radius &&
                vampire.y + vampire.radius > persons[i].y) {
                if (Math.random()*100 < vampire.Fatality*3.5) {
                    persons[i].Fatality = vampire.Fatality + (Math.random()*2-1);
                    laytency.push(persons[i]);
                    persons.splice(i, 1);
                }
            }
        }
    }
}, 50);

setInterval(() => {
    day += 1;
    dayDisplay.innerText = `시간 : ${day}일`;

    for (let i=0; i<laytency.length; i++) {
        laytency[i].laytencyTime -= 1;

        if (laytency[i].laytencyTime === 0) {
            laytency[i].isVampire = true;
            laytency[i].intoVampire();
            vampires.push(laytency[i]);
            laytency.splice(i, 1);
        }
    }

    for (let i=0; i<vampires.length; i++) {
        if (vampires[i].Fatality > Math.random()*100) {
            vampires[i].div.style.display = 'none';
            vampires.splice(i, 1);
        }
    }

}, 500);