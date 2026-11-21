$(function () {
    $(".room-images").slick({
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        cssEase: "ease-out",
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        pauseOnFocus: false,
    });
});

$(function () {
    $(".amenities-toggle").on("click", function () {
        const button = $(this);
        const more = button.siblings(".amenities-more");
        const isOpen = button.attr("aria-expanded") === "true";

        button.attr("aria-expanded", !isOpen);
        button.toggleClass("is-open", !isOpen);
        button.text(isOpen ? "アメニティを全て表示" : "閉じる ×");

        more.stop(true, true).slideToggle(300);
    });
});
