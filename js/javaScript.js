//-----------------------------    creating course Card using DOM...... -------------------------------------
function getFUllStarIcon(){
    let icon = document.createElement("i"); 
    icon.className="fa-solid fa-star star-icon"; 
    return icon ; 
}
function getHalfStarIcon(){
    let icon = document.createElement("i"); 
    icon.className="fa-solid fa-star-half-stroke star-icon" ; 
    return icon ; 
}

function getEmptyStarIcon(){
    let icon = document.createElement("i"); 
    icon.className="fa-regular fa-star star-icon" ; 
    return icon ; 
}

function getArrayOfStars(rateNumber){
    rateNum = rateNumber.split('.');
    let FullStarNum = parseInt(rateNum[0]); 
    let halfStarNum = parseInt(rateNum[1]);
    let emptySrarNum = 5-FullStarNum;
    if(halfStarNum >=5){
        emptySrarNum--; 
        halfStarNum=1;
    }
    else 
        halfStarNum=0;
    let arr=[] , cnt=0 ;
    for(let i = 0; i<FullStarNum; i++)
        arr[cnt++]= getFUllStarIcon();  
    if(halfStarNum >0) 
        arr[cnt++] = getHalfStarIcon();
    for(let i = 0; i<emptySrarNum; i++)
        arr[cnt++]= getEmptyStarIcon() ;  
     return arr; 
}
 
function getRateNumber(count ,e_className){
    let number = document.createElement("p");
    number.className=e_className ; 
    number.innerHTML =count ; 
    return number ; 
}

function getStudentNumber(count,e_className){
    let number = document.createElement("p");
    number.className=e_className ; 
    number.innerHTML =count ; 
    return number ; 
}

function getAuthor(Authorname,e_className ){
    let name = document.createElement("p");
    name.className=e_className ; 
    name.innerHTML =Authorname ; 
    return name ; 
}

function getPrice(count,e_className){
    let number = document.createElement("p");
    number.className=e_className ; 
    number.innerHTML ="E£"+count ; 
    return number ; 

}

function getsellingStatusForCouese(status , e_className){
    let mainDiv = document.createElement("div") ; 
    if(status === "") return mainDiv ; 
    mainDiv.className = e_className ; 
    let status_text = document.createElement("p") ; 
    status_text.innerText = status ; 
    mainDiv.appendChild(status_text);
    return mainDiv ; 
}

function getCourseName(nameStr ,e_className){
    let name = document.createElement("h3");
    name.className=e_className ; 
    name.innerHTML =nameStr ; 
    return name ;  
}
 
function getImage(imgPath, e_className){
   let img = document.createElement("img");
   img.className=e_className ;  
   let path = imgPath; 
    img.src=path;
    return img ; 
}

function getDiv(e_className, arrayOfElements){
    let Mydiv = document.createElement("div") ; 
    Mydiv.className = e_className; 
    for(let i = 0; i<arrayOfElements.length; i++){
        Mydiv.appendChild(arrayOfElements[i]) ;
    }
    return Mydiv ; 
}

/////          just finished Ceating small elements Now letsBuild out cart ///////////////////////////////
function buildCourseCard (e_className ,courseName ,authorName  , rateNumber , studentNumber , price , imgPath, sellingStatus){
    let test=document.createElement("div") ; 
    // all card div
   // image Div first Part .. just image yasta  
   const card_ImageDiv = getDiv("course-img-div" ,  [ getImage(imgPath ,"course-img" ) ]) ; 
   // test.appendChild(card_ImageDiv) ; 
    // text div (second Part )   ... -------------------------------------------------------------------
    // the second part div (name , price ,,,);
    const card_courseName = getCourseName(courseName , "") ; 
    const card_author = getAuthor(authorName , "author-name") ; 
     /// rate div 
             const card_rateNumber = getRateNumber( rateNumber, "rate-precent");
             const card_arrayOfStars =getArrayOfStars(rateNumber);
            const card_studentNumber = getStudentNumber(studentNumber , "student-num"); 
            const arrayOfRateElements=[
                 card_rateNumber, ...card_arrayOfStars , card_studentNumber
             ];
    const card_rateAllDiv = getDiv("rate" , arrayOfRateElements , "raterate"); 
    // course Price section 
    const card_price = getPrice(price,"Price") ;  
    // selling Status section 
    const card_sellingStatus = getsellingStatusForCouese(sellingStatus ,"best-seller") ;  
    const card_textDiv = getDiv("text-div" , [
        card_courseName, card_author ,card_rateAllDiv , 
        card_price , card_sellingStatus 
        ] );
    const bigCard =getDiv(e_className , [
        card_ImageDiv , 
        card_textDiv
        ]);
    return bigCard ; 
}

///  fetch courses from API .........................................
// // this function will search in api and show course with 
function getCourseApiDataIntoCard(arrOfJsonCourses){ // convert course json data into (html&css) course card ....
let arr=[]; let cnt=0 ; 
    for(let i = 0; i<arrOfJsonCourses.length; i++){
        let obj = arrOfJsonCourses[i] ; 
       let courseName =obj.name ,  id = obj.id  , image = obj.image  , authorName = obj.author , rateNumber =obj.rate;
       let price = obj.price , sellingStatus = obj.sellingTag , studentNumber = obj.studentNumber;   
       let courseCard = buildCourseCard("course-card swiper-slide" , courseName , authorName , rateNumber ,studentNumber,price,
       image , sellingStatus );
       arr[cnt++] = courseCard ;
    }
    return arr;
}

async function getApiData(url , searchStr){     // fetch Data from API .
    searchStr=searchStr.toLowerCase() ; 
    let jsonData = await fetch(url) ;
    jsonData= await jsonData.json();
    let arr=[];
    let cnt=0 ; 
    if(searchStr === ""){
        return jsonData.courses ; 
    }
    for(let obj of jsonData.courses){
        courseName = obj.name.toLowerCase() ;
        if(courseName.includes(searchStr) ===true)
            arr[cnt++] = obj ; 
    } 
    return arr ; 
}

function searchByCourseName( courseName){
    const slideButtons = document.querySelectorAll(".slide-btn"); 
    let arrOfSearchCoursesJson =  getApiData("http://localhost:3003/body", courseName).then(
        (response )=>{ // response => is an array of courses data from json  in  divs .. 
            arrOfSearchCoursesDivs=getCourseApiDataIntoCard(response);
            if(arrOfSearchCoursesDivs.length == 0){
                for(let i=0; i<slideButtons.length; i++)
                    slideButtons[i].classList.add("hide");
                
            }else {
                for(let i=0; i<slideButtons.length; i++)
                    slideButtons[i].classList.remove("hide");
            }
            let cards = document.querySelector(".swiper-wrapper-course-card"); 
            cards.innerHTML=""; 
            for(let i = 0; i<arrOfSearchCoursesDivs.length; i++){
                cards.appendChild(arrOfSearchCoursesDivs[i]);
            }
        }
    );  
}

document.querySelector(".apython").classList.add("mark"); 
searchByCourseName("python");     // inital fill courses section . 

////////////////////////////////////////////////////////////////////////  

// taking value from searchBox ... 
const searchBox = document.getElementById("searchBox-id");
searchBox.oninput= ()=>{searchByCourseName(searchBox.value)};

/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////    slick slider \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
     //
     breakpoints: {
        // when window width is >= 320px
        450: {
          slidesPerView: 2,
          spaceBetween: 20,
          slidesPerGroup: 2,
        },
        // when window width is >= 480px
        // when window width is >= 640px
        690: {
          slidesPerView: 3,
          spaceBetween: 40,
          slidesPerGroup: 3,
        }, 
        1000: {
            slidesPerView: 4,
            spaceBetween: 40,
            slidesPerGroup: 4,
        }, 
        1200: {
            slidesPerView: 5,
            spaceBetween: 40,
            slidesPerGroup: 5,
        }
      }   ,
   navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

////////////////// Courses header List \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function refreshDiv(){
    $( "courseCardSection" ).load(window.location.href + " #courseCardSection" );
}

const courseHeaderList = Array.from(document.querySelectorAll(".list-items")) ;
for(let i = 0; i<courseHeaderList.length; i++){
    const item = courseHeaderList[i]; 
    courseHeaderList[i].onclick=function(){
        for(let x = 0; x<courseHeaderList.length; x++)
            courseHeaderList[x].classList.remove("mark");
        item.classList.add("mark");
        document.getElementById("course-list-header").innerHTML=`
        Expand your career opportunities with ${item.innerHTML}`;
        document.getElementById("btn-explore").innerHTML =`Explore ${this.innerHTML}`;
        searchByCourseName(item.innerHTML);
        refreshDiv(); 
    }
    
}
