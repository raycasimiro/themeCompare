"use strict";

const btnParseJSON = document.getElementById('btn_parseJSON');
const btnReset = document.getElementById('btn_reset');
const themeA = document.getElementById('theme_A');
const themeB = document.getElementById('theme_B');
const iconDisplay = document.getElementById('icon_display');

themeA.addEventListener('keyup', ()=>prettyPrint(themeA));
themeA.addEventListener('focus', function(){this.select();});
themeA.addEventListener('input', function(){
    iconDisplay.src = "./assets/undef.svg"; 
});
themeB.addEventListener('keyup', ()=>prettyPrint(themeB));
themeB.addEventListener('focus', function(){this.select();});
themeB.addEventListener('input', function(){
    iconDisplay.src = "./assets/undef.svg"; 
});
btnReset.addEventListener('click', function(){
    iconDisplay.src = "./assets/undef.svg";
});

function prettyPrint(e){
    let ugly = JSON.parse('{}');
    try {
        ugly = JSON.parse(e.value);
    } catch (e) {
        //syntax error
    }
    const pretty = JSON.stringify(ugly, undefined, 4);
    e.value = pretty
}

function convertJSONtoObj(jsonString){
    const obj = JSON.parse(jsonString);
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        if(key === 'paneldefaults'){
            obj[key].forEach((child) => {
                newObj[child.match_panel_title] = { 
                    options: child.options, 
                    styles: child.styles, 
                    contents: child.contents, 
                    usable: child.usable 
                };
            })
        }
        else if(key === 'themeStyle'){
            newObj['Metadata'] = { ...obj[key].metadata};
            newObj['Styles'] = { ...obj[key].styles};
        }
    });
    return newObj;
}

btnParseJSON.addEventListener('click', function(e){

    e.preventDefault();

    const themeA_JSON = JSON.stringify(convertJSONtoObj(themeA.value));
    const themeB_JSON = JSON.stringify(convertJSONtoObj(themeB.value));

    if(themeA_JSON!=='{}' && themeB_JSON!=='{}'){

        if(themeA_JSON === themeB_JSON){
            console.log('identical');
            iconDisplay.src = "./assets/check.svg";
        }
        else {
            console.log('not identical');
            iconDisplay.src = "./assets/xmark.svg";
        }
    }

    else iconDisplay.src = "./assets/warn.svg";

});