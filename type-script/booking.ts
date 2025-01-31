
class Kalendar {
readonly p_id:string="b"; // počáteční id každého buttonu ke kterému je přiřazeno v HTML číslo 1-31 ... b1.b2->b31
readonly m_a_r_id:string="mesic_a_rok"; // id inputu s měsícem a rokem
readonly den_id:string="d"; // počáteční id každého dne v týdnu v kalendáři <p> Po,Út,St,Čt,Pá,So,Ne
readonly kryt_id="krit_dny"; // id DIV krytu, překrývající možnozst klikat do kalendáře
private poloha:number=0; // proměnná určuje polohu kalendáře 0===default, 1-krok o měsíc dále , 2-krok o dva měsíce dále
private book_den:[number,number,number]=[0,0,0]; // zápis booklého dne uživatelem : rok, měsíc, den
readonly facke_checked_id:string="fake-checked"; // id input type chacked - fake chacked, který nedošle formulář, dokud není od uživatele označený konkrétní den
readonly color_oznacen:string="rgb(87,168,110)"; // barva označeného buttonu s dnem v měsíci zvoleným uživatelem
readonly color_NEoznacen:string="white"; // barva neoznačeného buttonu s dny v měsíci
readonly z_posun_id:string="pb"; // začátek id vyplňovacích bloků pro posun buttonu s čísly dnů v kalendáři (id="pb1" až id="pb6")
block_days:number[][]=[]; // pole s blokovanými datumy pro booking dne
load_data_book_block_day:boolean=false; // proměnná na true ukazuje, že data o dnech, které se mají blokovat, jsou z JSON souboru načtena a false, že nejsou načtena
load_data_time_out:number|null=null; // časovač pro REKLUZI funkce data_book_block_day()
readonly error_load_element:string[]=["errror_load","flex","retry_load","errror_load_offline"]; // pole zahrnuje prvky,pro zobrazení errro okna - Potřebná data, nebyla ze serveru načtena. [0=id div, 1=display div, 2=id button Opakovat načtení, 3= element p v tomto okně upozorňující, že byl uživatel offline]
get rezervovane_datum()
{
// getter vrací pole s vybraným datumem od uživatele [rok, měsíc(0-11), den]:number[]
if(this.byl_vybran_datum)
{
return this.book_den as [number, number, number]; // vrací pole s vybraným datumem od uživatele [rok, měsíc(0-11), den]:number[]
}
return [9999,9999,9999]as [number, number, number]; // uživatel nevybral datum a návratová hodnota je taková, aby bylo možné odfiltrovat nezadání uživatele 
};


get aktualni_poloha(){
// getter slouží k zaslání aktuální polohy uživatele v kalendáři, jetomu poroto, aby private this.poloha mohl měnit použe objekt této třídy
return this.poloha; // getter vrací aktuální polohu uživatele v kalendáři
};

get byl_vybran_datum(){
// getter složí k odpovědi, zda uživatel vybral datum, pokud ano bude TRUE, pokud ne, bude FALSE
if(this.book_den.some(value=>value!==0))
{
// some() - kontroluje, že alespoň jedna hodnota v poli se nerovná 0
return true; // pokud se všechny prvky v poli !==0 uživatel vybral datum
}
return false; // pokud se včechny prvky v poli===0, uživatel nevybral datum
};


set posun(kam:number){
// setter bude nastavovat maximální a minimální hodnotu this.poloha
if(kam===+1)
{
// pokud se přidává poloha o 1 - vpřed
this.poloha++;
if(this.poloha>12)
{
// pokud je posun více jak o 12 měsíců
this.poloha=12; // maximální posun je 12 měsíců
}
}
else if(kam===-1)
{
// pokud se odebírá poloha o 1 - vzad
this.poloha--;
if(this.poloha<0)
{
// pokud je snaha vrátit se datumově zpět
this.poloha=0; // poloha bude 0 - není možné se vrátit zpět
}
}

};

reset_book_den(){
// metoda anuluje den, který si uživatel zabookoval
this.book_den=[0,0,0]; // zápis booklého dne uživatelem : rok, měsíc, den
};


restart_dnu_v_kalendari()
{
// metoda - povolí posluchače všem buttonům od 1-31, pokud tento posluchač nemají a všem nastaví disbled===false
for(let i = 1; i < 32; i++) {
// smyška postupně "projede" všechny buttony 1-31 dnů v kalendáři, jelikož jejich id začíná od 1 a je jich 31 >>> i = 1 a i < 32
const button_i = document.getElementById(`${this.p_id}${i}`) as HTMLButtonElement; // Získá konkrétní HTML button s číslem dne v měsíci 1-31
if(button_i){
// Pokud HTML objekt pod Id existuje
const hasListener=button_i.getAttribute("data-has-listener")==="true"; // Zkontroluje, zda už má button atribut 'data-has-listener' nastavený na 'true'
if(!hasListener){
// Pokud button ještě nemá posluchače událostí
button_i.addEventListener("click", this); // Přidělí posluchač událostí buttonu konkrétnímu buttonu 
button_i.setAttribute("data-has-listener","true"); // Nastaví atribut 'data-has-listener' na 'true' pro označení, že button má posluchače
}
(button_i as HTMLButtonElement).disabled=false; // Odblokuje všechny buttony
}
}

};
upravit(){
// funkce zablokuje pro booking dny které v měsíci už uběhly a den následující

let a_d=datum.den_v_mesici; // aktuální den v měsíci 1-31,1-30,1-28 ...

if(this.poloha===0)
{
// pokud bude poloha uživatel v kalendáři nezměněna
if(a_d!==1)
{
// pokud se právě aktuální den v měsíci !== 1 (tedy to není první den v měsící), budou se odebírat buttony pro objenání do tohoto dne v měsíci
const hours=new Date().getHours(); // Získání aktuální hodiny
if(hours>17)
{
// pokud je po 18 hod - zablokuje se booking i následujícího dne
a_d++; // +1 === blokace ještě dalšího dne
}

for(let i=1;i<a_d+1;i++)
{
const button_i=document.getElementById(`${this.p_id}${i}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
button_i.disabled=true; // udělá disabled na buttonu na dny, které už v měsíci uplynuly včetně dnešního
button_i.removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
button_i.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}}
}
else
{
// pokud právě aktuální den v měsíci je prvního - bude se odebírat tento den
const button_i=document.getElementById(`${this.p_id}${a_d}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i)
{
button_i.disabled=true; // udělá disabled na buttonu 1. v měsíci
button_i.removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
button_i.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}

const hours = new Date().getHours(); // Získání aktuální hodiny
if(hours>17)
{
// pokud je po 18 hod - zablokuje se booking i následujícíiho dne
a_d++; // +1 === blokace ještě dalšího dne
const button_i2=document.getElementById(`${this.p_id}${a_d}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i2){
button_i2.disabled=true; // udělá disabled na buttonu 2. v měsíci
button_i2.removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
button_i2.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}}
}
}
else
{
// pokud nebude kalendář v poloze===0

if(this.poloha===1)
{
// opatření pokud je další den dnem 1. v měsíci anebo obden je dnem 1. v měsíci a je po 18 hod., provede se opatření při pohybu v kalendáři na další měsíc

const hours=new Date().getHours(); // Získání aktuální hodiny
const today = new Date(); // do proměnné načte objekt Date
const nextDay=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1); // zjistí datum, které je jeden den po dnešním dni

const button_1=document.getElementById(`${this.p_id}1`) as HTMLButtonElement; // 1. button s číslem dne v měsíci (tedy 1. den toho měsíce)
const button_2=document.getElementById(`${this.p_id}2`) as HTMLButtonElement; // 2. button s číslem dne v měsíci (tedy 2. den toho měsíce)

if(nextDay.getDate()===1)
{
// pokud je datum po dnešním dni === 1, bude zítra 1. dalšího měsíce

if(button_1)
{
// pokud HTML element existuje
button_1.disabled=true; // udělá disabled na buttonu 1. v měsíci
button_1.removeEventListener("click",this); // odebere posluchač buttonu 1. v měsíci
button_1.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}

if(hours>17){
// pokud je po 18 hod - zablokuje se booking i následujícího dne
button_2.disabled=true; // udělá disabled na buttonu 2. v měsíci
button_2.removeEventListener("click",this); // odebere posluchač buttonu 2. v měsíci
button_2.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}}

const every_other_day=new Date(today.getFullYear(),today.getMonth(),today.getDate()+2); // zjistí datum, který je dva dny po dnešním dni

if(every_other_day.getDate()===1&&hours>17)
{
// pokud je dva dny po dnešním dni 1. den v měsíci a je po 18 hodině
if(button_1)
{
// pokud HTML element existuje
button_1.disabled=true; // udělá disabled na buttonu 1. v měsíci
button_1.removeEventListener("click",this); // odebere posluchač buttonu 1. v měsíci
button_1.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}}
}}
};


odebrat_dny(){
// funkce odebre nadbytečné dny v měsíci
let cmp=datum.mesic_v_roce+this.poloha; // aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři
    
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...
    
if(cmp>11)
{
// pokud bude aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři více jak 12.měsíc
cmp=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // přidá se jeden rok
}
const pdva=datum.dnu_v_mesici(a_r,cmp); // funkce vrací počet dní v aktuálním měsíci datum.dnu_v_mesici(rok,měsíc)

for(let i=1;i<32;i++)
{
// smyčka zneviditelní všechny budttony v měsíci
const button_i=document.getElementById(`${this.p_id}${i}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.visibility="hidden"; // zneviditelní button s dnem v měsíci
}}

for(let i=1;i<pdva+1;i++)
{
// smyčka nechá vidět jen počet konkrétních buttonů v měsíci
const button_i=document.getElementById(`${this.p_id}${i}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.visibility="visible"; // zviditelní button s dnem v měsíci
}}

for(let i=pdva+1;i<32;i++)
{
// smyška odebere posluchače všem odebraným buttonům
const button_i=document.getElementById(`${this.p_id}${i}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.removeEventListener("click",this); // odebere posluchač konkrétnímu buttonu
button_i.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}
}

};

nazev_mesice(){
// funkce přepíše název měsíce a roku v input měsíc a rok


let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}


const a_m_nazev=datum.mesice[a_m]; // název aktuálního měsíce slovně jako string: leden, únor, březen, duben, květen, červen, červenec, srpen, září, říjen, listopad, prosinec

const text=document.getElementById(this.m_a_r_id) as HTMLInputElement; // input s měsícem a rokem
if(text)
{
text.value=`${a_m_nazev} ${a_r}`; // změní value inputu s měsícem a rokem
}

};
poradi_dnu(){
// funkce upraví v kalendáři pořadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

for(let i=0;i<6;i++)
{
// smyčka zruší všechny posouvací bloky: 6 === počet posouvacích bloků (ib1-pb6)
const p_b=document.getElementById(`${this.z_posun_id}${i+1}`) as HTMLElement; // HTML P element zastupující posun dny v týdnu Po-Ne: id je číslováno od 1 proto i+1
if(p_b)
{
// pokud HTML element existuje
p_b.style.display="none"; // schová HTML P element
}
}

const a_d_m = new Date(a_r,a_m,1).getDay(); // první den v měsíci (1. den) - kde 0 je neděle

let posunovaci_bloky=a_d_m-1; // určí celkový počet bloků - jelikož máme v kalendáří Po-Ne a v Javascriptu je Ne-Po je tam -1

if(posunovaci_bloky===-1)
{
// pokud výjde záporné číslo - jedná se o neděli a musí být posun 6
posunovaci_bloky=6; // posun o 6
}

for(let i=0;i<posunovaci_bloky;i++)
{
const p_b=document.getElementById(`${this.z_posun_id}${i+1}`) as HTMLElement; // HTML P element zastupující posun dny v týdnu Po-Ne
if(p_b)
{
// pokud HTML Element existuje
p_b.style.display="flex"; // zobrazí vyplňovací HTML P element
}
}
};

dny_klikat(povolit:boolean){
// zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno

const plocha_dny=document.getElementById(mesic_a_rok.id_kalendar); // načte HTML element v kterém jsou zobrazení dny v měsíci 1-31
if(plocha_dny)
{
// pokud HTML element existuje
if(povolit)
{
// pokud má být povoleno klikání na buttony 1-31
plocha_dny.style.filter="blur(0px)"; // nastaví blur kontejneru bez rozmazání
}
else
{
// pokud nemá být povoleno klikání na buttony 1-31
plocha_dny.style.filter="blur(2px)"; // nastaví blur kontejneru na rozmazání
}
}
const kryt=document.getElementById(this.kryt_id); // načte HTML DIV element krytu, který má z-index:5 a je přes celou šířku a výšku dnů v kalendáři 1-31, má background-color:transparent
if(kryt)
{
// pokud HTML element existuje
if(povolit)
{
// pokud má být povoleno klikání na buttony 1-31
kryt.style.zIndex = "-5"; // nastaví KRYT na z-index:-5, tímto umožní uživateli klikat do dnů v měsíci 1-31
}
else
{
// pokud nemá být povoleno klikání na buttony 1-31
kryt.style.zIndex = "5"; // nastaví KRYT na z-index:5, tímto znemožní uživateli klikat do dnů v měsíci 1-31
}
}
};

book_block_day(){
// metoda fakticky blokuje dny, které jsou uvedeny v JSON souboru
if(!this.load_data_book_block_day)
{
if(this.load_data_time_out)
{
// pokud je časovač již spuštěn
clearTimeout(this.load_data_time_out); // vynuluje časovač
}
this.load_data_time_out=setTimeout(()=>{this.book_block_day();},1000); // REKLUZE - pokud nejsou data načtena pokusí se funkci spustit opět za 1s
return; // data zatím nebyla načtena - funkce bude ukončena
}

if(this.block_days.length===0)
{
// pokud bude globýlní pole s blokovanými dny prázdné, znamená to, že nejsou zadány žádné blokovaný dny
return; // funkce bude ukončena
}

const block_days:number[][]=this.block_days; // převede globýlní pole s blokovanými dny do lokální proměnné
const d=block_days.length; // délka pole:  globýlní pole s blokovanými dny do lokální proměnné
const poloha=this.aktualni_poloha; // aktuální poloha uživatele v kalendáři
const aktualni_mesic=datum.mesic_v_roce; // aktuální měsíc, kde 0 je leden
let rozhodny_mesic=aktualni_mesic+poloha; // rozhodný měsíc je měsíc vzhledem k poloze uživatele v kalendáři
let aktualni_rok=datum.aktualni_rok; // aktuální rok

if(rozhodny_mesic>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
rozhodny_mesic=aktualni_mesic+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
aktualni_rok++; // přidá jeden rok navíc
}

let dny_k_blokaci:number[]=[]; // pole, kde se budou zapisovat dny k blokaci v měsíci

for(let i=0;i<d;i++)
{
// smička zjistí jestli se poloha v kalendáři shoduje s blokovaným rokem a měsícem, pokud ano, udělá push blokovaného dne do pole dny_k_blokaci[]
if((block_days[i][0]===aktualni_rok)&&(block_days[i][1]===rozhodny_mesic))
{
// pokud je shoda v roce a měsíci vzhledem k aktuální poloze užovatele v kalendáři
dny_k_blokaci.push(block_days[i][2]); // zapíše den blokovaný v konkrétním měsíci a roce
}
}
console.log(dny_k_blokaci);

const d2=dny_k_blokaci.length; // délka pole, kde jsou push dny k blokaci v roce a měsíci připadající na aktuálně zobrazený kalendář

if(d2!==0)
{
// pokud byly zapsány nějýké blokované dny do pole, nerovná se jeho délka 0

for(let i=0;i<d2;i++)
{
// smyčka zablokuje včechny buttony dnů, které se nacházejí v poli: dny_k_blokaci
const button_i=document.getElementById(`${this.p_id}${dny_k_blokaci[i]}`) as HTMLButtonElement; // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML element existuje
button_i.disabled=true; // udělá disabled na buttonu
button_i.removeEventListener("click",this); // odebere posluchač buttonu
button_i.removeAttribute('data-has-listener'); // Odebere atribut 'data-has-listener' pokud ho má
}}}

if(cas_rezervace.load_data_rezervace)
{
// pokud již budou vpořádku načtena data rezervace časů od uživatelů
this.dny_klikat(true); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno
}

};

load_book_block_day()
{
// načtení z JSON dnů, které mají být blokovány - nepřístupné k bookingu

kalendar.dny_klikat(false); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno

// ZAČÁTEK SIMULACE


// const jsonString = `
// {
// "data":
// [
// {"rok":2025,"mesic":0,"den":5},
// {"rok":2025,"mesic":0,"den":6},
// {"rok":2025,"mesic":0,"den":8},
// {"rok":2025,"mesic":0,"den":9},
// {"rok":2025,"mesic":0,"den":13},
// {"rok":2025,"mesic":0,"den":14},
// {"rok":2025,"mesic":0,"den":16},
// {"rok":2025,"mesic":0,"den":17},
// {"rok":2025,"mesic":0,"den":21},
// {"rok":2025,"mesic":0,"den":22},
// {"rok":2025,"mesic":0,"den":24},
// {"rok":2025,"mesic":0,"den":25},
// {"rok":2025,"mesic":0,"den":29},
// {"rok":2025,"mesic":0,"den":30}
// ]
// }
// `;
  
// Funkce pro načtení JSON souboru z řetězce
// const loadJSONFromString=(jsonStr:string):any=>{
// try{
// const jsonData=JSON.parse(jsonStr);
// console.log('Načtená data (ze simulace):',jsonData);
// return jsonData;
// }catch (error) {
// console.error('Chyba při načítání JSON (ze simulace):', error);
// return null;
// }
// }

// KONEC SIMLACE

// Asynchronní funkce pro načtení JSON souboru pomocí fetch
const fetchJSON=async():Promise<any> =>{
const jsonFilePath ="config/cti-blok-days.php"; // cesta k PHP souboru, který zajistí čtení JSON souboru, číst JSON může kdokli, ale musí být chráněn proti zápisu
try{
const response=await fetch(jsonFilePath); // načítání dat ze souboru JSON
if(!response.ok)
{
throw new Error('Síťová odpověď nebyla v pořádku'); // chyba při načítání
}
const jsonData=await response.json(); // převzetí dat do proměnné

return jsonData; // vrací načtená data
}
catch(error)
{
console.error("Chyba při načítání JSON block-days:", error);
this.error_load_data(); // v kontejneru kde jsou dny 1-31 otevře okno s infornmací: Potřebná data, nebyla ze serveru načtena.
return null;
}
}
  

setTimeout(async ()=>{
// Načtení JSON dat ze serveru anebo simulačně dle potřeby

const jsonData=await fetchJSON(); // Načtení JSON dat z servru -- NAOSTRO !!!

// const jsonData=loadJSONFromString(jsonString);  Načtení JSON dat z řetězce -- SIMULACE !!!

// Pokud byla data úspěšně načtena, pokračuj ve zpracování
if(jsonData){
jsonData.data.forEach((item:{rok:number,mesic:number,den:number})=>{
const dateArray:number[]=[item.rok,item.mesic,item.den];
this.block_days.push(dateArray);
});
}

this.load_data_book_block_day=true; // proměnná na true ukazuje, že data o dnech, které se mají blokovat, jsou z JSON souboru načtena
this.book_block_day(); // jakmile budou načtena data, metoda provede faktickou blokaci konkrétních dnů podle dnů v souboru JSON

},0);  // Použití setTimeout k oddělení asynchronní operace

};

error_load_data(){
// metoda zobrazí v kontejneru kde jsou dny 1-31 okno s informací: Potřebná data, nebyla ze serveru načtena.

this.dny_klikat(true); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno

const kontajner=document.getElementById(this.error_load_element[0]) as HTMLElement; // kontajner s informací: Potřebná data, nebyla ze serveru načtena.
const k_button=document.getElementById(this.error_load_element[2]) as HTMLButtonElement; // buton kontajneru: Opakovat načtení
const p_offline=document.getElementById(this.error_load_element[3]) as HTMLElement; // P element s informací: Byl jste offline

if(kontajner)
{
// pokud html Element existuje
kontajner.style.display=this.error_load_element[1]; // zviditelní blok s informací: Potřebná data, nebyla ze serveru načtena.
}

if(k_button)
{
// pokud html Element existuje
k_button.addEventListener("click",this); // přidá posluchač click na button: Opakovat načtení
}

if(p_offline)
{
// pokud html Element existuje
if(navigator.onLine)
{
// uživatel je on-line
p_offline.style.display="none"; // zneviditelní P element s informací byl jste offline
}
else
{
// uživatel je off-line
p_offline.style.display="block"; // ukáže P element s informací byl jste offline (block je default nastavení P elementu)
}
}

};

error_load_data_close(load:boolean=false)
{
// metoda zavře v kontejneru kde jsou dny 1-31 okno s informací: Potřebná data, nebyla ze serveru načtena., pokud do funkce zašleme hodnotu: true, bude zavření doprovázet nové načtení dat ze serveru

const kontajner=document.getElementById(this.error_load_element[0]) as HTMLElement; // kontajner s informací: Potřebná data, nebyla ze serveru načtena.
const k_button=document.getElementById(this.error_load_element[2]) as HTMLButtonElement; // buton kontajneru: Opakovat načtení

if(kontajner)
{
// pokud html Element existuje
kontajner.style.display="none"; // zneviditelní blok s informací: Potřebná data, nebyla ze serveru načtena.
}

if(k_button)
{
// pokud html Element existuje
k_button.removeEventListener("click",this); // odebere posluchač click na button: Opakovat načtení
}

if(load===true)
{
// pokud bude do funkce zasláno true
boss.reset_aplikace("častečne"); // provede částečné resetnutí aplikace
}

};

handleEvent(e:any){
// klik na den v měsíci 1-31
const k:string=e.target.closest("button").id; // načte id buttonu na který bylo kliknuto

if(k===this.error_load_element[2])
{
// pokud bylo kliknuto na button error okna: Potřebná data, nebyla ze serveru načtena - Opakovat načtení
this.error_load_data_close(true); // metoda zavře toto okno a hodnota TRUE zajistí nové načtení dat z JSON
return; // ukončí funkci
}

const cislo_dne:number=parseInt(`${k[1]}${k[2]}`); // z id buttonu odstraní pomocí parseTnt veškerý text a získá číslo dne jako integer

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

this.book_den[0]=a_r; // zapíše do pole book_den - rok
this.book_den[1]=a_m; // zapíše do pole book_den - měsíc
this.book_den[2]=cislo_dne; // zapíše do pole book_den - den

const fake_check=document.getElementById(this.facke_checked_id) as HTMLInputElement; // HTML input type checked, který se zatrhne, aby se formuzlář mohl odeslat
if(fake_check)
{
// pokud HTML element existuje
fake_check.checked=true; // zatrhne checked u input type checked - fake checked
}

this.oznacit_den(); // funkce zajišťuje označení konkrétního dne

cas_rezervace.aktivace(); // aktivuje všechny radia a li na možnost zarezervování
cas_rezervace.data_rezervace_blok_time(); // zablokuje časy rezervace, které již byly rezervovány, data ze souboru JSON
cas_rezervace.zobrazit_casy(); // funkce hlavní kontejner s časy zobrazí z opacity:0; z-index:-1; na opacity:1; z-index:0;
cas_rezervace.problik_casy(); // metoda provede probliknutí hlavního kontejneru s časy rezervace
};
oznacit_den(){
// funkce zajistí označení konkrétního dne uživatelem

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

for(let i=1;i<32;i++)
{
// smyčka všechny buttony přebarví na default barvu
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.backgroundColor=this.color_NEoznacen; // přidá buttonu barvu NEoznačeného buttonu
}}

if(a_r===this.book_den[0]&&a_m===this.book_den[1])
{
const button_i=document.getElementById(`${this.p_id}${this.book_den[2]}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.backgroundColor=this.color_oznacen; // přidá buttonu barvu označeného buttonu
}
}
};

};



class Mesic_a_rok{
readonly id_posun=["m_minus","m_plus"]; // id šipek s posunem měsíce 0===vzad, 1===vpřed
readonly id_text="mesic_a_rok"; // id inputu s textem měsíc a rok
readonly id_kalendar="plocha_kalendar"; // ide Fielsetu kalendáře, kde jsou dny Po-Pá, dny v měsící 1-31, výplně 1-6
private touchStartX:number=0; // zachycení začátku pohybu uživatele prstem na obrazovce (osa X)
private touchEndX:number=0; // zachycení konce pohybu uživatele prstem na obrazovce (osa X)
private touchStartY:number=0; // zachycení začátku pohybu uživatele prstem na obrazovce (osa Y)
private touchEndY:number=0; // zachycení konce pohybu uživatele prstem na obrazovce (osa Y)
aktivace(){
// funkce aktivuje posluchače šipek měsíc vzad a vpřed

const butt_1=document.getElementById(this.id_posun[0]) as HTMLButtonElement; // button šipka vzad
const butt_2=document.getElementById(this.id_posun[1]) as HTMLButtonElement; // button šipka vpřed

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

const plocha_dny=document.getElementById(this.id_kalendar) as HTMLElement; // Fielset - plocha kalendáře

if(plocha_dny)
{
// Posluchač pro začátek dotyku
plocha_dny.addEventListener("touchstart",(e)=>{
this.touchStartX=e.touches[0].clientX; // počáteční souřadnice pohybu po ose X
this.touchStartY=e.touches[0].clientY; // počáteční souřadnice pohybu po ose Y
},{passive:true}); // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."

// Posluchač pro pohyb prstu
plocha_dny.addEventListener("touchmove",(e)=>{
this.touchEndX=e.touches[0].clientX;  // konečné souřadnice pohybu po ose X
this.touchEndY=e.touches[0].clientY; // konečné souřadnice pohybu po ose Y
},{passive:true}); // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."

// Posluchač pro konec dotyku
plocha_dny.addEventListener("touchend",(e)=>{
this.handleGesture(e); // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
},{passive:true});} // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."

};
handleGesture(e:any){
 // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
const diffX=this.touchEndX-this.touchStartX; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa X)
const diffY=this.touchEndY-this.touchStartY; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa Y)
if(Math.abs(diffX)>50&&Math.abs(diffY)<30){ // Práh pohybu (X:50px,Y:30px)
if(diffX>0){
this.handleEvent(e,1); // tah doprava
}else{
this.handleEvent(e,2); // tah doleva
}}
this.touchStartX=this.touchStartY=this.touchEndX=this.touchEndY=0; // anulace hodnot po vyhodnocení Prahu pohybu
};
handleEvent(e:any,pohyb:number=0){
const k:string=e.currentTarget.id; // id odkazuje na prvek, na který je navázán posluchač události

let problik_posunu=()=>{
// interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
const plocha_kalendare=document.getElementById(mesic_a_rok.id_kalendar) as HTMLElement; // načte objekt, kde je zobrazena plocha kalendáře dny v měsící 1-31
if(plocha_kalendare)
{
// pokud HTML element existuje
plocha_kalendare.style.opacity="0"; // opasity nastaví bez prodlení na 0
setTimeout(()=>{
plocha_kalendare.style.opacity="1"; // opacity nastaví s prodlením na 1, aby se zobrazil efekt postuopného transition opacity
},250);
}};

if(k===this.id_posun[0]||(pohyb===1&&k===this.id_kalendar))
{
// kliknuto na button VZAD, nebo tah uživatele prstem po kalendáři doprava
console.log("VZAD");
if(kalendar.aktualni_poloha!==0)
{
// pokud níní poloha kalendáře === 0, protože pozun vzad již není dále možný
problik_posunu(); // interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
}
kalendar.posun=-1; // přičte +1 poloze uživatele v kalendáři
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.restart_dnu_v_kalendari(); // funkce aktivuje všechny buttony pro dny 1-31 (všem nastaví disabled==false a přidá posluchače click)
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
kalendar.oznacit_den(); // funkce zajistí, že bude vždy oznacen den a pouze den, který zadal uživatel
kalendar.book_block_day();// metoda fakticky blokuje dny, které jsou uvedeny v JSON souboru
}
else if(k===this.id_posun[1]||(pohyb===2&&k===this.id_kalendar))
{
// kliknuto na button VPŘED, nebo tah uživatele prstem po kalendáři doleva
console.log("VPŘED");
if(kalendar.aktualni_poloha!==12)
{
// pokud uživatel není v poloze kalendáře 12, ta je poslední a další pohyb vpřed, již není možný
problik_posunu(); // interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
}
kalendar.posun=+1; // přičte +1 poloze uživatele v kalendáři, řešeno setterem
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.restart_dnu_v_kalendari(); // funkce aktivuje všechny buttony pro dny 1-31 (všem nastaví disabled==false a přidá posluchače click)
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
kalendar.oznacit_den(); // funkce zajistí, že bude vždy oznacen den a pouze den, který zadal uživatel
kalendar.book_block_day();// metoda fakticky blokuje dny, které jsou uvedeny v JSON souboru
}

}

};




class Datum {
readonly mesice:string[]=["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"]; // měsíce v roce

get den_v_tydnu(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDay(); // vrací den v týdnu, kde 0 je neděle a 1 je pondělí
};

get den_v_mesici(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDate(); // den v měsíci 1-31,1-30,1-28 ...
};

get mesic_v_roce(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getMonth(); // vrátí měsíc, kde leden je 0 a prosinec 11
};

get aktualni_rok(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getFullYear(); // aktuální rok
};

dnu_v_mesici(rok:number,mesic:number){
return new Date(rok,mesic+1,0).getDate(); // vrátí počet dnů v aktuálním měsíci v roce
}


};


class Cas_rezervace
{
// objekt zajišťuje potřebné funkcionality pro volbu času rezervace
readonly id_con="con_cas"; // ID hlavního kontejneru s časy rezervace
readonly id_logo=["app_logo_box","app_logo_svg","app_logo_text"]; // id k SVG logu [0=ID boxu v kterém je vloženo SVG logo Boar-cz, 1=ID samotného HTML SVG v kterém je logo, 2=ID contajneru textu pod logem]
readonly id_radio:string="cas"; // počátek ID input type radio cas1-cas14
readonly id_li:string="lic"; // počátek ID li v kterém je input type radio lic1-lic14
readonly class_nam:string[]=["zobraz_objekt","schovej_objekt"]; // názvy CSS tříd, které jsou používány pro animavce
private vybrany_cas:number=0; // vybraný čas uživatelem, kde 0 znamená, že čas nebyl vybrán a 1 je první čas
readonly casy:string[]=["9:00-9:30 hod.","9:30-10:00 hod.","10:00-10:30 hod.","10:30-11:00 hod.","11:00-11:30 hod.","11:30-12:00 hod.","12:00-12:30 hod.","12:30-13:00 hod.","13:00-13:30 hod.","13:30-14:00 hod.","14:00-14:30 hod.","14:30-15:00 hod.","15:00-15:30 hod.","15:30-16:00 hod."]; // všechny časy zadané slovně
rezervace:number[][]=[]; // pole s rokem, měsíce, dnem a časem(1-14) rezervace
load_data_rezervace:boolean=false; // proměnná, která ukazuje, zda byly ze souboru JSON načteny rezervace, pokud ano===true, pokud ne===false
load_rezervace_time_out:number|null=null; // časovač pro REKLUZI funkce data_rezervace_blok_time()

get cislo_vybraneho_casu()
{
// getter vrací číslo vybraného času 1-14
return this.vybrany_cas; //  vrací číslo vybraného času 1-14
};

get zobrazit_vybrany_cas()
{
// getter pomáhá zasílat čas vybraný uživatelem slovně
if(this.vybrany_cas!==0)
{
// pokud již uživatel vybral nějáký čas, pokud nevybral čas this.vybrany_cas===0
return this.casy[this.vybrany_cas-1]; // vrátí vybraný čas v textu: -1 protože pole je číslováno od 0, kdežto výbšr času je od 1, pokud je u vybraného času 0, znamená to, že čas nebyl uživatelem vybrán
}
return ("Čas nebyl doposud uživatelem vybrán");
};

get byl_vybran_cas()
{
// getter slouží k odpovědi, zda uživatel vybral čas
if(this.vybrany_cas>0&&this.vybrany_cas<=14)
{
// pokud byl vybrán čas uživatelem je jeho výběr v rozmezí 1-14 časových pásem
return true; // true===čas byl uživatelem vybrán
}
return false; // čas nebyl užívatelem vybrán
};

aktivace()
{
const pocet_casu=this.casy.length; // délka pole ukazuje na počet časů
for(let i=0;i<pocet_casu;i++)
{
// smička zajistí přidělení posluchačú událostí CLICK všem li elementům s volbou času

const radio=document.getElementById(`${this.id_radio}${i+1}`) as HTMLInputElement; // input type radio, číslování je od 1, proto i+1
if(radio)
{
radio.disabled=false; // vypne disabled, pokud by byl zaplý
radio.checked=false; // nastaví checked na false, čímž ho vypne, pokud by bylo zaplé
}

const li=document.getElementById(`${this.id_li}${i+1}`) as HTMLElement; // Element li je číslován od 1 : proto i+1
if(li)
{
// pokud existuje HTML element
const hasListener=li.getAttribute('data-has-listener')==='true'; // Pokud button ještě nemá posluchače událostí
if (!hasListener){
li.addEventListener("click",this); // přidělí posluchač událosi elementu li
li.style.color="black"; // nastaví konkrétní časem shodné  li na color black
li.style.backgroundColor="white"; // nastaví konkrétní časem shodné li na background-color white
li.style.cursor="pointer"; // nastaví konkrétní časem shodné li na cursor pointer
li.setAttribute("data-has-listener","true"); // přidá prvku atribut s hodnotou true
}}
}
this.vybrany_cas=0; // nastaví čas vybraného času na default hodnotu - čas nebyl vybrán
};

data_rezervace_blok_time()
{
// funkce zajistí blokaci časů, které již jsou rezervovány, časy byly načteny z JSON
if(!this.load_data_rezervace)
{
if(this.load_rezervace_time_out)
{
// pokud je časovač již spuštěn
clearTimeout(this.load_rezervace_time_out); // vynuluje časovač
}
this.load_rezervace_time_out=setTimeout(()=>{this.data_rezervace_blok_time();},1000); // REKLUZE - pokud nejsou data načtena pokusí se funkci spustit opět za 1s
return; // data zatím nebyla načtena - funkce bude ukončena
}

if(this.rezervace.length===0)
{
// pokud bude globýlní pole s blokovanými dny prázdné, znamená to, že nejsou zadány žádné blokovaný dny
return; // funkce bude ukončena
}


const rezervace:number[][]=this.rezervace; // převede globýlní pole s rezervací (rok,měsíc 0-11,den,čas 1-14) do lokální proměnné
const book_den=kalendar.rezervovane_datum; // getter vrací aktuální rezervované datum uživatelem [rok, měsíc , den]

const cas_shody:number[]=[]; // do pole budou zapsány všechny časy (1-14) odpovídající stejnému roku, měsíci a dnu rezervace

// Smyčka pro procházení pole polí a kontrolu shod
rezervace.forEach(item=>{
const [rok,mesic,den,cas]=item;
if(rok===book_den[0]&&mesic===book_den[1]&&den===book_den[2])
{
// Pokud se shodují první tři hodnoty, proveďte akci
cas_shody.push(cas); // zapíše do pole čas shody pro konkrétní rok , měsíc a den
}
});


if(cas_shody.length!==0)
{
// pokud byl zapsán nějáký čas shody

const pocet_shod=cas_shody.length; // počet shodných časů odpovídá délce pole

for(let i=0;i<pocet_shod;i++)
{
const radio=document.getElementById(`${this.id_radio}${cas_shody[i]}`) as HTMLInputElement; // input type radio, vezme svoje číslo z pole, kde byly zapsány všechny bookované časy
const li=document.getElementById(`${this.id_li}${cas_shody[i]}`) as HTMLElement; // li, které přísluší k input type radio, vezme svoje číslo z pole, kde byly zapsány všechny bookované časy

if(radio)
{
radio.disabled=true; // nastaví konkrétní časem shodné radio na disabled
}

if(li)
{
li.style.color="grey"; // nastaví konkrétní časem shodné  li na color grey
li.style.backgroundColor="lightgray"; // nastaví konkrétní časem shodné li na background-color lightgray
li.style.cursor="not-allowed"; // nastaví konkrétní časem shodné li na cursor přeškrklý
li.removeEventListener("click",this); // odebere posluchač klik
li.removeAttribute('data-has-listener'); // odebere prvku atribut, pokud ho má
}}}
};

load_rezervace()
{
// načtení z JSON časy, které jsou již rezervované

kalendar.dny_klikat(false); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno

// ZAČÁTEK SIMULACE


// const jsonString = `
// {
// "data":
// [
// {
// "rok": 2025,
// "mesic": 3,
// "den": 13,
// "cas_rezervace": 1,
// "encrypted_token": "ENCRYPTED_TOKEN_1",
// "iv": "IV_BASE64_1"
// },
// {
// "rok": 2025,
// "mesic": 2,
// "den": 25,
// "cas_rezervace": 4,
// "encrypted_token": "ENCRYPTED_TOKEN_2",
// "iv": "IV_BASE64_2"
// },
// {
// "rok": 2025,
// "mesic": 2,
// "den": 25,
// "cas_rezervace": 1,
// "encrypted_token": "ENCRYPTED_TOKEN_2",
// "iv": "IV_BASE64_2"
// }
// ]
// }
// `;
  
// Funkce pro načtení JSON souboru z řetězce
// const loadJSONFromString=(jsonStr:string):any=>{
// try{
// const jsonData=JSON.parse(jsonStr);
// console.log('Načtená data (ze simulace):',jsonData);
// return jsonData;
// }catch (error) {
// console.error('Chyba při načítání JSON (ze simulace):', error);
// return null;
// }
// }

// KONEC SIMLACE
  
// Asynchronní funkce pro načtení JSON souboru pomocí fetch
const fetchJSON=async():Promise<any> => {
const jsonFilePath="config/cti-rezervace.php"; // cesta k PHP souboru
try{
const response=await fetch(jsonFilePath); // načítání dat ze souboru JSON
if(!response.ok){
kalendar.error_load_data(); // v kontejneru kde jsou dny 1-31 otevře okno s infornmací: Potřebná data, nebyla ze serveru načtena.
throw new Error("Síťová odpověď nebyla v pořádku"); // chyba při načítání
}
let jsonData=await response.json(); // převzetí dat do proměnné

// Pokud JSON neobsahuje pole 'data' nebo pokud je prázdné, nastavíme prázdné pole
if(!jsonData||!jsonData.data||!Array.isArray(jsonData.data))
{
jsonData={data:[]};  // Zajistíme, že data budou vždy pole
}
return jsonData; // vrací načtená data
}catch(error) {
console.error("Chyba při načítání JSON data rezervací od uživatelů block-time:", error);
kalendar.error_load_data(); // v kontejneru kde jsou dny 1-31 otevře okno s infornmací: Potřebná data, nebyla ze serveru načtena.
return {data:[]}; // Vrátí prázdný objekt, pokud dojde k chybě
}
};

setTimeout(async()=>{
// Načtení JSON dat ze serveru anebo simulačně dle potřeby

const jsonData=await fetchJSON(); // Načtení JSON dat z servru -- NAOSTRO !!!

// const jsonData=loadJSONFromString(jsonString);  Načtení JSON dat z řetězce -- SIMULACE !!!

// Pokud byla data úspěšně načtena, pokračuj ve zpracování
if(jsonData){
jsonData.data.forEach((item:{rok:number,mesic:number,den:number,cas_rezervace:number})=>{
const dateArray:number[]=[item.rok,item.mesic,item.den,item.cas_rezervace];
this.rezervace.push(dateArray); // vložení načtených dat z JSON do globálního pole
});
}
this.load_data_rezervace=true; // proměnná na true ukazuje, že data o dnech, které se mají blokovat, jsou z JSON souboru načtena

if(kalendar.load_data_book_block_day)
{
// pokud budou vpořádku načtena data block-days - blokované dny
kalendar.dny_klikat(true); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno
}

},0);  // Použití setTimeout k oddělení asynchronní operace

};

handleEvent(e:any)
{
const k:string=e.target.id; // zjistí ID prvku na který byl klik proveden

const number:number=parseInt(k.replace(/\D/g,'')); // .replace(/\D/g, '') odstraní všechny nečíselné znaky (což jsou ty, které nejsou číslice) z řetězce a parseInt() převádí tento řetězec na celé číslo.

const radio=document.getElementById(`${this.id_radio}${number}`) as HTMLInputElement; // příslušný input type radio nacházející se v stejnél li elementu na který bylo kliknuto

if(radio)
{
// pokud existuje HTML element
radio.checked=true; // zatrhne konkrétní input type radio
this.vybrany_cas=number; // do proměnné uloží informaci s číslem, podle které je možné zjistit jaký čas byl uživatelem vybrán (1-14)
}

};

zobrazit_casy(){
// funkce hlavní kontejner s časy zobrazí z opacity:0; z-index:-1; na opacity:1; z-index:0;
const hl_con=document.getElementById(this.id_con); // hlavní kontejner, kde jsou chronologicky seřazeny časy

if(hl_con)
{
// Pokud HTML element existuje
hl_con.classList.add(this.class_nam[0]); // přidá CSS třídu s animací opacity z 0 na 1
}

const logo_box=document.getElementById(this.id_logo[0]) as HTMLElement; // kontejner s logem Boar-cz
const logo_svg=document.getElementById(this.id_logo[1]) as HTMLElement; // SVG kontajner pro samotné SVG logo
const logo_text=document.getElementById(this.id_logo[2]) as HTMLElement; // SVG kontajner pro samotné SVG logo

if(logo_box&&logo_svg&&logo_text){
// Pokud HTML elementy existují
if(!logo_box.classList.contains(this.class_nam[1]))
{
// pokud box s logem neobsahuje tuto css třídu
setTimeout(()=>{
logo_box.style.zIndex="-5"; // schová hluboko box s logem
logo_svg.style.opacity="0"; // sníží průhlednost SVG loga na 0
logo_text.style.opacity="0"; // sníží průhlednost textu pod SVG logem na 0
},600); // 500 ms je transition opacity
}
logo_box.classList.add(this.class_nam[1]); // přidá CSS třídu s animací opacity z 1 na 0
}

};

problik_casy(){
// metoda provede probliknutí hlavního kontejneru s časy rezervace
const hl_con=document.getElementById(this.id_con) as HTMLElement; // hlavní kontejner, kde jsou chronologicky seřazeny časy

if(hl_con)
{
// Pokud HTML element existuje
hl_con.style.filter="blur(5px)"; // nastaví mu rozmazání
hl_con.style.transform = "scale(0.9)" // nastaví zmenšení

setTimeout(()=>{
hl_con.style.filter="blur(0px)"; // nastaví na default
hl_con.style.transform = "scale(1)" // nastaví na default
},250); // zpoždění kopíruje css vlastnost transmition
}}
};

interface Dialog_okno
{
// interface pro vytvoření všech parametrů pro správné fungování dialogového okna
id_okna:string; // id dialogového okna
id_buton_pro_zavreni?:string; // id buttonu pro zavření dialogového okna
id_top_kotva?:string; // id horní kotvy dialogového okna, která slouží k scrool po otevření okna
id_button_pro_scroll_bottom?:string; // id buttonu, kterým je možné provést scroll k bottom kotvě
id_bottom_kotva?:string; // id spodní kotva dialogového okna, která slouží k scrool na bottom dialogového okna
id_animace?:string; // id animace dialogového okna, pokud je potřeba tuto animaci spustit při jeho otevření
};

class Dia
{
// CLASS slouží pro řízení otvírání a zavírání dialogových oken

boundOffs:{[key:string]:any}={}; // objekt, který zajistí správný způsob je skutečně uložit bindovanou funkci do proměnné
open_dialog=false; // proměnná, která sleduje jestli je otevřen dialogové okno s dotazem na zrušení rezervace, pokud ANO===TRUE, pokud NE===false
casovac_animace:number|null=null; // časovač animace pro její opakování
startTime:number|null=null; // proměnná hlídá kolik času animace uběhlo

dia_zasady:Dialog_okno={
// objekt s id pro dialogové okno: Zásady ochrany osobních údajů
id_okna:"zasady",
id_buton_pro_zavreni:"butt_zasady",
id_top_kotva:"top_kotva_zasady",
id_button_pro_scroll_bottom:"scroll_butt_zasady",
id_bottom_kotva:"bottom_kotva_zasady"
};

dia_waiting:Dialog_okno={
// objekt s id pro dialogové okno: Čekejte prosím ... Zpracovává se popožadavek
id_okna:"waiting",
id_animace:"cir_1",
};

dia_uspech:Dialog_okno={
// objekt s id pro dialogové okno: Rezervace byla úspěšně dokončena
id_okna:"uspech",
id_buton_pro_zavreni:"butt_uspech"
};

dia_neuspech:Dialog_okno={
// objekt s id pro dialogové okno: Rezervace byla NEúspěšně dokončena
id_okna:"neuspech",
id_buton_pro_zavreni:"butt_neuspech"
};

dia_prekrocen_limit:Dialog_okno={
// objekt s id pro dialogové okno: Překročili jste limit za 24 hodin === překročen Rate Limit
id_okna:"prekrocen_limit",
id_buton_pro_zavreni:"butt_prekrocen_limit"
};

dia_dotaz_zruseni:Dialog_okno={
// objekt s id pro dialogové okno: Zrušit rezervaci?
id_okna:"zrusit_rezervaci",
};

dia_zruseno:Dialog_okno={
// objekt s id pro dialogové okno: Rezervace zrušena
id_okna:"zruseno",
id_buton_pro_zavreni:"butt_zruseno"
};

dia_zruseno_driv:Dialog_okno={
// objekt s id pro dialogové okno: Rezervace existovala, ale už byla zrušena
id_okna:"zruseno_driv",
id_buton_pro_zavreni:"butt_zruseno_driv"
};

dia_nezruseno:Dialog_okno={
// objekt s id pro dialogové okno: Rezervace nezrušena
id_okna:"nezruseno",
id_buton_pro_zavreni:"butt_nezruseno"
};


get addDia_zasady()
{
// getter vrátí všechny parametry nutné ke spuštění funkcionalit dialogového okna: Zásady ochrany osobních údajů
return Object.values(this.dia_zasady) as [string,string?,string?,string?,string?]; // vrátí všechny hodnoty objektu jednu po druhé, jejich použití je možné pomocí speed operátoru ...
};

on(id_dialog:string,id_button_z:string="",id_kotva_top:string="",id_button_scroll:string="",id_kotva_bottom:string="")
{

const okno=document.getElementById(id_dialog) as HTMLDialogElement; // načte HTML element dialogového okna
if(okno)
{
// pokud HTML objekt existuje
okno.showModal(); // otevře dialogové okno

if(id_dialog===this.dia_dotaz_zruseni.id_okna)
{
// pokud se id otevřeného dialogu === id dialogu s dotazem: Zrušit rezervaci
this.open_dialog=true; // proměnnou přepíše na TRUE === dialogové okno s dotazem na zrušení rezervace je otevřené
}


}

if(id_button_z!=="")
{
// pokud bude zaslán id butonu pro zavření dialogového okna
const button_close=document.getElementById(id_button_z) as HTMLButtonElement; // načte HTML element buttonu pro zavření dialogového okna
if(button_close)
{
// pokud HTML objekt existuje
const boundOff = this.off.bind(this,id_dialog,id_button_z,id_button_scroll); // proměnná, do které se uloží bind funkce, aby mohla být správně pomocí removeEventlistener odstraněna
this.boundOffs[id_button_z]=boundOff; // proměná bude uložena do globální proměnné pod klíčem id_button_z
button_close.addEventListener("click",boundOff); // přidá posluchač buttonu pro zavření dialogového okna
}}

if(id_kotva_top!=="")
{
// pokud byl zaslána id kotvy pro scroll
const kotva=document.getElementById(id_kotva_top); // načte HTML element s kotvou pro sroll

if(kotva)
{
// pokud HTML objekt existuje
setTimeout(()=>{
kotva.scrollIntoView({behavior:"smooth",block:"start"}); // provede scroll TO na HTML kotvu
},100); // Přidání zpoždění pro zajištění posunu
}
}

if(id_button_scroll!==""&&id_kotva_bottom!=="")
{
// pokud byla metoda volána s id_button_scroll a id_kotva_bottom
const butt_kotva=document.getElementById(id_button_scroll) as HTMLButtonElement; // načte HTML element buttonem pro scroll

if(butt_kotva)
{
// pokud existuje HTML element
const boundOff_k=this.scroll.bind(this,id_kotva_bottom); // vytvoří referenci pro volání a následné odstranění posluchače bind
this.boundOffs[id_button_scroll]=boundOff_k; // zapíše refernci do objektu pod klíčem: d_button_scroll
butt_kotva.addEventListener("click",boundOff_k); // přidá posluchač události
}}
};
off(id_dialog:string,id_button_z:string="",id_button_scroll:string="")
{
// metoda zavře dialogové okno

if(id_dialog===this.dia_zruseno.id_okna)
{
// pokud se právě zavírá dialogové okno s informací: Rezervace byla zrušena
location.reload(); // udělá refreš stránky (její nové načtení), což znovu načte aplikace a udělá její kompletní reset
}

if(id_button_z!=="")
{
// pokud bude zaslán do funkce parametr s id buttonu pro zavření dialofového okna
const button_close=document.getElementById(id_button_z) as HTMLButtonElement; // načte HTML element buttonu pro zavření dialogového okna
if(button_close)
{
// pokud HTML objekt existuje
button_close.removeEventListener("click",this.boundOffs[id_button_z]); // odebere posluchač buttonu pro zavření dialogového okna
delete this.boundOffs[id_button_z]; // odstraní referenci z objektu
}
}

const okno=document.getElementById(id_dialog) as HTMLDialogElement; // načte HTML element dialogového okna

if(okno)
{
// pokud HTML objekt existuje
okno.style.opacity="0"; // zneviditelní dialogové okno, díky transitions v css vytvoří animaci
okno.style.transform="scale(.5)"; // začne dialogové okno zmenšovat, díky transitions v css vytvoří animaci
setTimeout(()=>{
okno.close(); // zavře dialogové okno
okno.style.opacity="1"; // nastaví hodnotu na default
okno.style.transform="scale(1)"; // nastaví hodnotu na default

if(id_dialog===this.dia_dotaz_zruseni.id_okna)
{
// pokud se id otevřeného dialogu === id dialogu s dotazem: Zrušit rezervaci
this.open_dialog=false; // proměnnou přepíše na FALSE === dialogové okno s dotazem na zrušení rezervace není otevřené
}

},200); // zpoždění odpovídá transition 0.2s v CSS
}

if(id_button_scroll!=="")
{
const butt_kotva=document.getElementById(id_button_scroll) as HTMLButtonElement; // načte HTML element buttonem pro scroll

if(butt_kotva)
{
// pokud existuje HTML element
const boundOff_k=this.boundOffs[id_button_scroll]; // načte referenci, která byla přidána posluchačí funke bind, klíč je: id_button_scroll
butt_kotva.removeEventListener("click",boundOff_k); // odebere posluchač události buttonu pro scroll bottom
delete this.boundOffs[id_button_scroll]; // odstraní referenci z objektu
}

}

console.log("CLOSE");
};

scroll(id_kotva_bottom:string)
{
const kotva=document.getElementById(id_kotva_bottom) as HTMLElement; // načte HTML objekt kotvy
if(kotva)
{
// pokud HTML objekt existuje
kotva.scrollIntoView({behavior:"smooth",block:"end"}); // provede scrollTo na HTML kotvu
}
};
wait_activ()
{
// metoda aktivuje dialogové okno: Čekejte prosím! Zpracovává se požadavek ... 
this.on(this.dia_waiting.id_okna); // otevře dialogové okno
const id_an=this.dia_waiting.id_animace ?? "cir_1"; // operátor nulového slučování (nullish coalescing operator), který poskytne výchozí hodnotu, pokud je hodnota undefined nebo null
const animace=document.getElementById(id_an); // HTML elemnt prvku s první animací

if(animace instanceof SVGAnimateElement)
{
if(this.startTime===null)
{
// pokud není žádný počáteční čas animace
animace.beginElement(); // pustí SVG animaci
this.startTime=performance.now(); // začne měřit čas spuštění animace
this.casovac_animace = setInterval(() => {
animace.beginElement(); // pustí animaci
this.startTime=performance.now();
},4500); // spustí opakující se interval
}
else
{
// pokud je nějáký čas zahájení spuštění animace
const begin=(performance.now()-this.startTime)|0; // zjistí kolik milisekund animace běžela a ořízne to na celé číslo
setTimeout(()=>{
animace.beginElement(); // pustí SVG animaci
this.startTime=performance.now(); // začne měřit počátek běhu SVG animace
this.casovac_animace = setInterval(()=>{
animace.beginElement(); // pustí animaci
this.startTime=performance.now(); // začne měřit počátek běhu SVG animace
}, 4500); // spustí opakující se interval
},4500-begin); // zpoždění odpovídající chybějícímu času do konce již spuštěné animace
}
}
};

wait_deactiv()
{
// metoda deaktivuje dialogové okno: Čekejte prosím! Zpracovává se požadavek ... 
if(this.casovac_animace != null){
// pokud je časovač aktivován
clearInterval(this.casovac_animace); // vynuluje časovač
}

if(this.startTime!==null)
{
// pokud byl zachycen čas spuštění SVG animace
const begin=(performance.now()-this.startTime)|0; // zjistí kolik milisekund animace běžela a ořízne to na celé číslo
setTimeout(()=>{
this.startTime=null; // nastaví proměnnou na default
},4400-begin); // spustí vynulování proměnné až v čase, kdy už animace proběhla
}

this.off(this.dia_waiting.id_okna); // zavře dialogové okno
}
};


class Boss
{
// class bude zajišťovat hlavní chod celé aplikace rezervace
readonly id_boss_con="boss_con"; // id hlavního kontejneru aplikace
readonly id_form=["rezervace_form","dokoncit_form"]; // id formulářů
readonly id_button=["zmenit","ukaz_zasady","butt_zavinac"]; // id hlavních buttonů formulářů
readonly id_inputHost=["jmeno","email","phone","predmet"]; // id input, které vyplňoval návštěvník [návštěvník: jméno a příjmení, návštěvník: email, návštěvník: telefon, návštěvník: O čem bude hovor]
readonly id_checked="checken_souhlas"; // id checked Souhlasím se zpracováním osobních údajů
readonly id_predvolba_phone="predvolba"; // id input s predvolbou telefonní +420
readonly id_cas="slovne_cas_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje čas rezervace
readonly id_den="slovne_den_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den rezervace Pondělí-Neděle
readonly id_den_v_mesici="ciselne_den_v_mesici_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den v měsíci rezervace 1-31
readonly id_mesic="slone_mesic_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje měsíc rezervace leden-prosinec
readonly id_rok="ciselne_rok_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje rok rezervace např. 2024
readonly id_token="token"; // id HTML input s tokenem
private slovne_datum=""; // v proměnné je slovně uložené celé datum rezervace
private slovne_cas=""; // v proměnné je uloženo slovně konkrétní čas rezervace
readonly dny:string[]=["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"]; // dny v týdnu
readonly mesice:string[]=["ledna","února","března","dubna","květena","června","července","srpna","září","října","listopadu","prosince"]; // měsíce v roce

rovna_vyska_form(){
// metoda zajistí že oba formuláře rezrvace budou mít stejnou výšku, budou oba vysoké jako ten nejvyšší
const form1 = document.getElementById(this.id_form[0]) as HTMLFormElement; // form 1
const form2 = document.getElementById(this.id_form[1]) as HTMLFormElement; // form 2
if (form1 && form2) {
let v1 = 0;
let v2 = 0;
if(window.getComputedStyle(form1).display !== "none")
{
// nataví jeho výšku na uto, aby ho změřil
form1.style.height="auto"; // natavení na auto nám zaručí přirozenou výšku kontejneru
v1=form1.clientHeight; // změří jeho výšku
}
else
{
// formulář dočasně zapne, aby zjistil jeho výšku
form2.style.display = "none";
form1.style.display = "flex";
form1.style.height="auto";  // natavení na auto nám zaručí přirozenou výšku kontejneru
v1 = form1.clientHeight; // změří jeho výšku
form1.style.display = "none";
form2.style.display = "flex";
}

if(window.getComputedStyle(form2).display !== "none")
{
// pokud nemá form2 display na none
form2.style.height="auto";  // natavení na auto nám zaručí přirozenou výšku kontejneru
v2 = form2.clientHeight;  // změří jeho výšku
}
else
{
// formulář dočasně zapne aby zjistil jeho výšku
form1.style.display="none";
form2.style.display="flex";
form2.style.height="auto";  // natavení na auto nám zaručí přirozenou výšku kontejneru
v2=form2.clientHeight;  // změří jeho výšku
form2.style.display = "none";
form1.style.display = "flex";
}
const maxHeight = Math.max(v1, v2); // vybere nejvišší výšku z formulářů
form1.style.height=`${maxHeight}px`; // naství výšku
form2.style.height=`${maxHeight}px`; // naství výšku
}};

reset_aplikace(jak:string="")
{
// metoda vyresetuje aplikaci, jako by ji nikdo předtím nepoužil


if(jak!="castecne")
{
// pokud nebyl jako parametr požadavek - resetovat aplikaci pouze částečně
const id_inputy=this.id_inputHost; // inputy všech prvků formuláře pro dokončení rezervace
const d=id_inputy.length;
for(let i=0;i<d;i++)
{
// smyčka anuluje všechny input vyplněné uživatelem
const input=document.getElementById(id_inputy[i]) as HTMLInputElement; // načte HTML input jeden po druhém

if(input)
{
// pokud HTML element existuje
input.value=""; // anuluje jeho value
}
}
      
const s_checked=document.getElementById(this.id_checked) as HTMLInputElement; // checked Souhlasím se zpracováním osobních údajů
if(s_checked)
{
s_checked.checked=false; // zruší checked
}
}
this.form_posun(this.id_form[1],this.id_form[0]);  // metoda zajistí posun formuláře z Dokončit Rezervaci na Rezervovat 

kalendar.block_days=[]; // anuluje pole, kde se ukládají blokované dny
kalendar.load_data_book_block_day=false; // proměnná na true ukazuje, že data o dnech, které se mají blokovat, jsou z JSON souboru načtena a false, že nejsou načtena

kalendar.reset_book_den(); // metoda anuluje den, který si uživatel zabookoval
kalendar.oznacit_den(); // tím, že byl anulován den pomocí výše funkce kalendar.reset_book_den(); - odbarví všechny dny v měsíci
kalendar.restart_dnu_v_kalendari(); // metoda - povolí posluchače všem buttonům od 1-31, pokud tento posluchač nemají a všem nastaví disbled===false
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dne v aktuálním měsíci mimo dnešního dne
kalendar.load_book_block_day(); // funkce načte JSON soubor, kde jsou blokované dny pro rezervaci, po jeho načtení zapne blokaci dnů napsaných v JSON souboru

const fake_checked=document.getElementById(kalendar.facke_checked_id) as HTMLInputElement; // checked fake, krerý slouží jen pro upozornění, aby uživatel zatrhl den 1-31, pokud tak neučinil

if(fake_checked)
{
// pokud HTML element existuje
fake_checked.checked=false; // odchecketuje tento fake checked
}
cas_rezervace.rezervace=[]; // vynuluje pole, kde se ukládají rezervované časy
cas_rezervace.aktivace(); // aktivuje všechny radia a li na možnost zarezervování
cas_rezervace.load_data_rezervace=false; // proměnná, která ukazuje, zda byly ze souboru JSON načteny rezervace, pokud ano===true, pokud ne===false
cas_rezervace.load_rezervace(); // nahraje z JSON časy, které si už uživatelé zarezervovali
cas_rezervace.zobrazit_casy(); // funkce hlavní kontejner s časy zobrazí z opacity:0; z-index:-1; na opacity:1; z-index:0;
cas_rezervace.problik_casy(); // metoda provede probliknutí hlavního kontejneru s časy rezervace

};

posluchace()
{
// posluchače formulářů a hlavních buttonů formulářů
const d1=this.id_form.length; // délka pole
for(let i=0;i<d1;i++)
{
// smička zajistí blokaci formulářů odesláním submit
const form=document.getElementById(this.id_form[i]) as HTMLFormElement; // HTML element FORM
if(form){
// pokud existuje HTML element FORM
form.addEventListener("submit",this); // přiřadí posluchač k formuláři
};
}

const d2=this.id_button.length; // délka pole
for(let i=0;i<d2;i++)
{
// smička zajistí posluchače pro hlavní butony formulářů: Změnit rezervaci
const button=document.getElementById(this.id_button[i]) as HTMLButtonElement; // HTML element Button
if(button)
{
button.addEventListener("click",this); // přiřadí posluchač click k buttonu na this
}
}

const input_predvolba=document.getElementById(this.id_predvolba_phone) as HTMLInputElement; // HTML input s předvolbou telefoního čísla +420
if(input_predvolba)
{
// pokud HTML element existuje
input_predvolba.addEventListener("focus",()=>{
const input_telefon=document.getElementById(this.id_inputHost[2]) as HTMLInputElement; // načte HTML input s telefoním číslem
if(input_telefon)
{
input_telefon.focus(); // focus na input zadání telefonního čísla
}
}); // přidá posluchač focus - pokud někdo focusne předvolbu +420 hned ho to focusne na zadání telefoního čísla, předvolba +420 je readonly
}

};

zobrazeni_datumu(){
// funkce zajistí správné zobrazení datumu rezervace ve formuláři Dokončit rezervaci

const dny:string[]=this.dny; // dny v týdnu
const mesice:string[]=this.mesice; // měsíce v roce

const den_rezervace_uzivatel:number[]=kalendar.rezervovane_datum; // getter vrátí datum zadané uživatelem [rok, měsíc(0-11), den]:number[]

if(den_rezervace_uzivatel.every(value=>value===9999))
{
// pokud se návratová hodnota getteru=== [9999,9999,9999], znamená to, že uživatel nevybral datum
alert("Kritická chyba aplikace: uživatel nevybral datum");
return; // funkce bude ukončena
}

const den_v_tydnu=new Date(den_rezervace_uzivatel[0],den_rezervace_uzivatel[1],den_rezervace_uzivatel[2]).getDay(); // den v týdnu v určitém dnu v měsíci a roce, kde 0 je neděle

const den_v_tydnu_slovne:string=dny[den_v_tydnu]; // konkrétní den v roce zadaný uivatelem slovně Neděle až Pátek
const den_v_mesici:string=den_rezervace_uzivatel[2].toString(); // den v měsíci převeden na string
const mesic_v_roce_slovne:string=mesice[den_rezervace_uzivatel[1]]; // měsíc v roce slovně
const rok:string=den_rezervace_uzivatel[0].toString(); // rok převeden na string

const span_den_slovne=document.getElementById(this.id_den) as HTMLSpanElement;  // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den rezervace Pondělí-Neděle
const span_cislo_dne=document.getElementById(this.id_den_v_mesici) as HTMLSpanElement; // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den v měsíci rezervace 1-31
const span_mesic=document.getElementById(this.id_mesic) as HTMLSpanElement; // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje měsíc rezervace leden-prosinec
const span_rok=document.getElementById(this.id_rok) as HTMLSpanElement; //  HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje rok rezervace např. 2024

if(span_den_slovne)
{
// pokud HTML objekt existuje
span_den_slovne.innerText=den_v_tydnu_slovne; // přepíše den v týdnu
}

if(span_cislo_dne)
{
// pokud HTML objekt existuje
span_cislo_dne.innerText=den_v_mesici; // přepíše číslo dne
}

if(span_mesic)
{
// pokud HTML objekt existuje
span_mesic.innerText=mesic_v_roce_slovne; // přepíše měsíc v roce
}

if(span_rok)
{
// pokud HTML objekt existuje
span_rok.innerText=rok; // přepíše rok
}

this.slovne_datum=`${den_v_tydnu_slovne}, ${den_v_mesici}.${mesic_v_roce_slovne} ${rok}`; // do proměnné bude vložen kompletní datum rezervace

};

zobrazeni_casu(){
// funkce zajistí správné zobrazení času rezervace ve formuláři Dokončit rezervaci
const span_cas=document.getElementById(this.id_cas); // HTML span pro čas rezervace
if(span_cas)
{
span_cas.innerText=cas_rezervace.zobrazit_vybrany_cas; // přepíše čas rezervace na čas vybraný uživatelem
}

this.slovne_cas=cas_rezervace.zobrazit_vybrany_cas; // do proměnné zapíše slovně čas rezerace

};
napis_zavinac()
{
// metoda napíše @ do input email
const input_email=document.getElementById(this.id_inputHost[1]) as HTMLInputElement; // načete HTML element input email
if(input_email)
{
// pokud HTML element existuje
input_email.value+="@"; // přidá @ do input email
input_email.focus(); // přehodí uživatele hbytě za vepsaný @ v inputu s emailem
}
};

handleEvent(e:any)
{
const k:string=e.target.id; // id HTMLelementu na který bylo kliknuto


if(k===this.id_form[0]||k===this.id_form[1])
{
// pokud jde požadavek od některého z formulářů zablokuje výchozí provedení submit
e.preventDefault(); // Zabrání výchozímu chování (odeslání formuláře)
}

if(k===this.id_form[0])
{
// pokud byl požadavek uživatele klik na button Rezervovat - spustí se submit formuláře 1
if(cas_rezervace.byl_vybran_cas&&kalendar.byl_vybran_datum)
{
// pokud byl vybrán datum a čas rezervace
this.form_posun(this.id_form[0],this.id_form[1]); // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
this.zobrazeni_casu(); // funkce zajistí správné zobrazení času rezervace ve formuláři Dokončit rezervaci
this.zobrazeni_datumu(); // funkce zajistí správné zobrazení datumu rezervace ve formuláři Dokončit rezervaci
}
}
else if(k===this.id_form[1])
{
// pokud byl požadavek uživatele klik na button Dokončit rezervaci - spustí se submit formuláře 2
this.rezervovat(); // metoda zajistí plné dokončení rezervace
}

if(e.target.closest("button") && e.target.closest("button").id)
{
// pokud bylo kliknuto na button a existuje jeho ID
const k_b:string=e.target.closest("button").id; // načte id buttonu na který bylo kliknuto
if(k_b===this.id_button[0])
{
// pokud byl požadavek uživatele klik na button Změnit rezervaci
this.form_posun(this.id_form[1],this.id_form[0]);  // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
}

if(k_b===this.id_button[1])
{
// kliknuto na button Zásady ochrany osobních údajů
dia.on(...dia.addDia_zasady); // otevře dialogové okno Zásady ochrany osobních údajů
}

else if(k_b===this.id_button[2])
{
// pokud byl požadavek uživatele klik na button @
this.napis_zavinac(); // metoda zajistí přidání @ do input pro email
}
}

};

form_posun(old_form:string,new_form:string)
{
// metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci a opačně (old_form=== ID formuláře, který hceme zavřít), (new_form=== ID formuláře,který chceme otevřít)

const form_old=document.getElementById(old_form) as HTMLFormElement; // HTML element FORM
const form_new=document.getElementById(new_form) as HTMLFormElement; // HTML element FORM

if(form_old&&form_new)
{
form_old.style.display="none"; /* vypne starý formulář */
form_new.style.opacity="0"; /* nastavý nový formulář na opacity 0 */
form_new.style.display="flex"; /* aktivuje na novém formuláři display:flex */
setTimeout(()=>
{
form_new.style.opacity="1"; // nastavý novému formuláři opacity na 1
const h_c=document.getElementById(this.id_boss_con) as HTMLElement; // HTML element - hlavní kontejner aplikace
if(h_c)
{
// pokud HTML Element existuje
h_c.scrollIntoView({behavior:"smooth",block:"start"}); // v případě pohybu ve formuláři zajistí posun na počátek-top hlavního kontejneru
}
},100); // drobné zpoždění zajistí bezproblémový průběh animace opacity
}};

kontola_verze_javaScript()
{
const id_div="no_es2017"; // id div, který obsahuje informaci o tom, že uživatel nemá alespoň veri Java Scriptu es2017
const error_div=document.getElementById(id_div) as HTMLElement; // načte HTML element do proměnné
    
let kontrola1=false; // proměnná pro první kontrolu Object.values
let kontrola2=false; // proměnná pro druhou kontrolu (async/await)
    
// podmínka testuje dostupnost funkce Object.values, která je také součástí ES2017.
if(typeof Object.values==="function")
{
kontrola1=true; // ES2017 je podporován
}
else
{
kontrola1=false; // ES2017 není podporován
}

try
{
// použítí vlastnosti ES2017 (async/await)
new Function("async()=>{}")();
kontrola2=true; // ES2017 je podporován
}
catch(e)
{
kontrola2=false; // ES2017 není podporován
}

if(!kontrola1||!kontrola2)
{
// pokud jedna z kontrolovaných proměnných neprošla testem
if(error_div)
{
// pokud HTML element existuje
error_div.style.display="flex"; // nastaví DIV, tak aby byl pro uživatele viditelný
}}
};

async rezervovat(){
// metoda zajistí plné dokončení rezervace
console.log("Dokončit rezervaci");

const den_rezervace_uzivatel:[number,number,number]=kalendar.rezervovane_datum; // getter vrátí datum zadané uživatelem [rok, měsíc(0-11), den]:number[]
const cas_rezervace_uzivatel:number=cas_rezervace.cislo_vybraneho_casu; // getter vrací číslo vybraného času uživatelem 1-14



const input_hidden=document.getElementById(this.id_token) as HTMLInputElement;
let token=""; // v proměnné bude uložen token, který bude zároveň heslem ke každé rezervaci - bude mít pokaždé stejnou délku 32 znaků!!!
if(input_hidden)
{
token=input_hidden.value; // načte token z HTML elementu input type hidden
}



const data_pro_JSON:[number,number,number,number,string]=[...den_rezervace_uzivatel,cas_rezervace_uzivatel,token]; // spojí všechny potřebné proměnné a vytvoří pole, které se následně bude zapisovat do souboru JSON

const in_jmeno_uzivatel=document.getElementById(this.id_inputHost[0]) as HTMLInputElement; // input s jménem a příjmením uživatel
const in_email_uzivatel=document.getElementById(this.id_inputHost[1]) as HTMLInputElement; // input s emailem uživatele
const in_phone_uzivatel=document.getElementById(this.id_inputHost[2]) as HTMLInputElement; // input s telefonem uživatele
const in_predmet_uzivatel=document.getElementById(this.id_inputHost[3]) as HTMLInputElement; // input s předmětem uživatele (O čem bude hovor?)


const data_pro_Email:[string,string,string,string,string,string,string,string]=["","","","","","","",""]; // do pole budou zapsána všechna data, která jsou pro odesílání emailu
let jmeno:string="", // jméno uživatele
email:string="", // email uživatele
phone:string="", // telefon uživatele
predmet:string=""; // předmět uživatele (O čem bude hovor)





if(in_jmeno_uzivatel)
{
// pokud HTML element existuje
jmeno=in_jmeno_uzivatel.value.trim(); // z input načte jméno a příjmení
data_pro_Email[0]=jmeno;
}

if(in_email_uzivatel)
{
// pokud HTML element existuje
email=in_email_uzivatel.value.trim(); // z input načte email
data_pro_Email[1]=email;
}

if(in_phone_uzivatel)
{
// pokud HTML element existuje
phone=in_phone_uzivatel.value.trim(); // z input načte telefon
data_pro_Email[2]=phone;
}

if(in_predmet_uzivatel)
{
// pokud HTML element existuje
predmet=in_predmet_uzivatel.value.trim(); // z input načte O čem bude hovor
data_pro_Email[3]=predmet;
}

const datum_rezervace_slovne:string=this.slovne_datum; // slovně zapsaný celé datum rezervace pro zaslání emalem (např.: Úterý, 1. dubna 2025)
data_pro_Email[4]=datum_rezervace_slovne;
const cas_rezervace_slovne:string=this.slovne_cas; // slovně zapsaný čas rezervace pro rozesílání emailem (např.:9:00-9:30 hod.)
data_pro_Email[5]=cas_rezervace_slovne;
const currentUrl:string=window.location.href; // Tento kód uloží aktuální URL do proměnné
const cleanUrl:string=currentUrl.split("#")[0].split("?")[0]; // očistí url adresu, kdyby obsahovala hash # anebo honotu za ?
data_pro_Email[6]=cleanUrl;
data_pro_Email[7]=token; // bude na poslední pole vložen token

// console.log("token: " + token);
// console.log("den_rezervace_uzivatel: " + den_rezervace_uzivatel);
// console.log("cas_rezervace_uzivatel: " + cas_rezervace_uzivatel);
// console.log("cas_rezervace_slovne: " + cas_rezervace_slovne);
// console.log("datum_rezervace_slovne " + datum_rezervace_slovne);
// console.log("Jméno: " + jmeno);
// console.log("email: " + email);
// console.log("Telefon: " + phone);
// console.log("URL adresa www stránky: " + currentUrl);
// console.log("O čem bude hovor: " + predmet);

console.log(data_pro_Email);

const data=`csrf_token=${encodeURIComponent(token)}&data_json=${encodeURIComponent(JSON.stringify(data_pro_JSON))}&data_email=${encodeURIComponent(JSON.stringify(data_pro_Email))}`; // nachystá data na odeslání pro fetch API metodou post

// Vytvoření AJAX požadavku
const sendRequest=async()=>{
try{
// Nastavení prodlevy před odesláním požadavku
dia.wait_activ(); // zapne dialogové okno Čekejte prosím … Zpracovává se rezervace
setTimeout(async()=>{
// Odeslání požadavku na server
try {
const response:Response=await fetch("config/distributor-rezervace.php",{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:data
});
const result=await response.json(); // Převedení odpovědi na JSON
// Zkontrolujte, zda server odpověděl s 'status' a 'message'
if(response.ok){
// Server vrátil odpověď se statusem 'success'
if(result.status==="success")
{
console.log("Úspěch:",result.message);
// logika pro úspěšné zpracování
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_uspech.id_okna,dia.dia_uspech.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace proběhla úspěšně
boss.reset_aplikace(); // provede resetování aplikace, jako by ji uživatel nikdy nepoužil, zde je to z důvodů, aby načetle aktuální data z JSON, kde už bude nově provedená rezervace propsána
}
else
{
// Server vrátil odpověď s chybou ('error')
console.error("Chyba:", result.message); // Zobrazení chyby do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace

if(result.message==="Překročili jste limit požadavků. Zkuste to znovu za 24 hodin.")
{
// pokud je taková odpověď z PHP, byl překročen Rate limit
dia.on(dia.dia_prekrocen_limit.id_okna,dia.dia_prekrocen_limit.id_buton_pro_zavreni); // otevře dialogové okno - Překročen limit rezervací za 24 hodin
}
else
{
dia.on(dia.dia_neuspech.id_okna,dia.dia_neuspech.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace proběhla NEúspěšně
}

}
}
else
{
// Pokud odpověď serveru není v pořádku
console.error("Chyba serveru:",result.message||"Neznámá chyba");
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_neuspech.id_okna,dia.dia_neuspech.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace proběhla NEúspěšně
}
}
catch(error){
// Pokud došlo k chybě při zpracování požadavku před jeho odesláním
console.error("Chyba při zpracování požadavku před jeho odesláním:",error); // výpis chyb do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_neuspech.id_okna,dia.dia_neuspech.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace proběhla NEúspěšně
}          
},0); // Nastavení 0 ms zpoždění pro vykonání funkce
}
catch(error){
// Pokud došlo k chybě při komunikaci s API (např. nevalidní JSON nebo síťová chyba)
console.error('Chyba při zpracování odpovědi:', error); // výpis chyb do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_neuspech.id_okna,dia.dia_neuspech.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace proběhla NEúspěšně
}
};
sendRequest(); // Zavolání asynchronní funkce pro odeslání požadavku
};

spustit_aplikaci()
{
// metoda zajišťuje spuštění základních procesů pro chod aplikace rezervace
this.kontola_verze_javaScript(); // metoda zkontroluje jestli uživatel má alespoň Java Script ES2017, pokud ne, aktivuje DIV s errorem
this.rovna_vyska_form(); // srovná výšku obou formulářů na stejnou výšku
this.posluchace(); // spustí posluchače formulářů a hlavních buttonů formulářů
kalendar.nazev_mesice(); // funkce přepíše název měsíce a roku v input měsíc a rok
kalendar.restart_dnu_v_kalendari(); // funkce aktivuje všechny buttony pro dny 1-31 (všem nastaví disabled==false a přidá posluchače click)
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dne v aktuálním měsíci mimo dnešního dne
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
mesic_a_rok.aktivace(); // aktivuje posluchače události click k tlačítkům pro posun měsíce VPŘED a VZAD
cas_rezervace.aktivace(); // aktivuje posluchače pro volbu konkrétního času rezervace uživatelem
kalendar.load_book_block_day(); // funkce načte JSON soubor, kde jsou blokované dny pro rezervaci, po jeho načtení zapne blokaci dnů napsaných v JSON souboru
cas_rezervace.load_rezervace(); // nahraje JSON soubor a data rezervace časů, které byly už rezervované
}

};


class Zrusit_rezervaci{
// třída se postará o všechny kroky potřebné pro zrušení rezervace
zaznam_encrypted_token:string=""; // proměnná do sebe vloží zakódovaný token záznamu, který má být zrušen, pokud existuje
den_a_cas_rezervace:string=""; // proměnná do sebe vloží informaci o dnu a času rezervace, toto bude následně zasláno emailem tomu kdo rezervaci zrušil a mně, text bude vypadat např.: Čtvrtek, 20. února 2025, 13:30-14:00 hod.
readonly id_form:string="form_zruseni_rezervace"; // id formuláře v dialogovém okně: Zrušit rezervaci?
readonly id_butt:string="butt_zavinac2"; // id buttonů v dialogovém okně: Zrušit rezervaci? button @ a button Zrušit rezervaci
readonly id_input:string[]=["email2","duvod"]; // id input Email a Důvod zrušení v dialogovém okně: Zrušit rezervaci?
readonly id_span_cas_r:string[]=["slovne_den_rezervace2","ciselne_den_v_mesici_rezervace2","slone_mesic_rezervace2","ciselne_rok_rezervace2","slovne_cas_rezervace2"]; // id SPAN HTML elementů kde se uvádí termín rezervace, která má být zrušena např: Úterý, 24. prosince 2024, 15:00-15:30 hod.
private readonly delka_tokenu:number=32; // délka tokenu, počet zbaků, který má token
zaslat_zadost_na_zruseni()
{
// metoda zajistí pomocí fetch a PHP, vymazání rezervace z JSON souboru


const input_hidden=document.getElementById(boss.id_token) as HTMLInputElement; // HTML input type hidden s tokenem
let token=""; // v proměnné bude uložen token, který bude zároveň heslem ke každé rezervaci - bude mít pokaždé stejnou délku 32 znaků!!!
if(input_hidden)
{
token=input_hidden.value; // načte token z HTML elementu input type hidden
}

const encrypted_token=this.zaznam_encrypted_token; // načte zakódovaný token, který určuje o jakou rezervaci se jedná
const den_a_cas_rezervace=this.den_a_cas_rezervace; // načte den a čas rezervace, tato informace se bude rozesílat emailem, např.: Čtvrtek, 20. února 2025, 13:30-14:00 hod.


const inp_email=document.getElementById(this.id_input[0]) as HTMLInputElement; // HTML input s emailem

let email=""; // proměnná do které se bude vkládat email, na který bude zasláno potvrzení o zrušení rezervace
if(inp_email)
{
// pokud HTML element existuje
email=inp_email.value.trim(); // načte email z inputu a ořízne u něj prázdné znaky před i za emailem
}

const inp_duvod=document.getElementById(this.id_input[1]) as HTMLInputElement; // HTML input s důvodem zrušení

let duvod=""; // proměnná do které se bude zapisovat důvod
if(inp_duvod)
{
// pokud HTML element existuje
duvod=inp_duvod.value.trim(); // vezme value z inputu důvodu a odstraní na něm všechny prázdné znaky před i za textem
if(duvod.length===0)
{
// pokud bude mít proměnná délku 0, znamená to, že důvod nebyl uveden
duvod="Důvod zrušení nebyl uveden."; // doplní do proměnné, že důvod nebyl uveden
}
}

const data=`csrf_token=${encodeURIComponent(token)}&encrypted_token=${encodeURIComponent(encrypted_token)}&email=${encodeURIComponent(email)}&duvod=${encodeURIComponent(duvod)}&den_a_cas_rezervace=${encodeURIComponent(den_a_cas_rezervace)}`; // nachystá data na odeslání pro fetch API metodou post

// Vytvoření AJAX požadavku
const sendRequest=async()=>{
try{
// Nastavení prodlevy před odesláním požadavku
dia.off(dia.dia_dotaz_zruseni.id_okna); // zavře dialogové okno s dotazem: Zrušit rezervaci?
dia.wait_activ(); // zapne dialogové okno Čekejte prosím … Zpracovává se rezervace
setTimeout(async()=>{
// Odeslání požadavku na server
try{
const response:Response=await fetch("config/zadost-zruseni-rezervace.php",{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:data
});
const result=await response.json(); // Převedení odpovědi na JSON
// Zkontrolujte, zda server odpověděl s 'status' a 'message'
if(response.ok){
// Server vrátil odpověď se statusem 'success'
if(result.status==="success")
{
console.log("Úspěch:",result.message);
// logika pro úspěšné zpracování
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
this.zaznam_encrypted_token=""; // nastaví proměnnou na default
this.den_a_cas_rezervace=""; // nastaví proměnnou na default
window.history.replaceState({},document.title,window.location.pathname); // Tento příkaz odstraní search z adresy včetně otazníku
dia.on(dia.dia_zruseno.id_okna,dia.dia_zruseno.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace byla zrušena
setTimeout(()=>{
boss.reset_aplikace(); // provede resetování aplikace, jako by ji uživatel nikdy nepoužil, zde je to z důvodů, aby načetle aktuální data z JSON, kde už zrušená rezervace bude propsána
},1000); // zpoždění umožní PHP zrušenou rezervaci zapsat, aby ho pak stihl Java Script přečíst
}
else
{
// Server vrátil odpověď s chybou ('error')
console.error("Chyba:", result.message); // Zobrazení chyby do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_nezruseno.id_okna,dia.dia_nezruseno.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace nebyla zrušena
}
}
else
{
// Pokud odpověď serveru není v pořádku
console.error("Chyba serveru:",result.message||"Neznámá chyba");
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_nezruseno.id_okna,dia.dia_nezruseno.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace nebyla zrušena
}
}
catch(error){
// Pokud došlo k chybě při zpracování požadavku před jeho odesláním
console.error("Chyba při zpracování požadavku před jeho odesláním:",error); // výpis chyb do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_nezruseno.id_okna,dia.dia_nezruseno.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace nebyla zrušena
}          
},0); // Nastavení 0 ms zpoždění pro vykonání funkce
}
catch(error){
// Pokud došlo k chybě při komunikaci s API (např. nevalidní JSON nebo síťová chyba)
console.error('Chyba při zpracování odpovědi:', error); // výpis chyb do konzole
dia.wait_deactiv(); // vypne dialogové okno Čekejte prosím … Zpracovává se rezervace
dia.on(dia.dia_nezruseno.id_okna,dia.dia_nezruseno.id_buton_pro_zavreni); // otevře dialogové okno - Rezervace nebyla zrušena
}
};
sendRequest(); // Zavolání asynchronní funkce pro odeslání požadavku

};

handleEvent(e:any){
const k:string=e.target.id; // zjistí id prvku, na který bylo kliknuto

if(k===this.id_form)
{
// pokud vychází požadavek z formuláře (submit), který je v dialogovém okně: Zrušit rezervaci?
e.preventDefault(); // Zabrání výchozímu chování (odeslání formuláře)
this.zaslat_zadost_na_zruseni(); // metoda zajistí pomocí fetch a PHP, vymazání rezervace z JSON souboru
}

if(k===this.id_butt)
{
// kliknuto na button @ dialogové okno: Zrušit Rezervaci?
const input_email=document.getElementById(this.id_input[0]) as HTMLInputElement; // načte HTML input email v dialogovém okně: Zrušit rezervaci?
if(input_email)
{
input_email.value+="@"; // přidá do input email @ v dialogovém okně: Zrušit rezervaci?
input_email.focus(); // provede zaměření na input email v dialogovém okně: Zrušit rezervaci?
}}

};

posluchace_activ()
{
// metoda zapne potřebné posluchače pro dialogové okno: Zrušit Rezervaci?
const form=document.getElementById(this.id_form) as HTMLFormElement; // načte HTML objekt formuláře

if(form)
{
// pokud HTML objekt existuje
form.addEventListener("submit",this); // Zabrání výchozímu chování (odeslání formuláře)
}


const butt=document.getElementById(this.id_butt) as HTMLButtonElement; // načte HTML element buttonu @
if(butt)
{
// pokud HTML element existuje
butt.addEventListener("click",this); // přiřadí buttonu @ posluchač click
}

};

vytvor_zadost_na_zruseni(rok:number,mesic:number,den:number,cislo_casu:number) // (mesic 0-11, den 1-31 , cislo_casu 1-14)
{
// metoda zajistí zobrazení dialogového okna pro zrušení rezervace

if((typeof rok !== "number")||(typeof mesic !== "number")||(typeof den !== "number")||(typeof cislo_casu !== "number"))
{
// pokud nebyly do metody dodány potřebné proměnné
console.error("do metody zrusit_rezervaci.vytvor_zadost_na_zruseni nebyly dodány všechny potřebné proměnné"); // error výpis do konzole
return; // funkce bude ukončena
}

this.posluchace_activ(); // metoda zapne potřebné posluchače pro dialogové okno: Zrušit Rezervaci?

const s_denS=document.getElementById(this.id_span_cas_r[0]) as HTMLSpanElement; // span, kde má být zapsán den rezervace slovně

const s_denC=document.getElementById(this.id_span_cas_r[1]) as HTMLSpanElement; // span, kde má být zapsán den rezervace v měsíci 1-31

const s_mesic=document.getElementById(this.id_span_cas_r[2]) as HTMLSpanElement; // span, kde má být zapsán měsíc rezervace slovně

const s_rok=document.getElementById(this.id_span_cas_r[3]) as HTMLSpanElement; // span, kde má být zapsaán rok rezervace

const s_cas=document.getElementById(this.id_span_cas_r[4]) as HTMLSpanElement; // span, kde má být zapsán slovně čas rezervace

const dny:string[]=boss.dny; // dny v týdnu splovně Neděle-Pondělí
const mesice:string[]=boss.mesice; // měsíce v roce slovně Leden-Prosinec
const casy:string[]=cas_rezervace.casy; // časy rezervací slovně (1-14)
const den_v_tydnu_slovne=dny[new Date(rok, mesic, den).getDay()]; // provede výpočet z číselného dne zaslaného uživatelelem na číslo dne v týdnu, který na něj přiřadí a z pole dny[] k němu podle tohto čísla přidělí slovně den
const den_v_mesici_ciselne=den.toString(); // den v měsíci, podle čísla dne, který byl do funkce zaslán
const mesic_v_roce_slovne= mesice[mesic]; // měsíc (slovně) , podle čísla měsíce, který byl do funkce zaslán, vybírá se podle čísla měsíce z pole mesice[]
const rok_to_string=rok.toString(); //  rok, podle čísla roku, který byl do funkce zaslán
const cas_slovne=casy[cislo_casu - 1]; // podle čísla času 1-14 vybere z pole casy[] odpovídající čas slovně, (časy jsou číslovány 1-14, ale pole začíná od 0, proto cislo_casu-1)

if(s_denS){
// pokud HTML element existuje
s_denS.innerText=den_v_tydnu_slovne; // přepíše spam dnem v týdnu, datumu, který byl do metody zaslán
}

if(s_denC){
// pokud HTML element existuje
s_denC.innerText=den_v_mesici_ciselne; // přepíše spam dnem v měsíci, podle čísla dne, který byl do funkce zaslán
}
if(s_mesic){
// pokud HTML element existuje
s_mesic.innerText = mesic_v_roce_slovne; // přepíše spam měsíce (slovně) , podle čísla měsíce, který byl do funkce zaslán
}
if(s_rok){
// pokud HTML element existuje
s_rok.innerText = rok_to_string; // přepíše spam rok, podle čísla roku, který byl do funkce zaslán
}
if(s_cas){
// pokud HTML element existuje
s_cas.innerText = cas_slovne; // přepíše spam času (slovně) , podle čísla času, který byl do funkce zaslán 
}
this.den_a_cas_rezervace = `${den_v_tydnu_slovne}, ${den_v_mesici_ciselne}.${mesic_v_roce_slovne} ${rok_to_string}, ${cas_slovne}`; // do proměnné zapíše celkový den a čas rezervace, toto se použije pro rozeslání emailu o zrušení rezervace, řetězec bude vypadat např takto: Čtvrtek, 20. února 2025, 13:30-14:00 hod.
dia.on(dia.dia_dotaz_zruseni.id_okna); // otevře dialogové okno s dotazem: Zrušit rezervaci?

};


inicializace()
{
// metoda zahájí procesy pro zjištění, zda chce uživatel zrušit rezervaci

console.log("délka pole search: "+location.search.length);

if(location.search)
{
let search=location.search.slice(1); // proměnná načte location.search a odstraní z něj první znak, kterým je ? (otazník)
console.log("obsah search bez?: "+search);

if(search.startsWith("rezervace")) {
// Odříznutí slova "rezervace" z začátku řetězce search, toto slovo slouží k rozpoznání požadavku, že se jedná o rušení rezervace
search=search.slice("rezervace".length); // odřízne slovo rezervace - zbyde jen token

if(search.length!=this.delka_tokenu)
{
// v search by nyní měl být pouze token, který musí mít 32 znaků podle this.delka_tokenu
return; // pokud nebude mít token 32 znaků, bude return - nejedná se o hledání záznamu s rezervací
}
}
else
{
window.history.replaceState({},document.title,window.location.pathname); // Tento příkaz odstraní search z adresy včetně otazníku
return; // pokud search nezačíná slovem rezervace .. tedy ?rezervace, není požadavkem vůbec prověření zda existuje rezervace
}


// Asynchronní funkce pro odeslání textu na server
const sendTextToServer=async(search:string):Promise<void>=>{
try {
// Vytvoření objektu pro odeslání POST požadavku
const options = {
method: 'POST',
headers: {
'Content-Type': 'application/x-www-form-urlencoded'
},
body: `search=${encodeURIComponent(search)}` // Převod textu na URL-encoded formát
};


await new Promise(res => setTimeout(res, 0)); // Vytvoření čekacího úseku s Timeoutem 0 ms k zajištění asynchronního prostředí

// Odeslání požadavku na PHP soubor
const response = await fetch('config/over-rezervaci.php', options); // soubor, který bude příjmat search
const result = await response.json(); // Převedení odpovědi na JSON

// Kontrola stavu odpovědi a výpis příslušné zprávy do konzole
if (response.ok) {
console.log('Success:', result.message); // Odpověď byla úspěšná

const zaznam_pro_odstraneni:[number,number,number,number,string]=result.message; // odpověď, záznam, který má být odstraněn: [(int)$entry['rok'],(int)$entry['mesic'],(int)$entry['den'],(int)$entry['cas_rezervace'],$entry['encrypted_token']] = pole s rokem, mesíce 0-11, dne, číslo času 1-14 a zakódovaný token rezervace

this.zaznam_encrypted_token=zaznam_pro_odstraneni[4]; // proměnná do sebe zapíše zašifrovaný token záznamu, který se vrátil z php

this.vytvor_zadost_na_zruseni(zaznam_pro_odstraneni[0],zaznam_pro_odstraneni[1],zaznam_pro_odstraneni[2],zaznam_pro_odstraneni[3]); // metoda zajistí zobrazení dotazu na zrušení rezervace

} else {
console.error('Error:', result.message); // Něco se pokazilo

if(result.message==="Žádný z rezervovaných záznamů se neshoduje s požadavkem z webu!")
{
// pokud vrácená error odpověď odpovídá odpovědi ZPH, ktrá informuje o tom, že záznam nebyl nalezen
dia.on(dia.dia_zruseno_driv.id_okna,dia.dia_zruseno_driv.id_buton_pro_zavreni); // otevře dialogové okno s tím, že záznam o rezervaci existoval, ale už byl zrušen
window.history.replaceState({},document.title,window.location.pathname); // Tento příkaz odstraní search z adresy včetně otazníku
}

}
} catch (error) {
// Zachycení a výpis případné chyby
console.error('Fetch failed:', error);
}
};
sendTextToServer(search); // Zavolání funkce pro odeslání search na server
}
};
};

class Hlidac_viditelnosti_aplikace{

aktivace(){
    
let neviditelnost:string="undefined";
let udalos_viditelnost:string="";
    
if("hidden" in document)
{
neviditelnost = "hidden";
udalos_viditelnost = "visibilitychange";
}
else if("msHidden" in document)
{
neviditelnost = "msHidden";
udalos_viditelnost = "msvisibilitychange";
}
else if("webkitHidden" in document)
{
neviditelnost = "webkitHidden";
udalos_viditelnost = "webkitvisibilitychange";
}
// KONEC kontrola kompatibility

if(typeof document.addEventListener === "undefined" || neviditelnost === "undefined")
{
console.error("API kontrola viditelnosti stránky nefunguje.");
}
else
{
// API viditelnosti je v pořádku
document.addEventListener(udalos_viditelnost,this,false); // aktivuje posluchač
}};

handleEvent(){
if(document.visibilityState !== "hidden")
{
// pokud www stránka je viditelná

if(dia.open_dialog)
{
// pokud je otevřen sledovaný dialog dotaz na zrušení rezervace, musí dojít k jeho prověření, jestli je ještě aktuální
location.reload(); // udělá refreš stránky (její nové načtení), což vyhodnotí aktuálnost dotazu na zrušení rezervace
}
kalendar.dny_klikat(false); // metoda zamezuje anebo umožňuje uživateli klikat na dny 1-31, pokud je do funkce zasláno TRUE=klikání, je umožněno; pokud FALSE=klikání je zamezeno
kalendar.error_load_data_close(false); // uzavře okno s chybou načtení, pokud je otevřeno; FALSE= nebude načítat znovu data z JSON
boss.reset_aplikace("castecne"); // provede reset aplikace, jako by ji uživatel nikdy nepoužil, ale pouze částečně, zachová případný vyplněný input uživatelem (jméno, email, telefon, důvod hovoru) a udělený souhlas

}
};


};

const boss=new Boss; // vytvoří objekt, který má nastarosti hlavní chod aplikace rezervace
const cas_rezervace=new Cas_rezervace(); // vytvoří objekt pro operace kolem volby času k rezervaci uživatelem
const datum=new Datum(); // vytvoření objektu datum
const kalendar=new Kalendar(); // pomocí class Kalendar vytvoří objekt kalendar
const mesic_a_rok=new Mesic_a_rok(); // pomocí class Mesic_a_rok vytvoří objekt mesic_a_rok
const dia=new Dia(); // pomocí class Dia se řídí otevírání a zavírání dialogových oken
const zrusit_rezervaci=new Zrusit_rezervaci(); // pomocí class Zrusit_rezervaci vytvoří objekt zrušit rezervaci
const hlidac_viditelnosti_aplikace=new Hlidac_viditelnosti_aplikace(); // pomocí class Hlidac_viditelnosti_aplikace vytvoří objekt hlidac_viditelnosti_aplikace
boss.spustit_aplikaci(); // metoda zajistí spuštění hlavních funkcí aplikace
zrusit_rezervaci.inicializace(); // zajistí základní procesy pro zrušení rezervace
hlidac_viditelnosti_aplikace.aktivace(); // aktivuje hlídač visibilitychange API, pokud uživatel z aplikace odejde a znovu se vrátí, aplikace se vyresetuje, mimo vyplněných input vstupů (jméno, příjmení, telefón, souhlas)


const resizeObserver=new ResizeObserver(()=>
{
// Použití ResizeObserver pro sledování změn velikosti okna, jakmile dojde ke změně výšky anebo šířky body, bude reagovat
boss.rovna_vyska_form(); // metoda zajistí že oba formuláře rezrvace budou mít stejnou výšku, budou oba vysoké jako ten nejvyšší
});
    
resizeObserver.observe(document.body); // resizeObserver bude hlídat změnu velikosti body - výška + šířka