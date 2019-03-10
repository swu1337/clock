window.onload = () => {
    const CLOCK_HOLDER = document.querySelector('.clock');
    const SELECT = document.querySelector('.timezones');
    const ICON = document.querySelector('.icon');
    const GREET = document.querySelector('.greet');
    const BG = document.querySelector('main');
    const H = document.querySelector('.hour');
    const M = document.querySelector('.min');
    const DOTS = document.querySelector('.dots');

    let h = 0; //For testing purposes
    let chosenOffset;
    let changeAnimation = (hour) => {
        //Late in the night 0:00 - 6:59
        if(hour < 7) {
            ICON.src = './img/night.svg';
            TweenMax.set(BG, { backgroundImage: 'var(--night)' });
        }
        //Morning 7:00 - 11:59
        if(hour >= 7 && hour < 12) {
            ICON.src = './img/morning.svg';
            TweenMax.set(BG, { backgroundImage: 'var(--morning)' });
        }
        //Afternoon 12:00 - 17:59
        if(hour >= 12 && hour < 18) {
            ICON.src = './img/afternoon.svg';
            TweenMax.set(BG, { backgroundImage: 'var(--afternoon)' });
        }
        //Evening 18:00 23:59
        if(hour >= 18 && hour <= 23) {
            ICON.src = './img/evening.svg';
            TweenMax.set(BG, { backgroundImage: 'var(--evening)' });
        }
    }
    let greet = (hour, elem) => {
        let greet;

        if (hour >= 5 && hour < 12) {
            greet = 'Good Morning, Martian.';
        }

        if(hour >= 12 && hour < 17) {
            greet = 'Good Afternoon, Martian.';
        }

        if(hour >= 17 || hour < 5) {
            greet = 'Good Evening, Martian.';
        }  

        elem.innerHTML = greet;
        //src: https://get.momentumdash.help/hc/en-us/articles/115007629867-When-do-the-greetings-Good-morning-afternoon-and-evening-change-
    }
    let showTime = () => {
        var date = new Date();
        // Converting to UTC
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        // Adding offset from another timezones. *60 to turn input offset to minutes
        date.setMinutes(date.getMinutes() + (chosenOffset * 60));
        //TODO: TESTING comment line 55 and uncomment line 56, 59-61
        h = date.getHours();
        //h++; //Testing
        let m = date.getMinutes();
        /*
        if(h >= 24) {
            h = 0;
        }
        */
        h = h < 10 ? `0${h}` : h;
        m = m < 10 ? `0${m}` : m;
        
        if(h < 7) {
            TweenMax.to(BG, 0.4, { autoAlpha: 1, scaleY: 1, backgroundImage: 'var(--night)', ease: Power4.easeInOut });
        }

        if(h >= 7 && h < 12) {
            TweenMax.to(BG, 0.4, { autoAlpha: 1, scaleY: 1, backgroundImage: 'var(--morning)', ease: Power4.easeInOut });
        }

        if(h >= 12 && h < 18) {
            TweenMax.to(BG, 0.4, { autoAlpha: 1, scaleY: 1, backgroundImage: 'var(--afternoon)', ease: Power4.easeInOut });
        }
        //Evening 18:00 23:59
        if(h >= 18 && h <= 23) {
            TweenMax.to(BG, 0.4, { autoAlpha: 1, scaleY: 1, backgroundImage: 'var(--evening)', ease: Power4.easeInOut });
        }

        greet(h, GREET);
        changeAnimation(h);
        H.innerHTML = h;
        M.innerHTML = m;
        setTimeout(showTime, 1000);
    };
    //Getting timezones and offset from an external source
    fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json')
        .then(res => res.json())
        .then((options) => {
            let htmlString = '';
            //Rewrite Data offset based on isdst, offset = offset - 1; Daylight Saving
            for(let data in options) {
                if (options[data].isdst) { 
                    options[data].offset -= 1;
                }
            }
            //Sort the objects based on offset from small to big
            options.sort((a, b) => a.offset - b.offset);
            for(let option in options) {
                let value = options[option];
                //Create list of options for select tag
                let optionHTML = `<option value="${value.offset}">${value.text}</option>`;
                //Select Amsterdam timezone as default value
                if(value.abbr === 'WEDT') {
                    chosenOffset = value.offset;
                    optionHTML = `<option selected value="${value.offset}">${value.text}</option>`;
                }
                htmlString += optionHTML;
            }
            SELECT.innerHTML = htmlString;
            
            tl = new TimelineMax({ onStart: () => { showTime() }});
              tl.from(GREET, 0.8, { autoAlpha: 0, x: -400, ease: Expo.easeOut, delay: 0.4 })
                .from(CLOCK_HOLDER, 0.8, { autoAlpha: 0, x: -400, ease: Expo.easeOut }, '-=0.4')
                .from(ICON, 0.9, { autoAlpha: 0, y: -295, ease: Expo.easeOut }, '-=0.6')
                .from(SELECT, 0.9, { autoAlpha: 0, y: 280, ease: Expo.easeOut }, '-=0.7');

            tlDots = new TimelineMax({ repeat: -1 });
              tlDots.to(DOTS, 1, { opacity: 1, ease: Power1.easeNone })
                    .to(DOTS, 1, { opacity: 0, ease: Power1.easeNone });
        });

    SELECT.onchange = () => {
        //Get offset from input
        chosenOffset = Number(SELECT.value);
        tl.reverse().tweenTo(0, { onComplete: () => { tl.restart(true); }});
    }
};