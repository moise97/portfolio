// ============================================================
// SCRIPT.JS — Mo Tech Solutions
// ============================================================
//
// JavaScript adds BEHAVIOR to our HTML and CSS.
// HTML = structure, CSS = appearance, JS = interactivity.
//
// This file handles three features:
// 1. Image Gallery (services.html)
// 2. Form Validation (contact.html)
// 3. FAQ Accordion (services.html)
//
// We use the DOM (Document Object Model) throughout.
// The DOM is the browser's representation of the HTML page
// as a tree of objects that JavaScript can read and modify.
// ============================================================

// ============================================================
// UTILITY: Wait for the page to fully load before running JS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  /*
    DOMContentLoaded fires when the HTML is fully parsed.
    We wrap ALL our code in this listener so JS never tries
    to access elements that haven't loaded yet.
    
    document = the entire HTML page (the root of the DOM tree)
    addEventListener = "listen for this event, then run this function"
    'DOMContentLoaded' = the event name
    function() { ... } = the callback — runs when the event fires
  */

  initGallery();
  initFAQ();
  initFormValidation();

  /*
    We call three init functions — one per feature.
    Each function checks if its elements exist on the current page
    before doing anything, so this script works on ALL pages
    without errors.
  */
});

// ============================================================
// FEATURE 1: IMAGE GALLERY
// ============================================================
/*
  How it works:
  - We have an array of image objects (src, alt, title, desc)
  - A counter tracks which image is currently displayed
  - Prev/Next buttons change the counter and update the DOM
  - The gallery reads from this data array, not from HTML
  
  DOM methods used:
  - document.getElementById() — finds one element by its id
  - element.src = ... — changes an image source
  - element.textContent = ... — changes text content
  - element.setAttribute() — changes an HTML attribute
*/

function initGallery() {
  /*
    A function is a reusable block of code.
    function initGallery() defines it.
    initGallery() calls/runs it.
  */

  // First check if the gallery exists on this page
  const gallery = document.getElementById("project-gallery");
  if (!gallery) return;
  /*
    const = declare a variable that won't be reassigned.
    document.getElementById('project-gallery') finds the HTML
    element with id="project-gallery".
    
    if (!gallery) return; = "if the gallery doesn't exist, 
    stop this function." This prevents errors on pages 
    that don't have a gallery.
    
    ! = NOT operator. !gallery = "gallery is null/undefined"
  */

  // Gallery data — our image collection
  const images = [
    {
      src: "images/docchat.png",
      alt: "DocChat AI application interface showing PDF upload and chat functionality",
      title: "DocChat",
      desc: "AI-powered PDF chatbot built with LlamaIndex and deployed on HuggingFace Spaces.",
      tag: "AI / ML",
    },
    {
      src: "images/sqlmystery.png",
      alt: "SQL Murder Mystery game showing detective interface and SQL query input",
      title: "SQL Murder Mystery",
      desc: "GBA-style detective game where players solve a murder using real SQL queries.",
      tag: "Full Stack",
    },
    {
      src: "https://via.placeholder.com/800x450/162032/00C2CB?text=Hydroficient+IoT+Defense",
      alt: "Hydroficient IoT cybersecurity framework diagram showing MQTT topic hierarchy",
      title: "Hydroficient IoT Defense",
      desc: "Full IoT cybersecurity framework including STRIDE threat modeling and MQTT security.",
      tag: "Cybersecurity",
    },
    {
      src: "https://via.placeholder.com/800x450/162032/F4A261?text=DocChat+Pro",
      alt: "DocChat Pro advanced RAG pipeline architecture diagram",
      title: "DocChat Pro",
      desc: "Upgraded RAG pipeline with BGE embeddings, LlamaIndex, and Gemini API integration.",
      tag: "AI / ML",
    },
  ];
  /*
    An ARRAY is an ordered list of items, defined with [].
    Each item here is an OBJECT defined with {}.
    Objects store related data as key: value pairs.
    
    images[0] = first image (DocChat)
    images[0].src = 'images/docchat.png'
    images[0].alt = 'DocChat AI application...'
  */

  // Track which image is showing
  let currentIndex = 0;
  /*
    let = variable that CAN be reassigned (unlike const).
    We use let here because currentIndex will change
    every time the user clicks prev/next.
    
    Starting at 0 = first image in the array.
  */

  // Get references to all gallery DOM elements
  const galleryImg = document.getElementById("gallery-img");
  const galleryTitle = document.getElementById("gallery-title");
  const galleryDesc = document.getElementById("gallery-desc");
  const galleryTag = document.getElementById("gallery-tag");
  const galleryCounter = document.getElementById("gallery-counter");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");
  const dotsContainer = document.getElementById("gallery-dots");
  /*
    We grab references to each element ONCE and store them.
    This is more efficient than calling getElementById
    every time we need to update something.
  */

  // Function to update the gallery display
  function updateGallery(index) {
    /*
      This function takes an index number and updates
      ALL gallery elements to show the correct image.
      It's called on page load and every time prev/next is clicked.
    */

    const image = images[index];
    /*
      images[index] = look up the array at position 'index'
      If index is 2, we get the Hydroficient object.
    */

    // Update image source and alt text
    galleryImg.src = image.src;
    galleryImg.alt = image.alt;
    /*
      galleryImg.src changes the image being displayed.
      galleryImg.alt updates the accessibility text.
      Both are direct DOM property changes — no page reload needed.
    */

    // Update text content
    galleryTitle.textContent = image.title;
    galleryDesc.textContent = image.desc;
    galleryTag.textContent = image.tag;
    /*
      .textContent sets the text inside an element.
      Safer than .innerHTML (which can run malicious scripts).
      Use textContent for plain text, innerHTML only when
      you need to insert actual HTML tags.
    */

    // Update counter "1 / 4"
    galleryCounter.textContent = index + 1 + " / " + images.length;
    /*
      index + 1 because arrays start at 0 but humans count from 1.
      images.length = total number of images (4).
      String concatenation: 'text' + variable + 'text'
    */

    // Update dots
    const dots = dotsContainer.querySelectorAll(".gallery-dot");
    /*
      querySelectorAll() finds ALL elements matching a CSS selector.
      Returns a NodeList (similar to an array).
      '.gallery-dot' targets all elements with that class.
    */
    dots.forEach(function (dot, i) {
      dot.classList.remove("active");
      if (i === index) {
        dot.classList.add("active");
      }
    });
    /*
      forEach loops through each dot.
      dot = current dot element
      i = current index number
      
      classList.remove('active') = removes the active class from all dots
      classList.add('active') = adds it back only to the current one
      
      This is how the dot indicator updates without reloading the page.
    */

    // Update ARIA live region for screen readers
    const liveRegion = document.getElementById("gallery-live");
    if (liveRegion) {
      liveRegion.textContent =
        "Now showing: " + image.title + ". " + image.desc;
    }
    /*
      ARIA live regions announce content changes to screen readers.
      Without this, screen reader users wouldn't know the gallery changed.
      role="status" on this element makes it announce automatically.
    */
  }

  // Create navigation dots dynamically
  images.forEach(function (image, i) {
    const dot = document.createElement("button");
    /*
      document.createElement('button') creates a new <button> element.
      It exists in memory but isn't on the page yet.
    */
    dot.classList.add("gallery-dot");
    dot.setAttribute(
      "aria-label",
      "View project " + (i + 1) + ": " + image.title,
    );
    /*
      setAttribute(name, value) sets an HTML attribute.
      aria-label gives screen readers a description of each dot button.
    */
    dot.addEventListener("click", function () {
      currentIndex = i;
      updateGallery(currentIndex);
    });
    dotsContainer.appendChild(dot);
    /*
      appendChild() adds the new element to the DOM
      inside the dotsContainer element.
      Now the button is visible on the page.
    */
  });

  // Previous button
  prevBtn.addEventListener("click", function () {
    /*
      addEventListener('click', function) = "when this button
      is clicked, run this function."
      This is how ALL user interactions work in JavaScript.
    */
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    /*
      This formula handles wrapping:
      If currentIndex is 0 (first image) and user clicks prev,
      we want to go to the LAST image (index 3), not index -1.
      
      (0 - 1 + 4) % 4 = 3 % 4 = 3 ✓
      
      % = modulo operator — returns the remainder after division.
      It's the standard way to create circular/wrapping behavior.
    */
    updateGallery(currentIndex);
  });

  // Next button
  nextBtn.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % images.length;
    /*
      If currentIndex is 3 (last) and user clicks next:
      (3 + 1) % 4 = 4 % 4 = 0 → wraps back to first image ✓
    */
    updateGallery(currentIndex);
  });

  // Keyboard navigation for accessibility
  gallery.addEventListener("keydown", function (event) {
    /*
      keydown fires when a key is pressed.
      event = the keyboard event object.
      event.key = which key was pressed.
    */
    if (event.key === "ArrowLeft") {
      prevBtn.click();
      /*
        .click() programmatically triggers a click event.
        Same as the user physically clicking the button.
      */
    } else if (event.key === "ArrowRight") {
      nextBtn.click();
    }
  });

  // Initialize gallery with first image
  updateGallery(0);
  /*
    Call updateGallery(0) once on load to display the first image
    and set up all the initial state.
  */
}

// ============================================================
// FEATURE 2: FAQ ACCORDION
// ============================================================
/*
  How it works:
  - Each FAQ item has a question button and an answer panel
  - Clicking the button toggles the answer open/closed
  - Only one answer can be open at a time
  - aria-expanded attribute updates for screen readers
  
  DOM methods used:
  - querySelectorAll() — finds multiple elements
  - forEach() — loops through them
  - classList.toggle() — adds class if absent, removes if present
  - setAttribute() — updates ARIA attributes
*/

function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length === 0) return;
  /*
    faqItems.length === 0 means no FAQ items found on this page.
    === is strict equality (checks value AND type).
    == is loose equality (avoid it — causes unexpected behavior).
  */

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    /*
      item.querySelector() searches WITHIN that specific item.
      Different from document.querySelector() which searches the whole page.
    */

    question.addEventListener("click", function () {
      // Check if this item is already open
      const isOpen = item.classList.contains("faq-open");
      /*
        classList.contains() returns true or false.
        isOpen = true if the item has the 'faq-open' class.
      */

      // Close ALL items first
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove("faq-open");
        otherItem
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
        /*
          We set aria-expanded to 'false' on ALL items.
          Screen readers use aria-expanded to announce 
          whether a section is open or closed.
        */
        const otherAnswer = otherItem.querySelector(".faq-answer");
        otherAnswer.style.maxHeight = null;
        otherAnswer.style.padding = "0 var(1.5rem)";
        /*
          style.maxHeight = null removes the inline style entirely.
          This lets CSS take back control (default is maxHeight: 0).
          We use maxHeight animation instead of display:none/block
          because display can't be animated smoothly.
        */
      });

      // If it wasn't open, open it now
      if (!isOpen) {
        item.classList.add("faq-open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.paddingBottom = "1.5rem";
        /*
          answer.scrollHeight = the full height of the content
          even when it's hidden (CSS maxHeight: 0).
          Setting maxHeight to scrollHeight animates it open.
          
          + 'px' converts the number to a CSS value string.
          scrollHeight is a number (e.g. 120), we need '120px'.
        */
      }
    });
  });
}

// ============================================================
// FEATURE 3: FORM VALIDATION
// ============================================================
/*
  How it works:
  - We intercept the form's submit event
  - Before sending, we validate each field
  - If errors exist, we show them and prevent submission
  - If all fields are valid, we show a success message
  - All feedback is DOM manipulation — no page reload
  
  DOM methods used:
  - event.preventDefault() — stops form from submitting
  - element.value — gets input field content
  - element.trim() — removes whitespace from start/end
  - insertAdjacentElement() — inserts element next to another
*/

function initFormValidation() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    /*
      event.preventDefault() stops the default browser behavior.
      For forms, the default is to reload the page and send data.
      We prevent that so we can validate first and show our own feedback.
      This is one of the most important JS form techniques.
    */

    // Clear previous error messages
    clearErrors();

    // Run all validations
    let isValid = true;
    /*
      let isValid = true — assume the form is valid to start.
      Each validation check can set it to false if something's wrong.
    */

    // Validate name
    const nameInput = document.getElementById("name");
    const nameValue = nameInput.value.trim();
    /*
      .value gets whatever the user typed in the input.
      .trim() removes leading/trailing spaces.
      "  Mo  ".trim() = "Mo"
      This prevents empty spaces from passing validation.
    */
    if (nameValue === "") {
      showError(nameInput, "Please enter your full name.");
      isValid = false;
    } else if (nameValue.length < 2) {
      showError(nameInput, "Name must be at least 2 characters.");
      isValid = false;
    }
    /*
      else if = "if the first condition was false, check this one."
      We chain conditions to give specific, helpful error messages.
    */

    // Validate email
    const emailInput = document.getElementById("email");
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /*
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/ is a REGULAR EXPRESSION (regex).
      Regex is a pattern-matching language for strings.
      This pattern checks for: text @ text . text
      
      ^ = start of string
      [^\s@]+ = one or more characters that aren't spaces or @
      @ = literal @ symbol
      \. = literal dot (. alone means "any character" in regex)
      $ = end of string
      
      emailPattern.test(emailValue) returns true if it matches.
    */
    if (emailValue === "") {
      showError(emailInput, "Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    // Validate subject
    const subjectInput = document.getElementById("subject");
    if (subjectInput.value === "") {
      showError(subjectInput, "Please select a topic.");
      isValid = false;
    }

    // Validate message
    const messageInput = document.getElementById("message");
    const messageValue = messageInput.value.trim();
    if (messageValue === "") {
      showError(messageInput, "Please enter your message.");
      isValid = false;
    } else if (messageValue.length < 20) {
      showError(messageInput, "Message must be at least 20 characters.");
      isValid = false;
    }

    // Validate checkbox
    const consentInput = document.getElementById("consent");
    if (!consentInput.checked) {
      /*
        .checked is a boolean property on checkboxes.
        true = checked, false = unchecked.
        !consentInput.checked = "if NOT checked"
      */
      showError(consentInput, "Please agree to the terms to continue.");
      isValid = false;
    }

    // If all valid — show success
    if (isValid) {
      showSuccess();
    }
  });

  // HELPER: Show error message for a field
  function showError(input, message) {
    /*
      Parameters: 
      input = the form field element that has the error
      message = the error text to display
    */

    const formGroup = input.closest(".form-group");
    /*
      .closest() walks UP the DOM tree looking for the 
      nearest ancestor matching the selector.
      From the input, it finds the parent .form-group div.
    */

    formGroup.classList.add("form-group--error");
    /*
      Adding a class to the parent lets CSS style the 
      entire group (label, input, hint) when there's an error.
    */

    // Create error message element
    const errorEl = document.createElement("span");
    errorEl.classList.add("form-error-msg");
    errorEl.textContent = message;
    errorEl.setAttribute("role", "alert");
    /*
      role="alert" = ARIA role that makes screen readers 
      immediately announce this message when it appears.
      Critical for accessible form validation.
    */

    formGroup.appendChild(errorEl);
    /*
      appendChild adds the error span to the end of the form group.
      It appears below the input field.
    */

    // Focus the first error field for accessibility
    if (document.querySelectorAll(".form-group--error").length === 1) {
      input.focus();
      /*
        .focus() moves keyboard focus to this input.
        We only do this for the FIRST error (length === 1)
        so focus doesn't jump around if there are multiple errors.
      */
    }
  }

  // HELPER: Clear all error messages
  function clearErrors() {
    const errorGroups = document.querySelectorAll(".form-group--error");
    errorGroups.forEach(function (group) {
      group.classList.remove("form-group--error");
    });

    const errorMessages = document.querySelectorAll(".form-error-msg");
    errorMessages.forEach(function (msg) {
      msg.remove();
      /*
        .remove() deletes the element from the DOM entirely.
        Used to clear old error messages before re-validating.
      */
    });

    // Also remove success message if present
    const successMsg = document.querySelector(".form-success");
    if (successMsg) successMsg.remove();
  }

  // HELPER: Show success message
  function showSuccess() {
    const successEl = document.createElement("div");
    successEl.classList.add("form-success");
    successEl.setAttribute("role", "status");
    /*
      role="status" announces this to screen readers
      but less urgently than role="alert".
      Appropriate for success messages.
    */
    successEl.innerHTML = `
      <span class="success-icon" aria-hidden="true">✓</span>
      <div>
        <strong>Message sent!</strong>
        <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
      </div>
    `;
    /*
      Template literals use backticks and allow multi-line strings.
      Much cleaner than concatenating strings with +.
      ${ } inside them lets you embed variables.
    */

    form.insertAdjacentElement("afterend", successEl);
    /*
      insertAdjacentElement(position, element)
      'afterend' = insert after the form's closing tag.
      Other positions: 'beforebegin', 'afterbegin', 'beforeend'
    */

    // Clear the form
    form.reset();
    /*
      form.reset() clears all inputs back to their default values.
      Built-in DOM method — no need to clear each field manually.
    */

    // Scroll to success message
    successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    /*
      scrollIntoView() scrolls the page so this element is visible.
      behavior: 'smooth' = animated scroll (not instant jump).
      block: 'center' = center it vertically in the viewport.
    */
  }
}
