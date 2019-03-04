window.onload = () => {
    let clockHolder = document.querySelector('.clock');
    
    let showTime = () => {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();           

        if(m < 10) {
            m = `0${m}`;
        }

        if(s < 10) {
            s = `0${s}`;
        }

        let stringTime = `${h}:${m}:${s}`;
        clockHolder.innerHTML = stringTime;

        setTimeout(showTime, 1000);
    };

    showTime();

};