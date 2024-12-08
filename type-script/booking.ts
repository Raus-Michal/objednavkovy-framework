﻿
const kalendar={
p_id:"b", // počáteční id každého buttonu ke kterému je přiřazeno v HTML číslo 1-31 ... b1.b2->b31
m_a_r_id:"mesic_a_rok", // id inputu s měsícem a rokem
den_id:"d", // počáteční id každého dne v týdnu v kalendáři <p> Po,Út,St,Čt,Pá,So,Ne

vytvorit(){
// funkce vytvoří k buttonum s daty čísla

const dny:string[]=[]; // pole určuje všechny id buttony pro dny v měsíci

for(let i=1;i<32;i++)
{
let nazev:string=`${this.p_id}${i}`; // k názvu přiřadí odpovídající číslici
dny.push(nazev); // pushne název id buttonu do pole
}



const d=dny.length; // délka pole
for(let i=0;i<d;i++)
{
const button_i=document.getElementById(dny[i]); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
const cislo=i+1; // dny začínají od 1, i=0, proto bude číslo dnu vždy +1
const cislo_t=cislo.toString(); // převede proměnou type number na string
(button_i as HTMLButtonElement).innerText=cislo_t; // přepíše text buttonu na konkrétní číslo 1-28,1-30,1-31
}
}

},

upravit(){
// funkce upraví datum vzhledem k aktuálnímu datu

const a_d=datum.den_v_mesici(); // aktuální den v měsíci 1-31,1-30,1-28 ...
const m_r=datum.mesic_v_roce(); // aktuální číslo měsíce
const p_d=datum.dnu_v_mesici [m_r]; // počet dní v aktuálním měsíci




if(a_d!==1)
{
// pokud se právě aktuální den v měsíci !== 1 (tedy to není první den v měsící), budou se odebírat buttony pro objenání

for(let i=1;i<a_d+1;i++)
{
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu na dny, které už v měsíci uplynuly včetně dnešního
}}
}
else
{
// pokud právě aktuální den v měsíci je prvního - bude se odebírat poze tento den
const button_i=document.getElementById(`${this.p_id}${a_d}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 1. v měsíci
}}

},
nazev_mesice(){
// funkce přepíše název měsíce a roku v input měsíc a rok

const a_r=datum.aktualni_rok(); // návratová hodnota je aktuální rok: 2024,2025 ...
const a_m=datum.mesic_v_roce(); // návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11
const a_m_nazev=datum.mesice[a_m]; // název aktuálního měsíce slovně jako string: leden, únor, březen, duben, květen, červen, červenec, srpen, září, říjen, listopad, prosinec

const text=document.getElementById(this.m_a_r_id); // input s měsícem a rokem
if(text)
{
(text as HTMLInputElement).value=`${a_m_nazev} ${a_r}`; // změní value inputu s měsícem a rokem
}

},
poradi_dnu(){
// funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce

const dni_v_tydnu=7; // počet dní v týdnu

const a_d=datum.den_v_tydnu(); // den v týdnu, kde 0 je neděle a 1 je pondělí
const a_d_m=datum.den_v_mesici(); // den v měsíci 1-31,1-30,1-28 ...
const modulo_a_d_m=a_d_m%dni_v_tydnu; // modulo den v měsíci (zbytek po dělení 7)


if(modulo_a_d_m!==a_d)
{
// pokud se modulo dne v měsíci !== dnu v týdnu - musí se posunout dny uvedené v kalendáři

const suma_posun=a_d-modulo_a_d_m; // hodnota posunu


console.log("suma: "+suma_posun);

const d=datum.dny.length; // délka pole
for(let i=0;i<d;i++)
{

let zacatek_v_poli=i+suma_posun;

console.log("zacatek_v_poli: "+zacatek_v_poli);

if(suma_posun>0)
{
// pokud je suma posunu kladné číslo
if(zacatek_v_poli===7)
{
zacatek_v_poli=0;
}
else if(zacatek_v_poli===8)
{
zacatek_v_poli=1;
}
else if(zacatek_v_poli===9)
{
zacatek_v_poli=2;
}
else if(zacatek_v_poli===10)
{
zacatek_v_poli=3;
}
else if(zacatek_v_poli===11)
{
zacatek_v_poli=4;
}
else if(zacatek_v_poli===12)
{
zacatek_v_poli=5;
}
else if(zacatek_v_poli===13)
{
zacatek_v_poli=6;
}
}
else
{
// pokud je suma posunu záporné číslo
if(zacatek_v_poli===-1)
{
zacatek_v_poli=6;
}
else if(zacatek_v_poli===-2)
{
zacatek_v_poli=5;
}
else if(zacatek_v_poli===-3)
{
zacatek_v_poli=4;
}
else if(zacatek_v_poli===-4)
{
zacatek_v_poli=3;
}
else if(zacatek_v_poli===-5)
{
zacatek_v_poli=2;
}
else if(zacatek_v_poli===-6)
{
zacatek_v_poli=1;
}
}

const p_e=document.getElementById(`${this.den_id}${i+1}`); // HTML P elementy zastupující dny v týdnu Po-Ne
if(p_e)
{
// pokud HTML element existuje
p_e.innerText=datum.dny[zacatek_v_poli]; // změní popisky Po,Út, St, Čt , Pá , So , Ne podle počátku dne v měsíci
}


}}

console.log("den v týdnu "+a_d);
console.log("modulo den v měsíci: "+a_d_m%7);

}

};

const mesic_a_rok={
id_posun:["m_minus","m_plus"], // id šipek s posunem měsíce 0===vzad, 1===vpřed
id_text:"mesic_a_rok", // id inputu s textem měsíc a rok
aktivace(){
// funkce aktivuje posluchače šipek měsíc vzad a vpřed

const butt_1=document.getElementById(this.id_posun[0]); // button šipka vzad
const butt_2=document.getElementById(this.id_posun[1]); // button šipka vpřed

if(butt_1)
{
// pokud existuhe HTML objekt button šipka vzad
butt_1.addEventListener("click",this); // posluchač click pro šipku vzad
}

if(butt_2)
{
// pokud existuhe HTML objekt button šipka vpřed
butt_2.addEventListener("click",this); // posluchač click pro šipku vpřed
}

},
handleEvent(e:any){
const k=e.target.id; // id buttonu na který bylo kliknuto

if(k===this.id_posun[0])
{
// kliknuto na button VZAD

console.log("VZAD");

}
else if(k===this.id_posun[1])
{
// kliknuto na button VPŘED


console.log("VPŘED");

}

}

};




const datum={
dnu_v_mesici:[31,28,31,30,31,30,31,31,30,31,30,31], // počet dnů v měsící: leden, únor, březen, duben, květen, červen, červenec, srpen, září, říjen, listopad, prosinec
mesice:["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"], // měsíce v roce
dny:["Po","Út","St","Čt","Pá","So","Ne"], // dny v týdnu
den_v_tydnu(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDay(); // vrací den v týdnu, kde 0 je neděle a 1 je pondělí
},
den_v_mesici(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDate(); // den v měsíci 1-31,1-30,1-28 ...
},

mesic_v_roce(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getMonth(); // vrátí měsíc, kde leden je 0 a prosinec 11
},

aktualni_rok(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getFullYear(); // aktuální rok
}

};

const form_rezervace=document.getElementById("rez_form"); // HTML element FORM rezervačního systému
if(form_rezervace)
{
// pokud existuje HTML element FORM rezervačního systému
(form_rezervace as HTMLFormElement).addEventListener("submit",(event)=>{
event.preventDefault(); // Zabrání výchozímu chování (odeslání formuláře)
});
}




kalendar.vytvorit(); // vytvoří čísla na buttonu kalendáře
kalendar.nazev_mesice(); // funkce přepíše název měsíce a roku v input měsíc a rok
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dne v aktuálním měsíci mimo dnešního dne
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
mesic_a_rok.aktivace(); // aktivuje posluchače události click k tlačítkům pro posun měsíce VPŘED a VZAD