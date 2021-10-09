"use strict";

const btnParseJSON = document.getElementById('btn_parseJSON');
const btnReset = document.getElementById('btn_reset');
const themeA = document.getElementById('theme_A');
const themeB = document.getElementById('theme_B');
const iconDisplay = document.getElementById('icon_display');
const themeA_diff = document.getElementById("themeA_diff");
const themeB_diff = document.getElementById("themeB_diff");
const themeA_label = document.getElementById("themeA_label");
const themeB_label = document.getElementById("themeB_label");
const invalidA = document.getElementById("invalid_badgeA");
const invalidB = document.getElementById("invalid_badgeB");
const themeNames = [];

//modal
const modalBackdrop = document.getElementById("modal_backdrop");
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modalBackdrop.style.display = "none";
    }
    if (event.key === 'Enter'){
        compare(event);
    }
})

modalBackdrop.addEventListener('click', function (e) {
    if(e.target.id === 'modal_backdrop' || e.target.id === 'btn_closeModal' || e.target.id === 'btnContent_closeModal')
        modalBackdrop.style.display = "none";
});

btnParseJSON.addEventListener('click', (e)=> compare(e))

themeA.addEventListener('keyup', function () { 
    prettyPrint(themeA); 
    themeA.scrollTop = 0; 
    invalidA.style.display = "none";
});

themeA.addEventListener('click', function () {
    this.select();
});

themeA.addEventListener('input', function () {
    iconDisplay.src = "./assets/undef.svg";
});

themeB.addEventListener('keyup', function () { 
    prettyPrint(themeB); 
    themeB.scrollTop = 0;
    invalidB.style.display = "none";
});

themeB.addEventListener('focus', function () {
    this.select();
});
themeB.addEventListener('input', function () {
    iconDisplay.src = "./assets/undef.svg";
});
btnReset.addEventListener('click', function () {
    iconDisplay.src = "./assets/undef.svg";
    themeA_diff.value = '';
    themeB_diff.value = '';
    invalidA.style.display = "none";
    invalidB.style.display = "none";
    themeNames.splice(0, themeNames.length);
    console.clear();
});

const prettyPrint = (e) => {
    let ugly = JSON.parse('{}');
    try {
        ugly = JSON.parse(e.value);
    } catch (e) {
        //syntax error
    }
    const pretty = JSON.stringify(ugly, null, 2);
    e.value = pretty
}

function convertJSONtoObj(jsonString) {
    const obj = JSON.parse(jsonString);
    let newObj = {};

    Object.keys(obj).forEach((key) => {
        if (key === 'themeName'){
            themeNames.push(obj[key]);
        }

        if (key === 'paneldefaults') {
            obj[key].forEach((child) => {
                newObj[child.match_panel_title] = {
                    options: child.options,
                    styles: child.styles,
                    contents: child.contents,
                    usable: child.usable
                };
            })
        } else if (key === 'themeStyle') {
            Object.entries(obj[key].metadata).forEach(([name, value]) => {
                if(typeof value === "object"){
                    if(Array.isArray(value)){
                        let arr=[];
                        // eslint-disable-next-line no-unused-vars
                        Object.entries(value).forEach(([a,b]) => {
                            arr=[...arr, b];
                        });
                        newObj[name] = arr;
                    }
                    else newObj[name] = {...value};
                }
                else newObj[name] = value;

            });

            Object.entries(obj[key].styles).forEach(([name, value]) => {
                newObj[name] = value;
            });
        }
    });
    return newObj;
}

/* https://gist.github.com/Yimiprod/7ee176597fef230d1451 */
/* eslint-disable no-undef */
function difference(object, base) {
    function changes(object, base) {
        let arrayIndexCounter = 0;
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
                let resultKey = _.isArray(base) ? arrayIndexCounter++ : key;
                result[resultKey] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}

function compare(e) {

    e.preventDefault();

    const objA = convertJSONtoObj(themeA.value);
    const objB = convertJSONtoObj(themeB.value);

    if (!_.isEmpty(objA) && !_.isEmpty(objB)) {
        if (_.isEqual(objA, objB))
            iconDisplay.src = "./assets/check.svg";
        else {
            console.clear();
            iconDisplay.src = "./assets/xmark.svg";
            let objA_string = JSON.stringify(difference(objA, objB));
            let objB_string = JSON.stringify(difference(objB, objA));
         
            themeA_diff.value = '';
            themeB_diff.value = '';
            modalBackdrop.style.display = "flex";
            themeA_label.innerText = themeNames[0];
            themeB_label.innerText = themeNames[1];
            let objA_stringParsed = JSON.parse(objA_string);
            let objB_stringParsed = JSON.parse(objB_string);
            themeA_diff.value = JSON.stringify(objA_stringParsed, null, 2);
            themeB_diff.value = JSON.stringify(objB_stringParsed, null, 2);
        }
        themeNames.splice(0, themeNames.length);
    } 
    else {
        if(_.isEmpty(objA))
            invalidA.style.display = "block";

        if(_.isEmpty(objB))
            invalidB.style.display = "block";
            
        iconDisplay.src = "./assets/warn.svg";
    }
}