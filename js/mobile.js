/* SPメニューと予約条件の表示。既存のmain.jsとは分けて管理する */
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".header-menu");
    const header = document.querySelector("header");
    const mobileWidth = window.matchMedia("(max-width: 1024px)");
    const background = document.querySelectorAll("main, footer, .fixed-reserve");

    if (toggle && menu && header) {
        function setMenu(open, returnFocus) {
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
            menu.classList.toggle("is-open", open);
            document.body.classList.toggle("is-menu-open", open);
            background.forEach(function (element) {
                element.inert = open;
            });
            if (!open && returnFocus) toggle.focus();
        }

        toggle.addEventListener("click", function () {
            setMenu(toggle.getAttribute("aria-expanded") !== "true", false);
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false, true);
            });
        });

        document.addEventListener("keydown", function (event) {
            if (toggle.getAttribute("aria-expanded") !== "true") return;
            if (event.key === "Escape") {
                setMenu(false, true);
                return;
            }
            if (event.key !== "Tab") return;
            const controls = [...header.querySelectorAll("a, button")].filter(function (element) {
                return element.getClientRects().length > 0;
            });
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        mobileWidth.addEventListener("change", function () {
            setMenu(false, false);
        });
    }

    /* 選択した日付・人数を、閉じた状態の欄にも反映する */
    /* 選択した日付・人数を、閉じた状態の欄にも反映する */
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");

    if (checkin && checkout) {
        /* 2026年11月・12月の選択肢を作る */
        function createDateOptions(select) {
            const months = [
                { month: 11, days: 30 },
                { month: 12, days: 31 }
            ];

            months.forEach(function (item) {
                const group = document.createElement("optgroup");
                group.label = "2026年" + item.month + "月";

                for (let day = 1; day <= item.days; day++) {
                    const option = document.createElement("option");

                    option.value =
                        "2026-" +
                        String(item.month).padStart(2, "0") +
                        "-" +
                        String(day).padStart(2, "0");

                    option.textContent = item.month + "月" + day + "日";
                    group.appendChild(option);
                }

                select.appendChild(group);
            });
        }

        createDateOptions(checkin);
        createDateOptions(checkout);

        /* 選択した日付を見出しに表示 */
        function showDate(select, valueId) {
            const display = document.getElementById(valueId);

            if (display) {
                display.textContent = select.value
                    ? select.value.replace(/-/g, "/")
                    : "日付を選択";
            }
        }

        /* チェックイン当日以前はチェックアウトに選べない */
        function updateCheckoutOptions() {
            Array.from(checkout.options).forEach(function (option) {
                option.disabled = Boolean(
                    option.value &&
                    checkin.value &&
                    option.value <= checkin.value
                );
            });

            if (
                checkout.value &&
                checkin.value &&
                checkout.value <= checkin.value
            ) {
                checkout.value = "";
            }

            showDate(checkout, "checkout-value");
        }

        /* 別の予約条件を開いたら、ほかの欄を閉じる */
        document.querySelectorAll(".reservation-field > summary").forEach(function (summary) {
            summary.addEventListener("click", function () {
                document.querySelectorAll(".reservation-field").forEach(function (field) {
                    if (field !== summary.parentElement) {
                        field.open = false;
                    }
                });
            });
        });

        checkin.addEventListener("change", function () {
            showDate(checkin, "checkin-value");
            updateCheckoutOptions();

            if (checkin.value) {
                checkin.closest("details").open = false;
            }
        });

        checkout.addEventListener("change", function () {
            showDate(checkout, "checkout-value");

            if (checkout.value) {
                checkout.closest("details").open = false;
            }
        });

        showDate(checkin, "checkin-value");
        updateCheckoutOptions();
    }

    /* 人数・客室の選択を見出しに表示 */
    const guests = document.getElementById("guests");
    const rooms = document.getElementById("rooms");
    const guestsValue = document.getElementById("guests-value");

    if (guests && rooms && guestsValue) {
        function showGuests() {
            guestsValue.textContent =
                guests.value + "名・" + rooms.value + "室";
        }

        guests.addEventListener("change", showGuests);
        rooms.addEventListener("change", showGuests);
        showGuests();
    }
});