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
                type: "post",
                url: "https://nodemailer-api-tu7e.vercel.app/api/sendmailer",
                data: guest,
                success: function (response) {
                    console.log(response)
                 //   console.log(`----info----- \n Gmail : ${response.email} \n Họ Và Tên: ${response.hoTen} \n Số điện thoại: ${response.sdt}`)
                }
            });
          
           // console.log(`gmail : ${guest.gmail} tên : ${guest.hoTen}, sdt: ${guest.sdt}`)
        }



    })











})