"use strict";


const btnParseJSON = document.getElementById('btn_parseJSON');
const btnReset = document.getElementById('btn_reset');
const themeA = document.getElementById('theme_A');
const themeB = document.getElementById('theme_B');
const iconDisplay = document.getElementById('icon_display');
let themeA_stripped = {};
let themeB_stripped = {};

function prettyPrint(e){
    let ugly= JSON.parse('{}');
    try {
        ugly = e.value !== '' ? JSON.parse(e.value) : JSON.parse('{}');
    } catch (e) {
        //error
    }
    const pretty = JSON.stringify(ugly, undefined, 4);
    e.value = pretty
}

themeA.addEventListener('keyup', ()=>prettyPrint(themeA));
themeA.addEventListener('focus', function(){this.select();});
themeA.addEventListener('change', function(){iconDisplay.src = "assets/undef.svg"});
themeB.addEventListener('keyup', ()=>prettyPrint(themeB));
themeB.addEventListener('focus', function(){this.select();});
themeB.addEventListener('change', function(){iconDisplay.src = "assets/undef.svg"});

btnReset.addEventListener('click', function(){
    themeA_stripped = {};
    themeB_stripped = {};
    iconDisplay.src = "assets/undef.svg";
});

btnParseJSON.addEventListener('click', function(e){
    e.preventDefault();
    const obj_A = themeA.value !== '' ? JSON.parse(themeA.value) : JSON.parse('{}');
    const obj_B = themeB.value !== '' ? JSON.parse(themeB.value) : JSON.parse('{}');

    Object.keys(obj_A).forEach((key) => {
        if( key === 'paneldefaults' ){
            obj_A[key].forEach((item) => {
                themeA_stripped[item.match_panel_title] = { options: item.options, styles: item.styles, usable: item.usable };
            })
        }
        else if( key === 'themeStyle' ){
            themeA_stripped['Metadata'] = { ...obj_A[key].metadata};
            themeA_stripped['Styles'] = { ...obj_A[key].styles};
        }
    });

    Object.keys(obj_B).forEach((key) => {
        if( key === 'paneldefaults' ){
            obj_B[key].forEach((item) => {
                themeB_stripped[item.match_panel_title] = { options: item.options, styles: item.styles, usable: item.usable };
            })
        }
        else if( key === 'themeStyle' ){
            themeB_stripped['Metadata'] = { ...obj_B[key].metadata};
            themeB_stripped['Styles'] = { ...obj_B[key].styles};
        }
    });


    const themeA_JSON = JSON.stringify(themeA_stripped);
    const themeB_JSON = JSON.stringify(themeB_stripped);

    if(themeA_JSON === themeB_JSON){
        console.log('equal!');
        iconDisplay.src = "assets/check.svg";
    }
    else {
        console.log('not equal');
        iconDisplay.src = "assets/xmark.svg";
    }   

});