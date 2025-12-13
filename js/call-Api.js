if (window.jQuery) {
    console.log("Loaded");
}

$(document).ready(function () {


    function createToast(type, icon, title, text) {
        let notifications = document.querySelector('.notifications');
        let newToast = document.createElement('div');
        newToast.innerHTML = `
            <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
            </div>`;
        notifications.appendChild(newToast);
        newToast.timeOut = setTimeout(
            () => newToast.remove(), 10000
        )
    }

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
        let type = 'success';
        let icon = 'fa-solid fa-circle-check';
        let title = 'Đăng Ký Thành Công';
        let text = 'Hãy chờ thông tin phản hồi trong gmail nhé!';

        getDataInput();
        guest.gmail = gmail
        guest.hoTen = hoTen
        guest.sdt = sdt

        if (gmail.trim() === "" ) {
            $("#gmailError").text("* Không được để trống")
        } else if (!gmail.includes("@")) {
            $("#gmailError").text("* Gmail ko đúng định dạng")
        }
        else if (hoTen.trim() === "") {
            $("#hoTenError").text("* Không được để trống")
        }
        else if (sdt.trim() === "") {
            $("#sdtError").text("* Không được để trống")
        } else if (!/^\d{10}$/.test(sdt)) {
             $("#sdtError").text("*sdt ko đúng định dạng")
        }
        else if (document.cookie.includes(`registeredEmail=${guest.gmail}`)) {
            let type = 'error';
            let icon = 'fa-solid fa-circle-exclamation';
            let title = 'Lỗi';
            let text = 'Email này đã được đăng ký';
            createToast(type, icon, title, text);
        }
        else {
            $("#gmailError").text("")
            $("#hoTenError").text("")
            $("#sdtError").text("")
            document.cookie = `registeredEmail=${guest.gmail}; max-age=31536000`; // 1 năm
            $.ajax({
                type: "post",
                url: "https://nodemailer-api-tu7e.vercel.app/api/sendmailer",
                data: guest,
                success: function (response) {
                    console.log(response)
                    createToast(type, icon, title, text);
                    //   console.log(`----info----- \n Gmail : ${response.email} \n Họ Và Tên: ${response.hoTen} \n Số điện thoại: ${response.sdt}`)
                },
            });
        }
        // console.log(`gmail : ${guest.gmail} tên : ${guest.hoTen}, sdt: ${guest.sdt}`)
    })











})