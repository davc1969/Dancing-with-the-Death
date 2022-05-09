
let appointmentsArray = [];
let selectedAppointment = null;
let selectedDate = null;
let selectedHour = null;
const appointmentsTable = document.getElementById("appointmentsList");
const formUser = document.getElementById("userInfoForm")
const userName = document.getElementById("userName")
const userEmail = document.getElementById("userEmail")
const userAge = document.getElementById("userAge")
const userGender = document.getElementById("userGender")
const btn1 = document.getElementById("button1")
const btn2 = document.getElementById("button2")
const btn3 = document.getElementById("button3")
const selectedTime = document.getElementById("selectedTime")

const today = () => {
    const date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getUTCDate();
    month = (month < 10) ? "0" + month : month;
    day = (day < 10) ? "0" + day : day;

    return `${date.getFullYear()}-${month}-${day}`;
}

const getTime = (i) => {
    const startHour = `${((i === 0) ? "0" : "")}${i + 9}:00`; 
    const finalHour = `${i + 10}:00`;
    return `${startHour} : ${finalHour}`
}

const validData = () => {
    const validName = userName.value != ""
    const validEmail = userEmail.value != ""
    const validAge = userAge.value > 17

    return validName && validEmail && validAge
}

const toggleForm = (type) => { //! 1 = turn ON, 0 = turn off

        userName.disabled = (type === 0)
        userEmail.disabled = (type === 0)
        userAge.disabled = (type === 0)
        userGender.disabled = (type === 0)
        btn1.hidden = (type === 0)
        btn2.hidden = (type === 0)
        btn3.hidden = (type === 0)

}

const activateForm = (type, i) => {  //! type: 0 = Set new appointment, 1= update/delete

    toggleForm(1)
    if (type === 0) { //Post

        userName.value = ""
        userEmail.value = ""
        userAge.value = ""
        userGender.value = "F"

        btn1.value = "Set"
        btn2.hidden = true
        btn2.value = ""
        btn3.value = "Cancel"

        selectedTime.innerText = getTime(i).split(" : ")[0]
    } else { //Update
        userName.value = appointmentsArray[i].name
        userEmail.disabled = true
        userEmail.value = appointmentsArray[i].email
        userAge.value = appointmentsArray[i].age
        userGender.value = appointmentsArray[i].gender.toUpperCase()

        btn1.value = "Update"
        btn2.value = "Delete"
        btn3.value = "Cancel"

        selectedTime.innerText = appointmentsArray[i].hour
        selectedAppointment = i
    }
}

const showDetails = (i) => {
    const row = appointmentsTable.children[i];
    selectedHour = row.children[0].innerText
    const appIndex = row.children[1].getAttribute("data-appointmentIndex")
    if (appIndex) {
        activateForm(1, appIndex)
    } else {
        activateForm(0, i)
    }
}

const createTable = () => {
    const appointmentsTable = document.getElementById("appointmentsList");
    for (let i = 0; i <= 8; i++) {
        const newRow = document.createElement("tr");
        const newColHour = document.createElement("td");
        newColHour.innerText = getTime(i);
        const newColPerson = document.createElement("td");
        newColPerson.innerText = "-"
        
        newRow.appendChild(newColHour);
        newRow.appendChild(newColPerson);
        newRow.addEventListener("click", (e) => showDetails(i))
        appointmentsTable.appendChild(newRow)
    }
}

const getAppointments = async (dateAppointments) => {
    const url = `/api/1.0/appointments/search?date=${dateAppointments}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.ok) {
        appointmentsArray = data.data
        const rows = appointmentsTable.children
        Array.from(rows).forEach( (elem) => {
            elem.children[1].innerText = "-"
        })

        appointmentsArray.forEach( (ap, i) => {
            const selHour = ap.hour.split(":")[0] * 1;
            const row = appointmentsTable.children[selHour - 9];
            row.children[1].innerText = ap.name;
            row.children[1].title = ap.email;
            row.children[1].setAttribute("data-appointmentIndex", i);
        })
    }

};

document.addEventListener("DOMContentLoaded", () => {

    const datePicker = document.getElementById('dateSelect')
    datePicker.addEventListener("change", async (event) => {
        event.preventDefault();
        selectedDate = datePicker.value
        await getAppointments(selectedDate)
    })

    btn1.addEventListener("click", async (e) => {

        let fetchOptions = {}
        let fetchMessages = {}
        if (btn1.value == "Set") {
            fetchOptions = {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": userName.value,
                        "age": userAge.value,
                        "gender": userGender.value,
                        "email": userEmail.value,
                        "date": selectedDate,
                        "hour": selectedHour.split(" : ")[0]
                    })
            };
            fetchMessages = {
                fetchOk : "New Appointment correctly set",
                fetchError : "Error creating new appointment: "
            }
        } else {
            fetchOptions = {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": userName.value,
                    "age": userAge.value,
                    "gender": userGender.value
                })
            };
            fetchMessages = {
                fetchOk : "Appointment correctly updated",
                fetchError : "Error updating appointment: "
            }
        }


        if (validData()) {
            e.preventDefault()
            const url = "/api/1.0/appointments"
            try {
                const response = await fetch(url, fetchOptions)
                const data = await response.json();
                if (data.ok) {
                    getAppointments(selectedDate)
                    activateForm(0, 0)
                    toggleForm(0);
                    alert(fetchMessages.fetchOk)
                } else {
                    alert("Error " + data.code + " : " + data.message)
                }
            } catch (error) {
                console.log(fetchMessages.fetchError + error)
            }

        } else {
            alert("please fill correctly all fields")
        }

    })

    btn2.addEventListener("click", async (e) => { //Always is delete
        e.preventDefault();
        if (confirm("Are you sure that you want to delete this appointment?")) {
            const id = appointmentsArray[selectedAppointment].id
            const url = `/api/1.0/appointments/${id}`;
            const response = await fetch(url, { method: "DELETE" })
            const data = await response.json()
            if (data.ok) {
                alert("appointment succesfully deleted!")
            } else {
                alert("Caution!, something went wrong.  Appointment not deleted")
            }
            await getAppointments(selectedDate)
            activateForm(0, 0)
            toggleForm(0)
        }
    })

    btn3.addEventListener("click", (e) => {  // Always is cancel
        e.preventDefault();
        activateForm(0, 0)
        toggleForm(0);
        selectedTime.innerText = "Select your time in the table"
        
    })


});



(async () => {
    document.getElementById('dateSelect').value = today();
    createTable();
    selectedDate = today()
    await getAppointments(selectedDate);
})()