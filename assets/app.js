
function password_check() {
    let pass = document.getElementById('password_input').value
    if (pass === OUTAGE_PASSWORD) {
        console.log("success")
    }
}