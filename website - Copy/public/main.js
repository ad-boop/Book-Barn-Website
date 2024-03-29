// SCRIPT FOR JS
    
    // CODE FOR BANNER SLIDES
        var slides = document.querySelectorAll('.slide');
        var btns = document.querySelectorAll('.btn');
        let currentSlide = 1;
    
        // Javascript for image slider manual navigation
        var manualNav = function(manual){
          slides.forEach((slide) => {
            slide.classList.remove('active');
    
            btns.forEach((btn) => {
              btn.classList.remove('active');
            });
          });
    
          slides[manual].classList.add('active');
          btns[manual].classList.add('active');
        }
    
        btns.forEach((btn, i) => {
          btn.addEventListener("click", () => {
            manualNav(i);
            currentSlide = i;
          });
        });
    
        // Javascript for image slider autoplay navigation
        var repeat = function(activeClass){
          let active = document.getElementsByClassName('active');
          let i = 1;
    
          var repeater = () => {
            setTimeout(function(){
              [...active].forEach((activeSlide) => {
                activeSlide.classList.remove('active');
              });
    
            slides[i].classList.add('active');
            btns[i].classList.add('active');
            i++;
    
            if(slides.length == i){
              i = 0;
            }
            if(i >= slides.length){
              return;
            }
            repeater();
          }, 5000);
          }
          repeater();
        }
        repeat();


// ====================================================================================
// SCRIPT FOR LOGIN AND REG FORM
var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register(){
    x.style.left="-400px"
    y.style.left="50px"
    z.style.left="110px"
}

function login(){
    x.style.left="50px"
    y.style.left="450px"
    z.style.left="0";
}


// ==================================================================================
// CODE FOR COLLAPSIBLE BUTTONS IN HTML
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("collapse-active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


// $(document).ready(function() {
// 	$(".fa-search").click(function() {
// 	   $(".togglesearch").toggle();
// 	   $("input[type='text']").focus();
// 	 });
// });



// FUNCTION FOR REVIEW BUTTON
function writeReviewClick(){
  var writeReview=document.getElementById("book-form");

  if(sessionStorage.getItem("loggedInUser")===null){
    console.log("no change");
    alert("Login to add a review.")
  }
  else{
    document.getElementById("review-message").style.display="none";
    writeReview.style.display="block";
  }
  
}


// FUNCTION FOR LOGIN HEADER MENU CLICK
function loginClick(){
  
  var forms=document.getElementById("forms");
  forms.style.display="block";
  
}



// FUNCTION FOR ACCOUNT HEADER MENU CLICK
function accountClick(){
  var account_section=document.getElementById("user-account");
  account_section.style.display="block";
}