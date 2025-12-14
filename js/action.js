
document.querySelector("#btnIcon").addEventListener("click", function () {
        var state = document.querySelector(".sub-nav")
        var navres = document.querySelector(".nav-res")
        navres.style.marginLeft = "83px";
        state.classList.toggle("active")
        console.log("Oke")


})

const track = document.querySelector(".slide-track");
const radios = document.querySelectorAll(".slider-nav input");

radios.forEach((radio, index) => {
        radio.addEventListener("change", () => {
                track.style.animationPlayState = "paused";
                track.style.marginLeft = `-${100 * index}%`; // mỗi click trượt 1 ảnh
                radios[index].checked = true;

                // bật lại animation sau 2 giây
                setTimeout(() => {
                        track.style.animationPlayState = "running";
                }, 2000);
        });
});

