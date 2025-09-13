
const CONFIG_FILE_PATH = "../data/config.json";

window.appConfig = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch(CONFIG_FILE_PATH + "?t=" + new Date().getTime())    // make each request "new" to browser so it would always use the newest config instead of from the cache
        .then(response => {
            if(!response.ok){
                throw new Error("Failed to read config file.");
            }
            return response.json();
        })
        .then(config => {
            window.appConfig = config;  // Load config

            populate_links(config);
        })
        .catch(err => console.error("Failed to load"))
})

function get_input_password(){
    return document.getElementById("passwordInput").value;
}

function myspace_linkcard_clicked(){
    const myspaceArea = get_myspace_area_element();
    const style = window.getComputedStyle(myspaceArea)
    if (style.display === "none"){
        show_password_area();
    } 
}
function password_unlock_button_clicked(){
    inputPassword = get_input_password();
    if (inputPassword.length === 0){
        update_password_warning_message("Password cannot be empty.");
        return;
    }

    isPasswordCorrect = verify_my_space_password(window.appConfig, inputPassword);
    if (isPasswordCorrect){
        show_password_area(false);
        show_myspace_area();
    }
    else{
        update_password_warning_message("Incorrect password.", true);
    }
}

function update_password_warning_message(msg, is_error = false){
    const password_warning_element = get_password_warning_message_element()
    if (password_warning_element){
        password_warning_element.textContent = msg;

        password_warning_element.style.color = is_error ? "red" : "orange";
    }
}

function show_myspace_area(toShow = true){
    const myspaceArea = get_myspace_area_element();
    if(myspaceArea){
        myspaceArea.style.display = toShow ? "block" : "none";
    }
}

function show_password_area(toShow = true){
    const passwordArea = get_password_area_element();
    if (passwordArea){
        passwordArea.style.display = toShow ? "block" : "none"; 
    }
}

function verify_my_space_password(config, password){
    if(config){
        const correctPassword = config.passwords.find(p => p.name === "mySpace").password; 
        return correctPassword == password;
    }
    else{
        console.log("Failed to verify MySpace password because config not found.");
        return false;
    }
}

function populate_links(config){
    if (config){
        const plexLinkElement = get_plex_link_element();
        const synologyDsmLinkElement = get_synology_link_element();
        const routerAdminLinkElement = get_router_admin_link_element();

        const plexLink = config.links.find(l => l.name === "plexUrl").url;
        const synologyDsmLink = config.links.find(l => l.name === "synologyDsmUrl").url;
        const routerAdminLink = config.links.find(l => l.name === "routerAdminUrl").url;

        plexLinkElement.href = plexLink;
        synologyDsmLinkElement.href = synologyDsmLink;
        routerAdminLinkElement.href = routerAdminLink;
    }
    else{
        console.log("Failed to populate links because config not found.")
    }
}

function get_plex_link_element(){
    const plexLinkElement = document.getElementById("plex-link-element");
    return plexLinkElement;
}

function get_synology_link_element(){
    return document.getElementById("synology-dsm-link-element");
}

function get_router_admin_link_element(){
    return document.getElementById("router-admin-link-element");
}

function get_password_area_element(){
    return document.getElementById("passwordArea");
}

function get_myspace_area_element(){
    return document.getElementById("mySpaceArea");
}

function get_password_warning_message_element(){
    return document.getElementById("password-warning-message");
}

// Clock updater
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();