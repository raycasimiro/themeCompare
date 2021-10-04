"use strict";

const btnParseJSON = document.getElementById('btn_parseJSON');
const btnReset = document.getElementById('btn_reset');
const themeA = document.getElementById('theme_A');
const themeB = document.getElementById('theme_B');
const iconDisplay = document.getElementById('icon_display');
let themeA_obj = {};
let themeB_obj = {};

themeA.addEventListener('keyup', ()=>prettyPrint(themeA));
themeA.addEventListener('focus', function(){this.select();});
themeA.addEventListener('change', function(){iconDisplay.src = "./assets/undef.svg"; themeA_obj = {}});
themeB.addEventListener('keyup', ()=>prettyPrint(themeB));
themeB.addEventListener('focus', function(){this.select();});
themeB.addEventListener('change', function(){iconDisplay.src = "./assets/undef.svg"; themeB_obj = {}});

btnReset.addEventListener('click', function(){
    themeA_obj = {};
    themeB_obj = {};
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

btnParseJSON.addEventListener('click', function(e){
    e.preventDefault();
    // const obj_A = themeA.value !== '' ? JSON.parse(themeA.value) : JSON.parse('{}');
    // const obj_B = themeB.value !== '' ? JSON.parse(themeB.value) : JSON.parse('{}');

    const obj_A = JSON.parse(themeA.value);
    const obj_B = JSON.parse(themeB.value);

    Object.keys(obj_A).forEach((key) => {
        if( key === 'paneldefaults' ){
            obj_A[key].forEach((item) => {
                themeA_obj[item.match_panel_title] = { options: item.options, styles: item.styles, contents: item.contents, usable: item.usable };
            })
        }
        else if( key === 'themeStyle' ){
            themeA_obj['Metadata'] = { ...obj_A[key].metadata};
            themeA_obj['Styles'] = { ...obj_A[key].styles};
        }
    });

    Object.keys(obj_B).forEach((key) => {
        if( key === 'paneldefaults' ){
            obj_B[key].forEach((item) => {
                themeB_obj[item.match_panel_title] = { options: item.options, styles: item.styles, contents: item.contents, usable: item.usable };
            })
        }
        else if( key === 'themeStyle' ){
            themeB_obj['Metadata'] = { ...obj_B[key].metadata};
            themeB_obj['Styles'] = { ...obj_B[key].styles};
        }
    });


    const themeA_JSON = JSON.stringify(themeA_obj);
    const themeB_JSON = JSON.stringify(themeB_obj);

    if(themeA_JSON!=='{}' ||themeB_JSON!=='{}'){

        if(themeA_JSON === themeB_JSON){
            console.log('identical');
            iconDisplay.src = "./assets/check.svg";
        }
        else {
            console.log('not identical');
            iconDisplay.src = "./assets/xmark.svg";
        }
    }

});