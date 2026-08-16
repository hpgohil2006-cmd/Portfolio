"use strict";


/* =========================================================
   THEME MANAGEMENT
========================================================= */

const themeToggle =
    document.getElementById("theme-toggle");

const themeIcon =
    document.getElementById("theme-icon");


/* Get previously saved theme */

const savedTheme =
    localStorage.getItem("portfolio-theme");


/* Detect user's system preference */

const systemPrefersDark =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;


/* Determine initial theme */

if (savedTheme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            savedTheme
        );

}
else if (systemPrefersDark) {

    document.documentElement
        .setAttribute(
            "data-theme",
            "dark"
        );

}


/* Update theme button */

function updateThemeButton() {

    const currentTheme =
        document.documentElement
            .getAttribute("data-theme");


    if (currentTheme === "dark") {

        themeIcon.textContent = "☀";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    }
    else {

        themeIcon.textContent = "☾";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }

}


/* Initial button state */

if (themeToggle) {

    updateThemeButton();


    /* Toggle theme */

    themeToggle.addEventListener(
        "click",
        function () {

            const currentTheme =
                document.documentElement
                    .getAttribute("data-theme");


            if (currentTheme === "dark") {

                document.documentElement
                    .setAttribute(
                        "data-theme",
                        "light"
                    );

                localStorage.setItem(
                    "portfolio-theme",
                    "light"
                );

            }
            else {

                document.documentElement
                    .setAttribute(
                        "data-theme",
                        "dark"
                    );

                localStorage.setItem(
                    "portfolio-theme",
                    "dark"
                );

            }


            updateThemeButton();

        }
    );

}



/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contact-form");

const formStatus =
    document.getElementById("form-status");


if (contactForm) {


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* HTML5 validation */

            if (!contactForm.checkValidity()) {

                formStatus.textContent =
                    "Please complete all required fields correctly.";

                contactForm.reportValidity();

                return;

            }


            /* Success message */

            formStatus.textContent =
                "Thank you! Your message has been submitted successfully.";


            /* Reset form */

            contactForm.reset();

        }
    );

}