window.onload = () => {
    const CLOCK_HOLDER = document.querySelector('.clock');
    const SELECT = document.querySelector('.timezones');

    fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json')
        .then(res => res.json())
        .then((options) => {
            let htmlString = '';
            
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
        console.log(SELECT.value);
        let date = new Date();
        let normalTime = date.getTime() + date.getTimezoneOffset() * 60000;
        let newTime = normalTime * Number(SELECT.value);
    }

    let showTime = () => {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        m = m < 10 ? `0${m}` : m;
        s = s < 10 ? `0${s}` : s;

        let stringTime = `${h}:${m}:${s}`;
        CLOCK_HOLDER.innerHTML = stringTime;

        setTimeout(showTime, 1000);
    };

    showTime();
};