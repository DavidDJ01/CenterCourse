if (window.jQuery) {
    console.log("Loaded");
}

$(document).ready(function () {
    var guest = {

    }

    var gmail = ""
    var hoTen = ""
    var sdt = ""

    function getDataInput() {
        gmail = $("#gmail").val()
        hoTen = $("#hoTen").val()
        sdt = $("#sdt").val()
    }


    $("#btnRegister").click(function () {
        getDataInput();
        guest.gmail = gmail
        guest.hoTen = hoTen
        guest.sdt = sdt

        if (gmail.trim() === "") {
            $("#gmailError").text("* Không được để trống")
        }       
        if (hoTen.trim() === "") {
            $("#hoTenError").text("* Không được để trống")
        }
        if (sdt.trim() === "") {
            $("#sdtError").text("* Không được để trống")
        }
        else {
            $("#gmailError").text("")
            $("#hoTenError").text("")
            $("#sdtError").text("")
            $.ajax({
                type: "get",
                url: "http://localhost:8090/api/sendmailer",
                success: function (response) {
                    console.log("kết quả: ", response)
                }
            });


            console.log(`gmail : ${guest.gmail} tên : ${guest.hoTen}, sdt: ${guest.sdt}`)
        }



    })











})