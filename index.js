const playBoard = document.querySelector("#Memory_Game")
const memory_Card = document.querySelectorAll(".memory_card_item")
const StartGameField = document.querySelector("#StartGameField")
const skor = document.querySelector(".skor")
const startBtn = document.querySelector(".startBtn")
const minutes = document.querySelector("#minutes")
const seconds = document.querySelector("#seconds")
const bestScore = document.querySelector("#StartGameField .Wrap h3 span")


startBtn.addEventListener("click", startGame)
document.addEventListener("DOMContentLoaded", loadAllBestTime)


// Eger iki kart dondurulduyse bu ıkı kart dısında bı karta 
// tıklanırsa bunu engellıyelım bu  donen ıkı kartın sonucundan
// sonra oyun alanına tıklanabılsın yani herhangi bir karta tıklanabilsin 
let lockBoard = false

let statusCard = false

let firstCard, secondCard;



for (let i = 0; i < memory_Card.length; i++) {

    memory_Card[i].addEventListener("click", flipCard)

}



function startGame() {
    // Oyun başlatılırken karları karıştıralım ve kartları eski haline getirelim 
    shuffleCards();

    memory_Card.forEach(function(card) {

        card.classList.remove("flip")
        card.style.opacity = "1"
    })
    StartGameField.style.opacity = "0"
    StartGameField.style.zIndex = "-2"
    playBoard.style.transform = "scale(1)"

    playBoard.style.opacity = "1"
    playBoard.style.zIndex = "2"



    setTimeout(function() {
        countingTime()
    }, 400)
}



function endGame() {
    // oyun sonunda süreyi goruntude sıfırladık  tık durumunu sıfırladık 
    // tekrar oyun oynanması için 
    shuffleCards();
    skor.innerHTML = 0
    minutes.innerHTML = "00"
    seconds.innerHTML = "00"
    playBoard.style.opacity = "0"
    playBoard.style.zIndex = "-2"
    StartGameField.style.opacity = "1"
    StartGameField.style.zIndex = "2"
    playBoard.style.transform = "scale(0.59)"
}

function flipCard() {

    if (lockBoard) {
        // eger lockBoard true ise yani tahta kilitlenmisse buraya 
        // girer bu durum sundan onemli döndürelen 2 kart kontrol 
        // edilirken 3. bir karta basarsa sorun yaratabılır bu yuzden 
        // tahtaya tıklamayı etkısızlestırıyoruz bu kosula gırerek 
        return
    }
    if (this == firstCard) {
        // eger döndürülen ilk kart ile 2.kart aynı kartsa 
        // yani 2 defa aynı karta basmıssa herhangi bir işlem olmasın 
        // resetBoard fonksiyonu ile kart eşleşme kontrolundekı fonksiyonda 
        // bu durumu engelledik 
        return
    }


    this.classList.add("flip")

    if (!statusCard) {
        // eger ilk defa bir kart seçilmisse bu kosula girer 

        firstCard = this
        statusCard = true
    } else {

        // eger 2.bir kartı seçiyorsa buraya girer ve birinci kartı ve 2.kartı 
        // checkMatchingCard fonk. göndererek karşılaştırıyoruz 
        secondCard = this

        checkMatchingCard(firstCard, secondCard)

        statusCard = false


    }

}


function checkMatchingCard(firstCard, secondCard) {

    // döndürelen iki kartın eşleşmesini kontrol eder 

    let firstSvgClass = firstCard.firstElementChild.firstElementChild.getAttribute("class")
    let seconSvgClass = secondCard.firstElementChild.firstElementChild.getAttribute("class")
    if (firstSvgClass == seconSvgClass) {
        // döndüren iki kart eşitse bu kosula girer 
        lockBoard = true

        setTimeout(function() {
            firstCard.style.opacity = "0"
            secondCard.style.opacity = "0"
            lockBoard = false
            skor.innerHTML = Number(skor.innerHTML) + 1

        }, 850)



    } else {
        // eger iki kart eşit degilse bu kosula girer 
        // lockBoard true yaparak bu iki kart eski haline gelmeden 
        // oyun alanındakı herhangi bir karta basılmasın dedık bunu
        // engelledik 

        lockBoard = true

        setTimeout(function() {

            firstCard.classList.remove("flip")
            secondCard.classList.remove("flip")
            lockBoard = false

        }, 1000)

    }
    // bu fonksiyon çagırılmıssa ya ıkı kart eşlemiştir 
    // yada eşleşmemiştir herhangi bir hata olmaması için 
    // degerlerimizi resetleyelım 
    resetBoard()


}

function resetBoard() {
    // belli sorunlardan dolayı oyunu en basa dondurmek için 
    [firstCard, secondCard] = [null, null]

    [statusCard, lockBoard] = [false]
}


function shuffleCards() {
    // Kartları Karıştıralım 
    memory_Card.forEach(function(card) {

        let randomNumber = Math.floor(Math.random() * 12)

        card.style.order = randomNumber
    })
}


function countingTime() {
    // oyun basladıgında bu fonksiyon sure saymaya baslar 
    var totalSeconds = 0;
    let counting = setInterval(setTime, 1000);

    function setTime() {
        totalSeconds += 1;
        seconds.innerHTML = pad(totalSeconds % 60);
        minutes.innerHTML = pad(parseInt(totalSeconds / 60));
        stopTime()

    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }


    function stopTime() {
        // 16 kart 2 li olarak 8 tik eger 8 tik olursa 
        // oyunu bitirelim ve süreyi durduralım storage'e 
        // kaydedelım sureyı ve oyun baslangıc ekranına gerı donelım 
        if (skor.innerHTML == 8) {
            time = Number(minutes.innerHTML * 60) + Number(seconds.innerHTML)

            console.log("OYUN BITTI -----------")

            console.log("YAPTIGIN SURE  : ", time)
            saveTimeToStorage(time)

            endGame()

            clearInterval(counting)

        }


    }

}


function saveTimeToStorage(time) {
    // kullanıcı skoru storage'e kaydedelım ama eskı sureden
    // daha kotu bır sure yaptıysa bunu kaydetmıyoruz 
    // daha iyi bir süre yaptıysa eski süreyle yer degiştiricez 
    // başlangıç ekranındada  en iyi yapılan süreyi gösterelim  
    let BestTime;

    if (localStorage.getItem("BestTime") == null) {


        BestTime = []

        BestTime.push(time)

        editTime(time)


        localStorage.setItem("BestTime", JSON.stringify(BestTime))


    } else {

        BestTime = JSON.parse(localStorage.getItem("BestTime"))

        console.log("eski süremiz : ", BestTime[0])

        console.log("yeni yaptıgımız  süre :", time)

        if (BestTime[0] > time) {

            BestTime[0] = time

            editTime(time)

        }

        localStorage.setItem("BestTime", JSON.stringify(BestTime))


    }



}

function editTime(time) {


    if (time < 60) {
        bestScore.innerHTML = "00" + " : " + time
    } else {
        minute = parseInt(time / 60)

        console.log("minute :", minute)
        second = time % 60
        console.log("second :", second)
        bestScore.innerHTML = "0" + minute + " : " + second

    }
}


function loadAllBestTime() {


    if (!(localStorage.getItem("BestTime") == null)) {
        BestTime = JSON.parse(localStorage.getItem("BestTime"))
        editTime(BestTime[0])
    }
}