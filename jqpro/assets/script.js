
(function(){
    var x = localStorage.getItem('dark');
    if (x == 'on') {
        $("#darkmo").addClass('active');
        $('body').addClass('wp-night-mode-on');
    } else {
        $(this).removeClass('active');
        $('body').removeClass('wp-night-mode-on');
    }


    $("#darkmo").click(function () {       
        var x = localStorage.getItem('dark');
        if (x == 'off') {
            localStorage.setItem('dark', 'on');
            $(this).toggleClass('active');
            $('body').toggleClass('wp-night-mode-on');
        } else {
            localStorage.setItem('dark', 'off');
            $(this).removeClass('active');
            $('body').removeClass('wp-night-mode-on');
        }

    })
})();
/////////////////////////////////////////////////////////
//////////////////////// peter //////////////////////////
/////////////////////////////////////////////////////////
var usersData = [];
var userCartItems = [];
var userWishlistItems = [];

// Below function show profile of login user on click of signup button.
function loadProfileContent() {    
    var profileUsername = getCookie("username");    

    if (!profileUsername) {
        alert('You have to log in');
        location.href = '/';
    }
 
    if (profileUsername != null) {
        document.getElementById("profileUsername").innerHTML = profileUsername;

        var arrayOfValues = JSON.parse(localStorage.getItem('usersData'));
        var userImage = localStorage.getItem('userImage');
        // Comparing 
        for (var i in arrayOfValues) {
            var username = arrayOfValues[i].userName;
            var fullname = arrayOfValues[i].fullName;

            var email = arrayOfValues[i].Email;
            if (username == profileUsername) {
                document.getElementById("fullname").innerHTML += fullname;
                document.getElementById("email").innerHTML += email;
                if(userImage){
                     document.getElementById("userImage").setAttribute('src', userImage);
                }else{
                     document.getElementById("userImage").setAttribute('src', 'images/0.jpg');
                }
               
            }
        }
    }
}


// Below function to change image of user
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#userImage').attr('src', e.target.result);
            localStorage.setItem("userImage", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        //console.log(input.files[0]);

    }
}

// Below function logout user on click of logout button.
function logout() {
    var resp = confirm("Are you sure You want to logout");
    if (resp == true) {
        deleteCookie("username");
        window.location = "index.html";
    }


}

// Below function show profile of user on click of profile button.
function profile() {
    var userImage = localStorage.getItem("userImage");
    if (userImage != null)
        $("#userImage").attr("src", userImage);
    console.log("Hello");
    window.location = "profile.html";

}

// Below function to contact us on click of submit button.
function contactUs() {
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var telNumber = document.getElementById("telNumber").value;
    var country = document.getElementById("country").value;
    /*var subject=document.getElementById("subject").value;*/
    var subject = $("#subject").val();

    var mail = "mailto:peterkameel.93@gmail.com?subject=" + subject + "&name=" + fname + " " + lname + "&tele no.=" + telNumber;
    window = window.open(mail, 'emailWindow');

}

// Below function to add phone to cart.
function addToCart() {
    alert("Item added to cart");
    //document.getElementById("addToCartBtn").style.display = 'none';
    $("#addToCartBtn").addClass('disabled');
    document.getElementById("addToCartBtn").style.opacity = 0.3;

    var phoneId = localStorage.getItem('phone_id');
    //var userItemId=localStorage.setItem("phoneCartId",phoneId);

    var temp = JSON.parse(localStorage.getItem("userCartIds"));

    if (temp == null) {
        userCartItems.push(phoneId);
        localStorage.setItem("userCartIds", JSON.stringify(userCartItems));
    } else {
        for (var i = 0; i < temp.length; i++)
            userCartItems.push(temp[i]);

        userCartItems.push(phoneId);
        localStorage.setItem("userCartIds", JSON.stringify(userCartItems));
    }

}

// Below function to load cart Page.
function onloadCart() {
    var userItems = localStorage.getItem("userCartIds");

    if (!userItems) {
        alert('You have not add any item to your cart yet');
        location.href = '/all-phones.html';
    }
    var totalPrice = 0;
    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            for (var j = 0; j < userItems.length; j++) {
                for (var i = 0; i < result.length; i++) {

                    if (userItems[j] == result[i].id) {                        
                        $("#phoneContainer").append("<div class=\"cart\"><i id=\"deletItemBtn\" class=\"fa fa-trash\" onclick=\"deleteItemFromCart(" + userItems[j] + ")\"></i><div id=\"phoneImage\"><img id=\"pImage\" src=" + result[i].imgurl + " /></div><div id=\"phoneDetails\"><h2 id=\"phoneName\">" + result[i].name + "</h2><h3 id=\"phonePrice\"></h3>" + result[i].price + "<h3 id=\"phoneColor\">" + result[i].color + "</h3><div style=\"margin: 24px 0;\"><table id=\"phoneDetailsTable\"><tr><th>Sold by</th><th>TECHINDEEP</th></tr><tr><th>Condition</th><th>New</th></tr></table></div></div></div>");
                        totalPrice += parseInt(result[i].price);
                        //console.log(totalPrice);

                    }
                }
            }
            $("#totalPricen").append("Total : " + totalPrice + "$");

        }
    })


}

// Below function to add phone to wishlist.
function addToWishlist() {
    alert("Item added to wishlist");
    $("#addToWishlist").addClass('disabled');
    document.getElementById("addToWishlist").style.color = "red";

    var phoneId = localStorage.getItem('phone_id');
    //var userItemId=localStorage.setItem("phoneCartId",phoneId);

    var temp = JSON.parse(localStorage.getItem("userWishlistIds"));

    if (temp == null) {
        userWishlistItems.push(phoneId);
        localStorage.setItem("userWishlistIds", JSON.stringify(userWishlistItems));
    } else {
        for (var i = 0; i < temp.length; i++)
            userWishlistItems.push(temp[i]);

        userWishlistItems.push(phoneId);
        localStorage.setItem("userWishlistIds", JSON.stringify(userWishlistItems));
    }

}

// Below function to load wishlist.
function onloadWhishlist() {
    var userItems = localStorage.getItem("userWishlistIds");

    if (!userItems) {
        alert('You have not add any item to your wishlist yet');
        location.href = '/all-phones.html';
    }

    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            for (var j = 0; j < userItems.length; j++) {
                for (var i = 0; i < result.length; i++) {

                    if (userItems[j] == result[i].id) {
                        //temp.push();
                        $("#phoneContainer2").append("<div class=\"cart\"><i id=\"deletItemBtn\" class=\"fa fa-trash\" onclick=\"deleteItemFromWishlist(" + userItems[j] + ")\"></i><div id=\"phoneImage\"><img id=\"pImage\" src=" + result[i].imgurl + " /></div><div id=\"phoneDetails\"><h2 id=\"phoneName\">" + result[i].name + "</h2><h3 id=\"phonePrice\"></h3>" + result[i].price + "<h3 id=\"phoneColor\">" + result[i].color + "</h3><div style=\"margin: 24px 0;\"><table id=\"phoneDetailsTable\"><tr><th>Sold by</th><th>TECHINDEEP</th></tr><tr><th>Condition</th><th>New</th></tr></table></div><i id=\"addCartFromWishlist" + userItems[j] + "\" class=\"fa fa-shopping-cart\" onclick=\"addCartFromWishlist(" + userItems[j] + ")\"></i></div></div>");


                    }
                }
            }
        }
    })

}

// Below function show alert message of success
function purchaseSuccess() {
    var res = confirm("Confirm the purchase");
    if (res == true) {
        alert("Successful purchase");
        localStorage.setItem("userCartIds", null);
        location.reload();
    }
}

// Below function delete item from cart
function deleteItemFromCart(deletedItemId) {
    var res = confirm("Are You Sure to Delete Item from Cart");

    if (res == true) {
        var temp = JSON.parse(localStorage.getItem("userCartIds"));
        //console.log(temp);
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == deletedItemId) {
                const index = temp.indexOf(temp[i]);
                if (index > -1) {
                    temp.splice(index, 1);
                }
            }
        }

        localStorage.setItem("userCartIds", JSON.stringify(temp));
        location.reload();
    }


}

// Below function delete item from wishlist
function deleteItemFromWishlist(deletedItemId) {
    var res = confirm("Are You Sure to Delete Item from Wishlist");

    if (res == true) {
        var temp = JSON.parse(localStorage.getItem("userWishlistIds"));
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == deletedItemId) {
                const index = temp.indexOf(temp[i]);
                if (index > -1) {
                    temp.splice(index, 1);
                }
            }
        }

        localStorage.setItem("userWishlistIds", JSON.stringify(temp));
        location.reload();
    }


}

//  Below function added item from wishlist to cart
function addCartFromWishlist(addedItemId) {
    var userItems = JSON.parse(localStorage.getItem("userCartIds"));
    if (userItems == null)
        userItems = [];


    userItems.push(addedItemId);
    localStorage.setItem("userCartIds", JSON.stringify(userItems));
    alert("Item added to Cart");
    $("#addCartFromWishlist" + addedItemId).addClass('disabled');
    document.getElementById("addCartFromWishlist" + addedItemId).style.opacity = 0.3;



}


//////////////////////////////////////////////////////////////
//////////////////////////// mohamed ma7foz //////////////////
//////////////////////////////////////////////////////////////

// load content index 


function loadTab(x) {
    $("#menu" + x).empty();
    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {

            for (var i = 0; i < result.length; i++) {
                if (result[i].catId == x) {

                    $("#menu" + x).append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');
                }
            }

        }
    })

}


function loadContent() {

    $.ajax({
        url: "jsonData/posts.json",
        success: function (result) {
            $('.loader').fadeOut(100);
            for (var i = 0; i < result.length - 5; i++) {
                $(".randomnya").append('<li><a href="javascript:void(0);" onclick="gotItem(' + result[i].id + ')"><div class="overlayx"></div><img class="random" src="' + result[i].jetpack_featured_media_url + '"><h4>' + result[i].title.rendered + '</h4></a><div class="label_text"><span class="date">15-10-2020</span></div></li>')
            }
            for (var i = 4; i < result.length; i++) {
                $("#latestNews").append('<div class="row border"><div class="col-md-3"><a href="javascript:void(0);" onclick="gotItem(' + result[i].id + ')"><img src="' + result[i].jetpack_featured_media_url + '" width="300" class="img-responsive" /></a></div><div class="col-md-9 text-left"><a href="javascript:void(0);" onclick="gotItem(' + result[i].id + ')"><span class="title"><h1>' + result[i].title.rendered + '</h1></span><p class="teaser-text">' + result[i].content.rendered.substring(0, 200) + '</p></a></div></div>');
            }
        }
    });
    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {

            $("#phones").empty();
            for (var i = 0; i < result.length - 6; i++) {
                $("#phones").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');

                for (var i = 0; i < result.length - 6; i++) {
                    $("#phones").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');
                }

                for (var i = 0; i < result.length; i++) {
                    $("#pr1").append('<option value="' + result[i].id + '">' + result[i].name + '</option>');
                    $("#pr2").append('<option value="' + result[i].id + '">' + result[i].name + '</option>');

                }

            }

            for (var i = 0; i < result.length; i++) {
                $("#home").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');
            }

            for (var i = 0; i <6; i++) {
                $("#suggetsed").append('<li style="margin-top: 10px;"><a style="cursor: pointer;" onclick="suggestedComp('+result[i].id+','+ result[i+1].id+')"><img src="'+result[i].imgurl+'" width="20" /> '+result[i].name.substring(0, 10)+' vs '+result[i+1].name.substring(0, 10)+' <img style="float: right;margin-right: 7em" src="'+result[i+1].imgurl+'" width="20"/></a></li>');
            }



        }
    });


}


function gotItem(id) {
    localStorage.setItem('post_id', id);

    location.href = 'news.html';

}

function gotPhone(id) {
    localStorage.setItem('phone_id', id);
    location.href = 'phone.html';
}

var serach = document.getElementById("serach");
serach.addEventListener('keypress', function () {
    $.getJSON('jsonData/mobiles.json', function (data) {
        $('.tid_search_result').fadeIn();
        var searchField = $('#search').val();

        var output = '<ul>';
        for (var i = 0; i < data.length; i++) {
            var x = data[i].name;
            if (x.includes(serach.value)) {
                output += '</ul>';
                output += '<li id="resuldt"><a id="resuldt" onclick="gotPhone(' + data[i].id + ')" href="javascript:void(0);"><img id="resuldt" src="' + data[i].imgurl + '" width="50"><span id="resuldt">' + data[i].name + '</span></a></li>';
                $('.phoneresult').html(output);
            }

        }

    });
});

$(document).on('click', function () {
    $('.tid_search_result').hide();
});

function loadPhone() {
    var post_id = localStorage.getItem('phone_id');
    if (!post_id) {
        alert('You have not choose any phone to display');
        location.href = '/all-phones.html';
    }

    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            $('.loader').fadeOut(100);
            for (var i = 0; i < result.length; i++) {
                if (result[i].id == post_id) {
                    console.log(result[i]);
                    $(".page-header").text(result[i].name);
                    $(".placeholder img").attr("src", result[i].imgurl);

                    /////// load mobile specifications
                    $("#brand").append(result[i].brandName);
                    $("#rdate").append(result[i].releaseDate);
                    $("#price").append(result[i].price);
                    $("#distype").append(result[i].type);
                    $("#dissize").append(result[i].size);
                    $("#resoulation").append(result[i].resolution);
                    $("#color").append(result[i].color);
                    $("#dimensions").append(result[i].dimensions);
                    $("#sensors").append(result[i].sensors);
                    $("#capacity").append(result[i].capacity);
                    $("#imageresolution").append(result[i].imageResolution);

                }
            }
        }
    })

    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            $("#phones").empty();
            for (var i = 0; i < result.length - 6; i++) {
                $("#phones").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');

            }
        }
    })
    var x = localStorage.getItem('dark');
    //alert(x);
    if (x == 'on') {
        $("#darkmo").addClass('active');
        $('body').addClass('wp-night-mode-on');
    } else {
        $(this).removeClass('active');
        $('body').removeClass('wp-night-mode-on');
    }



    $("#darkmo").click(function () {
        var x = localStorage.getItem('dark');
        if (x == 'off') {
            localStorage.setItem('dark', 'on');
            $(this).toggleClass('active');
            $('body').toggleClass('wp-night-mode-on');
        } else {
            localStorage.setItem('dark', 'off');
            $(this).removeClass('active');
            $('body').removeClass('wp-night-mode-on');
        }

    })
}

function loadPost() {
    var post_id = localStorage.getItem('post_id');
    if (!post_id) {
        alert('You have not choose any article to display');
        location.href = '/all-phones.html';
    }
    $.ajax({
        url: "https://www.techindeep.com/wp-json/wp/v2/posts/" + post_id,
        success: function (result) {
            $('.loader').fadeOut(100);
            console.log(result)
            $('#bgNews').css("background", "url(" + result.jetpack_featured_media_url + ")");
            $('#bgNews').css("background-size", "cover");
            $('.entry-content').html(result.content.rendered);

            $(".header").append('<div><h1 style="background: #000000e8;padding: 10px;border-radius: 38px;">' + result.title.rendered + '</h1></div> ');
        }
    });


    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            $("#phones").empty();
            for (var i = 0; i < result.length - 6; i++) {
                $("#phones").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');
            }
        }
    })

    var x = localStorage.getItem('dark');
    //alert(x);
    if (x == 'on') {
        $("#darkmo").addClass('active');
        $('body').addClass('wp-night-mode-on');
    } else {
        $(this).removeClass('active');
        $('body').removeClass('wp-night-mode-on');
    }



    $("#darkmo").click(function () {
        var x = localStorage.getItem('dark');
        if (x == 'off') {
            localStorage.setItem('dark', 'on');
            $(this).toggleClass('active');
            $('body').toggleClass('wp-night-mode-on');
        } else {
            localStorage.setItem('dark', 'off');
            $(this).removeClass('active');
            $('body').removeClass('wp-night-mode-on');
        }

    })

}

function compare() {
    var pr1 = $("#pr1 option:selected");
    var pr2 = $("#pr2 option:selected");

    if (pr1.val() != '0' && pr2.val() != '0') {
        localStorage.setItem('pr1', pr1.val());
        localStorage.setItem('pr2', pr2.val());
        location.href = 'compare.html';
    } else {
        alert("You have to choose the two products.");
    }

}

function suggestedComp(pr1,pr2) {     
        localStorage.setItem('pr1', pr1);
        localStorage.setItem('pr2', pr2);
        location.href = 'compare.html';    
}

function loadPhoneCompare() {
    var pr1 = localStorage.getItem('pr1');
    var pr2 = localStorage.getItem('pr2');

    if (!pr1 || !pr2) {
        alert('You have to select tow elements');
        location.href = '/';
    }

    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            $('.loader').fadeOut(100);
            for (var i = 0; i < result.length; i++) {
                if (result[i].id == pr1) {
                    console.log(result[i]);
                    $("#pr1Name").text(result[i].name);
                    $(".placeholderpr1 img").attr("src", result[i].imgurl);
                    $("#brand").append(result[i].brandName);
                    $("#rdate").append(result[i].releaseDate);
                    $("#price").append(result[i].price);
                    $("#distype").append(result[i].type);
                    $("#dissize").append(result[i].size);
                    $("#resoulation").append(result[i].resolution);
                    $("#color").append(result[i].color);
                    $("#dimensions").append(result[i].dimensions);
                    $("#sensors").append(result[i].sensors);
                    $("#capacity").append(result[i].capacity);
                    $("#imageresolution").append(result[i].imageResolution);
                }
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].id == pr2) {
                    console.log(result[i]);
                    $("#pr2Name").text(result[i].name);
                    $(".placeholderpr2 img").attr("src", result[i].imgurl);
                    $("#brand2").append(result[i].brandName);
                    $("#rdate2").append(result[i].releaseDate);
                    $("#price2").append(result[i].price);
                    $("#distype2").append(result[i].type);
                    $("#dissize2").append(result[i].size);
                    $("#resoulation2").append(result[i].resolution);
                    $("#color2").append(result[i].color);
                    $("#dimensions2").append(result[i].dimensions);
                    $("#sensors2").append(result[i].sensors);
                    $("#capacity2").append(result[i].capacity);
                    $("#imageresolution2").append(result[i].imageResolution);
                }
            }
        }
    })
    $.ajax({
        url: "jsonData/mobiles.json",
        success: function (result) {
            $("#phones").empty();
            for (var i = 0; i < result.length - 6; i++) {
                $("#phones").append('<li class="phoneListItem"><div class="swiper-slide pc swiper-slide-next"><a onclick="gotPhone(' + result[i].id + ')" href="javascript:void(0);"><img width="40" src="' + result[i].imgurl + '"><br><span>' + result[i].name + '</span></a></div></li>');

            }
        }
    })

}

