const main = document.getElementById("main");
const canvas = document.getElementById("canvas");
const canvasBasket = document.getElementById("canvasBasket")
let Fav = '';
const LoginUsername = document.getElementById("LoginUsername");
const LoginPass = document.getElementById("LoginPass");
const SignEmail = document.getElementById("SignEmail");
const SignUsername = document.getElementById("SignUsername");
const SignPass = document.getElementById("SignPass");
const SignSave = document.getElementById("SignSave");
const helper = document.getElementById("helper");
const CloseX = document.getElementById("CloseX");
const LoginBtn = document.getElementById("LoginBtn");
const LoginModal = document.getElementById("login-modal");
const LoginModalBody = document.getElementById("LoginModalBody")
let loginArr = []
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



let favArray = JSON.parse(localStorage.getItem("favorite")) || [];
console.log(favArray);
function getCards() {

    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(json => {
            localStorage.setItem("productData", JSON.stringify(json.products))
            json.products.map(item => {
                Fav = favArray.some(findItem => findItem.id == item.id);
                main.innerHTML += `<div class="card">
        <div  class="card-icons">
            <button onclick="AddToBasket(${item.id})"  style=" border:none; background:transparent"> <i class="fas fa-shopping-basket" title="Add to Basket"></i></button>
            <button onclick="AddToFav(${item.id})" class="${Fav ? "red" : ""}" style="border:none; background:transparent"><i class="fa-regular fa-heart" title="Add to Favorite"></i></button>
        </div>
        <img src="${item.images[0]}" class="card-img-top" alt="Product Image" style=" height:300px">
        <div class="card-body">
            <h5 class="card-title">Name:${item.brand}</h5>
            <h5 class="card-title">Price:${item.price}</h5>
        </div>
    </div>`
            })
        })

    canvas.innerHTML = ''
    showFav()




}
function AddToFav(id) {


    fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(data => {
            let control = favArray.some(item => item.id == data.id)
            if (control) {

                let index = favArray.findIndex(item => item.id == id)
                favArray.splice(index, 1)
                console.log(favArray);
                localStorage.setItem("favorite", JSON.stringify(favArray))
                main.innerHTML = ''
                getCards()
            }
            else {
                favArray.push(data)
                console.log(favArray);
                main.innerHTML = ''
                main.innerHTML = ''

                localStorage.setItem("favorite", JSON.stringify(favArray))
                getCards()
            }

        })


}

function showFav() {
    console.log("salam");
    favArray.map(item => {
        Fav = true;
        canvas.innerHTML += `<div class="card">
        <div  class="card-icons">
            <button   style=" border:none; background:transparent"> <i  class="fas fa-shopping-basket" title="Add to Basket"></i></button>
            <button onclick="AddToFav(${item.id})"class="${Fav ? "red" : ""}"style="border:none; background:transparent"><i class="fa-regular fa-heart" title="Add to Favorite"></i></button>
        </div>
        <img src="${item.images[0]}" class="card-img-top" alt="Product Image" style=" height:300px">
        <div class="card-body">
            <h5 class="card-title">Name:${item.brand}</h5>
            <h5 class="card-title">Price:${item.price}</h5>
        </div>
    </div>`}
    )
}


getCards()

function SignUp() {

    fetch("http://localhost:8000/users").then(res => res.json())
        .then(data => {
            console.log(SignEmail.value);
            console.log(data);
            let isUserExist = data.some(item=> item.email=== SignEmail.value)
            
                if(!isUserExist){
                    if (emailRegex.test(SignEmail.value)) {
                        fetch('http://localhost:8000/users', {
                            method: 'POST',
                            body: JSON.stringify({
                                email: SignEmail.value,
                                userName: SignUsername.value,
                                password: SignPass.value,
                                basket: []
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
        
                    } else {
        
                        SignEmail.style.border = "1px solid red"
                        helper.style.display = "block"
        
                    }
                }
                else{
                    helper.innerHTML="bele bir user movcuddu"
                    
                    SignEmail.style.border = "1px solid red"
                    helper.style.display = "block"
                }
           
        }
        )


}
SignSave.addEventListener("click", (e) => {
    e.preventDefault()
    SignUp();

}
)

CloseX.addEventListener("click", () => {
    SignEmail.value = ''
    SignPass.value = ''
    SignUsername.value = ''
})



LoginBtn.addEventListener("click", () => {

    fetch('http://localhost:8000/users')
        .then(data => data.json())
        .then(json => json.map(item => {
            if (item.userName == LoginUsername.value && item.password == LoginPass.value) {
                LoginModalBody.innerHTML = `Welcome ${item.userName}`
                sessionStorage.setItem("user", JSON.stringify(item))
                sessionStorage.setItem("isLogin", true)
            }
        }))
})



function AddToBasket(productId) {
    // console.log(productId);

    let isLogin = sessionStorage.getItem("isLogin");
    let user = JSON.parse(sessionStorage.getItem("user"));
    let productData = JSON.parse(localStorage.getItem("productData"));
    let findEl = productData.find(item => item.id == productId)
    console.log(findEl);


    if (isLogin) {

        fetch(`http://localhost:8000/users/${user.id}`)
            .then((response) => response.json())
            .then((json) => {
                fetch(`http://localhost:8000/users/${user.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        basket: [...json.basket, findEl],
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                    .then((response) => response.json())
                    .then((json) => console.log(json));

            }



            );


    }
    else {
        alert("Please Login")
    }
}



function showBasket() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    fetch(`http://localhost:8000/users/${user.id}`)
        .then(data => data.json())
        .then(json => json.basket.map(item => {
            let Favi = true
            canvasBasket.innerHTML += `<div class="card">
        <div  class="card-icons">
            <button   style=" border:none; background:transparent"> <i  class="fas fa-shopping-basket" title="Add to Basket"></i></button>
            <button onclick="AddToFav(${item.id})" class="${Favi ? "red" : ""}" style="border:none; background:transparent"><i class="fa-regular fa-heart" title="Add to Favorite"></i></button>
        </div>
        <img src="${item.images[0]}" class="card-img-top" alt="Product Image" style=" height:300px">
        <div class="card-body">
            <h5 class="card-title">Name:${item.brand}</h5>
            <h5 class="card-title">Price:${item.price}</h5>
        </div>
    </div>`
        }))

}
showBasket()