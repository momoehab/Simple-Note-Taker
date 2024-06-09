// ==UserScript==
// @name         Simple Note taker
// @description  Simple Note taker allows you to easily take notes while browsing the web. Simply select any text on a webpage, and you'll be prompted to add a note for that selection. Your notes are stored locally in your browser using localStorage, ensuring privacy and convenience. You can also review your notes by hovering over the previously selected text, which will display the associated note as a tooltip. Additionally, you can delete notes by selecting the text again and confirming deletion. Enhance your browsing experience by keeping track of important information with Simple Note taker.
// @author       momoehab
// @match      *://*/*
// ==/UserScript==

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString().trim();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text.trim();
    }
    return text.toUpperCase(); // Convert selected text to uppercase
}

function handleSelection() {
    var selectedText = getSelectedText();
    if (selectedText) {
        const storedText = localStorage.getItem(selectedText);
        if (storedText) {
            const shouldDelete = confirm("Info: " + storedText + "\nWant to delete?");
            if (shouldDelete) {
                var searchTerm = storedText; // Get the text of the item to delete
                removeSpanAndUnderline(searchTerm);
                localStorage.removeItem(selectedText);

            }

        } else {
            const newText = prompt("You selected: " + selectedText + "\nEnter details:");
            if (newText !== null) {
                localStorage.setItem(selectedText, newText);
            }
        }
    }
}

document.addEventListener("mouseup", handleSelection);
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        handleSelection();
    }
});

// Underline previously selected words with dotted line and show data as alt text on mouseover
document.addEventListener("DOMContentLoaded", function () {
    var storedWords = Object.keys(localStorage);
    storedWords.forEach(function (word) {
        var bodyHTML = document.body.innerHTML;
        var re = new RegExp("\\b(" + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ")\\b", "gi");
        var data = localStorage.getItem(word);
        bodyHTML = bodyHTML.replace(re, function (match) {
            return '<span style="text-decoration: underline dotted" data-text="' + data + '" onmouseover="this.title=this.getAttribute(\'data-text\')">' + match + '</span>';
        });
        document.body.innerHTML = bodyHTML;
    });
});

function removeSpanAndUnderline(word) {
    // Get all spans in the document
    var spans = document.getElementsByTagName('span');

    // Iterate through all spans
    for (var i = 0; i < spans.length; i++) {
        var span = spans[i];

        // Check if the span contains the specific word and is underlined
        if (span.textContent.includes(word) && span.style.textDecoration === 'underline') {
            // Remove the underline
            span.style.textDecoration = 'none';

            // Replace the span with its content
            var textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
        }
    }
}
