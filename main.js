class Thing {
    /**
     * 무작위로 움직이는 개체를 생성하는 함수입니다.
     * @param {boolean} isVampire 개체가 뱀파이어인지의 여부입니다. (기본값 : false)
     * @param {number} laytencyTime 개체가 뱀파이어에게 감염되었을때의 잠재기입니다. (기본값 : 3)
     * @param {number} fatality 개체가 뱀파이어에게 감염되었을때의 치사율입니다. (기본값 : 3+(-1~1사이의 난수))
     * @param {number} speed 개체가 0.05초당 움직이는 거리입니다. (기본값 : 15)
     */
    constructor(isVampire=false, laytencyTime=3, fatality=3+(Math.random()*2-1), speed=15) {
        this.speed = speed;

        this.isVampire = isVampire;

        this.laytencyTime = laytencyTime;
        this.fatality = fatality;

        const windowWidth = window.innerWidth; //브라우저 창의 가로 길이
        const windowHeight = window.innerHeight; //브라우저 창의 새로 길이

        this.x = Math.random() * windowWidth; //개체의 x좌표 (기본값 : 0~브라우저 창의 가로길이 사이의 난수)
        this.y = Math.random() * windowHeight; //개체의 y좌표 (기본값 : 0~브라우저 창의 새로길이 사이의 난수)

        this.dx = 0; //개체의 x좌표의 변화량
        this.dy = 0; //개체의 y좌표의 변화량

        this.div = document.createElement('div'); //개체의 div 엘리먼트
        this.div.classList.add('thing'); //개체가 가진 div의 클래스 리스트에 thing을 추가
        this.radius = 10; //개체의 반지름

        document.body.appendChild(this.div); //개체가 가진 div를 body의 자식으로 추가


        //만약 개체의 뱀파이어 여부가 참이면 intoVampire함수를 호출
        if(this.isVampire) {
            this.intoVampire();
        }

        //0.2초 마다 개체의 이동방향을 0에서 2pi라디안(360도)사이의 난수로 설정하고
        //개체의 x좌표 변화량을 cos(이동방향) * 속도로 설정, 개체의 y좌표 변화량을 sin(이동방향) * 속도로 설정
        setInterval(() => {
            let angle = Math.random() * Math.PI * 2; //이동방향을 2pi라디안(360도)로 설정
            this.dx = Math.cos(angle) * this.speed; //x좌표 변화랑을 cos(이동방향) * 속도로 설정
            this.dy = Math.sin(angle) * this.speed; //y좌표 변화랑을 sin(이동방향) * 속도로 설정
        }, 200);
        
        //0.05초 마다 개체의 현재 x좌표(0.05초 전 x좌표 + x좌표 변화량)가 0보다 크고
        //(브라우저 창 가로 길이 - 개체 반지름)보다 작을 시 개체의 x좌표에 x좌표 변화량을 더하고
        //0.05초 마다 개체의 현재 y좌표(0.05초 전 y좌표 + y좌표 변화량)가 0보다 크고
        //(브라우저 창 새로 길이 - 개체 반지름)보다 작을 시 개체의 y좌표에 y좌표 변화량을 더함,
        //개체가 가진 div의 스타일 left를 개체 x좌표로 설정하고 스타일 top을 개체 y좌표로 설정
        setInterval(() => {
            let presentX = this.x + this.dx; //현재 x좌표
            let presentY = this.y + this.dy; //현재 y좌표

            //현재x좌표가 0보다 크고 (브라우저 창 가로 길이 - 반지름)보다 작을 시
            if (presentX >= 0 && presentX <= windowWidth-this.radius) {
                this.x += this.dx; //x좌표에 x좌표 변화량을 더함
            }

            //현재y좌표가 0보다 크고 (브라우저 창 새로 길이 - 반지름)보다 작을 시
            if (presentY >= 0 && presentY <= windowHeight-this.radius) {
                this.y += this.dy; //y좌표에 y좌표 변화량을 더함
            }

            this.div.style.left = this.x + 'px'; //개체가 가진 div의 스타일 left를 x좌표로 설정
            this.div.style.top = this.y + 'px'; //개체가 가진 div의 스타일 top를 y좌표로 설정
        }, 50);
    }
    
    //**개체를 뱀파이어로 감염시켜 isVampire 변수의 값을 true로 변경하고 개체가 가진 div의 클래스 리스트에 vampire를 추가합니다.*/
    intoVampire() {
        this.isVampire = true; //개체의 뱀파이어 여부를 참으로 설정
        this.div.classList.add('vampire'); //개체가 가진 div의 클래스 리스트에 vampire추가
    }
}

let vampires = [new Thing(true)]; //뱀파이어인 개체들의 배열
let persons = []; //사람(뱀파이어가 아닌)인 개체들의 배열
let die = []; //죽은 개체들의 배열
let laytency = []; //잠재기에 있는 개체들의 배열

//사람(뱀파이어가 아닌)인 개체를 생성하고 persons배열에 넣는 것을 250번 반복
for (let i=0; i<250; i++) {
    persons.push(new Thing());
}

//0.05초 마다 vampires배열의 원소의 x좌표와 (persons배열의 원소의 x좌표 + persons배열의 원소의 반지름)이 같고
//persons배열의 원소의 x좌표와 (vampires배열의 원소의 x좌표 + vampires배열의 원소의 반지름)이 같고
//vampires배열의 원소의 y좌표와 (persons배열의 원소의 y좌표 + persons배열의 원소의 반지름)이 같고
//persons배열의 원소의 y좌표와 (vampires배열의 원소의 y좌표 + vampires배열의 원소의 반지름)이 같을 시
//
//(vampires배열의 원소의 fatality(치사율)*3.5)% 확률로,
//
//persons배열의 원소의 fatality(치사율)을 (vampires배열의 원소의 fatality(치사율) + (-1~1사이의 난수))로 설정,
//laytency배열에 persons배열의 원소 추가, persons배열에서 persons배열의 원소 삭제
setInterval(() => {
    for (const vampire of vampires) {
        for (let i=0; i<persons.length; i++) {
            if( vampire.x < persons[i].x + persons[i].radius &&
                vampire.x + vampire.radius > persons[i].x &&
                vampire.y < persons[i].y + persons[i].radius &&
                vampire.y + vampire.radius > persons[i].y) {
                if (Math.random()*100 < vampire.fatality*3.5) {
                    persons[i].fatality = vampire.fatality + (Math.random()*2-1); //persons배열의 원소의 fatality(치사율)을 (vampires배열의 원소의 fatality(치사율) + (-1~1사이의 난수))로 설정 
                    laytency.push(persons[i]); //laytency배열에 persons배열의 원소 추가
                    persons.splice(i, 1); //persons배열에서 persons배열의 원소 삭제
                }
            }
        }
    }
}, 50);

const dayDisplay = document.getElementById('day'); //day라는 id를 가진 엘리먼트, 현재 일 수를 표시

let day = 0; //현재 일 수

//0.5초 마다 현재 일 수에 1을 더하고 dayDisplay(현재 일 수를 표시하는 엘리먼트)의 내용을 시간 : day일로 설정
//0.5초 마다 laytency배열의 원소의 laytencyTime(잠재기)를 1씩 빼고 만약 laytency배열의 원소의 laytencyTime이 0일 시 
//laytency배열의 원소의 뱀파이어 여부를 참으로 설정하고 intoVampire함수 호출, vampires배열에 추가, laytency배열에서 삭제
//
//vampires배열의 원소의 치사율% 확률로 vampires배열의 원소가 가진 div의 스타일 display를 none으로 설정, vampires배열에서 삭제
setInterval(() => {
    day += 1; //현재 일 수에 1을 더함
    dayDisplay.innerText = `시간 : ${day}일`; //현재 일 수를 표시하는 엘리먼트의 내용을 시간 : day일로 설정

    for (let i=0; i<laytency.length; i++) {
        laytency[i].laytencyTime -= 1; //laytency배열의 원소의 laytencyTime(잠재기)를 1뻄

        //만약 laytency배열의 원소의 laytencyTime이 0일 시
        if (laytency[i].laytencyTime === 0) {
            laytency[i].isVampire = true; //laytency배열의 원소의 isVampire(뱀파이어 여부)를 참으로 설정
            laytency[i].intoVampire(); //laytency배열의 원소의 intoVampire함수를 호출
            vampires.push(laytency[i]); //vampires배열에 laytency배열의 원소를 추가
            laytency.splice(i, 1); //laytency배열에 laytency배열의 원소를 제거
        }
    }

    for (let i=0; i<vampires.length; i++) {
        //vampires배열의 원소의 치사율% 확률로
        if (vampires[i].fatality > Math.random()*100) {
            vampires[i].div.style.display = 'none'; //vampires배열의 원소가 가진 div의 스타일 display를 none으로 설정
            vampires.splice(i, 1); //vampires배열에서 vampires배열의 원소 삭제
        }
    }

}, 500);