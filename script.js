"use strict";

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!contactForm.checkValidity()) {

            formStatus.textContent =
                "Please complete all required fields correctly.";

            contactForm.reportValidity();

            return;
        }

        formStatus.textContent =
            "Thank you! Your message has been submitted successfully.";

        contactForm.reset();

    });

}