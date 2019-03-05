window.onload = () => {
    const CLOCK_HOLDER = document.querySelector('.clock');
    const SELECT = document.querySelector('.timezones');
    let showTime = (dateValue) => {
        console.log(dateValue);
        
        let date = new Date();
        if(dateValue) {
            date.setTime(dataValue);
        }
        
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        h = h < 10 ? `0${h}` : h;
        m = m < 10 ? `0${m}` : m;
        s = s < 10 ? `0${s}` : s;

        let stringTime = `${h}:${m}:${s}`;
        CLOCK_HOLDER.innerHTML = stringTime;

        // (function(d) {
        //     let de = d;
        //     console.log(d);
            
        //     setTimeout(function() {
        //         console.log(de);
        //         showTime(de);
        //     }, 1000);
        // })(dateValue);
        setTimeout(showTime, 1000);
    };
    //Getting timezones and offset from an external source
    fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json')
        .then(res => res.json())
        .then((options) => {
            let htmlString = '';
            //Create list of options voor de select tag
            for(let option in options) {
                let value = options[option];
                let optionHTML = `<option value="${value.offset}">${value.text}</option>`;

                if(value.abbr === 'WEDT') {
                    optionHTML = `<option selected value="${value.offset}">${value.text}</option>`;
                }

                htmlString += optionHTML;
            } 

            SELECT.innerHTML = htmlString;
        });

    SELECT.onchange = () => {
        let date = new Date();
        //Calculate the new time in ms
        let chosenOffset = SELECT.value;
        let normalTime = date.getTime() + date.getTimezoneOffset() * 60000; //60000 is  one minutes in ms
        let newTime = normalTime + Number(chosenOffset) * 3600000; //3600000 is one hour in ms
        //console.log(Number(chosenOffset));
        
        let newDate = new Date(newTime);
        showTime(newDate);
    }

    showTime();
};