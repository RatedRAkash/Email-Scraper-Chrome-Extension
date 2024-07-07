let scrapeEmailElement = document.getElementById('scrapeEmailId')

let emailListElement = document.getElementById('emailListId');


// Handler to receive emails from conent script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Get Emails
    let emailList = request.emailList;
    
    if(emailList == null || emailList.length == 0) {
        // No emails
        let li = document.createElement('li');
        li.innerText = "No emails found";
        emailListElement.appendChild(li);
    }

    else {
        // Display emails
        emailList.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            emailListElement.appendChild(li);
        });
    }
})


///////////////////////////***CLICK LISTENER***////////////////////////////////////////

// Button's click event listener
scrapeEmailElement.addEventListener("click", async () => {
    
    // Get current Active Tab
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});

    // Execute script to parse email from the Current page
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,
    });
})

// Function Scrape Emails
function scrapeEmailsFromPage(){
    // RegEx to Parse emails from HTML Code
    const emailRegex = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // Parse Emails from the HTML of the page
    let emailList = document.body.innerHTML.match(emailRegex)

    // Send emails to popup script
    chrome.runtime.sendMessage({emailList});
}