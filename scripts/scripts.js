window.onload = () => {
    const CLOCK_HOLDER = document.querySelector('.clock');
    const SELECT = document.querySelector('.timezones');
    let chosenOffset;

    let showTime = () => {
        var date = new Date();
        // Converting to UTC
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        
        // Adding offset from another timezones. *60 to turn input offset to minutes
        date.setMinutes(date.getMinutes() + (chosenOffset * 60));
        
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        h = h < 10 ? `0${h}` : h;
        m = m < 10 ? `0${m}` : m;
        s = s < 10 ? `0${s}` : s;

        CLOCK_HOLDER.innerHTML = `${h}:${m}:${s}`;
        setTimeout(showTime, 1000);
    };
    //Getting timezones and offset from an external source
    fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json')
        .then(res => res.json())
        .then((options) => {
            let htmlString = '';
            //Rewrite Data offset based on isdst
            for(let data in options) {
                if (options[data].isdst) { 
                    options[data].offset -= 1;
                }
            }
            //Sort the objects based on offset small to big
            options.sort((a, b) => a.offset - b.offset);
            for(let option in options) {
                let value = options[option];
                //Create list of options voor de select tag
                let optionHTML = `<option value="${value.offset}">${value.text}</option>`;
                //Select Amsterdam timezone on default
                if(value.abbr === 'WEDT') {
                    chosenOffset = value.offset;
                    optionHTML = `<option selected value="${value.offset}">${value.text}</option>`;
                }
                htmlString += optionHTML;
            } 
            SELECT.innerHTML = htmlString;
            showTime();
        });

    SELECT.onchange = () => {
        //Get offset from input
        chosenOffset = Number(SELECT.value);
        showTime();
    }
};